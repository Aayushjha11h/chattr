import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface NotificationOptions {
  title: string;
  body: string;
  id?: number;
  schedule?: boolean;
  sound?: string;
}

export class CapacitorNotifications {
  static async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      console.log('Not on native platform, using browser notifications');
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return 'Notification' in window && Notification.permission === 'granted';
    }

    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  }

  static async schedule(options: NotificationOptions): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      // Fallback to browser notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: '/icons/icon-192x192.png',
          tag: options.id?.toString(),
        });
      }
      return;
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: options.title,
          body: options.body,
          id: options.id || Date.now(),
          schedule: options.schedule ? { at: new Date(Date.now() + 1000) } : undefined,
          sound: options.sound || 'default',
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF',
        },
      ],
    });
  }

  static async cancel(id: number): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await LocalNotifications.cancel({ notifications: [{ id }] });
  }

  static async cancelAll(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }

  static async getPending(): Promise<any[]> {
    if (!Capacitor.isNativePlatform()) return [];
    const { notifications } = await LocalNotifications.getPending();
    return notifications;
  }

  static async registerActionTypes(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'VIEW_ACTION',
          actions: [
            {
              id: 'view',
              title: 'View',
            },
            {
              id: 'dismiss',
              title: 'Dismiss',
              destructive: true,
            },
          ],
        },
      ],
    });
  }

  static async addListeners(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    await LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      console.log('Notification action performed:', action);
    });
  }
}
