import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  Landmark,
  Menu,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";

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
  {
    label: "Ranking",
    icon: BarChart3,
    view: "dashboard" as const,
    active: true,
  },
  { label: "Search", icon: Search, view: "search" as const, active: false },
  {
    label: "Evidence",
    icon: FileText,
    view: "evidence" as const,
    active: false,
  },
  {
    label: "Methodology",
    icon: Landmark,
    view: "methodology" as const,
    active: false,
  },
  { label: "Profile", icon: User, view: "profile" as const, active: false },
];

const tickerRows = [
  {
    ticker: "WASK",
    rank: "#1",
    company: "Waskita Karya (Persero) Tbk.",
    sector: "Construction",
    driver: "Debt Restructuring Standstill",
    score: 96,
    delta: "+4.2",
    tone: "red",
  },
  {
    ticker: "BUMI",
    rank: "#2",
    company: "Bumi Resources Tbk.",
    sector: "Energy & Coal",
    driver: "Negative Equity (Rule III.1)",
    score: 92,
    delta: "+2.1",
    tone: "red",
  },
  {
    ticker: "GOTO",
    rank: "#3",
    company: "GoTo Gojek Tokopedia Tbk.",
    sector: "Technology",
    driver: "Operating Loss & Cash Burn",
    score: 88,
    delta: "-0.6",
    tone: "amber",
  },
];

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  return (
    <div className="min-h-screen bg-[#f3f2ef] text-slate-800">
      <div className="flex min-h-screen">
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
            {navItems.map(({ label, icon: Icon, onClick, active }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
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

        <main className="flex-1 px-4 py-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-4 border-b border-[#d8d3cd] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] sm:text-4xl lg:text-5xl">
                  Risk Ranking
                </h1>
                <p className="mt-2 text-sm text-[#5b6675] sm:text-[1.05rem]">
                  IDX Real-time Suspension Risk Monitor
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => onNavigate("profile")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] px-4 py-2.5 text-sm font-semibold text-[#273244]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8d3cd] bg-[#f3f1ee] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#465267] sm:text-[11px]">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2ec784]" />
                  System Updated: Just Now
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-[#f0b5b5] bg-[#fff1f1] px-4 py-4 shadow-sm sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d93e3e] text-white sm:h-11 sm:w-11">
                    <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-[1.8rem] font-black leading-none tracking-[-0.08em] text-[#d93e3e] sm:text-[2.2rem]">
                      3
                    </span>
                    <span className="pb-1 text-sm font-semibold text-[#3b4555] sm:text-[1.05rem]">
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

              <p className="mt-2 text-sm text-[#4f5969] sm:pl-[3.7rem] sm:text-[1.05rem]">
                Audited financial triggers & persistent equity impairment
                require immediate portfolio assessment.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <label className="relative block w-full max-w-[760px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8594] sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search ticker, company name, or ISIN code (e.g. BUMI, GOTO)..."
                  className="w-full rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-[#778194] focus:border-[#b5c6d9] sm:py-4 sm:pl-12 sm:text-[1.05rem]"
                />
              </label>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] px-3 py-2.5 text-sm font-medium text-[#475367] sm:px-4 sm:py-3"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] px-3 py-2.5 text-sm font-medium text-[#475367] sm:px-4 sm:py-3"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {[
                { label: "All Tickers (924)", active: true },
                { label: "Critical Risk (3)", active: false, tone: "red" },
                { label: "High Watc h (11)", active: false, tone: "amber" },
                { label: "Normal / Low Risk", active: false, tone: "green" },
              ].map((chip, index) => (
                <button
                  key={index}
                  type="button"
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[0.9rem] font-medium",
                    chip.active
                      ? "border-[#ddd5cf] bg-[#f1efed] text-[#111827]"
                      : chip.tone === "red"
                        ? "border-[#f1c7c7] bg-[#fff1f1] text-[#d93e3e]"
                        : chip.tone === "amber"
                          ? "border-[#f0d7ad] bg-[#fff7eb] text-[#b87812]"
                          : "border-[#cfead7] bg-[#edfdf4] text-[#0d8a5b]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-2.5 w-2.5 rounded-full",
                      chip.active
                        ? "bg-[#111827]"
                        : chip.tone === "red"
                          ? "bg-[#d93e3e]"
                          : chip.tone === "amber"
                            ? "bg-[#f3b13b]"
                            : "bg-[#28b67a]",
                    ].join(" ")}
                  />
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="mt-8 overflow-x-auto rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] shadow-sm">
              <div className="min-w-[720px]">
                <div className="grid grid-cols-[1.7fr_1fr_1.3fr_1.1fr_0.7fr] items-center gap-4 border-b border-[#d8d3cd] bg-[#eceae7] px-5 py-4 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a]">
                  <span>Ticker &amp; Issuer</span>
                  <span>Sector</span>
                  <span>Primary Risk Driver</span>
                  <span>Suspension Risk Index</span>
                  <span className="text-right">Action</span>
                </div>

                {tickerRows.map((row) => (
                  <div
                    key={row.ticker}
                    className="grid grid-cols-[1.7fr_1fr_1.3fr_1.1fr_0.7fr] items-center gap-4 border-b border-[#e7e0d8] px-5 py-5 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.75rem] font-black text-white",
                          row.ticker === "WASK"
                            ? "bg-[#d93e3e]"
                            : row.ticker === "BUMI"
                              ? "bg-[#d93e3e]"
                              : "bg-[#f1b234]",
                        ].join(" ")}
                      >
                        {row.ticker[0]}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[1.1rem] font-black tracking-[-0.06em] text-[#1b2433]">
                            {row.ticker}
                          </span>
                          <span className="text-[0.8rem] font-medium text-[#5a6576]">
                            Rank {row.rank}
                          </span>
                        </div>

                        <div className="mt-1 text-[0.9rem] text-[#5c6676]">
                          {row.company}
                        </div>
                      </div>
                    </div>

                    <div className="text-[0.96rem] font-medium text-[#263140]">
                      {row.sector}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-[0.75rem] font-semibold",
                          row.ticker === "GOTO"
                            ? "bg-[#fff0c8] text-[#a15c09]"
                            : "bg-[#ffe8e8] text-[#bc3030]",
                        ].join(" ")}
                      >
                        <span className="mr-1 h-2 w-2 rounded-full bg-current" />
                        {row.driver}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-full max-w-[140px] rounded-full border border-[#e0d4d1] bg-[#f0efed] p-1">
                        <div
                          className={[
                            "h-2 rounded-full",
                            row.tone === "red"
                              ? "bg-[#d93e3e]"
                              : "bg-[#f1b234]",
                          ].join(" ")}
                          style={{ width: `${row.score}%` }}
                        />
                      </div>
                      <div className="min-w-[60px] text-right text-[0.9rem] font-semibold text-[#1b2433]">
                        {row.score}/100
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <span
                        className={[
                          "text-[0.8rem] font-semibold",
                          Number(row.delta) > 0
                            ? "text-[#d93e3e]"
                            : "text-[#1a7d62]",
                        ].join(" ")}
                      >
                        {row.delta}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate("dashboard")}
                        className="inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] bg-[#f7f5f3] px-3 py-2 text-[0.9rem] font-medium text-[#263140] transition hover:bg-white"
                      >
                        Analyze <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
