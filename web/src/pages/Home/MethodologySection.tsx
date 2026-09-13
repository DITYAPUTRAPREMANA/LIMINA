import { Activity, ChevronRight, Clock, Filter, Info } from "lucide-react";

const MethodologySection: React.FC = () => {
  return (
    <section
      id="methodology"
      className="w-full py-24 px-4 sm:px-6 lg:px-10 bg-white"
    >
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> MATHEMATICAL RIGOR & TRANSPARENCY
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Methodology & Calculation Architecture
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl">
              Skeptical of algorithmic claims? Limina provides complete
              mathematical transparency into its Point-in-Time (PIT) models and
              static data extraction from Sectors API.
            </p>
          </div>
          <div className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded border border-slate-200">
            Data Source: Sectors API (Static JSON)
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="border border-slate-200 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-500" /> Point-in-Time (PIT)
                  Calculation Rules
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
                  No Look-Ahead Bias
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Calculations are executed strictly at discrete 15-minute
                intervals during active IDX trading sessions. Financial report
                disclosures are ingested only when formally stamped by the
                exchange:
              </p>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>{" "}
                  PIT Snapshot Frequency: 15-minute intervals during active IDX
                  market hours
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>{" "}
                  Corporate Actions: Ex-date adjustments for splits, reverse
                  splits & rights issues
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></div>{" "}
                  Disclosure Latency: 24h operational processing buffer for
                  official exchange filings
                </li>
              </ul>
            </div>

            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" /> Indicator
                  Formulations
                </h3>
                <span className="text-[10px] font-mono text-red-500">
                  Risk Engine
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-4 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">
                    LIQUIDITY STRESS INDEX (LSI)
                  </div>
                  <div className="font-mono text-xs text-emerald-400 mb-2">
                    LSI = Σ(V_bid - V_ask) / V_total + v(Vol_30d)
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight">
                    Detects severe book thinning before trading halts.
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-4 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">
                    EQUITY RISK PREMIUM (ERP)
                  </div>
                  <div className="font-mono text-xs text-blue-400 mb-2">
                    ERP_t = (R_e - R_f) + β_i * α_sector
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight">
                    Identifies valuation breakdowns against 10Y IDN bonds.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-8">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
              <Filter className="w-5 h-5 text-red-500" /> Specific IDX Risk
              Criteria Employed
            </h3>
            <p className="text-sm text-slate-500 mb-8">
              Weighted components derived directly from IDX suspension rules &
              Special Monitoring Board criteria:
            </p>

            <div className="space-y-6">
              {[
                {
                  label: "Financial Reporting Delay & Negative Equity",
                  weight: "40% Weight",
                  desc: "Unsubmitted audited financial reports > 90-days.",
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
                  label: "Public Float Compliance (< 7.5%)",
                  weight: "15% Weight",
                  desc: "Non-compliance with free-float statutory minimums.",
                  color: "bg-slate-800",
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
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold text-slate-900 mb-1">
                    <span>{crit.label}</span>
                    <span className="text-red-500 text-xs">{crit.weight}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-1">
                    <div
                      className={`h-1.5 rounded-full ${crit.color} ${crit.width}`}
                    ></div>
                  </div>
                  <p className="text-[11px] text-slate-500">{crit.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-sm">
              <span className="text-slate-500">
                Read comprehensive technical documentation:
              </span>
              <a
                href="#"
                className="text-red-500 font-bold hover:underline flex items-center gap-1"
              >
                Read Specs <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
