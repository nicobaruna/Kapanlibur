import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AuthorizationStatus,
} from '@notifee/react-native';
import {HOLIDAYS_2026, Holiday} from '../data/holidays2026';

const CHANNEL_ID = 'liburindonesia_reminders';
const CHANNEL_NAME = '🇮🇩 Pengingat Hari Libur';

export class NotificationService {
  // Create notification channel (Android)
  static async createChannel(): Promise<void> {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
  }

  // Request permission
  static async requestPermission(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  // Schedule H-7 and H-1 notifications for a holiday
  static async scheduleHolidayReminders(holiday: Holiday): Promise<void> {
    const holidayDate = new Date(holiday.date + 'T07:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const offsets = [
      {days: 7, label: '7 hari lagi', notifId: `${holiday.id}-h7`},
      {days: 1, label: 'besok', notifId: `${holiday.id}-h1`},
    ];

    for (const offset of offsets) {
      const triggerDate = new Date(holidayDate);
      triggerDate.setDate(triggerDate.getDate() - offset.days);
      triggerDate.setHours(8, 0, 0, 0); // Notify at 08:00

      // Skip if trigger date is in the past
      if (triggerDate <= today) continue;

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      try {
        await notifee.createTriggerNotification(
          {
            id: offset.notifId,
            title: `${holiday.emoji} ${holiday.shortName} ${offset.label}!`,
            body: `${holiday.name} jatuh pada ${new Date(
              holiday.date + 'T00:00:00',
            ).toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}`,
            android: {
              channelId: CHANNEL_ID,
              smallIcon: 'ic_notification',
              color: '#C8102E',
              pressAction: {
                id: 'default',
              },
              importance: AndroidImportance.HIGH,
            },
          },
          trigger,
        );
      } catch (e) {
        console.warn(`[Notifee] Skip ${offset.notifId}:`, e);
      }
    }
  }

  // Schedule all notifications for remaining holidays this year
  static async scheduleAllReminders(): Promise<void> {
    await NotificationService.createChannel();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cancel previous notifications first
    await notifee.cancelAllNotifications();

    const futureHolidays = HOLIDAYS_2026.filter(h => {
      const holidayDate = new Date(h.date + 'T00:00:00');
      return holidayDate > today;
    });

    for (const holiday of futureHolidays) {
      await NotificationService.scheduleHolidayReminders(holiday);
    }

    console.log(
      `✅ Scheduled reminders for ${futureHolidays.length} holidays`,
    );
  }

  // Show immediate test notification
  static async showTestNotification(): Promise<void> {
    await NotificationService.createChannel();

    await notifee.displayNotification({
      title: '🇮🇩 Libur Indonesia - Aktif!',
      body:
        'Notifikasi libur berhasil diaktifkan. Kamu akan diingatkan H-7 dan H-1 sebelum setiap hari libur.',
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_notification',
        color: '#C8102E',
        importance: AndroidImportance.HIGH,
      },
    });
  }

  // Get all pending trigger notifications
  static async getPendingNotifications() {
    return await notifee.getTriggerNotifications();
  }

  // Cancel all notifications
  static async cancelAll(): Promise<void> {
    await notifee.cancelAllNotifications();
  }
}
