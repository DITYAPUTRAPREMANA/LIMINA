import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Landmark,
  Search,
  ShieldCheck,
} from "lucide-react";
import AppShell from "../components/AppShell";

type EvidencePageProps = {
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
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const, active: true },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
];

const matrixRows = [
  { ticker: "WASK", sector: "Infrastructure", lead: "42 Days", risk: 98, peak: 98, outcome: "Halting Confirmed" },
  { ticker: "KAEF", sector: "Healthcare", lead: "21 Days", risk: 92, peak: 92, outcome: "Trading Suspension" },
  { ticker: "SRTG", sector: "Investment Holding", lead: "30 Days Active", risk: 85, peak: 85, outcome: "Watchlist Active" },
];

const EvidencePage = ({ onNavigate }: EvidencePageProps) => {
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
        <div className="mb-8 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#58677a] dark:text-slate-400">Case Studies</div>
              <h1 className="mt-3 text-3xl font-bold leading-[0.98] tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-[3rem]">
                Timeline Analysis: PT GoTo Gojek Tokopedia Tbk.
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded border border-[#d8d3cd] dark:border-slate-600 bg-[#f1efed] dark:bg-slate-700 px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#465267] dark:text-slate-300">
              <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#d93e3e]" />
              Case ID: IDX-GOTO-2023
            </div>
          </div>
          <p className="mt-4 max-w-[820px] text-[1.12rem] leading-relaxed text-[#5b6675] dark:text-slate-400">
            Reconstruction of empirical anomaly triggers leading up to the official IDX suspension window.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-4 shadow-sm">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[1.35fr_1fr_0.9fr_1.4fr_0.9fr] gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900 px-3 py-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a] dark:text-slate-400">
              <span>Ticker</span><span>Sector</span><span>Predicted Lead Time</span><span>Risk Escalation Vector</span><span>Peak Risk</span>
            </div>
            {matrixRows.map((row) => (
              <div key={row.ticker} className="grid grid-cols-[1.35fr_1fr_0.9fr_1.4fr_0.9fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700 px-3 py-4 last:border-b-0">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d93e3e] text-[0.72rem] font-black text-white">{row.ticker[0]}</span>
                  <span className="text-[1rem] font-semibold text-[#1b2433] dark:text-slate-100">{row.ticker}</span>
                </div>
                <div className="text-[0.92rem] text-[#2f3b4d] dark:text-slate-300">{row.sector}</div>
                <div className="text-[0.98rem] font-medium text-[#2e3c4f] dark:text-slate-300">{row.lead}</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-[#efefef] dark:bg-slate-700">
                    <div className="h-full rounded-full bg-[#d93e3e]" style={{ width: `${row.risk}%` }} />
                  </div>
                  <span className="text-[0.82rem] font-semibold text-[#d93e3e]">{row.risk}%</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-right">
                  <span className="text-[0.92rem] font-semibold text-[#1b2433] dark:text-slate-200">{row.peak}</span>
                  <span className="rounded bg-[#ffe8e8] dark:bg-red-950/50 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#c84a4a]">{row.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#d8d3cd] dark:border-slate-700 pb-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[1.7rem] font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100">Evidence Ledger</h2>
              <p className="mt-1 text-[0.92rem] text-[#5b6675] dark:text-slate-400">Cross-dataset triggers and validation artifacts.</p>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[#d8d3cd] dark:border-slate-600 bg-[#f1efed] dark:bg-slate-700 px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#465267] dark:text-slate-300">
              <ShieldCheck className="h-4 w-4" /> Verified Chain
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { title: "Trading Halt Timeline", copy: "Evidence confirms a three-stage escalation beginning with debt restructurings, followed by negative equity margin breach and final exchange trigger over 42 days.", flag: "Verified" },
              { title: "Market Microstructure Review", copy: "Intraday volume spikes, spread widening, and abnormal bid-ask dispersion align with the risk signal windows detected by the model.", flag: "Archived" },
              { title: "Regulatory Correspondence", copy: "IDX documentation and announced risk factors align with the computed trigger path and timing output, reinforcing the anomaly classification.", flag: "Attached" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#eef7f1] dark:bg-green-950/50 text-[#1a8a64]">
                      <Check className="h-4 w-4" />
                    </span>
                    <div className="text-[1.08rem] font-semibold text-[#1b2433] dark:text-slate-100">{item.title}</div>
                  </div>
                  <span className="rounded-full border border-[#cfead7] dark:border-green-900 bg-[#edfdf4] dark:bg-green-950/40 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#14825d]">
                    {item.flag}
                  </span>
                </div>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-[#5b6675] dark:text-slate-400">{item.copy}</p>
                <button type="button" className="mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#d93e3e]">
                  Open artifact <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-[#f0b5b5] dark:border-red-900/40 bg-[#fff1f1] dark:bg-red-950/30 px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-[#d93e3e]" />
            <div>
              <div className="text-[1.05rem] font-semibold text-[#2b3748] dark:text-slate-200">Evidence integrity confirmed for this signal cluster.</div>
              <div className="text-[0.88rem] text-[#5b6675] dark:text-slate-400">Last validation performed 14 minutes ago.</div>
            </div>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#d93e3e] px-4 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-white">
            Review Full Brief <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default EvidencePage;
