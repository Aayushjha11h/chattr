import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'chattr.arwebdevs.app',
  appName: 'chattr',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    url: 'https://your-app.netlify.app', // Replace with your actual Netlify URL after deployment
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
