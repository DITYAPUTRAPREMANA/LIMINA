import { Clock, Shield } from "lucide-react";

const CaseStudiesSection: React.FC = () => {
  return (
    <section
      id="case-studies"
      className="w-full py-24 bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-10 border-y border-slate-200 dark:border-slate-700"
    >
      <div className="w-full mx-auto">
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> HISTORICAL VALIDATION &amp; LEAD-TIME PROOF
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
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <div className="text-[10px] font-bold text-red-500 tracking-wider mb-1">
                  CASE STUDY 01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Reconstruction: PT GoTo Gojek Tokopedia Tbk. (GOTO)
                </h3>
              </div>
              <div className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full">
                Full 30-Day Predictive Gap
              </div>
            </div>

            <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-4 space-y-12 pb-4">
              <div className="relative pl-8">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-slate-400">
                  1
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1">
                    DAY 0 - BASELINE FLAG
                  </div>
                  <div className="text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                    Risk Score: 68 / 100
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
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

              <div className="relative pl-8">
                <div className="absolute w-6 h-6 bg-white dark:bg-slate-800 border-2 border-orange-400 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-orange-500">
                  2
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-orange-500 mb-1">
                    DAY 15 - CRITICAL ESCALATION
                  </div>
                  <div className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded shadow-sm">
                    Risk Score: 95 / 100
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
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

              <div className="relative pl-8">
                <div className="absolute w-6 h-6 bg-red-500 border-2 border-red-500 rounded-full -left-[13px] top-0 flex items-center justify-center text-[10px] font-bold text-white">
                  3
                </div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-bold text-red-500 mb-1">
                    DAY 30 - REGULATORY ACTION
                  </div>
                  <div className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                    Official Suspension
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-6">
                HISTORICAL MATRIX VALIDATION
              </h3>
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      WSKT (Waskita Karya)
                    </div>
                    <div className="text-xs font-bold text-emerald-500">
                      42 Days Lead
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Suspended following debt restructuring defaults.
                  </div>
                </div>
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      KAEF (Kimia Farma)
                    </div>
                    <div className="text-xs font-bold text-emerald-500">
                      21 Days Lead
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Audit qualification and negative equity breach.
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      SRTG (Saratoga)
                    </div>
                    <div className="text-xs font-bold text-orange-500">
                      Live Alert Active
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Volatility spike approaching primary criteria.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800 dark:text-slate-700 opacity-50" />
              <div className="relative z-10">
                <div className="text-[10px] font-bold text-slate-400 tracking-wider mb-2">
                  BACKTEST PRECISION
                </div>
                <div className="text-5xl font-extrabold text-red-500 mb-3">
                  89.4%
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
