import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface NetworkState {
  connected: boolean;
  connectionType: string;
}

class MobileService {
  private isNative: boolean = false;
  private currentNetworkState: NetworkState = {
    connected: true,
    connectionType: 'wifi'
  };
  private networkListeners: ((state: NetworkState) => void)[] = [];

  constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  public isNativeMobile(): boolean {
    return this.isNative;
  }

  public getPlatform(): string {
    return Capacitor.getPlatform(); // 'android' | 'ios' | 'web'
  }

  /**
   * Initialize native mobile runtime lifecycle, status bar, splash screen, and listeners.
   */
  public async initialize(): Promise<void> {
    if (!this.isNative) {
      console.log('[MobileService] Running in Web Browser mode.');
      return;
    }

    console.log(`[MobileService] Initializing native runtime for: ${this.getPlatform()}`);

    try {
      // 1. Status Bar Configuration
      await StatusBar.setStyle({ style: Style.Dark });
      if (this.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#090B10' });
      }

      // 2. Hide Splash Screen after layout is stable
      setTimeout(async () => {
        try {
          await SplashScreen.hide();
        } catch (e) {
          console.warn('[MobileService] SplashScreen hide warning:', e);
        }
      }, 800);

      // 3. Network Connectivity Monitoring
      const status = await Network.getStatus();
      this.currentNetworkState = {
        connected: status.connected,
        connectionType: status.connectionType
      };

      Network.addListener('networkStatusChange', status => {
        this.currentNetworkState = {
          connected: status.connected,
          connectionType: status.connectionType
        };
        this.networkListeners.forEach(listener => listener(this.currentNetworkState));
      });

      // 4. Keyboard Behavior
      if (this.getPlatform() === 'ios') {
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
      }

      // 5. Hardware Back Button on Android
      if (this.getPlatform() === 'android') {
        App.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            // Optional: exit or minimize app
          }
        });
      }

      // 6. Request Notification Permissions
      await this.requestNotificationPermissions();

    } catch (error) {
      console.error('[MobileService] Error during native mobile initialization:', error);
    }
  }

  /**
   * Dynamically synchronize Status Bar with the active difficulty theme
   */
  public async setStatusBarColor(hexColor: string): Promise<void> {
    if (!this.isNative) return;
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      if (this.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: hexColor });
      }
    } catch (e) {
      console.warn('[MobileService] Failed to set status bar color:', e);
    }
  }

  /**
   * Native Haptic Feedback for workout reps, buttons, and rank upgrades
   */
  public async triggerHaptic(style: ImpactStyle = ImpactStyle.Medium): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.impact({ style });
    } catch {}
  }

  /**
   * Request Native Push and Local Notification permissions
   */
  public async requestNotificationPermissions(): Promise<boolean> {
    if (!this.isNative) return false;
    try {
      // Local Notifications permission
      const localStatus = await LocalNotifications.requestPermissions();
      
      // Push Notifications permission
      let pushGranted = false;
      try {
        const pushStatus = await PushNotifications.requestPermissions();
        pushGranted = pushStatus.receive === 'granted';
        if (pushGranted) {
          await PushNotifications.register();
        }
      } catch (pushErr) {
        console.warn('[MobileService] Push notification registration skipped/unavailable:', pushErr);
      }

      return localStatus.display === 'granted';
    } catch (e) {
      console.warn('[MobileService] Notification permissions error:', e);
      return false;
    }
  }

  /**
   * Schedule a Native Local Notification (e.g. for background workout rest timers)
   */
  public async scheduleLocalNotification(title: string, body: string, delaySeconds: number = 0): Promise<void> {
    if (!this.isNative) return;
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 100000),
            schedule: delaySeconds > 0 ? { at: new Date(Date.now() + delaySeconds * 1000) } : undefined,
            sound: 'beep.wav',
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } catch (e) {
      console.warn('[MobileService] Failed to schedule local notification:', e);
    }
  }

  /**
   * Subscribe to live network connectivity changes
   */
  public onNetworkChange(callback: (state: NetworkState) => void): () => void {
    this.networkListeners.push(callback);
    return () => {
      this.networkListeners = this.networkListeners.filter(l => l !== callback);
    };
  }

  public getNetworkState(): NetworkState {
    return this.currentNetworkState;
  }
}

export const mobileService = new MobileService();
