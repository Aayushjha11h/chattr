import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'chattr.arwebdevs.app',
  appName: 'Chatr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://chattrarwebdevs.netlify.app',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF',
    }
  }
};

export default config;
