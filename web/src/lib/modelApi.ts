import { BASELINE_STOCKS, type DashboardStockItem } from "./sectorsApi";

export interface SkorEmiten {
  symbol: string;
  company_name: string;
  as_of_date: string;
  sector?: string | null;
  sub_sector?: string | null;
  board?: string | null;
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

export const stripSuffix = (symbol: string) =>
  symbol.replace(/\.JK$/i, "").toUpperCase();

export const humanize = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const FACTOR_LABELS_ID: Record<string, string> = {
  lapor_jarak_hari: "Jarak Laporan (Hari)",
  lapor_terlambat: "Keterlambatan Laporan Keuangan",
  tanpa_pendapatan: "Status Tanpa Pendapatan Operasional",
  ekuitas_negatif: "Defisit Ekuitas Negatif",
  utang_terhadap_aset: "Rasio Utang thd Total Aset (DAR)",
  ako_negatif_berturut: "Arus Kas Operasi Negatif Berturut",
  hari_tanpa_transaksi_90d: "Hari Tanpa Transaksi (90 Hari)",
  rasio_volume_30_90: "Rasio Volume Perdagangan (30H / 90H)",
  hari_di_batas_bawah_90d: "Hari di Batas Bawah Auto Rejection (90H)",
  turun_dari_puncak_90d: "Penurunan Harga dari Puncak (90H)",
  volatilitas_90d: "Volatilitas Harga Saham (90 Hari)",
  earnings_margin: "Earnings Margin (Laba Bersih / Pendapatan)",
  fcf_margin: "Free Cash Flow Margin",
  ocf_to_debt: "Rasio Kas Operasi thd Total Utang (OCF/Debt)",
};

export function getFactorLabel(key: string): string {
  return FACTOR_LABELS_ID[key] ?? humanize(key);
}

function toStockItem(
  score: SkorEmiten,
  rank: number,
): DashboardStockItem {
  const ticker = stripSuffix(score.symbol);
  const base = BASELINE_STOCKS.find((b) => b.ticker === ticker);

  const value = Math.round(score.persentil);
  const tone: DashboardStockItem["tone"] =
    value >= CRITICAL_PERCENTILE
      ? "red"
      : value >= WATCH_PERCENTILE
        ? "amber"
        : "green";

  const direction = score.arah_30h?.toLowerCase();
  const delta =
    direction === "upward" || direction === "naik"
      ? "+1.0"
      : direction === "downward" || direction === "turun"
        ? "-1.0"
        : "0.0";

  return {
    rank: `#${rank}`,
    ticker,
    company: score.company_name || base?.company || `${ticker} Tbk.`,
    sector: score.sector || base?.sector || "IDX Listed",
    driver: humanize(score.indikator_dominan || base?.driver || "Risk Factor"),
    score: value,
    delta: base?.delta || delta,
    tone,
    price: base?.price || 500,
    priceFormatted: base?.priceFormatted || "Rp 500",
    changePercent:
      base?.changePercent ||
      (delta.startsWith("+") ? "+1.2%" : delta.startsWith("-") ? "-1.5%" : "0.0%"),
    marketCap: base?.marketCap || "—",
    marketCapRaw: base?.marketCapRaw || 0,
    isin: base?.isin || `ID${ticker}000`,
    equityStatus: humanize(score.status || base?.equityStatus || "Aktif"),
    daysToSuspension:
      base?.daysToSuspension ||
      (value >= 85 ? "30 Days" : value >= 70 ? "60 Days" : "Normal"),
    ruleViolation:
      base?.ruleViolation ||
      (value >= 85
        ? "Pola Perdagangan Tidak Wajar / UMA"
        : "Dalam Batas Pemantauan Wajar"),
    leadTimeDays: base?.leadTimeDays || (value >= 85 ? 14 : 30),
    lastAuditOpinion: base?.lastAuditOpinion || "Wajar Tanpa Pengecualian (WTP)",
    der: base?.der || "—",
  };
}

export async function fetchLiveModelRankings(): Promise<{
  stocks: DashboardStockItem[];
  scores: Record<string, SkorEmiten>;
  isFromRemoteModel: boolean;
  asOfDate?: string;
}> {
  try {
    // GET /scores without `tickers` returns all issuers
    const res = await fetch(`${MODEL_API_BASE}/scores`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const json: SkorEmiten[] = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const sorted = [...json].sort((a, b) => b.persentil - a.persentil);
        const scores: Record<string, SkorEmiten> = {};
        for (const item of sorted) {
          const clean = stripSuffix(item.symbol);
          scores[clean] = item;
          scores[item.symbol] = item;
        }

        return {
          stocks: sorted.map((item, idx) => toStockItem(item, idx + 1)),
          scores,
          isFromRemoteModel: true,
          asOfDate: sorted[0]?.as_of_date,
        };
      }
    }
  } catch {
    // Model server offline or timing out
  }

  return { stocks: [], scores: {}, isFromRemoteModel: false };
}

