import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Landmark,
  Loader2,
  LogOut,
  Save,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { validateName } from "../lib/validation";
import type { View } from "../App";

type ProfilePageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
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
    onClick: () => { setSidebarOpen(false); onNavigate(item.view); },
  }));

  const inputClass =
    "w-full rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 text-[15px] text-slate-700 dark:text-slate-200 outline-none focus:border-[#b5c6d9] transition";

  const initials = formData.full_name
    ? formData.full_name.split(" ").slice(0, 2).map((w: string) => w[0] ?? "").join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

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
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-600 dark:text-red-300">
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
                    onChange={(e) => handleChange(field as keyof typeof formData, e.target.value)}
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
                  To change your email address, re-verification via Supabase is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
