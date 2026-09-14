import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Download,
  FileText,
  Info,
  Landmark,
  RotateCcw,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import {
  BASELINE_STOCKS,
  fetchSectorsUniverseData,
  type DashboardStockItem,
} from "../lib/sectorsApi";
import type { View } from "../App";

type SearchPageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const, active: true },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
  { label: "Profile", icon: User, view: "profile" as const },
];

type RiskFilter = "all" | "critical" | "high" | "normal";
type SortOption = "score-desc" | "score-asc" | "price-desc" | "ticker-asc";

const SearchPage = ({ onNavigate }: SearchPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stocks, setStocks] = useState<DashboardStockItem[]>(BASELINE_STOCKS);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("All Sectors");
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedStock, setSelectedStock] = useState<DashboardStockItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const live = await fetchSectorsUniverseData();
        if (mounted && live.length > 0) {
          setStocks(live);
        }
      } catch (e) {
        console.warn("[Search] Error fetching live data:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector)));
    return ["All Sectors", ...list.sort()];
  }, [stocks]);

  const counts = useMemo(() => {
    return {
      all: stocks.length,
      critical: stocks.filter((s) => s.score >= 75).length,
      high: stocks.filter((s) => s.score >= 40 && s.score < 75).length,
      normal: stocks.filter((s) => s.score < 40).length,
    };
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return stocks
      .filter((s) => {
        if (q) {
          const matchTicker = s.ticker.toLowerCase().includes(q);
          const matchCompany = s.company.toLowerCase().includes(q);
          const matchSector = s.sector.toLowerCase().includes(q);
          const matchDriver = s.driver.toLowerCase().includes(q);
          const matchIsin = s.isin.toLowerCase().includes(q);
          if (!matchTicker && !matchCompany && !matchSector && !matchDriver && !matchIsin) {
            return false;
          }
        }

        if (riskFilter === "critical" && s.score < 75) return false;
        if (riskFilter === "high" && (s.score < 40 || s.score >= 75)) return false;
        if (riskFilter === "normal" && s.score >= 40) return false;

        if (sectorFilter !== "All Sectors" && s.sector !== sectorFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "score-desc") return b.score - a.score;
        if (sortBy === "score-asc") return a.score - b.score;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "ticker-asc") return a.ticker.localeCompare(b.ticker);
        return 0;
      });
  }, [stocks, query, riskFilter, sectorFilter, sortBy]);

  const handleResetFilters = () => {
    setQuery("");
    setRiskFilter("all");
    setSectorFilter("All Sectors");
    setSortBy("score-desc");
  };

  const handleExportCSV = () => {
    const headers = [
      "Ticker",
      "Company",
      "Sector",
      "Risk Score",
      "Risk Level",
      "Stock Price (IDR)",
      "24h Change",
      "DER Ratio",
      "Primary Driver",
      "ISIN",
    ];

    const rows = filteredStocks.map((s) => [
      `"${s.ticker}"`,
      `"${s.company.replace(/"/g, '""')}"`,
      `"${s.sector}"`,
      s.score,
      s.score >= 75 ? "Critical" : s.score >= 40 ? "High Watch" : "Normal/Low",
      s.price,
      `"${s.changePercent}"`,
      `"${s.der}"`,
      `"${s.driver.replace(/"/g, '""')}"`,
      `"${s.isin}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LIMINA_Search_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Berhasil mengekspor ${filteredStocks.length} emiten ke format CSV.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
      navItems={navItems}
      onNavigate={onNavigate}
      currentView="search"
    >
      <div className="mx-auto max-w-[1240px] pb-16">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/90 px-5 py-3.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-xl backdrop-blur-md transition-all">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#f26a4d]/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#f26a4d]">
                Issuer Intelligence
              </span>
              {loading && (
                <span className="text-[10px] text-slate-400 animate-pulse">Syncing...</span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl mt-1">
              Search Securities
            </h1>
            <p className="mt-1.5 text-sm text-[#5b6675] dark:text-slate-400 sm:text-[1.02rem]">
              Cari emiten, rasio keuangan, dan status risiko suspensi pasar modal Indonesia
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => onNavigate("profile")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-[#273244] dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-700 shadow-xs"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8d3cd] dark:border-slate-700 bg-[#f3f1ee] dark:bg-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#465267] dark:text-slate-400">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2ec784]" />
              System Active: 12 Universe Stocks
            </div>
          </div>
        </div>

        {/* Search Bar & Action Buttons */}
        <div className="mt-8 rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7b8594]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode ticker (misal: BBCA, MGLV), nama emiten, sektor, atau pemicu..."
                className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-white dark:bg-slate-900 py-3.5 pl-12 pr-10 text-[1rem] text-slate-800 dark:text-slate-100 outline-none placeholder:text-[#778194] focus:border-[#f26a4d] transition shadow-2xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${showFilters
                  ? "border-[#f26a4d] bg-[#fdf5f2] dark:bg-slate-700 text-[#f26a4d]"
                  : "border-[#d8d3cd] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#475367] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {(sectorFilter !== "All Sectors" || sortBy !== "score-desc") && (
                  <span className="h-2 w-2 rounded-full bg-[#f26a4d]" />
                )}
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-[#475367] dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Expandable Advanced Filters Drawer */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/80 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Filter Sektor
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#f26a4d]"
                >
                  {sectors.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-[#f26a4d]"
                >
                  <option value="score-desc">Skor Risiko: Tertinggi ke Terendah</option>
                  <option value="score-asc">Skor Risiko: Terendah ke Tertinggi</option>
                  <option value="price-desc">Harga Saham: Tertinggi</option>
                  <option value="ticker-asc">Ticker: A - Z</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 w-full justify-center transition"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Semua Filter
                </button>
              </div>
            </div>
          )}

          {/* Interactive Risk Category Chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
            <button
              type="button"
              onClick={() => setRiskFilter("all")}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-semibold transition ${riskFilter === "all"
                ? "border-[#111827] dark:border-slate-400 bg-[#111827] text-white dark:bg-slate-200 dark:text-slate-900"
                : "border-[#ddd5cf] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                }`}
            >
              Semua Ticker ({counts.all})
            </button>

            <button
              type="button"
              onClick={() => setRiskFilter("critical")}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-semibold transition ${riskFilter === "critical"
                ? "border-red-600 bg-red-600 text-white shadow-xs"
                : "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Risiko Kritis ({counts.critical})
            </button>

            <button
              type="button"
              onClick={() => setRiskFilter("high")}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-semibold transition ${riskFilter === "high"
                ? "border-amber-600 bg-amber-600 text-white shadow-xs"
                : "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Dalam Pengawasan ({counts.high})
            </button>

            <button
              type="button"
              onClick={() => setRiskFilter("normal")}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-semibold transition ${riskFilter === "normal"
                ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                : "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100"
                }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Normal / Rendah ({counts.normal})
            </button>
          </div>
        </div>

        {/* Search Results Table */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 shadow-sm">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.2fr_1.8fr_1.2fr_1.1fr_1fr_0.9fr] items-center gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900/90 px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#58677a] dark:text-slate-400">
              <span>Ticker</span>
              <span>Emiten &amp; Pemicu Risiko</span>
              <span>Sektor</span>
              <span>Harga &amp; 24h</span>
              <span>Skor Suspensi</span>
              <span className="text-right">Aksi</span>
            </div>

            {filteredStocks.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400 mb-3 opacity-60" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Tidak ada emiten yang sesuai
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Coba gunakan kata kunci pencarian lain atau klik tombol Reset Filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f26a4d] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#d95e39]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Filter
                </button>
              </div>
            ) : (
              filteredStocks.map((stock) => {
                const isCritical = stock.score >= 75;
                const isWatch = stock.score >= 40 && stock.score < 75;

                return (
                  <div
                    key={stock.ticker}
                    className="grid grid-cols-[1.2fr_1.8fr_1.2fr_1.1fr_1fr_0.9fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700/80 px-6 py-4.5 last:border-b-0 hover:bg-white/60 dark:hover:bg-slate-700/40 transition"
                  >
                    {/* Ticker Badge */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white shadow-xs ${isCritical
                          ? "bg-gradient-to-br from-red-500 to-rose-600"
                          : isWatch
                            ? "bg-gradient-to-br from-amber-500 to-orange-500"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600"
                          }`}
                      >
                        {stock.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-base font-black tracking-tight text-[#1b2433] dark:text-slate-100">
                          {stock.ticker}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {stock.isin}
                        </div>
                      </div>
                    </div>

                    {/* Company & Anomaly Driver */}
                    <div>
                      <div className="text-sm font-bold text-[#212b38] dark:text-slate-200 truncate">
                        {stock.company}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f26a4d]" />
                        <span className="truncate">{stock.driver}</span>
                      </div>
                    </div>

                    {/* Sector */}
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {stock.sector}
                    </div>

                    {/* Price & 24h Change */}
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {stock.priceFormatted}
                      </div>
                      <div
                        className={`mt-0.5 text-xs font-semibold flex items-center gap-1 ${stock.changePercent.startsWith("+")
                          ? "text-emerald-600 dark:text-emerald-400"
                          : stock.changePercent.startsWith("-")
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-500"
                          }`}
                      >
                        {stock.changePercent.startsWith("+") ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stock.changePercent}
                      </div>
                    </div>

                    {/* Risk Score */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-black ${isCritical
                            ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                            : isWatch
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400"
                              : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400"
                            }`}
                        >
                          {stock.score} / 100
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Δ {stock.delta}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 font-medium">
                        DER: {stock.der}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStock(stock)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d8d3cd] dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition hover:border-[#f26a4d] hover:text-[#f26a4d] shadow-2xs"
                      >
                        <Info className="h-3.5 w-3.5" />
                        Detail
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detailed Quantitative Stock Modal */}
        {selectedStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white ${selectedStock.score >= 75
                    ? "bg-red-600"
                    : selectedStock.score >= 40
                      ? "bg-amber-500"
                      : "bg-emerald-600"
                    }`}
                >
                  {selectedStock.ticker.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedStock.ticker} — {selectedStock.company}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedStock.sector} • ISIN: {selectedStock.isin}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Skor Risiko</span>
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">{selectedStock.score} / 100</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Harga Saham</span>
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">{selectedStock.priceFormatted}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Rasio DER</span>
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">{selectedStock.der}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Market Cap</span>
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 truncate">{selectedStock.marketCap}</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Pemicu Utama Anomali Suspensi:</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{selectedStock.driver}</p>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Opini Audit Terakhir: {selectedStock.lastAuditOpinion}</span>
                  <span>Lead Time Prediksi: {selectedStock.leadTimeDays} Hari</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStock(null);
                    onNavigate("dashboard");
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f26a4d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d95e39]"
                >
                  Buka di Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default SearchPage;
