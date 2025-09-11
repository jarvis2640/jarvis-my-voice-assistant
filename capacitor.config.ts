import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.52a7138550474e4aa9a44ef43d5fef0d',
  appName: 'jarvis-my-voice-assistant',
  webDir: 'dist',
  server: {
    url: 'https://52a71385-5047-4e4a-a9a4-4ef43d5fef0d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f0f23",
      showSpinner: false,
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0f0f23",
    },
  },
};

export default config;