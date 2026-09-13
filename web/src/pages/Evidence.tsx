import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  FileText,
  Landmark,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";

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
  {
    label: "Evidence",
    icon: FileText,
    view: "evidence" as const,
    active: true,
  },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
];

const matrixRows = [
  {
    ticker: "WASK",
    sector: "Infrastructure",
    lead: "42 Days",
    risk: 98,
    peak: 98,
    outcome: "Halting Confirmed",
  },
  {
    ticker: "KAEF",
    sector: "Healthcare",
    lead: "21 Days",
    risk: 92,
    peak: 92,
    outcome: "Trading Suspension",
  },
  {
    ticker: "SRTG",
    sector: "Investment Holding",
    lead: "30 Days Active",
    risk: 85,
    peak: 85,
    outcome: "Watchlist Active",
  },
];

const EvidencePage = ({ onNavigate }: EvidencePageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-8 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#58677a]">
                    Case Studies
                  </div>
                  <h1 className="mt-3 text-3xl font-bold leading-[0.98] tracking-[-0.07em] text-[#111827] sm:text-4xl lg:text-[3rem]">
                    Timeline Analysis: PT GoTo Gojek Tokopedia Tbk.
                  </h1>
                </div>

                <div className="flex items-center gap-2 rounded border border-[#d8d3cd] bg-[#f1efed] px-3 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#465267]">
                  <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#d93e3e]" />
                  Case ID: IDX-GOTO-2023
                </div>
              </div>

              <p className="mt-4 max-w-[820px] text-[1.12rem] leading-relaxed text-[#5b6675]">
                Reconstruction of empirical anomaly triggers leading up to the
                official IDX suspension window. Mapped against Lima multi-factor
                neural risk vectors and volume dispersion anomalies.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] p-4 shadow-sm">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.35fr_1fr_0.9fr_1.4fr_0.9fr] gap-4 border-b border-[#d8d3cd] bg-[#eceae7] px-3 py-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a]">
                  <span>Ticker</span>
                  <span>Sector</span>
                  <span>Predicted Lead Time</span>
                  <span>Risk Escalation Vector</span>
                  <span>Peak Risk</span>
                </div>

                {matrixRows.map((row) => (
                  <div
                    key={row.ticker}
                    className="grid grid-cols-[1.35fr_1fr_0.9fr_1.4fr_0.9fr] items-center gap-4 border-b border-[#e7e0d8] px-3 py-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#d93e3e] text-[0.72rem] font-black text-white">
                        {row.ticker[0]}
                      </span>
                      <span className="text-[1rem] font-semibold text-[#1b2433]">
                        {row.ticker}
                      </span>
                    </div>

                    <div className="text-[0.92rem] text-[#2f3b4d]">
                      {row.sector}
                    </div>
                    <div className="text-[0.98rem] font-medium text-[#2e3c4f]">
                      {row.lead}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-[#efefef]">
                        <div
                          className="h-full rounded-full bg-[#d93e3e]"
                          style={{ width: `${row.risk}%` }}
                        />
                      </div>
                      <span className="text-[0.82rem] font-semibold text-[#d93e3e]">
                        {row.risk}%
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 text-right">
                      <span className="text-[0.92rem] font-semibold text-[#1b2433]">
                        {row.peak}
                      </span>
                      <span className="rounded bg-[#ffe8e8] px-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#c84a4a]">
                        {row.outcome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] p-4 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#d8d3cd] pb-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[1.7rem] font-bold tracking-[-0.06em] text-[#111827]">
                    Evidence Ledger
                  </h2>
                  <p className="mt-1 text-[0.92rem] text-[#5b6675]">
                    Cross-dataset triggers and validation artifacts used in the
                    signal reconstruction.
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#d8d3cd] bg-[#f1efed] px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-[#465267]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Verified Chain
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Trading Halt Timeline",
                    copy: "Evidence confirms a three-stage escalation beginning with debt restructurings, followed by negative equity margin breach and final exchange trigger over 42 days.",
                    flag: "Verified",
                  },
                  {
                    title: "Market Microstructure Review",
                    copy: "Intraday volume spikes, spread widening, and abnormal bid-ask dispersion align with the risk signal windows detected by the model.",
                    flag: "Archived",
                  },
                  {
                    title: "Regulatory Correspondence",
                    copy: "IDX documentation and announced risk factors align with the computed trigger path and timing output, reinforcing the anomaly classification.",
                    flag: "Attached",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[#d8d3cd] bg-white px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#eef7f1] text-[#1a8a64]">
                          <Check className="h-4 w-4" />
                        </span>
                        <div className="text-[1.08rem] font-semibold text-[#1b2433]">
                          {item.title}
                        </div>
                      </div>

                      <span className="rounded-full border border-[#cfead7] bg-[#edfdf4] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#14825d]">
                        {item.flag}
                      </span>
                    </div>

                    <p className="mt-3 text-[0.98rem] leading-relaxed text-[#5b6675]">
                      {item.copy}
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#d93e3e]"
                    >
                      Open artifact <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-xl border border-[#f0b5b5] bg-[#fff1f1] px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-[#d93e3e]" />
                <div>
                  <div className="text-[1.05rem] font-semibold text-[#2b3748]">
                    Evidence integrity confirmed for this signal cluster.
                  </div>
                  <div className="text-[0.88rem] text-[#5b6675]">
                    Last validation performed 14 minutes ago.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-[#d93e3e] px-4 py-2 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-white"
              >
                Review Full Brief <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvidencePage;
