import { hunterService } from './hunterService';
import { storageService } from './storageService';
import { nutritionStorage } from './nutritionStorage';
import { mobileService } from './mobileService';

export class NotificationService {
  private timerId: number | null = null;
  private lastHydrationPromptDate: string | null = null;

  // Request browser Notification permissions
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  // Check if browser notifications are allowed
  public isPermissionGranted(): boolean {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  // Check quiet hours
  private isQuietHour(start: string, end: string): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (startMin > endMin) {
      // Crosses midnight, e.g. 22:00 to 07:00
      return currentMinutes >= startMin || currentMinutes <= endMin;
    } else {
      return currentMinutes >= startMin && currentMinutes <= endMin;
    }
  }

  // Evaluate and dispatch 3-hour reminder if required missions are pending
  public evaluateAndSendReminder(): boolean {
    const prefs = hunterService.getNotificationPreferences();
    if (!prefs.enabled) return false;

    // Check quiet hours
    if (prefs.quietHoursEnabled && this.isQuietHour(prefs.quietHoursStart, prefs.quietHoursEnd)) {
      return false;
    }

    // Check if daily missions are completed
    const missions = hunterService.getDailyMissions();
    const pendingRequired = missions.filter(m => !m.isRecovery && !m.isCompleted);

    // Stop reminders immediately if all required missions are completed!
    if (pendingRequired.length === 0) {
      return false;
    }

    // Check time since last reminder (enforce 3 hours or user configured interval)
    const now = Date.now();
    const intervalMs = prefs.intervalHours * 60 * 60 * 1000;
    const lastSent = prefs.lastReminderSentAt ? new Date(prefs.lastReminderSentAt).getTime() : 0;

    if (now - lastSent < intervalMs) {
      return false;
    }

    // Prepare reminder content with remaining deadline
    const deadline = hunterService.getTimeUntilDailyDeadline();
    const streak = hunterService.getStreak();

    const messages = [
      `Your daily mission is still pending (${deadline.hours}h ${deadline.minutes}m remaining). Complete your workout to protect your ${streak.currentStreak}-day streak!`,
      `Your Hunter Rank progression is waiting! Finish today's training directives before the midnight reset.`,
      `Three-hour reminder: ${pendingRequired.length} daily missions remain incomplete. Shield your rank!`,
      `Don't lose your consistency. Complete today's mission before the deadline (${deadline.formatted} left).`
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const storedTheme = (typeof localStorage !== 'undefined' ? localStorage.getItem('ascend_brand_theme') || 'normal' : 'normal').toLowerCase();
    const modeName = (storedTheme === 'easy' || storedTheme === 'ascend') ? 'EASY MODE' : (storedTheme === 'hell' || storedTheme === 'titan') ? 'HELL MODE' : 'NORMAL MODE';

    // 1. Dispatch Web / Desktop Notification or Native Mobile Notification
    if (mobileService.isNativeMobile()) {
      mobileService.scheduleLocalNotification(`${modeName} Directive Protocol`, randomMsg);
    } else if (this.isPermissionGranted()) {
      try {
        new Notification(`${modeName} Directive Protocol`, {
          body: randomMsg,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'hunter-daily-mission-reminder',
        });
      } catch {}
    }

    // 2. Dispatch In-App Notification
    storageService.addNotification({
      id: 'notif-hunter-remind-' + Date.now(),
      type: 'reminder',
      title: 'Hunter Directive Incomplete ⏳',
      message: randomMsg,
      timestamp: 'Just now',
      isRead: false
    });

    // Update last reminder timestamp
    prefs.lastReminderSentAt = new Date().toISOString();
    hunterService.saveNotificationPreferences(prefs);

    return true;
  }

  // Hydration Prompt Check
  public evaluateAndSendHydrationReminder(): boolean {
    const prefs = hunterService.getNotificationPreferences();
    if (!prefs.enabled) return false;
    if (prefs.quietHoursEnabled && this.isQuietHour(prefs.quietHoursStart, prefs.quietHoursEnd)) {
      return false;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const today = now.toISOString().split('T')[0];

    // Only prompt between 13:00 and 19:00 once per day if water is under 2,000ml
    if (currentHour >= 13 && currentHour <= 19 && this.lastHydrationPromptDate !== today) {
      const log = nutritionStorage.getTodayLog();
      if (log.waterConsumedMl < 2000) {
        this.lastHydrationPromptDate = today;

        const title = 'Hydration Alert 💧';
        const message = `You've logged ${log.waterConsumedMl}ml of water today. Drink a quick glass to reach your daily hydration target!`;

        const storedTheme = (typeof localStorage !== 'undefined' ? localStorage.getItem('ascend_brand_theme') || 'normal' : 'normal').toLowerCase();
        const modeName = (storedTheme === 'easy' || storedTheme === 'ascend') ? 'EASY MODE' : (storedTheme === 'hell' || storedTheme === 'titan') ? 'HELL MODE' : 'NORMAL MODE';

        if (this.isPermissionGranted()) {
          try {
            new Notification(`${modeName} Hydration Protocol`, {
              body: message,
              icon: '/favicon.ico',
              tag: 'hydration-alert'
            });
          } catch {}
        }

        storageService.addNotification({
          id: 'notif-water-' + Date.now(),
          type: 'reminder',
          title,
          message,
          timestamp: 'Just now',
          isRead: false
        });

        return true;
      }
    }
    return false;
  }

  // Start background evaluation runner
  public startReminderScheduler(): void {
    if (this.timerId) return;

    // Check immediately on launch
    this.evaluateAndSendReminder();
    this.evaluateAndSendHydrationReminder();

    // Check every 10 minutes in the background to ensure reliable scheduling
    this.timerId = window.setInterval(() => {
      this.evaluateAndSendReminder();
      this.evaluateAndSendHydrationReminder();
    }, 10 * 60 * 1000);
  }

  public stopReminderScheduler(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const notificationService = new NotificationService();
