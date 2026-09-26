import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Bell,
  BellRing,
  CheckCircle2,
  FileText,
  Laptop,
  Loader2,
  LogOut,
  Save,
  Search,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { validateName } from "../lib/validation";
import {
  areDeviceAlertsEnabled,
  getNotificationPermission,
  getNotificationThreshold,
  isNotificationSupported,
  requestNotificationPermission,
  sendTestRiskAlert,
  setDeviceAlertsEnabled,
  setNotificationThreshold,
  type NotificationThreshold,
} from "../lib/notifications";
import type { View } from "../App";

type ProfilePageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "News", icon: FileText, view: "news" as const },
  { label: "Profile", icon: User, view: "profile" as const, active: true },
];

const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
  const { user, signOut, updateProfile } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [formData, setFormData] = useState(() => ({
    full_name: user?.user_metadata?.full_name ?? "",
    alias: user?.user_metadata?.alias ?? "",
    phone: user?.user_metadata?.phone ?? "",
    company: user?.user_metadata?.company ?? "",
    role: user?.user_metadata?.role ?? "",
    location: user?.user_metadata?.location ?? "",
  }));

  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [deviceAlertsActive, setDeviceAlertsActive] = useState(false);
  const [notifThreshold, setNotifThresholdState] =
    useState<NotificationThreshold>("critical_only");
  const [testingNotif, setTestingNotif] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const updatePerm = () => {
      const supported = isNotificationSupported();
      setNotifSupported(supported);
      if (supported) {
        setNotifPermission(getNotificationPermission());
        setDeviceAlertsActive(areDeviceAlertsEnabled());
        setNotifThresholdState(getNotificationThreshold());
      } else {
        setNotifPermission("unsupported");
      }
    };

    updatePerm();
    window.addEventListener("focus", updatePerm);
    return () => window.removeEventListener("focus", updatePerm);
  }, []);

  const handleToggleNotifications = async () => {
    setTestFeedback(null);
    if (!deviceAlertsActive) {
      const res = await requestNotificationPermission();
      setNotifPermission(res.status);
      if (res.granted) {
        setDeviceAlertsActive(true);
        setTestFeedback({
          success: true,
          message:
            "Permission granted! System notifications to your device are now active.",
        });
      } else {
        setDeviceAlertsActive(false);
        setTestFeedback({
          success: false,
          message:
            res.status === "denied"
              ? "Notification permission is blocked in your browser. Click the lock icon to the left of the URL to allow it."
              : "Notification permission has not been granted.",
        });
      }
    } else {
      setDeviceAlertsEnabled(false);
      setDeviceAlertsActive(false);
      setTestFeedback({
        success: true,
        message: "Device notifications disabled.",
      });
    }
  };

  const handleSendTest = async () => {
    setTestingNotif(true);
    setTestFeedback(null);
    const res = await sendTestRiskAlert();
    setTestingNotif(false);
    setTestFeedback(res);
    setNotifPermission(getNotificationPermission());
    setDeviceAlertsActive(areDeviceAlertsEnabled());
  };

  const handleChangeThreshold = (val: NotificationThreshold) => {
    setNotificationThreshold(val);
    setNotifThresholdState(val);
  };

  useEffect(() => {
    let mounted = true;
    async function loadProfileFromDb() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data && mounted) {
          setFormData((prev) => ({
            full_name: data.full_name || prev.full_name,
            alias: data.alias || prev.alias,
            phone: data.phone || prev.phone,
            company: data.company || prev.company,
            role: data.role || prev.role,
            location: data.location || prev.location,
          }));
        }
      } catch (err) {
        console.warn("[Profile] Error loading DB profile:", err);
      }
    }
    loadProfileFromDb();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSave = useCallback(async () => {
    setSaveError(null);
    setSaveSuccess(false);

    const nameResult = validateName(formData.full_name);
    if (!nameResult.valid) {
      setSaveError(nameResult.error ?? "Invalid name format.");
      return;
    }

    setSaving(true);
    const { error } = await updateProfile(formData);
    setSaving(false);

    if (error) {
      setSaveError(error);
      return;
    }
    setSaveSuccess(true);
  }, [formData, updateProfile]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await signOut();
  }, [signOut]);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  const inputClass =
    "w-full rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 text-[15px] text-slate-700 dark:text-slate-200 outline-none focus:border-[#b5c6d9] transition";

  const initials = formData.full_name
    ? formData.full_name
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0] ?? "")
        .join("")
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
      navItems={navItems}
      onNavigate={onNavigate}
      currentView="profile"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl">
              Profile
            </h1>
            <p className="mt-2 text-[1.05rem] text-[#5b6675] dark:text-slate-400">
              Manage your account and user profile details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="inline-flex items-center justify-center rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-[#273244] dark:text-slate-200"
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:bg-red-100 disabled:opacity-60"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* ── Avatar card ── */}
          <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#101a2b] dark:bg-violet-700 text-3xl font-black text-white shadow-lg">
                {initials}
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100">
                {formData.full_name || "User"}
              </h2>
              <p className="mt-1 text-[#58677a] dark:text-slate-400">
                {formData.role || "Retail Analyst"}
              </p>

              {/* Email — read only (cannot change without re-verification) */}
              <div className="mt-3 w-full rounded-xl border border-[#dfe4ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#536174] dark:text-slate-400">
                {user?.email ?? "—"}
              </div>

              <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe4ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-[#1f2937] dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-[#2ec784]" />
                Free Retail Tier
              </div>
            </div>
          </div>

          {/* ── Right Column (Edit form & Notifications) ── */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* ── Edit form ── */}
            <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#7a8697] dark:text-slate-400">
                    Account Settings
                  </div>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100">
                    Personal Information
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#101a2b] dark:bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>

              {/* Status messages */}
              {saveSuccess && (
                <div className="mb-4 rounded-xl border border-[#cfe7dd] bg-[#ebfff7] px-4 py-3 text-sm text-[#1f7d5d]">
                  ✓ Profile updated successfully.
                </div>
              )}
              {saveError && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-300"
                >
                  {saveError}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { label: "Full Name *", field: "full_name" },
                  { label: "Alias", field: "alias" },
                  { label: "Phone", field: "phone" },
                  { label: "Company", field: "company" },
                  { label: "Role", field: "role" },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">
                      {label}
                    </label>
                    <input
                      value={formData[field as keyof typeof formData]}
                      onChange={(e) =>
                        handleChange(
                          field as keyof typeof formData,
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">
                    Location
                  </label>
                  <input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* Email — read-only */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">
                    Email (read-only)
                  </label>
                  <input
                    readOnly
                    value={user?.email ?? ""}
                    className={`${inputClass} cursor-not-allowed opacity-60`}
                    title="Email cannot be changed directly. Contact support if you need to update your email."
                  />
                  <p className="mt-1 text-[11px] text-[#7a8697] dark:text-slate-500">
                    To change your email address, re-verification via Supabase
                    is required.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Web Push & Device Notification Settings Card ── */}
            <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm sm:p-6 transition-colors">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2ded9] dark:border-slate-700/80 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-red-500 border border-[#dfe4ea] dark:border-slate-700 shadow-xs">
                    <BellRing className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-xl font-bold tracking-tight text-[#111827] dark:text-slate-100">
                        Device & Web Push Notifications
                      </h3>
                      {notifPermission === "granted" && deviceAlertsActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      ) : notifPermission === "denied" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Blocked by Browser
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e7e4e0] dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#5e6b7d] dark:text-slate-400 max-w-xl">
                      Receive system alerts directly on Windows, macOS, Linux,
                      or Android Chrome when an IDX issuer anomaly is detected.
                    </p>
                  </div>
                </div>

                {/* Toggle switch / Action button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleNotifications}
                    disabled={!notifSupported}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-xs ${
                      deviceAlertsActive
                        ? "border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100"
                        : "bg-[#101a2b] dark:bg-violet-600 text-white hover:opacity-90"
                    } disabled:opacity-50`}
                  >
                    <Bell className="h-4 w-4" />
                    {deviceAlertsActive
                      ? "Disable Alerts"
                      : "Enable Notifications"}
                  </button>
                </div>
              </div>

              {/* Notice if permission is denied by browser */}
              {notifPermission === "denied" && (
                <div className="mb-5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/30 p-4 text-xs text-rose-800 dark:text-rose-300">
                  <div className="font-bold flex items-center gap-1.5 text-sm mb-1 text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    Notification Permission Blocked by Browser
                  </div>
                  <p className="leading-relaxed">
                    To enable notifications: click the{" "}
                    <strong>lock icon / site settings</strong> to the left of
                    the browser's URL bar, change the{" "}
                    <strong>Notifications</strong> permission to{" "}
                    <strong>Allow</strong>, then reload this page.
                  </p>
                </div>
              )}

              {/* Test feedback toast / banner */}
              {testFeedback && (
                <div
                  role="alert"
                  className={`mb-5 rounded-xl border px-4 py-3 text-sm flex items-start gap-2.5 ${
                    testFeedback.success
                      ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                      : "border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                  }`}
                >
                  {testFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{testFeedback.message}</span>
                </div>
              )}

              {/* Configuration Options */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-[#d8d3cd] dark:border-slate-700 shadow-xs">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                    Notification Sensitivity Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChangeThreshold("critical_only")}
                      className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                        notifThreshold === "critical_only"
                          ? "border-red-500 bg-red-50/70 dark:bg-red-950/30 text-slate-900 dark:text-slate-100 font-semibold shadow-xs ring-1 ring-red-500/20"
                          : "border-[#dfe4ea] dark:border-slate-700/80 bg-[#f7f5f3] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold mb-1">
                        🚨 Critical Risk Only (Recommended)
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-normal">
                        Only send alerts when an issuer's risk score is ≥ 7.5
                        (potential suspension, extreme anomalous volume spikes).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChangeThreshold("all_anomalies")}
                      className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                        notifThreshold === "all_anomalies"
                          ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-slate-900 dark:text-slate-100 font-semibold shadow-xs ring-1 ring-amber-500/20"
                          : "border-[#dfe4ea] dark:border-slate-700/80 bg-[#f7f5f3] dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold mb-1">
                        ⚡ All Detected Anomalies
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-normal">
                        Send alerts for every unusual movement and detected
                        accumulation anomaly.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Action Buttons & Device Compatibility notes */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" /> Desktop
                      (Windows / macOS / Linux)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />{" "}
                      Android Chrome
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={testingNotif}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#d8d3cd] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs"
                  >
                    {testingNotif ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 text-red-500" />
                    )}
                    Send Test Alert to Device
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
