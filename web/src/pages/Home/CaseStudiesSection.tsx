import { Clock, Shield } from "lucide-react";
import type { View } from "../../App";
import { BASELINE_STOCKS } from "../../lib/sectorsApi";

interface CaseStudiesSectionProps {
  onNavigate?: (view: View) => void;
}

const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onNavigate,
}) => {
  const caseStudyRankings = BASELINE_STOCKS.slice(0, 3);

  const handleTickerClick = (ticker: string) => {
    const rankingsEl = document.getElementById("rankings");
    if (rankingsEl) {
      rankingsEl.scrollIntoView({ behavior: "smooth" });
      const searchInput = rankingsEl.querySelector<HTMLInputElement>("input");
      if (searchInput) {
        searchInput.value = ticker;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(() => searchInput.focus(), 600);
      }
    } else if (onNavigate) {
      onNavigate("news");
    }
  };

  return (
    <section
      id="case-studies"
      className="w-full py-24 bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-10 border-y border-slate-200 dark:border-slate-700"
    >
      <div className="w-full mx-auto">
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> HISTORICAL VALIDATION &amp; LEAD-TIME
          PROOF
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
          Backtesting Case Study: The Lead-Time
          <br />
          Advantage
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-3xl mb-12">
          Demonstrating mathematical effectiveness: notice the critical days
          elapsed between Limina's algorithmic score escalation and the official
          suspension decree issued by the Indonesia Stock Exchange.
        </p>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm card-hover-lift hover:shadow-xl transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700 gap-3">
              <div>
                <div className="text-[10px] font-bold text-red-500 tracking-wider mb-1">
                  CASE STUDY 01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Reconstruction: PT GoTo Gojek Tokopedia Tbk. (GOTO)
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-3.5 py-1.5 rounded-full border border-red-100 dark:border-red-900/60 w-fit">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                Full 30-Day Predictive Gap
              </div>
            </div>

            <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-4 space-y-12 pb-4">
              <div className="relative pl-8 group">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-slate-400 transition-colors">
                  1
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                    DAY 0 - BASELINE FLAG
                  </div>
                  <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">
                    Risk Score: 68 / 100
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                  Initial Algorithmic Early Warning
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Triggered by secondary market abnormal trading velocity and
                  persistent daily volatility spikes, diverging from the
                  Composite Index (IHSG) trend.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded border border-orange-100 dark:border-orange-900">
                  ↓ +15 Days Lead Time Buffer
                </div>
              </div>

              <div className="relative pl-8 group">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 border-2 border-orange-400 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-orange-500 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-orange-500 mb-1">
                    DAY 15 - CRITICAL ESCALATION
                  </div>
                  <div className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded shadow-xs">
                    Risk Score: 95 / 100
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-orange-500 transition-colors">
                  Critical Threshold Breach
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Limina model confidence surpasses 90%. Multiple UMA triggers
                  confirmed with accelerating negative operating cash burn and
                  book illiquidity.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded border border-red-100 dark:border-red-900">
                  ↓ +15 Days until Official Halting
                </div>
              </div>

              <div className="relative pl-8 group">
                <div className="absolute w-6 h-6 bg-red-500 border-2 border-red-500 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-red-500 mb-1">
                    DAY 30 - REGULATORY ACTION
                  </div>
                  <div className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-xs">
                    Official Suspension
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-red-500 transition-colors">
                  Official IDX Trading Halt Issued
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Exchange authorities announce cooling-down suspension. Limina
                  users received a <strong>full 30-day proactive window</strong>{" "}
                  to rebalance or exit before liquidity became trapped.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm card-hover-lift hover:shadow-xl transition-all">
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-4 uppercase">
                HISTORICAL MATRIX VALIDATION
              </h3>

              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                <div className="grid grid-cols-[1.3fr_1.1fr_1fr_0.9fr] items-center gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  <span>Issuer</span>
                  <span>Price</span>
                  <span>Sector</span>
                  <span>Risk</span>
                </div>

                <div className="space-y-2 p-2">
                  {caseStudyRankings.map((ranking) => (
                    <button
                      key={ranking.ticker}
                      type="button"
                      onClick={() => handleTickerClick(ranking.ticker)}
                      className="w-full rounded-xl border border-transparent bg-white/60 dark:bg-slate-800/60 p-2 text-left transition hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-700/80 cursor-pointer"
                    >
                      <div className="grid grid-cols-[1.3fr_1.1fr_1fr_0.9fr] items-center gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[0.7rem] font-black text-white shadow-sm bg-red-500">
                            {ranking.ticker[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-slate-100">
                              <span>{ranking.ticker}</span>
                              <span className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[0.62rem] font-bold text-slate-600 dark:text-slate-300">
                                {ranking.rank}
                              </span>
                            </div>
                            <div className="truncate text-[0.72rem] text-slate-500 dark:text-slate-400">
                              {ranking.company}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[0.82rem] font-black text-slate-900 dark:text-slate-100">
                            {ranking.priceFormatted}
                          </div>
                          <div
                            className={`text-[0.7rem] font-bold ${
                              ranking.changePercent.startsWith("-")
                                ? "text-red-500"
                                : "text-emerald-500"
                            }`}
                          >
                            {ranking.changePercent}
                          </div>
                        </div>

                        <div className="text-[0.78rem] font-medium text-slate-600 dark:text-slate-300">
                          {ranking.sector}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full max-w-[74px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className={[
                                "h-full rounded-full",
                                ranking.tone === "red"
                                  ? "bg-red-500"
                                  : ranking.tone === "amber"
                                    ? "bg-amber-400"
                                    : "bg-emerald-500",
                              ].join(" ")}
                              style={{ width: `${ranking.score}%` }}
                            />
                          </div>
                          <span className="min-w-[42px] text-right text-[0.8rem] font-black text-slate-900 dark:text-slate-100">
                            {ranking.score}/100
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden card-hover-lift hover:shadow-2xl transition-all">
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800 dark:text-slate-700 opacity-50 animate-pulse-soft" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">
                  BACKTEST PRECISION
                </div>
                <div className="text-5xl font-extrabold text-red-500 mb-3 flex items-baseline gap-2">
                  <span>89.4%</span>
                  <span className="text-xs font-medium text-emerald-400">
                    Validated
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Backtested across 24 historical IDX leading suspensions over
                  the 2021-2024 period. Zero look-ahead bias confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
