import { useState } from "react";
import {
  BarChart3,
  FileText,
  Landmark,
  Menu,
  Save,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";

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

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-40 inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] bg-[#f7f5f3] p-3 shadow-sm lg:hidden"
        >
          <Menu className="h-5 w-5 text-[#1f2937]" />
        </button>

        <div
          className={[
            "fixed inset-0 z-30 bg-slate-950/25 transition-opacity lg:hidden",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-[#d8d3cd] bg-[#f3f2ef] px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <div className="mb-12 flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-8 w-auto" alt="Limina logo" />
              <span className="rounded bg-[#eae5de] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5f6875]">
                IDX Monitor
              </span>
            </div>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex items-center justify-center rounded-lg p-2 lg:hidden"
            >
              <X className="h-5 w-5 text-[#1f2937]" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map(({ label, icon: Icon, view, active }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  onNavigate(view);
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[1.05rem] font-medium transition",
                  active
                    ? "bg-[#e7e3df] text-[#111827] shadow-inner"
                    : "text-[#465267] hover:bg-[#ece8e3]",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 w-full px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-col gap-4 border-b border-[#d8d3cd] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] sm:text-4xl lg:text-5xl">
                  Profile
                </h1>
                <p className="mt-2 text-[1.05rem] text-[#5b6675]">
                  Manage your account and user details
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="inline-flex items-center justify-center rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] px-4 py-2.5 text-sm font-semibold text-[#273244]"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-2xl border border-[#d8d3cd] bg-[#f7f5f3] p-5 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#101a2b] text-3xl font-black text-white shadow-lg">
                    {formData.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold tracking-[-0.06em] text-[#111827]">
                    {formData.name}
                  </h2>
                  <p className="mt-1 text-[#58677a]">{formData.role}</p>

                  <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe4ea] bg-white px-3 py-2 text-sm font-medium text-[#1f2937]">
                    <ShieldCheck className="h-4 w-4 text-[#2ec784]" />
                    {formData.plan}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d8d3cd] bg-[#f7f5f3] p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#7a8697]">
                      Account Settings
                    </div>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.06em] text-[#111827]">
                      Personal Information
                    </h3>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#101a2b] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Full Name
                    </label>
                    <input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Alias
                    </label>
                    <input
                      value={formData.alias}
                      onChange={(e) => handleChange("alias", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Email
                    </label>
                    <input
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Phone
                    </label>
                    <input
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Company
                    </label>
                    <input
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Role
                    </label>
                    <input
                      value={formData.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Location
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                      Current Plan
                    </label>
                    <input
                      value={formData.plan}
                      onChange={(e) => handleChange("plan", e.target.value)}
                      className="w-full rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 text-[15px] text-slate-700 outline-none focus:border-[#b5c6d9]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
