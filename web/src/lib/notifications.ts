// LIMINA Device & Web Push Notification Manager
// Supports Chrome Desktop, Windows Action Center, macOS Notifications, and Android Chrome

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

/**
 * Check if the browser supports Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Check if the browser supports Service Workers
 */
export function isServiceWorkerSupported(): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Register Service Worker for background notifications
 */
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

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<{
  granted: boolean;
  status: NotificationPermission | "unsupported";
  error?: string;
}> {
  if (!isNotificationSupported()) {
    return {
      granted: false,
      status: "unsupported",
      error: "Browser Anda tidak mendukung Web Notifications.",
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
      error: (err as Error).message || "Gagal meminta izin notifikasi.",
    };
  }
}

/**
 * Check if user has toggled device notifications ON in LIMINA settings
 */
export function areDeviceAlertsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(STORAGE_KEYS.ENABLED);
  return stored === "true" && getNotificationPermission() === "granted";
}

/**
 * Save user preference for device alerts
 */
export function setDeviceAlertsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ENABLED, enabled ? "true" : "false");
}

/**
 * Get notification alert sensitivity threshold
 */
export function getNotificationThreshold(): NotificationThreshold {
  if (typeof window === "undefined") return "critical_only";
  return (localStorage.getItem(STORAGE_KEYS.THRESHOLD) as NotificationThreshold) || "critical_only";
}

/**
 * Set notification alert sensitivity threshold
 */
export function setNotificationThreshold(threshold: NotificationThreshold): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.THRESHOLD, threshold);
}

/**
 * Safely send a system notification to the user device
 */
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

  // Try ServiceWorker showNotification first (with 800ms timeout race to prevent hanging)
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

  // Fallback to native window Notification constructor
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

/**
 * Send a test notification so user can verify device pop-ups immediately
 */
export async function sendTestRiskAlert(): Promise<{ success: boolean; message: string }> {
  let perm = getNotificationPermission();

  // If still default, prompt for permission directly
  if (perm === "default") {
    const req = await requestNotificationPermission();
    perm = req.status;
  }

  if (perm === "denied") {
    return {
      success: false,
      message: "Izin notifikasi diblokir oleh browser. Silakan klik ikon gembok / setelan di samping URL untuk mengubah ke 'Allow (Izinkan)'.",
    };
  }

  if (perm !== "granted") {
    return {
      success: false,
      message: "Izin notifikasi belum diaktifkan.",
    };
  }

  const success = await sendDeviceNotification({
    title: "🚨 [TEST] LIMINA Critical Risk Alert",
    body: "Emiten BUMI mendeteksi lonjakan volume anomali +340% & Volatilitas Ekstrem. Skor Risiko: 8.9/10.",
    url: "/dashboard",
    tag: "limina-test-alert",
  });

  if (success) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LAST_TEST, new Date().toISOString());
    }
    return {
      success: true,
      message: "✓ Notifikasi uji coba berhasil dikirim! Periksa pojok kanan bawah desktop Windows / notification center Anda.",
    };
  }

  return {
    success: false,
    message: "Gagal menampilkan notifikasi. Pastikan mode 'Do Not Disturb' atau 'Focus Assist' di Windows tidak memblokir notifikasi Google Chrome.",
  };
}

/**
 * Notify when a real critical stock anomaly occurs
 */
export async function notifyStockRisk(stock: {
  symbol: string;
  name?: string;
  riskScore: number;
  reason?: string;
}): Promise<boolean> {
  if (!areDeviceAlertsEnabled()) return false;

  const threshold = getNotificationThreshold();
  if (threshold === "critical_only" && stock.riskScore < 7.5) {
    return false;
  }

  const severityIcon = stock.riskScore >= 8.0 ? "🚨" : "⚠️";
  return sendDeviceNotification({
    title: `${severityIcon} ${stock.symbol}: Risiko Tinggi Terdeteksi (${stock.riskScore.toFixed(1)}/10)`,
    body: stock.reason || `Emiten ${stock.symbol} ${stock.name ? `(${stock.name})` : ""} menunjukkan lonjakan anomali transaksi signifikan.`,
    url: "/dashboard",
    tag: `stock-alert-${stock.symbol}`,
  });
}
