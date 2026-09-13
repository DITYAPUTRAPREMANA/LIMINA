import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  Landmark,
  Search,
  ShieldCheck,
} from "lucide-react";
import AppShell from "../components/AppShell";

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
  { label: "Methodology", icon: Landmark, view: "methodology" as const, active: true },
];

const MethodologyPage = ({ onNavigate }: MethodologyPageProps) => {
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
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-[3.4rem]">
            Methodology &amp; Governance
          </h1>
          <p className="mt-3 max-w-[820px] text-[1.1rem] leading-relaxed text-[#5b6675] dark:text-slate-400">
            Comprehensive documentation of calculation rules, indicator formulas, and legal disclaimers.
          </p>
        </div>

        <section className="rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100 sm:text-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f0f0f0] dark:bg-slate-700 text-[#111827] dark:text-slate-200">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Point-in-Time Calculation Rules
          </div>
          <div className="text-[1.05rem] leading-relaxed text-[#5b6675] dark:text-slate-400">
            <p>All metrics are calculated strictly on a Point-in-Time (PIT) basis to prevent look-ahead bias.</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Data snapshots are taken at market close (16:00 WIB) daily.</li>
              <li>Corporate actions (splits, dividends) are adjusted on the ex-date.</li>
              <li>Financial statement data is only available post-publication by the exchange.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100 sm:text-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f0f0f0] dark:bg-slate-700 text-[#111827] dark:text-slate-200">Σ</span>
            Key Indicator Formulas
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-[#f3f1ee] dark:bg-slate-900 p-4">
              <div className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#2f3b4d] dark:text-slate-300">
                Earnings Risk Premium (ERP)
              </div>
              <div className="overflow-x-auto rounded-lg bg-[#171f2e] px-3 py-2 font-mono text-[0.9rem] text-[#f5f7fb]">
                ERP = (E/P) - Risk_Free_Rate
              </div>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-[#5b6675] dark:text-slate-400">
                Measures the excess yield an equity provides over a risk-free asset.
              </p>
            </div>
            <div className="rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-[#f3f1ee] dark:bg-slate-900 p-4">
              <div className="mb-3 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#2f3b4d] dark:text-slate-300">
                Liquidity Stress Indicator (LSI)
              </div>
              <div className="overflow-x-auto rounded-lg bg-[#171f2e] px-3 py-2 font-mono text-[0.9rem] text-[#f5f7fb]">
                LSI = (Vol_10D / Avg_Vol_90D) * (Spread / Price)
              </div>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-[#5b6675] dark:text-slate-400">
                Evaluates short-term liquidity stress by combining volume surges with bid-ask spread expansion.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-[#f0b5b5] dark:border-red-900/40 bg-[#fbdede] dark:bg-red-950/30 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-xl font-bold tracking-[-0.06em] text-[#111827] dark:text-slate-100 sm:text-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f8e0e0] dark:bg-red-900/50 text-[#d93e3e]">
              <AlertTriangle className="h-5 w-5" />
            </span>
            Strict Legal Disclaimer
          </div>
          <div className="text-[1.02rem] font-medium uppercase tracking-[0.12em] text-[#c63e3e]">
            For informational purposes only. Not financial advice.
          </div>
          <p className="mt-4 text-[1.06rem] leading-relaxed text-[#4a5468] dark:text-slate-300">
            The calculations and indicators presented within the Limina IDX Risk Monitor are derived from publicly available data. While every effort is made to ensure accuracy, Limina does not guarantee the completeness, timeliness, or reliability of this data.
          </p>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-[#4a5468] dark:text-slate-300">
            Users are solely responsible for their investment decisions. Past performance or calculated risk metrics are not indicative of future results.
          </p>
        </section>
      </div>
    </AppShell>
  );
};

export default MethodologyPage;
