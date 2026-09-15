import { supabase, isSupabaseConfigured } from "./supabase";

export const TARGET_TICKERS = [
  "BBCA",
  "TLKM",
  "ASII",
  "AMMN",
  "IMPC",
  "AADI",
  "MGLV",
  "SOHO",
  "BELI",
  "SRAJ",
  "BRPT",
  "TPIA",
] as const;

export type TargetSymbol = (typeof TARGET_TICKERS)[number];

export interface SectorsCompanyData {
  symbol: string;
  company_name: string;
  sector: string;
  sub_sector?: string;
  market_cap?: number;
  last_close_price?: number;
  daily_close_change?: number;
  pe_ttm?: number;
  pb_mrq?: number;
  der_mrq?: number;
  dar_mrq?: number;
  total_equity_mrq?: number;
  total_revenue_mrq?: number;
  earnings_mrq?: number;
  isin?: string;
}

export interface DashboardStockItem {
  ticker: string;
  rank: string;
  company: string;
  sector: string;
  driver: string;
  score: number; // Suspension Risk Index (0 - 100)
  delta: string;
  tone: "red" | "amber" | "green";
  price: number;
  priceFormatted: string;
  changePercent: string;
  marketCap: string;
  marketCapRaw: number;
  isin: string;
  equityStatus: string;
  daysToSuspension: string;
  ruleViolation: string;
  leadTimeDays: number;
  lastAuditOpinion: string;
  der: string;
}

export const BASELINE_STOCKS: DashboardStockItem[] = [
  {
    ticker: "BELI",
    rank: "#1",
    company: "Global Digital Niaga Tbk. (Blibli)",
    sector: "Technology",
    driver: "Persistent Operating Cash Burn & E-Commerce Deficit",
    score: 88,
    delta: "+3.4",
    tone: "red",
    price: 432,
    priceFormatted: "Rp 432",
    changePercent: "-1.8%",
    marketCap: "Rp 52.4 T",
    marketCapRaw: 52400000000000,
    isin: "ID1000168300",
    equityStatus: "Heavy Accumulated Loss",
    daysToSuspension: "35 Days",
    ruleViolation: "IDX Rule III.1 (Negative Cumulative Operating Flow)",
    leadTimeDays: 24,
    lastAuditOpinion: "Unqualified with Explanatory Paragraph",
    der: "1.42x",
  },
  {
    ticker: "SRAJ",
    rank: "#2",
    company: "Sejahteraraya Anugrahjaya Tbk. (Mayapada Hospital)",
    sector: "Healthcare",
    driver: "Aggressive Hospital Capex & Debt Service Ratio Watch",
    score: 84,
    delta: "+2.1",
    tone: "amber",
    price: 2420,
    priceFormatted: "Rp 2,420",
    changePercent: "+0.8%",
    marketCap: "Rp 29.1 T",
    marketCapRaw: 29100000000000,
    isin: "ID1000120103",
    equityStatus: "High Leverage Exposure",
    daysToSuspension: "60 Days",
    ruleViolation: "OJK Debt Coverage Covenant Watchlist",
    leadTimeDays: 21,
    lastAuditOpinion: "Qualified on Long-Term Debt Structure",
    der: "3.15x",
  },
  {
    ticker: "MGLV",
    rank: "#3",
    company: "Panca Anugrah Wisesa Tbk.",
    sector: "Consumer Cyclicals",
    driver: "Small Float Volatility & Inventory Turnover Stagnation",
    score: 79,
    delta: "+1.9",
    tone: "amber",
    price: 88,
    priceFormatted: "Rp 88",
    changePercent: "-3.3%",
    marketCap: "Rp 167 M",
    marketCapRaw: 167000000000,
    isin: "ID1000160208",
    equityStatus: "Thin Working Capital Buffer",
    daysToSuspension: "75 Days",
    ruleViolation: "IDX Unusual Market Activity (UMA Protocol)",
    leadTimeDays: 18,
    lastAuditOpinion: "Unqualified (Going Concern Note)",
    der: "0.85x",
  },
  {
    ticker: "TPIA",
    rank: "#4",
    company: "Chandra Asri Pacific Tbk.",
    sector: "Basic Materials",
    driver: "Petrochemical Cycle Compression & Heavy FX Loan Exposure",
    score: 75,
    delta: "-0.8",
    tone: "amber",
    price: 6850,
    priceFormatted: "Rp 6,850",
    changePercent: "-1.1%",
    marketCap: "Rp 592.6 T",
    marketCapRaw: 592600000000000,
    isin: "ID1000062404",
    equityStatus: "Capital Intensive Expansion",
    daysToSuspension: "90 Days",
    ruleViolation: "None (High Net Debt Burden)",
    leadTimeDays: 15,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "1.78x",
  },
  {
    ticker: "BRPT",
    rank: "#5",
    company: "Barito Pacific Tbk.",
    sector: "Basic Materials & Energy",
    driver: "Holding Subsidiary Gearing & Geothermal Refinancing",
    score: 72,
    delta: "+0.5",
    tone: "amber",
    price: 945,
    priceFormatted: "Rp 945",
    changePercent: "+1.6%",
    marketCap: "Rp 88.6 T",
    marketCapRaw: 88600000000000,
    isin: "ID1000107407",
    equityStatus: "Leveraged Holding Accord",
    daysToSuspension: "Watchlist Active",
    ruleViolation: "None (Conglomerate Debt Concentration)",
    leadTimeDays: 14,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "2.05x",
  },
  {
    ticker: "AADI",
    rank: "#6",
    company: "Adaro Andalan Indonesia Tbk.",
    sector: "Energy & Coal",
    driver: "Thermal Coal Spinoff Dynamics & Energy Transition Risk",
    score: 64,
    delta: "-1.4",
    tone: "green",
    price: 5825,
    priceFormatted: "Rp 5,825",
    changePercent: "-0.4%",
    marketCap: "Rp 45.3 T",
    marketCapRaw: 45300000000000,
    isin: "ID1000171205",
    equityStatus: "High Dividend Spinoff Cash",
    daysToSuspension: "Low Probability",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.48x",
  },
  {
    ticker: "IMPC",
    rank: "#7",
    company: "Impack Pratama Industri Tbk.",
    sector: "Basic Materials",
    driver: "Raw Material Resin Price Fluctuations & Distribution Margin",
    score: 52,
    delta: "-0.9",
    tone: "green",
    price: 360,
    priceFormatted: "Rp 360",
    changePercent: "+0.6%",
    marketCap: "Rp 19.5 T",
    marketCapRaw: 19500000000000,
    isin: "ID1000133403",
    equityStatus: "Healthy Retained Earnings",
    daysToSuspension: "Low Probability",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.62x",
  },
  {
    ticker: "SOHO",
    rank: "#8",
    company: "Soho Global Health Tbk.",
    sector: "Healthcare",
    driver: "Retail Pharmaceutical Inventory & Currency Import Sensitivity",
    score: 44,
    delta: "-1.8",
    tone: "green",
    price: 610,
    priceFormatted: "Rp 610",
    changePercent: "-0.8%",
    marketCap: "Rp 7.7 T",
    marketCapRaw: 7700000000000,
    isin: "ID1000156909",
    equityStatus: "Strong Liquidity Buffer",
    daysToSuspension: "Low Probability",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.38x",
  },
  {
    ticker: "AMMN",
    rank: "#9",
    company: "Amman Mineral Internasional Tbk.",
    sector: "Basic Materials & Mining",
    driver: "Batu Hijau Copper Reserves & Smelter Construction Capex",
    score: 36,
    delta: "-0.5",
    tone: "green",
    price: 8850,
    priceFormatted: "Rp 8,850",
    changePercent: "+2.3%",
    marketCap: "Rp 641.8 T",
    marketCapRaw: 641800000000000,
    isin: "ID1000170009",
    equityStatus: "Sovereign Strategic Asset Buffer",
    daysToSuspension: "Negligible",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.88x",
  },
  {
    ticker: "TLKM",
    rank: "#10",
    company: "Telkom Indonesia (Persero) Tbk.",
    sector: "Telecommunication",
    driver: "Data Center Capex & ARPU Consolidation in Mobile",
    score: 25,
    delta: "-0.4",
    tone: "green",
    price: 2780,
    priceFormatted: "Rp 2,780",
    changePercent: "+0.7%",
    marketCap: "Rp 275.4 T",
    marketCapRaw: 275400000000000,
    isin: "ID1000096600",
    equityStatus: "State-Owned Enterprise Fortress",
    daysToSuspension: "Negligible",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.55x",
  },
  {
    ticker: "ASII",
    rank: "#11",
    company: "Astra International Tbk.",
    sector: "Industrials & Automotive",
    driver: "Automotive Market Share & Mining Equipment Demand",
    score: 18,
    delta: "-0.5",
    tone: "green",
    price: 4940,
    priceFormatted: "Rp 4,940",
    changePercent: "+1.2%",
    marketCap: "Rp 200.0 T",
    marketCapRaw: 200000000000000,
    isin: "ID1000050102",
    equityStatus: "Net Cash Conglomerate Position",
    daysToSuspension: "Negligible",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.41x",
  },
  {
    ticker: "BBCA",
    rank: "#12",
    company: "Bank Central Asia Tbk.",
    sector: "Financials & Banking",
    driver: "Tier-1 Capital Adequacy & Industry-Lowest NPL (1.8%)",
    score: 8,
    delta: "-0.1",
    tone: "green",
    price: 9950,
    priceFormatted: "Rp 9,950",
    changePercent: "+0.5%",
    marketCap: "Rp 1,226.5 T",
    marketCapRaw: 1226500000000000,
    isin: "ID1000109502",
    equityStatus: "Apex Blue-Chip Capital Buffer",
    daysToSuspension: "Negligible",
    ruleViolation: "None (Compliant)",
    leadTimeDays: 0,
    lastAuditOpinion: "Unqualified (Clean)",
    der: "0.18x",
  },
];


const CACHE_TTL_HOURS = 6;
const LS_PREFIX = "limina_cache_";

async function getSupabaseCache<T>(key: string): Promise<T | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from("sectors_cache")
      .select("data, fetched_at, ttl_hours")
      .eq("id", key)
      .maybeSingle();

    if (error || !data) return null;

    const age = Date.now() - new Date(data.fetched_at as string).getTime();
    const ttl = (data.ttl_hours as number) * 3600_000;
    if (age > ttl) return null;

    return data.data as T;
  } catch {
    return null;
  }
}

async function setSupabaseCache<T>(key: string, payload: T): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const { error } = await supabase.from("sectors_cache").upsert(
      { id: key, data: payload, fetched_at: new Date().toISOString(), ttl_hours: CACHE_TTL_HOURS },
      { onConflict: "id" }
    );
    if (error) console.warn("[sectorsApi] cache write failed:", error.message);
  } catch (e) {
    console.warn("[sectorsApi] cache write exception:", e);
  }
}

function getLocalCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const { data, fetchedAt } = JSON.parse(raw) as { data: T; fetchedAt: number };
    if (Date.now() - fetchedAt > CACHE_TTL_HOURS * 3600_000) {
      localStorage.removeItem(LS_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch {
    // quota exceeded or private mode — skip silently
  }
}

export async function fetchSectorsUniverseData(): Promise<DashboardStockItem[]> {
  const KEY = "universe_v1";

  const cached =
    (await getSupabaseCache<DashboardStockItem[]>(KEY)) ??
    getLocalCache<DashboardStockItem[]>(KEY);
  if (cached) return cached;

  try {
    const res = await fetch(
      `/api/sectors/companies/?where=symbol in ['BBCA','TLKM','ASII','AMMN','IMPC','AADI','MGLV','SOHO','BELI','SRAJ','BRPT','TPIA']`,
      { headers: { Accept: "application/json" } }
    );

    if (res.ok) {
      const json = await res.json();
      const companies: SectorsCompanyData[] = Array.isArray(json) ? json : json.data ?? [];

      if (companies.length > 0) {
        const merged = BASELINE_STOCKS.map((base) => {
          const remote = companies.find((c) => c.symbol.toUpperCase() === base.ticker);
          if (!remote) return base;

          const updatedPrice = remote.last_close_price ?? base.price;
          const updatedChange = remote.daily_close_change
            ? `${(remote.daily_close_change * 100).toFixed(1)}%`
            : base.changePercent;

          return {
            ...base,
            company: remote.company_name || base.company,
            sector: remote.sector || base.sector,
            price: updatedPrice,
            priceFormatted: `Rp ${updatedPrice.toLocaleString("id-ID")}`,
            changePercent: updatedChange,
            marketCap: remote.market_cap ? formatIDR(remote.market_cap) : base.marketCap,
            marketCapRaw: remote.market_cap ?? base.marketCapRaw,
            der: remote.der_mrq ? `${remote.der_mrq.toFixed(2)}x` : base.der,
          };
        });

        await setSupabaseCache(KEY, merged);
        setLocalCache(KEY, merged);
        return merged;
      }
    }
  } catch (err) {
    console.warn("[sectorsApi] fetch failed:", err);
  }

  return BASELINE_STOCKS;
}

export async function fetchStockDailyHistory(
  symbol: string
): Promise<{ date: string; close: number; volume: number }[]> {
  const KEY = `daily_${symbol}_v1`;

  const cached =
    (await getSupabaseCache<{ date: string; close: number; volume: number }[]>(KEY)) ??
    getLocalCache<{ date: string; close: number; volume: number }[]>(KEY);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/sectors/daily/${symbol}/`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        const history = json.slice(-30).map((d: any) => ({
          date: d.date || "",
          close: Number(d.close || d.price || 0),
          volume: Number(d.volume || 0),
        }));
        await setSupabaseCache(KEY, history);
        setLocalCache(KEY, history);
        return history;
      }
    }
  } catch (e) {
    console.warn(`[sectorsApi] daily history fetch failed (${symbol}):`, e);
  }

  // fallback: generate synthetic curve from baseline price
  const base = BASELINE_STOCKS.find((s) => s.ticker === symbol) ?? BASELINE_STOCKS[0];
  const now = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString("id-ID", { month: "short", day: "numeric" }),
      close: Math.round(base.price * (1 + Math.sin(i * 0.8) * 0.04 - 0.02)),
      volume: Math.round(5_000_000 + Math.random() * 8_000_000),
    };
  });
}

function formatIDR(val: number): string {
  if (val >= 1e12) return `Rp ${(val / 1e12).toFixed(1)} T`;
  if (val >= 1e9) return `Rp ${(val / 1e9).toFixed(1)} M`;
  return `Rp ${val.toLocaleString("id-ID")}`;
}
