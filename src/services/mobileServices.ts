import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Browser } from '@capacitor/browser';

export class MobileServices {
  static isNative = Capacitor.isNativePlatform();

  // Initialize mobile app
  static async initialize() {
    if (!this.isNative) return;

    try {
      // Hide splash screen
      await SplashScreen.hide();
      
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Request notification permissions
      await this.requestNotificationPermissions();
      
      // Set up app state listeners
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

    } catch (error) {
      console.error('Mobile initialization error:', error);
    }
  }

  // Device information
  static async getDeviceInfo() {
    if (!this.isNative) return null;
    
    try {
      const info = await Device.getInfo();
      return {
        platform: info.platform,
        model: info.model,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }

  // Haptic feedback
  static async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.isNative) return;
    
    try {
      const impactStyle = style === 'light' ? ImpactStyle.Light : 
                         style === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Medium;
      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  }

  // Local notifications
  static async requestNotificationPermissions() {
    if (!this.isNative) return false;
    
    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  static async scheduleNotification(title: string, body: string, delay: number = 0) {
    if (!this.isNative) return;
    
    try {
      const notificationId = Date.now();
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: notificationId,
            schedule: delay > 0 ? { at: new Date(Date.now() + delay) } : undefined,
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: 'JARVIS_ACTION',
            extra: null,
          },
        ],
      });
      return notificationId;
    } catch (error) {
      console.error('Schedule notification error:', error);
      return null;
    }
  }

  static async cancelNotification(id: number) {
    if (!this.isNative) return;
    
    try {
      await LocalNotifications.cancel({
        notifications: [{ id }],
      });
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  }

  // App control
  static async openApp(appId: string) {
    if (!this.isNative) return false;
    
    try {
      // For Android apps
      if (Capacitor.getPlatform() === 'android') {
        await Browser.open({ url: `intent://launch?package=${appId}#Intent;scheme=android-app;end` });
        return true;
      }
      
      // For iOS apps
      if (Capacitor.getPlatform() === 'ios') {
        await Browser.open({ url: `${appId}://` });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Open app error:', error);
      return false;
    }
  }

  static async openWebsite(url: string) {
    if (!this.isNative) {
      window.open(url, '_blank');
      return;
    }
    
    try {
      await Browser.open({ url });
    } catch (error) {
      console.error('Open website error:', error);
    }
  }

  // Voice commands processing
  static async processVoiceCommand(command: string): Promise<string> {
    const lowerCommand = command.toLowerCase();
    
    // System commands
    if (lowerCommand.includes('time') || lowerCommand.includes('সময়')) {
      const now = new Date();
      return `Current time is ${now.toLocaleTimeString()}`;
    }
    
    if (lowerCommand.includes('date') || lowerCommand.includes('তারিখ')) {
      const now = new Date();
      return `Today is ${now.toLocaleDateString()}`;
    }
    
    // App control commands
    if (lowerCommand.includes('open') || lowerCommand.includes('খোল')) {
      if (lowerCommand.includes('camera') || lowerCommand.includes('ক্যামেরা')) {
        await this.openApp('com.android.camera');
        return 'Opening camera...';
      }
      
      if (lowerCommand.includes('gallery') || lowerCommand.includes('গ্যালারি')) {
        await this.openApp('com.android.gallery3d');
        return 'Opening gallery...';
      }
      
      if (lowerCommand.includes('settings') || lowerCommand.includes('সেটিংস')) {
        await this.openApp('com.android.settings');
        return 'Opening settings...';
      }
      
      if (lowerCommand.includes('phone') || lowerCommand.includes('ফোন')) {
        await this.openApp('com.android.dialer');
        return 'Opening phone...';
      }
      
      if (lowerCommand.includes('messages') || lowerCommand.includes('মেসেজ')) {
        await this.openApp('com.android.mms');
        return 'Opening messages...';
      }
    }
    
    // Website commands
    if (lowerCommand.includes('google') || lowerCommand.includes('গুগল')) {
      await this.openWebsite('https://www.google.com');
      return 'Opening Google...';
    }
    
    if (lowerCommand.includes('youtube') || lowerCommand.includes('ইউটিউব')) {
      await this.openWebsite('https://www.youtube.com');
      return 'Opening YouTube...';
    }
    
    if (lowerCommand.includes('facebook') || lowerCommand.includes('ফেসবুক')) {
      await this.openWebsite('https://www.facebook.com');
      return 'Opening Facebook...';
    }
    
    // Notification commands
    if (lowerCommand.includes('remind') || lowerCommand.includes('মনে করিয়ে')) {
      await this.scheduleNotification(
        'JARVIS Reminder',
        command,
        5 * 60 * 1000 // 5 minutes
      );
      return 'Reminder set for 5 minutes from now.';
    }
    
    // Device info commands
    if (lowerCommand.includes('device info') || lowerCommand.includes('ডিভাইস তথ্য')) {
      const deviceInfo = await this.getDeviceInfo();
      if (deviceInfo) {
        return `Device: ${deviceInfo.manufacturer} ${deviceInfo.model}, OS: ${deviceInfo.operatingSystem} ${deviceInfo.osVersion}`;
      }
    }
    
    // Default response
    return `I heard: "${command}". How can I help you with that?`;
  }

  // Background task management
  static async enableBackgroundMode() {
    if (!this.isNative) return;
    
    try {
      // Keep app running in background for voice processing
      App.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          console.log('App moved to background, maintaining voice services...');
        }
      });
    } catch (error) {
      console.error('Background mode error:', error);
    }
  }
}
