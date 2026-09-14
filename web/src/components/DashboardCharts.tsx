import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Activity,
} from "lucide-react";
import type { DashboardStockItem } from "../lib/sectorsApi";

interface DashboardChartsProps {
  stocks: DashboardStockItem[];
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  stocks,
  selectedTicker,
  onSelectTicker,
}) => {
  const [chartMode, setChartMode] = useState<"risk" | "price">("risk");

  // Get current active ticker data for detail chart
  const currentStock = useMemo(() => {
    return stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  }, [stocks, selectedTicker]);

  // Generate SVG curve points for currentStock.historicalPrices
  const priceCurveData = useMemo(() => {
    const prices = currentStock?.historicalPrices || [100, 105, 102, 108, 110];
    const min = Math.min(...prices) * 0.98;
    const max = Math.max(...prices) * 1.02;
    const range = max - min || 1;
    const width = 600;
    const height = 180;

    const points = prices.map((val, idx) => {
      const x = (idx / (prices.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 30) - 15;
      return { x, y, val };
    });

    const d = points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth cubic curve
      const prev = points[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, "");

    const areaD = `${d} L ${width} ${height} L 0 ${height} Z`;

    return { points, d, areaD, min, max };
  }, [currentStock]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* ── Chart 1: Suspension Risk Index Comparison Bar Chart (7 Cols) ── */}
      <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700/80 bg-[#f7f5f3] dark:bg-slate-800/90 p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#f26a4d]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                  Perbandingan Indeks Risiko Suspensi (12 Emiten)
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Data real-time dari Sectors API · Skor 0 (Aman) hingga 100 (Kritis)
              </p>
            </div>

            <div className="flex items-center gap-1.5 self-start rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 text-xs">
              <button
                type="button"
                onClick={() => setChartMode("risk")}
                className={`rounded px-2.5 py-1 font-semibold transition ${chartMode === "risk"
                  ? "bg-[#f26a4d] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Risk Index
              </button>
              <button
                type="button"
                onClick={() => setChartMode("price")}
                className={`rounded px-2.5 py-1 font-semibold transition ${chartMode === "price"
                  ? "bg-[#f26a4d] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Harga Pasar
              </button>
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="mt-5 space-y-2.5">
            {stocks.map((item) => {
              const isSelected = item.ticker === currentStock.ticker;
              const barWidth =
                chartMode === "risk"
                  ? `${item.score}%`
                  : `${Math.min(100, Math.max(15, (item.price / 10000) * 100))}%`;

              return (
                <div
                  key={item.ticker}
                  onClick={() => onSelectTicker(item.ticker)}
                  className={`group flex items-center gap-3 rounded-xl p-2 cursor-pointer transition ${isSelected
                    ? "bg-white dark:bg-slate-700/80 shadow-sm ring-1 ring-[#f26a4d]"
                    : "hover:bg-white/60 dark:hover:bg-slate-700/40"
                    }`}
                >
                  <div className="w-12 text-xs font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <span>{item.ticker}</span>
                  </div>

                  <div className="relative flex-1 h-5 rounded-full bg-slate-200/80 dark:bg-slate-900 p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-bold text-white ${item.tone === "red"
                        ? "bg-gradient-to-r from-red-600 to-rose-500"
                        : item.tone === "amber"
                          ? "bg-gradient-to-r from-amber-500 to-orange-400"
                          : "bg-gradient-to-r from-emerald-600 to-teal-400"
                        }`}
                      style={{ width: barWidth }}
                    >
                      {item.score > 25 && (
                        <span>
                          {chartMode === "risk"
                            ? `${item.score}`
                            : item.priceFormatted}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-24 text-right">
                    <span
                      className={`text-xs font-bold ${item.tone === "red"
                        ? "text-red-600 dark:text-red-400"
                        : item.tone === "amber"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      {chartMode === "risk"
                        ? `${item.score}/100`
                        : item.priceFormatted}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-semibold">
                      {item.changePercent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700/70 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Critical (&ge; 85)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            High Watch (70 - 84)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Low Risk (&lt; 70)
          </span>
        </div>
      </div>

      {/* ── Chart 2: Detailed Trend & Volatility Curve for Selected Stock (5 Cols) ── */}
      <div className="rounded-2xl border border-[#d8d3cd] dark:border-slate-700/80 bg-[#f7f5f3] dark:bg-slate-800/90 p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
        <div>
          {/* Header of Active Stock */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700/70 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white ${currentStock.tone === "red"
                    ? "bg-red-600"
                    : currentStock.tone === "amber"
                      ? "bg-amber-500"
                      : "bg-emerald-600"
                    }`}
                >
                  {currentStock.ticker[0]}
                </span>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {currentStock.ticker}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                    {currentStock.company}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {currentStock.priceFormatted}
              </span>
              <span
                className={`flex items-center justify-end gap-1 text-xs font-bold ${currentStock.changePercent.startsWith("-")
                  ? "text-red-500"
                  : "text-emerald-500"
                  }`}
              >
                {currentStock.changePercent.startsWith("-") ? (
                  <TrendingDown className="h-3.5 w-3.5" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5" />
                )}
                {currentStock.changePercent}
              </span>
            </div>
          </div>

          {/* Key Metrics Pill Grid */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Risk Index
              </span>
              <p
                className={`text-sm font-black ${currentStock.tone === "red"
                  ? "text-red-600"
                  : currentStock.tone === "amber"
                    ? "text-amber-500"
                    : "text-emerald-600"
                  }`}
              >
                {currentStock.score}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                DER Ratio
              </span>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                {currentStock.der}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Market Cap
              </span>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">
                {currentStock.marketCap}
              </p>
            </div>
          </div>

          {/* Interactive SVG Area Curve */}
          <div className="mt-4 relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/80 p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-[#f26a4d]" />
                Trend Trajectory 30 Hari
              </span>
              <span>High: Rp {Math.round(priceCurveData.max).toLocaleString("id-ID")}</span>
            </div>

            <svg
              viewBox="0 0 600 180"
              className="w-full h-36 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`gradient-${currentStock.ticker}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      currentStock.tone === "red"
                        ? "#f43f5e"
                        : currentStock.tone === "amber"
                          ? "#f59e0b"
                          : "#10b981"
                    }
                    stopOpacity="0.35"
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      currentStock.tone === "red"
                        ? "#f43f5e"
                        : currentStock.tone === "amber"
                          ? "#f59e0b"
                          : "#10b981"
                    }
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path
                d={priceCurveData.areaD}
                fill={`url(#gradient-${currentStock.ticker})`}
              />

              {/* Curve Stroke Line */}
              <path
                d={priceCurveData.d}
                fill="none"
                stroke={
                  currentStock.tone === "red"
                    ? "#e11d48"
                    : currentStock.tone === "amber"
                      ? "#d97706"
                      : "#059669"
                }
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              {priceCurveData.points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  className="fill-white stroke-2"
                  stroke={
                    currentStock.tone === "red"
                      ? "#e11d48"
                      : currentStock.tone === "amber"
                        ? "#d97706"
                        : "#059669"
                  }
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Ticker Switcher Pills */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/70">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pilih Emiten untuk Inspeksi Grafik:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stocks.map((s) => (
              <button
                key={s.ticker}
                type="button"
                onClick={() => onSelectTicker(s.ticker)}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${s.ticker === currentStock.ticker
                  ? "bg-[#0f172a] dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
              >
                {s.ticker}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
