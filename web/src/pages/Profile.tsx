import { useState } from "react";
import {
  BarChart3,
  FileText,
  Landmark,
  Save,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import AppShell from "../components/AppShell";

type ProfilePageProps = {
  onNavigate: (
    view:
      | "home"
      | "register"
      | "login"
      | "otp"
      | "success"
      | "dashboard"
      | "search"
      | "evidence"
      | "methodology"
      | "profile"
      | "not-found",
  ) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
  { label: "Profile", icon: User, view: "profile" as const, active: true },
];

const ProfilePage = ({ onNavigate }: ProfilePageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "Raden Arya",
    alias: "Arya",
    email: "r.arya@limina.id",
    phone: "+62 812 3456 7890",
    company: "Limina Research",
    role: "Retail Analyst",
    location: "Jakarta, Indonesia",
    plan: "Free Retail Tier",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => { setSidebarOpen(false); onNavigate(item.view); },
  }));

  const inputClass = "w-full rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-3 text-[15px] text-slate-700 dark:text-slate-200 outline-none focus:border-[#b5c6d9]";

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
      navItems={navItems}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl">Profile</h1>
            <p className="mt-2 text-[1.05rem] text-[#5b6675] dark:text-slate-400">Manage your account and user details</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
            className="inline-flex items-center justify-center rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-[#273244] dark:text-slate-200"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#101a2b] dark:bg-violet-700 text-3xl font-black text-white shadow-lg">
                {formData.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100">{formData.name}</h2>
              <p className="mt-1 text-[#58677a] dark:text-slate-400">{formData.role}</p>
              <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe4ea] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-[#1f2937] dark:text-slate-200">
                <ShieldCheck className="h-4 w-4 text-[#2ec784]" />
                {formData.plan}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#7a8697] dark:text-slate-400">Account Settings</div>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100">Personal Information</h3>
              </div>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#101a2b] dark:bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                { label: "Full Name", field: "name" },
                { label: "Alias", field: "alias" },
                { label: "Email", field: "email" },
                { label: "Phone", field: "phone" },
                { label: "Company", field: "company" },
                { label: "Role", field: "role" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">{label}</label>
                  <input
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => handleChange(field as keyof typeof formData, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">Location</label>
                <input value={formData.location} onChange={(e) => handleChange("location", e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a] dark:text-slate-400">Current Plan</label>
                <input value={formData.plan} onChange={(e) => handleChange("plan", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
