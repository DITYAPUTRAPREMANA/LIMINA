import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Filter,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { View } from "../../App";
import {
  BASELINE_STOCKS,
  fetchSectorsUniverseData,
  type DashboardStockItem,
} from "../../lib/sectorsApi";
import { fetchLiveModelRankings } from "../../lib/modelApi";

interface RankingsSectionProps {
  onNavigate?: (view: View) => void;
}

type RiskCategory = "all" | "critical" | "high" | "normal";
type SortOption = "score-desc" | "score-asc" | "price-desc" | "ticker-asc";

const TOP_N = 5;

const RankingsSection: React.FC<RankingsSectionProps> = ({ onNavigate }) => {
  const [stocks, setStocks] = useState<DashboardStockItem[]>(BASELINE_STOCKS);
  const [loadingApi, setLoadingApi] = useState(true);
  const [isRemoteModelOnline, setIsRemoteModelOnline] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskCategory>("all");
  const [sortBy, setSortBy] = useState<SortOption>("score-desc");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [inspectStock, setInspectStock] = useState<DashboardStockItem | null>(
    null,
  );

  // ── Live data fetch (same pipeline as Dashboard) ──────────────────────────
  useEffect(() => {
    let mounted = true;
    const load = async () => {
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
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Computed stats ────────────────────────────────────────────────────────
  const criticalCount = useMemo(
    () => stocks.filter((s) => s.score >= 85).length,
    [stocks],
  );
  const highWatchCount = useMemo(
    () => stocks.filter((s) => s.score >= 70 && s.score < 85).length,
    [stocks],
  );
  const normalCount = useMemo(
    () => stocks.filter((s) => s.score < 70).length,
    [stocks],
  );

  const filteredStocks = useMemo(() => {
    let list = [...stocks];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q) ||
          s.driver.toLowerCase().includes(q),
      );
    }
    if (riskFilter === "critical") list = list.filter((s) => s.score >= 85);
    else if (riskFilter === "high")
      list = list.filter((s) => s.score >= 70 && s.score < 85);
    else if (riskFilter === "normal") list = list.filter((s) => s.score < 70);

    list.sort((a, b) => {
      if (sortBy === "score-desc") return b.score - a.score;
      if (sortBy === "score-asc") return a.score - b.score;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "ticker-asc") return a.ticker.localeCompare(b.ticker);
      return 0;
    });
    // Landing page: show only the top N results
    return list.slice(0, TOP_N);
  }, [stocks, searchQuery, riskFilter, sortBy]);

  // Total matching before slice (for the counter)
  const totalMatching = useMemo(() => {
    let list = [...stocks];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q) ||
          s.driver.toLowerCase().includes(q),
      );
    }
    if (riskFilter === "critical") list = list.filter((s) => s.score >= 85);
    else if (riskFilter === "high")
      list = list.filter((s) => s.score >= 70 && s.score < 85);
    else if (riskFilter === "normal") list = list.filter((s) => s.score < 70);
    return list.length;
  }, [stocks, searchQuery, riskFilter]);

  const isCustomFilterActive =
    searchQuery.trim() !== "" ||
    riskFilter !== "all" ||
    sortBy !== "score-desc";

  const handleReset = () => {
    setSearchQuery("");
    setRiskFilter("all");
    setSortBy("score-desc");
  };

  return (
    <section
      id="rankings"
      className="w-full py-24 px-4 sm:px-6 lg:px-10 bg-white dark:bg-slate-950 relative"
    >
      <div className="w-full mx-auto">
        {/* ── Section Header ── */}
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {isRemoteModelOnline
            ? "FastAPI Model Live Feed"
            : "Sectors.app API Live Feed"}
          {loadingApi && (
            <span className="flex items-center gap-1 text-slate-400 normal-case font-normal animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> Syncing...
            </span>
          )}
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

          {/* Search + Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker, sector..."
                className="pl-9 pr-9 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-400 dark:focus:border-red-500 w-60 placeholder:text-slate-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFiltersPanel((v) => !v)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all duration-200 shadow-2xs btn-hover-lift ${showFiltersPanel || isCustomFilterActive
                ? "bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-600 dark:text-red-400"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {isCustomFilterActive && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        {showFiltersPanel && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 transition-all">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5" /> Sort by:
            </span>
            {[
              { id: "score-desc", label: "Risk: Highest" },
              { id: "score-asc", label: "Risk: Lowest" },
              { id: "price-desc", label: "Price: Highest" },
              { id: "ticker-asc", label: "Ticker A–Z" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSortBy(s.id as SortOption)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 btn-hover-lift ${sortBy === s.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                  }`}
              >
                {s.label}
              </button>
            ))}
            {isCustomFilterActive && (
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto flex items-center gap-1 text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        )}

        {/* ── Risk Category Chips ── */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {[
            {
              id: "all" as RiskCategory,
              label: `All Issuers (${stocks.length})`,
            },
            {
              id: "critical" as RiskCategory,
              label: `Critical Risk (${criticalCount})`,
              tone: "red",
            },
            {
              id: "high" as RiskCategory,
              label: `High Watch (${highWatchCount})`,
              tone: "amber",
            },
            {
              id: "normal" as RiskCategory,
              label: `Normal / Low (${normalCount})`,
              tone: "green",
            },
          ].map((chip) => {
            const active = riskFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setRiskFilter(chip.id)}
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition cursor-pointer active:scale-95",
                  active
                    ? "border-slate-900 dark:border-slate-200 bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 font-bold shadow-xs"
                    : chip.tone === "red"
                      ? "border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100"
                      : chip.tone === "amber"
                        ? "border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 hover:bg-amber-100"
                        : chip.tone === "green"
                          ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 hover:bg-emerald-100"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2 w-2 rounded-full inline-block",
                    active
                      ? "bg-white dark:bg-slate-900"
                      : chip.tone === "red"
                        ? "bg-red-500"
                        : chip.tone === "amber"
                          ? "bg-amber-500"
                          : chip.tone === "green"
                            ? "bg-emerald-500"
                            : "bg-slate-400",
                  ].join(" ")}
                />
                {chip.label}
              </button>
            );
          })}
          <div className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
            Top{" "}
            <span className="text-slate-900 dark:text-slate-100 font-black">
              {filteredStocks.length}
            </span>{" "}
            of {totalMatching} matching · {stocks.length} total issuers
          </div>
        </div>

        {/* ── Critical alert banner ── */}
        {criticalCount > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-red-700 dark:text-red-400">
                  {criticalCount} Issuer{criticalCount > 1 ? "s" : ""} Exceeding
                  Critical Risk Threshold (≥85)
                </div>
                <div className="text-xs text-red-500 dark:text-red-400/90">
                  Immediate investor attention recommended under IDX suspension
                  methodology.
                </div>
              </div>
            </div>
            <div className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              High Alert
            </div>
          </div>
        )}

        {/* ── Main Table ── */}
        <div className="overflow-x-auto rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800/90 shadow-sm">
          <div className="min-w-[760px]">
            {/* Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1.3fr_1fr_0.8fr] items-center gap-4 border-b border-[#d8d3cd] dark:border-slate-700 bg-[#eceae7] dark:bg-slate-900 px-6 py-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#58677a] dark:text-slate-400 select-none">
              <button
                type="button"
                onClick={() =>
                  setSortBy(
                    sortBy === "ticker-asc" ? "score-desc" : "ticker-asc",
                  )
                }
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Ticker &amp; Issuer</span>
                {sortBy === "ticker-asc" ? (
                  <ArrowUp className="h-3 w-3 text-red-500" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setSortBy(
                    sortBy === "price-desc" ? "score-desc" : "price-desc",
                  )
                }
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Price &amp; 24h</span>
                {sortBy === "price-desc" ? (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <span>Primary Risk Driver</span>

              <button
                type="button"
                onClick={() =>
                  setSortBy(
                    sortBy === "score-desc" ? "score-asc" : "score-desc",
                  )
                }
                className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer"
              >
                <span>Risk Index</span>
                {sortBy === "score-desc" ? (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                ) : sortBy === "score-asc" ? (
                  <ArrowUp className="h-3 w-3 text-red-500" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                )}
              </button>

              <span className="text-right">Action</span>
            </div>

            {/* Rows */}
            {filteredStocks.length > 0 ? (
              filteredStocks.map((row, idx) => (
                <div
                  key={row.ticker}
                  className="grid grid-cols-[1.5fr_1fr_1.3fr_1fr_0.8fr] items-center gap-4 border-b border-[#e7e0d8] dark:border-slate-700/80 px-6 py-4 last:border-b-0 hover:bg-white/70 dark:hover:bg-slate-700/40 transition cursor-pointer group"
                  onClick={() => setInspectStock(row)}
                >
                  {/* Ticker & Issuer */}
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        "inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white shadow-xs shrink-0",
                        row.tone === "red"
                          ? "bg-red-600"
                          : row.tone === "amber"
                            ? "bg-amber-400"
                            : "bg-emerald-500",
                      ].join(" ")}
                    >
                      {row.ticker[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[1.1rem] font-black tracking-[-0.04em] text-[#1b2433] dark:text-slate-100">
                          {row.ticker}
                        </span>
                        <span className="text-[0.7rem] font-bold text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                        {row.score >= 85 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[0.82rem] text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
                        {row.company}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-[0.95rem] font-black text-[#1b2433] dark:text-slate-100">
                      {row.priceFormatted}
                    </div>
                    <div
                      className={`text-[0.8rem] font-bold ${row.changePercent.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {row.changePercent}
                    </div>
                  </div>

                  {/* Driver */}
                  <div>
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.72rem] font-semibold truncate max-w-[220px]",
                        row.tone === "red"
                          ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                          : row.tone === "amber"
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
                      ].join(" ")}
                    >
                      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                      <span className="truncate">{row.driver}</span>
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <div className="w-full max-w-[90px] rounded-full border border-[#e0d4d1] dark:border-slate-600 bg-[#f0efed] dark:bg-slate-700 p-0.5">
                      <div
                        className={[
                          "h-2 rounded-full transition-all duration-700",
                          row.tone === "red"
                            ? "bg-red-600"
                            : row.tone === "amber"
                              ? "bg-amber-400"
                              : "bg-emerald-500",
                        ].join(" ")}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <div className="min-w-[52px] text-right text-[0.9rem] font-black text-[#1b2433] dark:text-slate-200">
                      {row.score}/100
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectStock(row);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] dark:border-slate-600 bg-[#f7f5f3] dark:bg-slate-700 px-3 py-1.5 text-[0.82rem] font-bold text-[#263140] dark:text-slate-200 transition hover:border-red-400 dark:hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-600 shadow-xs cursor-pointer"
                    >
                      Analyze <ArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-slate-400 opacity-60 mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
                  No matching issuers
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                  Try a different search term or reset the filters.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA to Dashboard ── */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onNavigate?.("dashboard")}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold transition hover:bg-red-600 dark:hover:bg-red-500 dark:hover:text-white shadow-md btn-hover-lift"
          >
            Open Full Dashboard with Charts <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Detail Modal (same as Dashboard inspect modal) ── */}
      {inspectStock && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setInspectStock(null)}
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
                    inspectStock.tone === "red"
                      ? "bg-red-600"
                      : inspectStock.tone === "amber"
                        ? "bg-amber-400"
                        : "bg-emerald-500",
                  ].join(" ")}
                >
                  {inspectStock.ticker[0]}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#111827] dark:text-white">
                      {inspectStock.ticker}
                    </h2>
                    <span className="rounded bg-black/10 dark:bg-white/10 px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Rank {inspectStock.rank}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {inspectStock.isin}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {inspectStock.company} · {inspectStock.sector}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectStock(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-6 space-y-6">
              {/* Score highlight */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 p-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Suspension Risk Index &amp; Market Price
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span
                      className={[
                        "text-3xl font-black tracking-tight",
                        inspectStock.tone === "red"
                          ? "text-red-600"
                          : inspectStock.tone === "amber"
                            ? "text-amber-500"
                            : "text-emerald-500",
                      ].join(" ")}
                    >
                      {inspectStock.score}/100
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {inspectStock.priceFormatted}
                    </span>
                    <span
                      className={`text-xs font-bold ${inspectStock.changePercent.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
                    >
                      {inspectStock.changePercent}
                    </span>
                  </div>
                </div>
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
                    inspectStock.tone === "red"
                      ? "bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300"
                      : inspectStock.tone === "amber"
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300"
                        : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300",
                  ].join(" ")}
                >
                  {inspectStock.tone === "red" ? (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  )}
                  {inspectStock.tone === "red"
                    ? "Critical Suspension Risk"
                    : inspectStock.tone === "amber"
                      ? "High Monitoring Risk"
                      : "Normal / Low Risk"}
                </span>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">Market Cap</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectStock.marketCap}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">
                    Debt / Equity (DER)
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectStock.der}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">
                    Equity Condition
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                    {inspectStock.equityStatus}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3">
                  <span className="text-slate-400 font-medium">
                    Est. Days to Suspension
                  </span>
                  <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
                    {inspectStock.daysToSuspension}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 p-3 sm:col-span-2">
                  <span className="text-slate-400 font-medium">
                    Latest Audit Opinion
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 truncate">
                    {inspectStock.lastAuditOpinion}
                  </p>
                </div>
              </div>

              {/* Driver */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Primary Risk Driver &amp; Regulation
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {inspectStock.driver}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulatory Trigger:{" "}
                  <strong className="text-red-500">
                    {inspectStock.ruleViolation}
                  </strong>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end border-t border-[#d8d3cd] dark:border-slate-700/80 pt-5">
              <button
                type="button"
                onClick={() => setInspectStock(null)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectStock(null);
                  onNavigate?.("news");
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
              >
                View Forensic Evidence <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectStock(null);
                  onNavigate?.("dashboard");
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-red-600 cursor-pointer"
              >
                Open Full Dashboard <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RankingsSection;
