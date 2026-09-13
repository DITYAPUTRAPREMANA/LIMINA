import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  Landmark,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type MethodologyPageProps = {
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
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  {
    label: "Methodology",
    icon: Landmark,
    view: "methodology" as const,
    active: true,
  },
];

const MethodologyPage = ({ onNavigate }: MethodologyPageProps) => {
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
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] sm:text-4xl lg:text-[3.4rem]">
                Methodology &amp; Governance
              </h1>
              <p className="mt-3 max-w-[820px] text-[1.1rem] leading-relaxed text-[#5b6675]">
                Comprehensive documentation of calculation rules, indicator
                formulas, and legal disclaimers governing the IDX Risk Monitor.
              </p>
            </div>

            <section className="rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] sm:text-2xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f0f0f0] text-[#111827]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                Point-in-Time Calculation Rules
              </div>

              <div className="text-[1.05rem] leading-relaxed text-[#5b6675]">
                <p>
                  All metrics are calculated strictly on a Point-in-Time (PIT)
                  basis to prevent look-ahead bias during historical analysis.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>
                    Data snapshots are taken at market close (16:00 WIB) daily.
                  </li>
                  <li>
                    Corporate actions (splits, dividends) are adjusted on the
                    ex-date.
                  </li>
                  <li>
                    Financial statement data is only available post-publication
                    by the exchange, not on the fiscal period end date.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-[#d8d3cd] bg-[#f7f5f3] p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] sm:text-2xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f0f0f0] text-[#111827]">
                  Σ
                </span>
                Key Indicator Formulas
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[#d8d3cd] bg-[#f3f1ee] p-4">
                  <div className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#2f3b4d]">
                    Earnings Risk Premium (ERP)
                  </div>
                  <div className="overflow-x-auto rounded-lg bg-[#171f2e] px-3 py-2 font-mono text-[0.9rem] text-[#f5f7fb]">
                    ERP = (E/P) - Risk_Free_Rate
                  </div>
                  <p className="mt-3 text-[1.02rem] leading-relaxed text-[#5b6675]">
                    Measures the excess yield an equity provides over a
                    risk-free asset (typically 10-year Indonesian Government
                    Bond).
                  </p>
                </div>

                <div className="rounded-xl border border-[#d8d3cd] bg-[#f3f1ee] p-4">
                  <div className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#2f3b4d]">
                    Liquidity Stress Indicator (LSI)
                  </div>
                  <div className="overflow-x-auto rounded-lg bg-[#171f2e] px-3 py-2 font-mono text-[0.9rem] text-[#f5f7fb]">
                    LSI = (Vol_10D / Avg_Vol_90D) * (Spread / Price)
                  </div>
                  <p className="mt-3 text-[1.02rem] leading-relaxed text-[#5b6675]">
                    Evaluates short-term liquidity stress by combining volume
                    surges with bid-ask spread expansion.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-[#f0b5b5] bg-[#fbdede] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] sm:text-2xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f8e0e0] text-[#d93e3e]">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                Strict Legal Disclaimer
              </div>

              <div className="text-[1.02rem] font-medium uppercase tracking-[0.12em] text-[#c63e3e]">
                For informational purposes only. Not financial advice.
              </div>

              <p className="mt-4 text-[1.06rem] leading-relaxed text-[#4a5468]">
                The calculations and indicators presented within the Limina IDX
                Risk Monitor are derived from publicly available data provided
                by the Indonesia Stock Exchange (IDX) and other third-party
                sources. While every effort is made to ensure accuracy, Limina
                does not guarantee the completeness, timeliness, or reliability
                of this data.
              </p>

              <p className="mt-3 text-[1.06rem] leading-relaxed text-[#4a5468]">
                Users are solely responsible for their investment decisions.
                Past performance or calculated risk metrics are not indicative
                of future results. Trading securities involves significant risk
                of loss.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MethodologyPage;
