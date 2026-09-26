import { Activity, ChevronRight, Clock, Filter, Info } from "lucide-react";
import type { View } from "../../App";

interface MethodologySectionProps {
  onNavigate?: (view: View) => void;
}

const MethodologySection: React.FC<MethodologySectionProps> = ({
  onNavigate,
}) => {
  const handleReadSpecs = () => {
    if (onNavigate) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section
      id="methodology"
      className="w-full py-24 px-4 sm:px-6 lg:px-10 bg-white dark:bg-slate-950"
    >
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> MATHEMATICAL RIGOR &amp; TRANSPARENCY
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">
              Methodology &amp; Calculation Architecture
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-2xl">
              Skeptical of algorithmic claims? Limina provides complete
              mathematical transparency into its Point-in-Time (PIT) models and
              static data extraction from Sectors API.
            </p>
          </div>
          <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Data Source: Sectors API (Static JSON)
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-8 bg-white dark:bg-slate-900 card-hover-lift hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Clock className="w-5 h-5 text-red-500" /> Point-in-Time (PIT)
                  Calculation Rules
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  No Look-Ahead Bias
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Calculations are executed strictly at discrete 15-minute
                intervals during active IDX trading sessions. Financial report
                disclosures are ingested only when formally stamped by the
                exchange:
              </p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>{" "}
                  <span>
                    PIT Snapshot Frequency: 15-minute intervals during active
                    IDX market hours
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>{" "}
                  <span>
                    Corporate Actions: Ex-date adjustments for splits, reverse
                    splits &amp; rights issues
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></div>{" "}
                  <span>
                    Disclosure Latency: 24h operational processing buffer for
                    official exchange filings
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 card-hover-lift hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Activity className="w-5 h-5 text-red-500" /> Indicator
                  Formulations &amp; Live Telemetry
                </h3>
                <span className="text-[10px] font-mono text-red-500 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900/60 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  Risk Engine
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* LSI CARD WITH INTERACTIVE CHART */}
                <div className="group bg-slate-900 dark:bg-slate-800 text-white p-4.5 rounded-xl border border-slate-800 dark:border-slate-700 hover:border-emerald-500/50 transition-all card-hover-lift flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                        LIQUIDITY STRESS INDEX (LSI)
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                        Simulated Curve
                      </span>
                    </div>
                    <div className="font-mono text-xs text-emerald-400 mb-2 font-bold tracking-tight">
                      LSI = Σ(V_bid - V_ask) / V_total + v(Vol_30d)
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      Detects severe order book thinning before trading halts.
                    </p>
                  </div>

                  {/* LSI Mini Chart */}
                  <div className="mt-2 pt-3 border-t border-slate-800 dark:border-slate-700/80">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
                      <span>Order Book Depth Trajectory</span>
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                        -0.84 (Alert)
                      </span>
                    </div>

                    <div className="relative w-full h-24 bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 overflow-hidden">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 260 70"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="lsiGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#10b981"
                              stopOpacity="0.4"
                            />
                            <stop
                              offset="60%"
                              stopColor="#f59e0b"
                              stopOpacity="0.2"
                            />
                            <stop
                              offset="100%"
                              stopColor="#ef4444"
                              stopOpacity="0.5"
                            />
                          </linearGradient>
                        </defs>

                        {/* Critical Threshold Line */}
                        <line
                          x1="0"
                          y1="48"
                          x2="260"
                          y2="48"
                          stroke="#ef4444"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          opacity="0.65"
                        />
                        <text
                          x="4"
                          y="44"
                          fill="#ef4444"
                          fontSize="7"
                          fontFamily="monospace"
                          opacity="0.8"
                        >
                          CRITICAL BREACH THRESHOLD
                        </text>

                        {/* Normal Line Grid */}
                        <line
                          x1="0"
                          y1="20"
                          x2="260"
                          y2="20"
                          stroke="#334155"
                          strokeWidth="0.5"
                          strokeDasharray="2,2"
                          opacity="0.5"
                        />

                        {/* Shaded Area */}
                        <path
                          d="M 0 15 Q 60 18, 110 24 T 180 44 T 245 62 L 245 70 L 0 70 Z"
                          fill="url(#lsiGradient)"
                        />

                        {/* Trend Curve */}
                        <path
                          d="M 0 15 Q 60 18, 110 24 T 180 44 T 245 62"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="transition-all"
                        />

                        {/* Transition to Red Stroke at Breakpoint */}
                        <path
                          d="M 180 44 T 245 62"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Live Pulsing Beacon on Current Value */}
                        <circle
                          cx="245"
                          cy="62"
                          r="5"
                          fill="#ef4444"
                          opacity="0.4"
                          className="animate-ping"
                        />
                        <circle cx="245" cy="62" r="3" fill="#ef4444" />
                      </svg>
                    </div>

                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1.5 px-0.5">
                      <span>Day -30 (Normal)</span>
                      <span>Day -15</span>
                      <span className="text-red-400 font-bold">
                        Halt Trigger
                      </span>
                    </div>
                  </div>
                </div>

                {/* ERP CARD WITH INTERACTIVE CHART */}
                <div className="group bg-slate-900 dark:bg-slate-800 text-white p-4.5 rounded-xl border border-slate-800 dark:border-slate-700 hover:border-blue-500/50 transition-all card-hover-lift flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                        EQUITY RISK PREMIUM (ERP)
                      </span>
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-950/70 border border-blue-800/60 px-1.5 py-0.5 rounded">
                        Yield Spread
                      </span>
                    </div>
                    <div className="font-mono text-xs text-blue-400 mb-2 font-bold tracking-tight">
                      ERP_t = (R_e - R_f) + β_i * α_sector
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      Identifies valuation breakdowns against 10Y IDN bonds.
                    </p>
                  </div>

                  {/* ERP Mini Chart */}
                  <div className="mt-2 pt-3 border-t border-slate-800 dark:border-slate-700/80">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
                      <span>Return vs. 10Y IDN Bond Spread</span>
                      <span className="text-orange-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                        -3.85% (Inversion)
                      </span>
                    </div>

                    <div className="relative w-full h-24 bg-slate-950/60 rounded-lg p-2 border border-slate-800/80 overflow-hidden">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 260 70"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="erpGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#3b82f6"
                              stopOpacity="0.35"
                            />
                            <stop
                              offset="100%"
                              stopColor="#ef4444"
                              stopOpacity="0.25"
                            />
                          </linearGradient>
                        </defs>

                        {/* Benchmark Baseline: 10Y IDN Bond Yield ~6.8% */}
                        <line
                          x1="0"
                          y1="30"
                          x2="260"
                          y2="30"
                          stroke="#60a5fa"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                          opacity="0.8"
                        />
                        <text
                          x="4"
                          y="24"
                          fill="#93c5fd"
                          fontSize="7"
                          fontFamily="monospace"
                        >
                          10Y IDN GOVT BOND YIELD (Rf = 6.8%)
                        </text>

                        {/* Shaded Divergence Gap */}
                        <path
                          d="M 0 16 Q 70 20, 130 30 T 200 48 T 245 60 L 245 30 L 130 30 L 0 30 Z"
                          fill="url(#erpGradient)"
                        />

                        {/* Issuer Expected Return Curve diving down */}
                        <path
                          d="M 0 16 Q 70 20, 130 30 T 200 48 T 245 60"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Divergence Breakpoint to Orange/Red */}
                        <path
                          d="M 130 30 T 200 48 T 245 60"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Live Pulsing Beacon */}
                        <circle
                          cx="245"
                          cy="60"
                          r="5"
                          fill="#f97316"
                          opacity="0.4"
                          className="animate-ping"
                        />
                        <circle cx="245" cy="60" r="3" fill="#f97316" />
                      </svg>
                    </div>

                    <div className="flex justify-between text-[8px] font-mono text-slate-400 mt-1.5 px-0.5">
                      <span>ERP &gt; 0 (Safe Premium)</span>
                      <span>Spread Parity</span>
                      <span className="text-orange-400 font-bold">
                        Negative Spread
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl p-8 bg-white dark:bg-slate-900 card-hover-lift hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-slate-900 dark:text-slate-100">
                <Filter className="w-5 h-5 text-red-500" /> Specific IDX Risk
                Criteria Employed
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                Weighted components derived directly from IDX suspension rules
                &amp; Special Monitoring Board criteria:
              </p>

              <div className="space-y-6">
                {[
                  {
                    label: "Financial Reporting Delay & Negative Equity",
                    weight: "40% Weight",
                    desc: "Unsubmitted audited financial reports >90-days.",
                    color: "bg-red-500",
                    width: "w-[40%]",
                  },
                  {
                    label: "Unusual Market Activity (UMA) Spike",
                    weight: "30% Weight",
                    desc: "Aberrant price fluctuation vs. 90-day volume baseline.",
                    color: "bg-orange-400",
                    width: "w-[30%]",
                  },
                  {
                    label: "Public Float Compliance (<7.5%)",
                    weight: "15% Weight",
                    desc: "Non-compliance with free-float statutory minimums.",
                    color: "bg-slate-800 dark:bg-slate-300",
                    width: "w-[15%]",
                  },
                  {
                    label: "Going Concern & Material Litigation",
                    weight: "15% Weight",
                    desc: "Auditor disclaimer or ongoing bankruptcy petitions.",
                    color: "bg-slate-500",
                    width: "w-[15%]",
                  },
                ].map((crit, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      <span className="group-hover:text-red-500 transition-colors">
                        {crit.label}
                      </span>
                      <span className="text-red-500 text-xs font-mono">
                        {crit.weight}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mb-1 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${crit.color} ${crit.width} transition-all duration-500 group-hover:brightness-110`}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {crit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Read comprehensive technical documentation:
              </span>
              <button
                type="button"
                id="btn-read-specs"
                onClick={handleReadSpecs}
                className="group cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white font-bold transition-all duration-200 text-xs btn-hover-lift shadow-xs"
              >
                <span>Read Specs</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
