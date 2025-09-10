import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Toast } from '@capacitor/toast';

export class MobileServices {
  
  // Get device information
  static async getDeviceInfo() {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  // Store user preferences
  static async storePreference(key: string, value: string) {
    try {
      await Preferences.set({
        key: key,
        value: value,
      });
      return true;
    } catch (error) {
      console.error('Error storing preference:', error);
      return false;
    }
  }

  // Get user preferences
  static async getPreference(key: string) {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch (error) {
      console.error('Error getting preference:', error);
      return null;
    }
  }

  // Show toast notification
  static async showToast(message: string) {
    try {
      await Toast.show({
        text: message,
        duration: 'short',
        position: 'bottom'
      });
    } catch (error) {
      console.error('Error showing toast:', error);
    }
  }

  // Schedule reminder notification
  static async scheduleReminder(title: string, body: string, delayInMinutes: number) {
    try {
      // Request permission first
      await LocalNotifications.requestPermissions();
      
      const notificationId = Date.now();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: notificationId,
            schedule: { at: new Date(Date.now() + delayInMinutes * 60000) },
          }
        ]
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  // Open app or URL
  static async openApp(url: string) {
    try {
      // Open as web URL using Browser
      if (url.includes('://')) {
        await Browser.open({ url });
      } else {
        // Open as web URL
        await Browser.open({ url: `https://${url}` });
      }
    } catch (error) {
      console.error('Error opening app/URL:', error);
      await this.showToast('অ্যাপ/URL খুলতে সমস্যা হয়েছে');
    }
  }

  // Simulate voice command processing
  static async processVoiceCommand(command: string): Promise<string> {
    const lowerCommand = command.toLowerCase();
    
    // App opening commands
    if (lowerCommand.includes('হোয়াটসঅ্যাপ') || lowerCommand.includes('whatsapp')) {
      await this.openApp('whatsapp://');
      return 'ওকে স্যার, হোয়াটসঅ্যাপ খুলছি';
    }
    
    if (lowerCommand.includes('গুগল') || lowerCommand.includes('google')) {
      await this.openApp('https://google.com');
      return 'ওকে স্যার, গুগল খুলছি';
    }
    
    if (lowerCommand.includes('ব্রাউজার') || lowerCommand.includes('browser')) {
      await this.openApp('https://google.com');
      return 'ওকে স্যার, ব্রাউজার খুলছি';
    }
    
    // Reminder commands
    if (lowerCommand.includes('রিমাইন্ড') || lowerCommand.includes('remind')) {
      const minutes = this.extractMinutesFromCommand(lowerCommand);
      await this.scheduleReminder('JARVIS রিমাইন্ডার', command, minutes);
      return `ওকে স্যার, ${minutes} মিনিট পর রিমাইন্ড করব`;
    }
    
    // Device info commands
    if (lowerCommand.includes('ডিভাইস') || lowerCommand.includes('device') || lowerCommand.includes('ফোন')) {
      const deviceInfo = await this.getDeviceInfo();
      if (deviceInfo) {
        return `আপনার ডিভাইস: ${deviceInfo.model}, OS: ${deviceInfo.operatingSystem}`;
      }
    }
    
    // Default response
    return 'আমি শুনতে পায়নি স্যার, আবার বলুন';
  }
  
  private static extractMinutesFromCommand(command: string): number {
    const matches = command.match(/(\d+)/);
    return matches ? parseInt(matches[1]) : 10; // Default 10 minutes
  }
}