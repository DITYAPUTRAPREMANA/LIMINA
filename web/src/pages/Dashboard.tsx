import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Check,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Landmark,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { DashboardCharts } from "../components/DashboardCharts";
import {
  BASELINE_STOCKS,
  fetchSectorsUniverseData,
  type DashboardStockItem,
} from "../lib/sectorsApi";
import { fetchLiveModelRankings } from "../lib/modelApi";
import type { View } from "../App";

type DashboardPageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const, active: true },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const },
  { label: "Profile", icon: User, view: "profile" as const },
];

type RiskCategory = "all" | "critical" | "high" | "normal";
type SortOption =
  | "score-desc"
  | "score-asc"
  | "price-desc"
  | "ticker-asc"
  | "delta-desc";

const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stocks, setStocks] = useState<DashboardStockItem[]>(BASELINE_STOCKS);
  const [loadingApi, setLoadingApi] = useState(false);
  const [isRemoteModelOnline, setIsRemoteModelOnline] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskCategory>("all");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const [selectedTicker, setSelectedTicker] = useState<string>("BELI");
  const [inspectTicker, setInspectTicker] = useState<DashboardStockItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadApiData = async () => {
      setLoadingApi(true);
      const modelResult = await fetchLiveModelRankings();
      if (!mounted) return;

      if (modelResult.isFromRemoteModel) {
        setStocks(modelResult.stocks);
        setIsRemoteModelOnline(true);
        setLoadingApi(false);
      } else {
        const sectorsData = await fetchSectorsUniverseData();
        if (mounted) {
          setStocks(sectorsData);
          setIsRemoteModelOnline(false);
          setLoadingApi(false);
        }
      }
    };
    loadApiData();
    return () => {
      mounted = false;
    };
  }, []);

  const navItems = menuItems.map((item) => ({
    ...item,
    onClick: () => {
      setSidebarOpen(false);
      onNavigate(item.view);
    },
  }));

  const availableSectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector)));
    return ["All Sectors", ...list];
  }, [stocks]);

  const criticalCount = useMemo(
    () => stocks.filter((t) => t.score >= 85).length,
    [stocks]
  );
  const highWatchCount = useMemo(
    () => stocks.filter((t) => t.score >= 70 && t.score < 85).length,
    [stocks]
  );
  const normalCount = useMemo(
    () => stocks.filter((t) => t.score < 70).length,
    [stocks]
  );

  const filteredTickers = useMemo(() => {
    let list = [...stocks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.ticker.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.sector.toLowerCase().includes(q) ||
          t.driver.toLowerCase().includes(q) ||
          t.isin.toLowerCase().includes(q)
      );
    }

    if (riskFilter === "critical") {
      list = list.filter((t) => t.score >= 85);
    } else if (riskFilter === "high") {
      list = list.filter((t) => t.score >= 70 && t.score < 85);
    } else if (riskFilter === "normal") {
      list = list.filter((t) => t.score < 70);
    }

    if (selectedSector !== "All Sectors") {
      list = list.filter((t) => t.sector === selectedSector);
    }

    list.sort((a, b) => {
      if (sortBy === "score-desc") return b.score - a.score;
      if (sortBy === "score-asc") return a.score - b.score;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "ticker-asc") return a.ticker.localeCompare(b.ticker);
      if (sortBy === "delta-desc")
        return parseFloat(b.delta) - parseFloat(a.delta);
      return 0;
    });

    return list;
  }, [stocks, searchQuery, riskFilter, selectedSector, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setRiskFilter("all");
    setSelectedSector("All Sectors");
    setSortBy("score-desc");
  };

  const isCustomFilterActive =
    searchQuery.trim() !== "" ||
    riskFilter !== "all" ||
    selectedSector !== "All Sectors" ||
    sortBy !== "score-desc";

  const handleExportCSV = () => {
    if (filteredTickers.length === 0) return;

    const headers = [
      "Rank",
      "Ticker",
      "Company",
      "Sector",
      "Price",
      "24h Change",
      "Market Cap",
      "Suspension Risk Index",
      "Delta",
      "Primary Risk Driver",
      "DER",
      "ISIN",
      "Last Audit",
    ];

    const rows = filteredTickers.map((t) => [
      t.rank,
      t.ticker,
      `"${t.company}"`,
      `"${t.sector}"`,
      t.price,
      `"${t.changePercent}"`,
      `"${t.marketCap}"`,
      t.score,
      t.delta,
      `"${t.driver}"`,
      `"${t.der}"`,
      t.isin,
      `"${t.lastAuditOpinion}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `LIMINA_Sectors_Ranking_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Berhasil mengekspor ${filteredTickers.length} emiten ke file CSV.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpen={() => setSidebarOpen(true)}
      onSidebarClose={() => setSidebarOpen(false)}
      navItems={navItems}
      onNavigate={onNavigate}
      currentView="dashboard"
    >
      <div className="mx-auto max-w-[1240px] pb-16">
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/90 px-5 py-3.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200 shadow-xl backdrop-blur-md transition-all">
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {toastMessage}
          </div>
        )}

        {/* ── Top Header ── */}
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#f26a4d]/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#f26a4d]">
                {isRemoteModelOnline ? "FastAPI Model Live Feed" : "Sectors.app API Live Feed"}
              </span>
              {loadingApi && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400 animate-pulse">
                  <RefreshCw className="h-2.5 w-2.5 animate-spin" /> Syncing...
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl mt-1">
              IDX Risk Ranking
            </h1>
            <p className="mt-1.5 text-sm text-[#5b6675] dark:text-slate-400 sm:text-[1.02rem]">
              Analisis probabilitas suspensi pasar modal Indonesia untuk emiten pilihan
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
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d8d3cd] dark:border-slate-700 bg-[#f3f1ee] dark:bg-slate-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#465267] dark:text-slate-400 sm:text-[11px]">
              <span
                className={`inline-flex h-2.5 w-2.5 rounded-full ${
                  isRemoteModelOnline ? "bg-emerald-500 animate-pulse" : "bg-[#2ec784]"
                }`}
              />
              {isRemoteModelOnline
                ? "AI Model Server: Connected"
                : "API Connected: 12 Universe Stocks"}
            </div>
          </div>
        </div>

        {/* ── Visual Charts Component ── */}
        <DashboardCharts
          stocks={stocks}
          selectedTicker={selectedTicker}
          onSelectTicker={(t) => setSelectedTicker(t)}
        />

        {/* ── Critical Alert Banner ── */}
        <div className="mt-8 rounded-2xl border border-[#f0b5b5] dark:border-red-900/40 bg-[#fff1f1] dark:bg-red-950/30 px-5 py-4 shadow-sm transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d93e3e] text-white shadow-sm">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex items-end gap-2.5">
                <span className="text-[2rem] font-black leading-none tracking-[-0.08em] text-[#d93e3e]">
                  {criticalCount}
                </span>
                <span className="pb-1 text-sm font-bold text-[#3b4555] dark:text-slate-200 sm:text-base">
                  Emiten Terindikasi Risiko Kritis / Pemantauan Khusus
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setRiskFilter("critical");
                setSearchQuery("");
                setSelectedSector("All Sectors");
              }}
              className="inline-flex items-center justify-center rounded-xl bg-[#d93e3e] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#c83535] active:scale-[0.98]"
            >
              Fokus Emiten Kritis ({criticalCount})
            </button>
          </div>
          <p className="mt-2 text-sm text-[#4f5969] dark:text-slate-400 sm:pl-[3.8rem]">
            Peringatan risiko dini dihitung berdasarkan defisit arus kas operasi, rasio utang (DER), dan kepatuhan aturan IDX.
          </p>
        </div>

        {/* ── Search & Filter Action Bar ── */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-[720px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8594] sm:h-5 sm:w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dari 12 emiten: BBCA, TLKM, ASII, AMMN, IMPC, AADI, MGLV, SOHO, BELI, SRAJ, BRPT, TPIA..."
              className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 py-3 pl-11 pr-10 text-sm text-slate-700 dark:text-slate-200 outline-none placeholder:text-[#778194] dark:placeholder:text-slate-500 focus:border-[#f26a4d] focus:ring-2 focus:ring-[#f26a4d]/20 transition sm:py-3.5 sm:pl-12 sm:text-[1.02rem]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            {/* Toggle Filters Panel */}
            <button
              type="button"
              onClick={() => setShowFiltersPanel((v) => !v)}
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition shadow-xs cursor-pointer",
                showFiltersPanel || isCustomFilterActive
                  ? "border-[#f26a4d] bg-[#f26a4d]/10 text-[#f26a4d]"
                  : "border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 text-[#475367] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700",
              ].join(" ")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {isCustomFilterActive && (
                <span className="h-2 w-2 rounded-full bg-[#f26a4d]" />
              )}
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredTickers.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-[#475367] dark:text-slate-300 transition hover:bg-white dark:hover:bg-slate-700 disabled:opacity-50 shadow-xs cursor-pointer"
              title="Download CSV report"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Expandable Filter Settings Panel ── */}
        {showFiltersPanel && (
          <div className="mt-4 rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-white/90 dark:bg-slate-800/95 p-5 shadow-lg backdrop-blur-md transition-all">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Filter className="h-3.5 w-3.5 text-[#f26a4d]" />
                Kustomisasi Filter &amp; Pengurutan
              </span>
              <button
                type="button"
                onClick={() => setShowFiltersPanel(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Sector Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Sektor Industri
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#f26a4d]"
                >
                  {availableSectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Level Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Kategori Tingkat Risiko
                </label>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value as RiskCategory)}
                  className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#f26a4d]"
                >
                  <option value="all">Semua Tingkat Risiko</option>
                  <option value="critical">Critical Risk (Indeks &ge; 85)</option>
                  <option value="high">High Watch (70 - 84)</option>
                  <option value="normal">Normal / Low Risk (&lt; 70)</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Urutkan Kolom
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full rounded-xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:border-[#f26a4d]"
                >
                  <option value="score-desc">Indeks Risiko: Tertinggi &rarr; Terendah</option>
                  <option value="score-asc">Indeks Risiko: Terendah &rarr; Tertinggi</option>
                  <option value="price-desc">Harga Saham Tertinggi</option>
                  <option value="ticker-asc">Nama Ticker (A ke Z)</option>
                  <option value="delta-desc">Perubahan Delta Terbesar</option>
                </select>
              </div>
            </div>

            {isCustomFilterActive && (
              <div className="mt-4 flex justify-end border-t border-slate-200 dark:border-slate-700 pt-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f26a4d] hover:underline cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Semua Filter ke Default
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Risk Filter Chips ── */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {[
            { id: "all" as RiskCategory, label: `Semua Emiten (${stocks.length})` },
            { id: "critical" as RiskCategory, label: `Critical Risk (${criticalCount})`, tone: "red" },
            { id: "high" as RiskCategory, label: `High Watch (${highWatchCount})`, tone: "amber" },
            { id: "normal" as RiskCategory, label: `Normal / Low Risk (${normalCount})`, tone: "green" },
          ].map((chip) => {
            const isActive = riskFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setRiskFilter(chip.id)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.88rem] font-medium transition cursor-pointer active:scale-95",
                  isActive
                    ? "border-[#111827] dark:border-slate-200 bg-[#111827] dark:bg-slate-200 text-white dark:text-slate-900 font-bold shadow-xs"
                    : chip.tone === "red"
                      ? "border-[#f1c7c7] dark:border-red-900/60 bg-[#fff1f1] dark:bg-red-950/40 text-[#d93e3e] hover:bg-[#ffe5e5]"
                      : chip.tone === "amber"
                        ? "border-[#f0d7ad] dark:border-amber-900/60 bg-[#fff7eb] dark:bg-amber-950/40 text-[#b87812] hover:bg-[#feeed5]"
                        : chip.tone === "green"
                          ? "border-[#cfead7] dark:border-green-900/60 bg-[#edfdf4] dark:bg-green-950/40 text-[#0d8a5b] hover:bg-[#d9f9e5]"
                          : "border-[#ddd5cf] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#eeebe7]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-2.5 w-2.5 rounded-full",
                    isActive
                      ? "bg-white dark:bg-slate-900"
                      : chip.tone === "red"
                        ? "bg-[#d93e3e]"
                        : chip.tone === "amber"
                          ? "bg-[#f3b13b]"
                          : chip.tone === "green"
                            ? "bg-[#28b67a]"
                            : "bg-[#717b8c]",
                  ].join(" ")}
                />
                {chip.label}
              </button>
            );
          })}

          <div className="ml-auto text-xs font-bold text-[#667285] dark:text-slate-400">
            Menampilkan <span className="text-slate-900 dark:text-slate-100 font-black">{filteredTickers.length}</span> dari {stocks.length} emiten
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800/90 shadow-sm">
          <div className="min-w-[820px]">
            {/* Table Header with Sort actions */}
            <div className="grid grid-cols-[1.6fr_1.1fr_1.1fr_1.4fr_1fr_0.8fr] items-center gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900 px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#58677a] dark:text-slate-400 select-none">
              <button
                type="button"
                onClick={() => setSortBy(sortBy === "ticker-asc" ? "score-desc" : "ticker-asc")}
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Ticker &amp; Nama Emiten</span>
                {sortBy === "ticker-asc" ? (
                  <ArrowUp className="h-3 w-3 text-[#f26a4d]" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSortBy(sortBy === "price-desc" ? "score-desc" : "price-desc")}
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Harga Pasar &amp; 24h</span>
                {sortBy === "price-desc" ? (
                  <ArrowDown className="h-3 w-3 text-[#f26a4d]" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <span>Sektor</span>

              <span>Pemicu Risiko Utama</span>

              <button
                type="button"
                onClick={() => setSortBy(sortBy === "score-desc" ? "score-asc" : "score-desc")}
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Suspension Risk Index</span>
                {sortBy === "score-desc" ? (
                  <ArrowDown className="h-3 w-3 text-[#f26a4d]" />
                ) : sortBy === "score-asc" ? (
                  <ArrowUp className="h-3 w-3 text-[#f26a4d]" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <span className="text-right">Aksi</span>
            </div>

            {/* Table Body */}
            {filteredTickers.length > 0 ? (
              filteredTickers.map((row) => (
                <div
                  key={row.ticker}
                  className={`grid grid-cols-[1.6fr_1.1fr_1.1fr_1.4fr_1fr_0.8fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700/80 px-6 py-4.5 last:border-b-0 hover:bg-white/70 dark:hover:bg-slate-700/40 transition cursor-pointer ${row.ticker === selectedTicker
                    ? "bg-white/80 dark:bg-slate-700/50"
                    : ""
                    }`}
                  onClick={() => setSelectedTicker(row.ticker)}
                >
                  {/* Ticker & Issuer */}
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white shadow-xs shrink-0",
                        row.tone === "red"
                          ? "bg-[#d93e3e]"
                          : row.tone === "amber"
                            ? "bg-[#f1b234]"
                            : "bg-[#28b67a]",
                      ].join(" ")}
                    >
                      {row.ticker[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[1.15rem] font-black tracking-[-0.04em] text-[#1b2433] dark:text-slate-100">
                          {row.ticker}
                        </span>
                        <span className="text-[0.76rem] font-bold text-[#687487] dark:text-slate-400 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                          {row.rank}
                        </span>
                      </div>
                      <div className="text-[0.84rem] text-[#5c6676] dark:text-slate-400 truncate max-w-[170px]">
                        {row.company}
                      </div>
                    </div>
                  </div>

                  {/* Price & 24h change */}
                  <div>
                    <div className="text-[0.95rem] font-black text-[#1b2433] dark:text-slate-100">
                      {row.priceFormatted}
                    </div>
                    <div
                      className={`text-[0.8rem] font-bold ${row.changePercent.startsWith("-")
                        ? "text-red-500"
                        : "text-emerald-500"
                        }`}
                    >
                      {row.changePercent}
                    </div>
                  </div>

                  {/* Sector */}
                  <div className="text-[0.88rem] font-medium text-[#263140] dark:text-slate-300">
                    {row.sector}
                  </div>

                  {/* Driver */}
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.72rem] font-semibold truncate max-w-[200px]",
                        row.tone === "red"
                          ? "bg-[#ffe8e8] dark:bg-red-950/60 text-[#bc3030] dark:text-red-300"
                          : row.tone === "amber"
                            ? "bg-[#fff0c8] dark:bg-amber-950/60 text-[#a15c09] dark:text-amber-300"
                            : "bg-[#e2f9ec] dark:bg-emerald-950/60 text-[#147a46] dark:text-emerald-300",
                      ].join(" ")}
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                      <span className="truncate">{row.driver}</span>
                    </span>
                  </div>

                  {/* Score & Progress */}
                  <div className="flex items-center gap-3">
                    <div className="w-full max-w-[110px] rounded-full border border-[#e0d4d1] dark:border-slate-600 bg-[#f0efed] dark:bg-slate-700 p-0.5">
                      <div
                        className={[
                          "h-2 rounded-full transition-all duration-500",
                          row.tone === "red"
                            ? "bg-[#d93e3e]"
                            : row.tone === "amber"
                              ? "bg-[#f1b234]"
                              : "bg-[#28b67a]",
                        ].join(" ")}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <div className="min-w-[50px] text-right text-[0.92rem] font-black text-[#1b2433] dark:text-slate-200">
                      {row.score}/100
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectTicker(row);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-3 py-1.5 text-[0.82rem] font-bold text-[#263140] dark:text-slate-200 transition hover:bg-white dark:hover:bg-slate-600 active:scale-95 shadow-xs cursor-pointer"
                    >
                      Analyze <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              /* Empty state */
              <div className="py-14 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-slate-400 opacity-60 mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Tidak ada emiten yang sesuai
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Coba sesuaikan kata kunci pencarian atau reset filter untuk menampilkan kembali semua 12 emiten.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Deep-Dive Risk Analysis Modal ── */}
      {inspectTicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setInspectTicker(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-[#181a24] p-6 sm:p-8 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#d8d3cd] dark:border-slate-700/80 pb-5">
              <div className="flex items-center gap-3.5">
                <span
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-white shadow-md",
                    inspectTicker.tone === "red"
                      ? "bg-[#d93e3e]"
                      : inspectTicker.tone === "amber"
                        ? "bg-[#f1b234]"
                        : "bg-[#28b67a]",
                  ].join(" ")}
                >
                  {inspectTicker.ticker[0]}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#111827] dark:text-white">
                      {inspectTicker.ticker}
                    </h2>
                    <span className="rounded bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Rank {inspectTicker.rank}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {inspectTicker.isin}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {inspectTicker.company} · {inspectTicker.sector}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectTicker(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-6 space-y-6">
              {/* Score Highlight Box */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 p-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Suspension Risk Index &amp; Harga Saham
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span
                      className={[
                        "text-3xl font-black tracking-tight",
                        inspectTicker.tone === "red"
                          ? "text-[#d93e3e]"
                          : inspectTicker.tone === "amber"
                            ? "text-[#f1b234]"
                            : "text-[#28b67a]",
                      ].join(" ")}
                    >
                      {inspectTicker.score}/100
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {inspectTicker.priceFormatted}
                    </span>
                    <span
                      className={`text-xs font-bold ${inspectTicker.changePercent.startsWith("-")
                        ? "text-red-500"
                        : "text-emerald-500"
                        }`}
                    >
                      {inspectTicker.changePercent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                      inspectTicker.tone === "red"
                        ? "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300"
                        : inspectTicker.tone === "amber"
                          ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
                    ].join(" ")}
                  >
                    {inspectTicker.tone === "red" ? (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}
                    {inspectTicker.tone === "red"
                      ? "Critical Suspension Risk"
                      : inspectTicker.tone === "amber"
                        ? "High Monitoring Risk"
                        : "Normal / Low Risk"}
                  </span>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">Kapitalisasi Pasar</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectTicker.marketCap}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">Debt to Equity (DER)</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectTicker.der}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">Kondisi Ekuitas</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectTicker.equityStatus}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">Estimasi Hari Suspensi</span>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
                    {inspectTicker.daysToSuspension}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3 sm:col-span-2">
                  <span className="text-slate-400 font-medium">Opini Auditor Terakhir</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {inspectTicker.lastAuditOpinion}
                  </p>
                </div>
              </div>

              {/* Regulatory Trigger Description */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Pemicu Utama Risiko &amp; Aturan Terkait
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {inspectTicker.driver}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulasi Terkait: <strong className="text-[#f26a4d]">{inspectTicker.ruleViolation}</strong>
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end border-t border-[#d8d3cd] dark:border-slate-700/80 pt-5">
              <button
                type="button"
                onClick={() => setInspectTicker(null)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={() => {
                  setInspectTicker(null);
                  onNavigate("evidence");
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0f172a] dark:bg-slate-700 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Buka Bukti Forensik <ExternalLink className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setInspectTicker(null);
                  onNavigate("methodology");
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#f26a4d] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#f26a4d]/20 transition hover:bg-[#d95e39] cursor-pointer"
              >
                Cek Metodologi <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default DashboardPage;
