import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  Landmark,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import AppShell from "../components/AppShell";

type DashboardPageProps = {
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
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const, active: true },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
  { label: "Profile", icon: User, view: "profile" as const },
];

const tickerRows = [
  { ticker: "WASK", rank: "#1", company: "Waskita Karya (Persero) Tbk.", sector: "Construction", driver: "Debt Restructuring Standstill", score: 96, delta: "+4.2", tone: "red" },
  { ticker: "BUMI", rank: "#2", company: "Bumi Resources Tbk.", sector: "Energy & Coal", driver: "Negative Equity (Rule III.1)", score: 92, delta: "+2.1", tone: "red" },
  { ticker: "GOTO", rank: "#3", company: "GoTo Gojek Tokopedia Tbk.", sector: "Technology", driver: "Operating Loss & Cash Burn", score: 88, delta: "-0.6", tone: "amber" },
];

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => { setSidebarOpen(false); onNavigate(item.view); },
  }));

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
      navItems={navItems}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl">
              Risk Ranking
            </h1>
            <p className="mt-2 text-sm text-[#5b6675] dark:text-slate-400 sm:text-[1.05rem]">
              IDX Real-time Suspension Risk Monitor
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-[#273244] dark:text-slate-200"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8d3cd] dark:border-slate-700 bg-[#f3f1ee] dark:bg-slate-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#465267] dark:text-slate-400 sm:text-[11px]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2ec784]" />
              System Updated: Just Now
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#f0b5b5] dark:border-red-900/40 bg-[#fff1f1] dark:bg-red-950/30 px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d93e3e] text-white sm:h-11 sm:w-11">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex items-end gap-2">
                <span className="text-[1.8rem] font-black leading-none tracking-[-0.08em] text-[#d93e3e] sm:text-[2.2rem]">3</span>
                <span className="pb-1 text-sm font-semibold text-[#3b4555] dark:text-slate-300 sm:text-[1.05rem]">
                  Stocks Flagged at Critical Suspension Risk
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="inline-flex items-center justify-center rounded-md bg-[#d93e3e] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-[#c83535] sm:px-5 sm:py-3 sm:text-sm"
            >
              Review All 3
            </button>
          </div>
          <p className="mt-2 text-sm text-[#4f5969] dark:text-slate-400 sm:pl-[3.7rem] sm:text-[1.05rem]">
            Audited financial triggers &amp; persistent equity impairment require immediate portfolio assessment.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-[760px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8594] sm:h-5 sm:w-5" />
            <input
              type="text"
              placeholder="Search ticker, company name, or ISIN code (e.g. BUMI, GOTO)..."
              className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 py-3 pl-11 pr-4 text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-[#778194] dark:placeholder:text-slate-500 focus:border-[#b5c6d9] sm:py-4 sm:pl-12 sm:text-[1.05rem]"
            />
          </label>
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-3 py-2.5 text-sm font-medium text-[#475367] dark:text-slate-300 sm:px-4 sm:py-3">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-3 py-2.5 text-sm font-medium text-[#475367] dark:text-slate-300 sm:px-4 sm:py-3">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            { label: "All Tickers (924)", active: true },
            { label: "Critical Risk (3)", tone: "red" },
            { label: "High Watch (11)", tone: "amber" },
            { label: "Normal / Low Risk", tone: "green" },
          ].map((chip, index) => (
            <button
              key={index}
              type="button"
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[0.9rem] font-medium",
                chip.active
                  ? "border-[#ddd5cf] dark:border-slate-600 bg-[#f1efed] dark:bg-slate-700 text-[#111827] dark:text-slate-100"
                  : chip.tone === "red"
                    ? "border-[#f1c7c7] dark:border-red-900 bg-[#fff1f1] dark:bg-red-950/40 text-[#d93e3e]"
                    : chip.tone === "amber"
                      ? "border-[#f0d7ad] dark:border-amber-900 bg-[#fff7eb] dark:bg-amber-950/40 text-[#b87812]"
                      : "border-[#cfead7] dark:border-green-900 bg-[#edfdf4] dark:bg-green-950/40 text-[#0d8a5b]",
              ].join(" ")}
            >
              <span className={["inline-block h-2.5 w-2.5 rounded-full", chip.active ? "bg-[#111827] dark:bg-slate-300" : chip.tone === "red" ? "bg-[#d93e3e]" : chip.tone === "amber" ? "bg-[#f3b13b]" : "bg-[#28b67a]"].join(" ")} />
              {chip.label}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 shadow-sm">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.7fr_1fr_1.3fr_1.1fr_0.7fr] items-center gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900 px-5 py-4 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a] dark:text-slate-400">
              <span>Ticker &amp; Issuer</span>
              <span>Sector</span>
              <span>Primary Risk Driver</span>
              <span>Suspension Risk Index</span>
              <span className="text-right">Action</span>
            </div>

            {tickerRows.map((row) => (
              <div
                key={row.ticker}
                className="grid grid-cols-[1.7fr_1fr_1.3fr_1.1fr_0.7fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700 px-5 py-5 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className={["inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-black text-white", row.tone === "amber" ? "bg-[#f1b234]" : "bg-[#d93e3e]"].join(" ")}>
                    {row.ticker[0]}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[1.1rem] font-black tracking-[-0.06em] text-[#1b2433] dark:text-slate-100">{row.ticker}</span>
                      <span className="text-[0.8rem] font-medium text-[#5a6576] dark:text-slate-400">Rank {row.rank}</span>
                    </div>
                    <div className="mt-1 text-[0.9rem] text-[#5c6676] dark:text-slate-400">{row.company}</div>
                  </div>
                </div>

                <div className="text-[0.96rem] font-medium text-[#263140] dark:text-slate-300">{row.sector}</div>

                <div className="flex items-center gap-2">
                  <span className={["inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold", row.tone === "amber" ? "bg-[#fff0c8] dark:bg-amber-950/50 text-[#a15c09]" : "bg-[#ffe8e8] dark:bg-red-950/50 text-[#bc3030]"].join(" ")}>
                    <span className="mr-1 h-2 w-2 rounded-full bg-current" />
                    {row.driver}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full max-w-[140px] rounded-full border border-[#e0d4d1] dark:border-slate-600 bg-[#f0efed] dark:bg-slate-700 p-1">
                    <div className={["h-2 rounded-full", row.tone === "red" ? "bg-[#d93e3e]" : "bg-[#f1b234]"].join(" ")} style={{ width: `${row.score}%` }} />
                  </div>
                  <div className="min-w-[60px] text-right text-[0.9rem] font-semibold text-[#1b2433] dark:text-slate-200">{row.score}/100</div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <span className={["text-[0.8rem] font-semibold", Number(row.delta) > 0 ? "text-[#d93e3e]" : "text-[#1a7d62]"].join(" ")}>
                    {row.delta}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-3 py-2 text-[0.9rem] font-medium text-[#263140] dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-600"
                  >
                    Analyze <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
