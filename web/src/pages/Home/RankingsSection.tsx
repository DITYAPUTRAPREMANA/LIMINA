import { AlertCircle, AlertTriangle, Filter, Search } from "lucide-react";

const RankingsSection: React.FC = () => {
  return (
    <section
      id="rankings"
      className="w-full py-24 px-4 sm:px-6 lg:px-10 bg-white"
    >
      <div className="w-full mx-auto">
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> IMMEDIATE UTILITY & LIVE TICKER
          INTELLIGENCE
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Live Suspension Risk Rankings
            </h2>
            <p className="text-slate-500">
              Sorted strictly by proximity score (highest to lowest). Real-time
              evaluation of Indonesia Stock Exchange issuers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticker (e.g. BUMI, GOTO)..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-300 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-bold text-red-700">
                3 Issuers Exceeding Critical Risk Threshold (&gt;80)
              </div>
              <div className="text-xs text-red-500">
                Immediate investor attention recommended under current IDX
                suspension methodology.
              </div>
            </div>
          </div>
          <div className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">
            High Alert
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ticker / Company
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sector & Board
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Primary Risk Driver
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lead Trajectory
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">BUMI</div>
                  <div className="text-xs text-slate-500">
                    PT Bumi Resources Tbk.
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-slate-700">Energy & Coal</div>
                  <div className="text-[10px] text-slate-400">Main Board</div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{" "}
                    Negative Equity & Debt
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-red-600">92</span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                    <div className="h-1 bg-red-600 rounded-full w-[92%]"></div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-xs font-bold text-red-500 flex items-center gap-1">
                    ↗ +14 pts / 15d
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
                    View Detail
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">GOTO</div>
                  <div className="text-xs text-slate-500">
                    PT GoTo Gojek Tokopedia Tbk.
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-slate-700">Technology</div>
                  <div className="text-[10px] text-slate-400">Main Board</div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>{" "}
                    Persistent Operating Loss
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-orange-500">
                      88
                    </span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                    <div className="h-1 bg-orange-500 rounded-full w-[88%]"></div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-xs font-bold text-orange-500 flex items-center gap-1">
                    ↗ +6 pts / 15d
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
                    View Detail
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">SRTG</div>
                  <div className="text-xs text-slate-500">
                    PT Saratoga Investama Sedaya Tbk.
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-slate-700">
                    Financial Holdings
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Development Board
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>{" "}
                    Severe Volatility Spike
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-orange-500">
                      85
                    </span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                    <div className="h-1 bg-orange-500 rounded-full w-[85%]"></div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-xs font-bold text-orange-500 flex items-center gap-1">
                    ↗ +18 pts / 15d
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
                    View Detail
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">TOTO</div>
                  <div className="text-xs text-slate-500">
                    PT Surya Toto Indonesia Tbk.
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-slate-700">Basic Materials</div>
                  <div className="text-[10px] text-slate-400">Main Board</div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>{" "}
                    Public Float Threshold (&gt;7.5%)
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-slate-700">
                      45
                    </span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  <div className="w-24 h-1 bg-slate-100 rounded-full mt-1">
                    <div className="h-1 bg-slate-700 rounded-full w-[45%]"></div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    — Stable
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">
                    View Detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RankingsSection;
