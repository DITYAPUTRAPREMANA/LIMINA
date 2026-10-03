import { BASELINE_STOCKS, type DashboardStockItem } from "./sectorsApi";
export interface SkorEmiten {
  symbol: string;
  company_name: string;
  as_of_date: string;
  sector?: string | null;
  sub_sector?: string | null;
  board?: string | null
  skor: number;
  persentil: number;
  kategori: string;
  arah_30h: string;
  status: string;
  indikator_dominan: string;
  kontribusi: Record<string, number>;
}

const MODEL_API_BASE = "/api/model";
const CRITICAL_PERCENTILE = 85;
const WATCH_PERCENTILE = 70;

const stripSuffix = (symbol: string) => symbol.replace(/\.JK$/i, "").toUpperCase();

const humanize = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

function toStockItem(
  score: SkorEmiten,
  rank: number,
): DashboardStockItem {
  const ticker = stripSuffix(score.symbol);
  const base =
    BASELINE_STOCKS.find((b) => b.ticker === ticker) ?? BASELINE_STOCKS[0];

  const value = Math.round(score.persentil);
  const tone: DashboardStockItem["tone"] =
    value >= CRITICAL_PERCENTILE
      ? "red"
      : value >= WATCH_PERCENTILE
        ? "amber"
        : "green";

  const direction = score.arah_30h?.toLowerCase();
  const delta =
    direction === "upward" ? "+1.0" : direction === "downward" ? "-1.0" : "0.0";

  return {
    ...base,
    rank: `#${rank}`,
    ticker,
    company: score.company_name || base.company,
    sector: score.sector || base.sector,
    driver: humanize(score.indikator_dominan || base.driver),
    score: value,
    delta,
    tone,
    equityStatus: humanize(score.status || base.equityStatus),
  };
}
export async function fetchLiveModelRankings(): Promise<{
  stocks: DashboardStockItem[];
  scores: Record<string, SkorEmiten>;
  isFromRemoteModel: boolean;
  asOfDate?: string;
}> {
  try {
    const query = BASELINE_STOCKS.map(
      (s) => `tickers=${encodeURIComponent(s.ticker)}`,
    ).join("&");

    const res = await fetch(`${MODEL_API_BASE}/scores?${query}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const json: SkorEmiten[] = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const sorted = [...json].sort((a, b) => b.persentil - a.persentil);
        const scores: Record<string, SkorEmiten> = {};
        for (const item of sorted) scores[stripSuffix(item.symbol)] = item;

        return {
          stocks: sorted.map((item, idx) => toStockItem(item, idx + 1)),
          scores,
          isFromRemoteModel: true,
          asOfDate: sorted[0]?.as_of_date,
        };
      }
    }
  } catch {

  }

  return {
    stocks: BASELINE_STOCKS,
    scores: {},
    isFromRemoteModel: false,
  };
}
