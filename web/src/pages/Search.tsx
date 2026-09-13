import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  Landmark,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import AppShell from "../components/AppShell";


type SearchPageProps = {
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
      | "not-found",
  ) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const, active: true },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
];

const searchResults = [
  { ticker: "GOTO", company: "GoTo Gojek Tokopedia Tbk.", sector: "Technology", risk: "Critical", score: 88, note: "Operating Loss & Cash Burn", badge: "red" },
  { ticker: "BUMI", company: "Bumi Resources Tbk.", sector: "Energy & Coal", risk: "Critical", score: 92, note: "Negative Equity (Rule III.1)", badge: "red" },
  { ticker: "WASK", company: "Waskita Karya (Persero) Tbk.", sector: "Construction", risk: "Critical", score: 96, note: "Debt Restructuring Standstill", badge: "red" },
  { ticker: "PTRO", company: "Petrosea Tbk.", sector: "Mining", risk: "High", score: 72, note: "Order Backlog Compression", badge: "amber" },
  { ticker: "SMGR", company: "Semen Indonesia Tbk.", sector: "Materials", risk: "Moderate", score: 58, note: "Margin Compression", badge: "green" },
];

const SearchPage = ({ onNavigate }: SearchPageProps) => {
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
            <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl">Search</h1>
            <p className="mt-2 text-[1.05rem] text-[#5b6675] dark:text-slate-400">Search securities, issuers, and evidence trails</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8d3cd] dark:border-slate-700 bg-[#f3f1ee] dark:bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#465267] dark:text-slate-400">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2ec784]" />
            System Updated: Just Now
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full max-w-[820px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b8594]" />
              <input
                type="text"
                defaultValue="GOTO"
                className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-white dark:bg-slate-900 py-4 pl-12 pr-4 text-[1.1rem] text-slate-700 dark:text-slate-200 outline-none placeholder:text-[#778194] focus:border-[#b5c6d9]"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-4 py-3 text-[0.95rem] font-medium text-[#475367] dark:text-slate-300">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-4 py-3 text-[0.95rem] font-medium text-[#475367] dark:text-slate-300">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.9rem]">
            {[
              { label: "All Tickers", active: true },
              { label: "Critical Risk", tone: "red" },
              { label: "High Risk", tone: "amber" },
              { label: "Low Risk", tone: "green" },
            ].map((chip, index) => (
              <button
                key={index}
                type="button"
                className={["inline-flex items-center gap-2 rounded-full border px-3 py-2 font-medium",
                  chip.active ? "border-[#ddd5cf] dark:border-slate-600 bg-[#f1efed] dark:bg-slate-700 text-[#111827] dark:text-slate-100"
                    : chip.tone === "red" ? "border-[#f1c7c7] dark:border-red-900 bg-[#fff1f1] dark:bg-red-950/40 text-[#d93e3e]"
                    : chip.tone === "amber" ? "border-[#f0d7ad] dark:border-amber-900 bg-[#fff7eb] dark:bg-amber-950/40 text-[#b87812]"
                    : "border-[#cfead7] dark:border-green-900 bg-[#edfdf4] dark:bg-green-950/40 text-[#0d8a5b]"].join(" ")}
              >
                <span className={["inline-block h-2.5 w-2.5 rounded-full", chip.active ? "bg-[#111827] dark:bg-slate-300" : chip.tone === "red" ? "bg-[#d93e3e]" : chip.tone === "amber" ? "bg-[#f3b13b]" : "bg-[#28b67a]"].join(" ")} />
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 shadow-sm">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.2fr_1.5fr_1fr_0.9fr_0.8fr] items-center gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900 px-5 py-4 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a] dark:text-slate-400">
              <span>Ticker</span><span>Issuer</span><span>Sector</span><span>Risk</span><span className="text-right">Action</span>
            </div>
            {searchResults.map((row) => (
              <div key={row.ticker} className="grid grid-cols-[1.2fr_1.5fr_1fr_0.9fr_0.8fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700 px-5 py-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={["flex h-9 w-9 items-center justify-center rounded-full text-[0.85rem] font-black text-white", row.badge === "red" ? "bg-[#d93e3e]" : row.badge === "amber" ? "bg-[#f1b234]" : "bg-[#2cb57e]"].join(" ")}>{row.ticker[0]}</div>
                  <div className="text-[1.05rem] font-black tracking-[-0.05em] text-[#1b2433] dark:text-slate-100">{row.ticker}</div>
                </div>
                <div>
                  <div className="text-[1rem] font-medium text-[#212b38] dark:text-slate-200">{row.company}</div>
                  <div className="mt-1 text-[0.8rem] text-[#69798a] dark:text-slate-400">{row.note}</div>
                </div>
                <div className="text-[0.95rem] font-medium text-[#303c4c] dark:text-slate-300">{row.sector}</div>
                <div className="flex items-center gap-2">
                  <span className={["inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold", row.badge === "red" ? "bg-[#ffe8e8] dark:bg-red-950/50 text-[#bc3030]" : row.badge === "amber" ? "bg-[#fff0c8] dark:bg-amber-950/50 text-[#a15c09]" : "bg-[#ebfff4] dark:bg-green-950/50 text-[#0d8a5b]"].join(" ")}>
                    {row.risk}
                  </span>
                  <span className="text-[0.82rem] font-semibold text-[#4d5d73] dark:text-slate-400">{row.score}/100</span>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => onNavigate("dashboard")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-3 py-2 text-[0.9rem] font-medium text-[#263140] dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-600"
                  >
                    View <ArrowRight className="h-4 w-4" />
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

export default SearchPage;
