import { AlertCircle, AlertTriangle, Filter, Search } from "lucide-react";

const RankingsSection: React.FC = () => {
  return (
    <section
      id="rankings"
      className="w-full py-24 px-4 sm:px-6 lg:px-10 bg-white dark:bg-slate-950"
    >
      <div className="w-full mx-auto">
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> IMMEDIATE UTILITY &amp; LIVE TICKER
          INTELLIGENCE
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Live Suspension Risk Rankings
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
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
                className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-300 w-64 placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <div className="text-sm font-bold text-red-700 dark:text-red-400">
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
              <tr className="border-b-2 border-slate-100 dark:border-slate-700">
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ticker / Company</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sector &amp; Board</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Risk Driver</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Score</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Trajectory</th>
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { ticker: "BUMI", company: "PT Bumi Resources Tbk.", sector: "Energy & Coal", board: "Main Board", driver: "Negative Equity & Debt", driverClass: "text-red-600 bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900", dotClass: "bg-red-500", score: 92, scoreClass: "text-red-600", traj: "↗ +14 pts / 15d", trajClass: "text-red-500" },
                { ticker: "GOTO", company: "PT GoTo Gojek Tokopedia Tbk.", sector: "Technology", board: "Main Board", driver: "Persistent Operating Loss", driverClass: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900", dotClass: "bg-orange-500", score: 88, scoreClass: "text-orange-500", traj: "↗ +6 pts / 15d", trajClass: "text-orange-500" },
                { ticker: "SRTG", company: "PT Saratoga Investama Sedaya Tbk.", sector: "Financial Holdings", board: "Development Board", driver: "Severe Volatility Spike", driverClass: "text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900", dotClass: "bg-orange-500", score: 85, scoreClass: "text-orange-500", traj: "↗ +18 pts / 15d", trajClass: "text-orange-500" },
                { ticker: "TOTO", company: "PT Surya Toto Indonesia Tbk.", sector: "Basic Materials", board: "Main Board", driver: "Public Float Threshold (>7.5%)", driverClass: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700", dotClass: "bg-slate-400", score: 45, scoreClass: "text-slate-700 dark:text-slate-300", traj: "— Stable", trajClass: "text-slate-400" },
              ].map((row) => (
                <tr key={row.ticker} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{row.ticker}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{row.company}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300">{row.sector}</div>
                    <div className="text-[10px] text-slate-400">{row.board}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${row.driverClass}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${row.dotClass}`}></div>
                      {row.driver}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-end gap-1">
                      <span className={`text-2xl font-bold ${row.scoreClass}`}>{row.score}</span>
                      <span className="text-xs text-slate-400 mb-1">/100</span>
                    </div>
                    <div className="w-24 h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-1">
                      <div className={`h-1 rounded-full ${row.dotClass}`} style={{ width: `${row.score}%` }}></div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`text-xs font-bold flex items-center gap-1 ${row.trajClass}`}>
                      {row.traj}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default RankingsSection;
