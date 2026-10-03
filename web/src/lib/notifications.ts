export type NotificationThreshold = "critical_only" | "all_anomalies";

export interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

const STORAGE_KEYS = {
  ENABLED: "limina_device_notifications_enabled",
  THRESHOLD: "limina_notification_threshold",
  LAST_TEST: "limina_last_test_notification",
};

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

function isServiceWorkerSupported(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return registration;
  } catch (err) {
    console.warn("[LIMINA Notifications] Service worker registration failed:", err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<{
  granted: boolean;
  status: NotificationPermission | "unsupported";
  error?: string;
}> {
  if (!isNotificationSupported()) {
    return {
      granted: false,
      status: "unsupported",
      error: "Your browser does not support Web Notifications.",
    };
  }

  try {
    const permission = await Notification.requestPermission();
    const granted = permission === "granted";

    if (granted) {
      setDeviceAlertsEnabled(true);
      await registerServiceWorker();
    } else if (permission === "denied") {
      setDeviceAlertsEnabled(false);
    }

    return { granted, status: permission };
  } catch (err) {
    return {
      granted: false,
      status: Notification.permission,
      error: (err as Error).message || "Failed to request notification permission.",
    };
  }
}

export function areDeviceAlertsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEYS.ENABLED);
  return stored === "true" && getNotificationPermission() === "granted";
}

export function setDeviceAlertsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ENABLED, enabled ? "true" : "false");
}

export function getNotificationThreshold(): NotificationThreshold {
  if (typeof window === "undefined") return "critical_only";
  return (localStorage.getItem(STORAGE_KEYS.THRESHOLD) as NotificationThreshold) || "critical_only";
}

export function setNotificationThreshold(threshold: NotificationThreshold): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THRESHOLD, threshold);
}

export async function sendDeviceNotification(payload: NotificationPayload): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;

  const safeTitle = String(payload.title || "LIMINA Alert").slice(0, 100);
  const safeBody = String(payload.body || "").slice(0, 300);
  const safeUrl = payload.url || "/";

  interface ExtendedNotificationOptions extends NotificationOptions {
    renotify?: boolean;
    vibrate?: number[];
  }

  const options: ExtendedNotificationOptions = {
    body: safeBody,
    tag: payload.tag || "limina-risk-alert",
    renotify: true,
    data: {
      url: safeUrl,
      timestamp: Date.now(),
    },
    vibrate: [200, 100, 200, 100, 250],
  };

  try {
    if (isServiceWorkerSupported()) {
      const swReady = navigator.serviceWorker.ready;
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
      const reg = await Promise.race([swReady, timeout]);

      if (reg && "showNotification" in reg) {
        await reg.showNotification(safeTitle, options);
        return true;
      }
    }
  } catch (swErr) {
    console.warn("[LIMINA Notifications] ServiceWorker notification failed, using fallback:", swErr);
  }

  try {
    const notif = new Notification(safeTitle, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (err) {
    console.error("[LIMINA Notifications] Notification constructor failed:", err);
    return false;
  }
}

export async function sendTestRiskAlert(): Promise<{ success: boolean; message: string }> {
  let perm = getNotificationPermission();

  if (perm === "default") {
    const req = await requestNotificationPermission();
    perm = req.status;
  }

  if (perm === "denied") {
    return {
      success: false,
      message: "Notification permission is blocked by the browser. Please click the lock icon / site settings next to the URL to change it to 'Allow'.",
    };
  }

  if (perm !== "granted") {
    return {
      success: false,
      message: "Notification permission has not been enabled.",
    };
  }

  const success = await sendDeviceNotification({
    title: "🚨 [TEST] LIMINA Critical Risk Alert",
    body: "Issuer BUMI detected an anomalous volume spike of +340% & Extreme Volatility. Risk Score: 8.9/10.",
    url: "/dashboard",
    tag: "limina-test-alert",
  });

  if (success) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LAST_TEST, new Date().toISOString());
    }
    return {
      success: true,
      message: "✓ Test notification sent successfully! Check the bottom-right corner of your Windows desktop / notification center.",
    };
  }

  return {
    success: false,
    message: "Failed to display notification. Make sure 'Do Not Disturb' or 'Focus Assist' mode on Windows is not blocking Google Chrome notifications.",
  };
}