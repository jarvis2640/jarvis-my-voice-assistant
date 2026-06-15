import { Capacitor } from '@capacitor/core';
import { Contacts } from '@capacitor-community/contacts';

export type ContactEntry = {
  name: string;
  phones: string[];
};

export class ContactServices {
  static isNative = Capacitor.isNativePlatform();
  private static cache: ContactEntry[] | null = null;

  static async requestPermission(): Promise<boolean> {
    if (!this.isNative) return false;
    try {
      const res = await Contacts.requestPermissions();
      return res.contacts === 'granted';
    } catch (e) {
      console.error('Contacts permission error:', e);
      return false;
    }
  }

  static async loadContacts(force = false): Promise<ContactEntry[]> {
    if (!this.isNative) return [];
    if (this.cache && !force) return this.cache;

    const granted = await this.requestPermission();
    if (!granted) return [];

    try {
      const result = await Contacts.getContacts({
        projection: { name: true, phones: true },
      });
      const list: ContactEntry[] = (result.contacts || [])
        .map((c: any) => ({
          name: c.name?.display || [c.name?.given, c.name?.family].filter(Boolean).join(' ') || '',
          phones: (c.phones || []).map((p: any) => String(p.number || '').replace(/\s|-/g, '')).filter(Boolean),
        }))
        .filter((c) => c.name && c.phones.length > 0);
      this.cache = list;
      return list;
    } catch (e) {
      console.error('Load contacts error:', e);
      return [];
    }
  }

  static async findByName(query: string): Promise<ContactEntry | null> {
    const all = await this.loadContacts();
    if (!all.length) return null;
    const q = query.toLowerCase().trim();
    // exact, then startsWith, then includes
    return (
      all.find((c) => c.name.toLowerCase() === q) ||
      all.find((c) => c.name.toLowerCase().startsWith(q)) ||
      all.find((c) => c.name.toLowerCase().includes(q)) ||
      null
    );
  }

  /** Normalize to digits only (keeps leading + as plain digits) */
  static normalize(num: string): string {
    return num.replace(/[^\d+]/g, '');
  }
}

export type Platform = 'phone' | 'whatsapp' | 'messenger' | 'imo' | 'sms';

export class CommunicationServices {
  /** Open a URL/scheme reliably on native */
  private static openScheme(url: string) {
    // Use top-level navigation so custom schemes (tel:, whatsapp:, fb-messenger:) trigger the OS handler
    window.location.href = url;
  }

  static call(number: string) {
    const n = ContactServices.normalize(number);
    this.openScheme(`tel:${n}`);
  }

  static sms(number: string, message = '') {
    const n = ContactServices.normalize(number);
    this.openScheme(`sms:${n}${message ? `?body=${encodeURIComponent(message)}` : ''}`);
  }

  static whatsappMessage(number: string, message = '') {
    const n = ContactServices.normalize(number).replace(/^\+/, '');
    // wa.me works universally and opens WhatsApp app if installed
    const url = `https://wa.me/${n}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    this.openScheme(url);
  }

  static whatsappCall(number: string) {
    // WhatsApp does not expose a public call deep-link; open chat so user can tap call
    this.whatsappMessage(number);
  }

  static messengerMessage(number: string) {
    const n = ContactServices.normalize(number).replace(/^\+/, '');
    // Messenger has limited deep-link; fallback to m.me with phone is not supported.
    // Open Messenger app; user picks chat. As fallback open m.me search.
    this.openScheme(`fb-messenger://user-thread/${n}`);
  }

  static imoMessage(number: string) {
    const n = ContactServices.normalize(number).replace(/^\+/, '');
    this.openScheme(`imo://chat?phone=${n}`);
  }

  static send(platform: Platform, number: string, message = '') {
    switch (platform) {
      case 'phone':
        return this.call(number);
      case 'sms':
        return this.sms(number, message);
      case 'whatsapp':
        return this.whatsappMessage(number, message);
      case 'messenger':
        return this.messengerMessage(number);
      case 'imo':
        return this.imoMessage(number);
    }
  }
}
