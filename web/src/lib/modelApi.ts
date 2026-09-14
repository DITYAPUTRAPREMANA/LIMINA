import { BASELINE_STOCKS, type DashboardStockItem } from "./sectorsApi";

export interface ModelPrediction {
  ticker: string;
  company_name: string;
  sector: string;
  risk_score: number;
  risk_level: "CRITICAL" | "HIGH_WATCH" | "NORMAL" | "LOW";
  confidence: number;
  primary_driver: string;
  delta_30d: number;
  indicators: {
    debt_to_equity?: number;
    current_ratio?: number;
    price_to_book?: number;
    price_to_earnings?: number;
    market_cap?: number;
    price?: number;
    change_24h?: number;
    volatility_30d?: number;
    negative_equity_flag?: boolean;
    consecutive_loss_flag?: boolean;
    special_notation_count?: number;
  };
  model_version: string;
  evaluated_at: string;
}

export interface ModelUniverseRankings {
  universe_size: number;
  last_updated: string;
  critical_count: number;
  watch_count: number;
  normal_count: number;
  rankings: ModelPrediction[];
}

export interface ModelHealth {
  status: string;
  service: string;
  model_version: string;
  sectors_api_configured: boolean;
}

const MODEL_API_BASE = "/api/model/api/v1";

export async function checkModelServerHealth(): Promise<{
  online: boolean;
  data?: ModelHealth;
}> {
  try {
    const res = await fetch(`${MODEL_API_BASE}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data: ModelHealth = await res.json();
      return { online: true, data };
    }
  } catch {
    // Model server offline
  }
  return { online: false };
}

export async function fetchLiveModelRankings(): Promise<{
  stocks: DashboardStockItem[];
  isFromRemoteModel: boolean;
  modelVersion?: string;
}> {
  try {
    const res = await fetch(`${MODEL_API_BASE}/rankings`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const json: ModelUniverseRankings = await res.json();
      if (Array.isArray(json.rankings) && json.rankings.length > 0) {
        const mappedStocks: DashboardStockItem[] = json.rankings.map(
          (pred, idx) => {
            const base =
              BASELINE_STOCKS.find((b) => b.ticker === pred.ticker) ||
              BASELINE_STOCKS[0];

            let tone: "red" | "amber" | "green" = "green";
            if (pred.risk_score >= 75) tone = "red";
            else if (pred.risk_score >= 40) tone = "amber";

            const price = pred.indicators.price ?? base.price;

            return {
              ...base,
              rank: String(idx + 1).padStart(2, "0"),
              ticker: pred.ticker,
              company: pred.company_name || base.company,
              sector: pred.sector || base.sector,
              score: Math.round(pred.risk_score),
              driver: pred.primary_driver || base.driver,
              tone,
              price,
              priceFormatted: `Rp ${price.toLocaleString("id-ID")}`,
              der: pred.indicators.debt_to_equity
                ? `${pred.indicators.debt_to_equity.toFixed(2)}x`
                : base.der,
              delta:
                pred.delta_30d > 0
                  ? `+${pred.delta_30d.toFixed(1)}%`
                  : `${pred.delta_30d.toFixed(1)}%`,
            };
          }
        );

        return {
          stocks: mappedStocks,
          isFromRemoteModel: true,
          modelVersion: json.rankings[0]?.model_version,
        };
      }
    }
  } catch {
    // Standby fallback
  }

  return {
    stocks: BASELINE_STOCKS,
    isFromRemoteModel: false,
  };
}

export async function predictStockRisk(
  ticker: string,
  customIndicators?: Record<string, unknown>
): Promise<ModelPrediction | null> {
  try {
    const res = await fetch(`${MODEL_API_BASE}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ticker,
        custom_indicators: customIndicators,
      }),
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      return (await res.json()) as ModelPrediction;
    }
  } catch {
    // Prediction request failed
  }
  return null;
}
