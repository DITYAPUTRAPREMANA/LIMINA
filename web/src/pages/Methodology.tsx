import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calculator,
  FileText,
  Landmark,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import AppShell from "../components/AppShell";
import type { View } from "../App";

type MethodologyPageProps = {
  onNavigate: (view: View) => void;
};

const menuItems = [
  { label: "Ranking", icon: BarChart3, view: "dashboard" as const },
  { label: "Search", icon: Search, view: "search" as const },
  { label: "Evidence", icon: FileText, view: "evidence" as const },
  { label: "Methodology", icon: Landmark, view: "methodology" as const, active: true },
  { label: "Profile", icon: User, view: "profile" as const },
];

interface NotationItem {
  code: string;
  name: string;
  criteria: string;
  penaltyPoints: number;
  category: "Solvency" | "Compliance" | "Audit" | "Liquidity";
}

const IDX_NOTATIONS: NotationItem[] = [
  {
    code: "E",
    name: "Negative Equity (Rule III.1)",
    criteria: "Latest financial report shows negative equity value (Rule III.1 compliance breach).",
    penaltyPoints: 38,
    category: "Solvency",
  },
  {
    code: "M",
    name: "PKPU Application / Debt Restructuring",
    criteria: "Suspension of Debt Payment Obligations (PKPU) application or debt restructuring is underway.",
    penaltyPoints: 35,
    category: "Solvency",
  },
  {
    code: "B",
    name: "Bankruptcy Petition Filed",
    criteria: "A bankruptcy petition has been filed by creditors or authorized parties.",
    penaltyPoints: 40,
    category: "Solvency",
  },
  {
    code: "L",
    name: "Late Financial Report Submission",
    criteria: "Audited financial report not submitted within the mandatory 30–90 calendar day deadline.",
    penaltyPoints: 25,
    category: "Compliance",
  },
  {
    code: "D",
    name: "Disclaimer / Adverse Audit Opinion",
    criteria: "Public accountant issued a Disclaimer or Adverse opinion on the financial statements.",
    penaltyPoints: 32,
    category: "Audit",
  },
  {
    code: "X",
    name: "Special Monitoring Board (FCA)",
    criteria: "Securities meet one or more Special Monitoring Board criteria (low liquidity / price floor).",
    penaltyPoints: 20,
    category: "Liquidity",
  },
  {
    code: "S",
    name: "No Operating Revenue",
    criteria: "Latest financial report records no operational revenue from core business activities.",
    penaltyPoints: 22,
    category: "Solvency",
  },
  {
    code: "Y",
    name: "Annual General Meeting Not Held",
    criteria: "Annual General Meeting of Shareholders (AGMS) not conducted within the prescribed deadline.",
    penaltyPoints: 15,
    category: "Compliance",
  },
];

const MethodologyPage = ({ onNavigate }: MethodologyPageProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [simDer, setSimDer] = useState<number>(2.2);
  const [simCr, setSimCr] = useState<number>(1.2);
  const [simNegativeEquity, setSimNegativeEquity] = useState<boolean>(false);
  const [simConsecutiveLoss, setSimConsecutiveLoss] = useState<boolean>(false);
  const [simPriceFloor, setSimPriceFloor] = useState<boolean>(false);
  const [simVolatility, setSimVolatility] = useState<number>(28);

  const [selectedNotationCat, setSelectedNotationCat] = useState<string>("All");

  const calculateSimulatedScore = (): {
    score: number;
    level: "Critical" | "High Watch" | "Low Risk";
    levelColor: "red" | "amber" | "emerald";
    primaryDriver: string;
  } => {
    let score = 10.0;
    const drivers: string[] = [];

    if (simNegativeEquity) {
      score += 38.0;
      drivers.push("Negative Equity (Rule III.1 Compliance Breach)");
    }

    if (simDer > 4.0) {
      score += 32.0;
      drivers.push(`Extreme Leverage Overhang (DER ${simDer.toFixed(2)}x)`);
    } else if (simDer > 2.5) {
      score += 20.0;
      drivers.push(`Elevated Leverage Risk (DER ${simDer.toFixed(2)}x)`);
    } else if (simDer < 1.0) {
      score -= 5.0;
    }

    if (simConsecutiveLoss) {
      score += 18.0;
      drivers.push("Persistent Operating Loss & Cash Burn");
    }

    if (simCr < 0.8) {
      score += 12.0;
      drivers.push(`Severe Liquidity Squeeze (CR ${simCr.toFixed(2)})`);
    }

    if (simPriceFloor) {
      score += 15.0;
      drivers.push("Penny Stock Floor Compression (< Rp 80)");
    }

    if (simVolatility > 40) {
      score += 10.0;
      drivers.push(`Extreme Historical Volatility (${simVolatility}%)`);
    }

    const finalScore = Math.max(5, Math.min(98, Math.round(score)));

    let level: "Critical" | "High Watch" | "Low Risk" = "Low Risk";
    let levelColor: "red" | "amber" | "emerald" = "emerald";

    if (finalScore >= 75) {
      level = "Critical";
      levelColor = "red";
    } else if (finalScore >= 40) {
      level = "High Watch";
      levelColor = "amber";
    }

    const primaryDriver = drivers.length > 0 ? drivers[0] : "Stable Solvency & Operations";

    return { score: finalScore, level, levelColor, primaryDriver };
  };

  const simResult = calculateSimulatedScore();

  const handleResetSim = () => {
    setSimDer(1.2);
    setSimCr(1.5);
    setSimNegativeEquity(false);
    setSimConsecutiveLoss(false);
    setSimPriceFloor(false);
    setSimVolatility(20);
  };

  const filteredNotations =
    selectedNotationCat === "All"
      ? IDX_NOTATIONS
      : IDX_NOTATIONS.filter((n) => n.category === selectedNotationCat);

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
      currentView="methodology"
    >
      <div className="mx-auto max-w-[1240px] pb-16">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-[#d8d3cd] dark:border-slate-700 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#f26a4d]/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#f26a4d]">
                Methodology &amp; Regulatory Framework
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-[-0.07em] text-[#111827] dark:text-slate-100 sm:text-4xl lg:text-5xl mt-1">
              Methodology &amp; Governance
            </h1>
            <p className="mt-1.5 text-sm text-[#5b6675] dark:text-slate-400 sm:text-[1.02rem]">
              Transparency of early-warning model calculations, Point-in-Time rules, and IDX special notation dictionary
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
            <div className="flex items-center gap-2 rounded-full border border-[#d8d3cd] dark:border-slate-700 bg-[#f1efed] dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-[#465267] dark:text-slate-300">
              <Scale className="h-4 w-4 text-[#f26a4d]" />
              Rubric Standard v1.0
            </div>
          </div>
        </div>

        {/* ── SECTION 1: INTERACTIVE RISK SIMULATOR / KALKULATOR RUBRIK EWS ── */}
        <section className="mt-8 rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f26a4d]">
                <Calculator className="h-4 w-4" />
                Interactive Rubric Simulator
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                EWS Suspension Risk Probability Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust the financial ratio values below to test how the model weights compute the suspension risk score in real time.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetSim}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Values
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Slider Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Slider DER */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  <span>Debt to Equity Ratio (DER)</span>
                  <span className="font-mono text-[#f26a4d]">{simDer.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="6.0"
                  step="0.1"
                  value={simDer}
                  onChange={(e) => setSimDer(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f26a4d]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Safe (&lt; 1.5x)</span>
                  <span>Caution (2.5x)</span>
                  <span>Critical (&gt; 4.0x)</span>
                </div>
              </div>

              {/* Slider Current Ratio */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  <span>Current Ratio (Short-Term Liquidity)</span>
                  <span className="font-mono text-[#f26a4d]">{simCr.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.1"
                  value={simCr}
                  onChange={(e) => setSimCr(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f26a4d]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Tight (&lt; 0.8x)</span>
                  <span>Moderate (1.2x)</span>
                  <span>High Liquidity (&gt; 2.0x)</span>
                </div>
              </div>

              {/* Slider Volatilitas */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  <span>30-Day Price Volatility</span>
                  <span className="font-mono text-[#f26a4d]">{simVolatility}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="70"
                  step="1"
                  value={simVolatility}
                  onChange={(e) => setSimVolatility(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#f26a4d]"
                />
              </div>

              {/* Toggles (Negative Equity, Operating Loss, Price Floor) */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={simNegativeEquity}
                    onChange={(e) => setSimNegativeEquity(e.target.checked)}
                    className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Negative Equity (Rule III.1)
                  </span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={simConsecutiveLoss}
                    onChange={(e) => setSimConsecutiveLoss(e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Persistent Operating Loss
                  </span>
                </label>

                <label className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs cursor-pointer shadow-2xs">
                  <input
                    type="checkbox"
                    checked={simPriceFloor}
                    onChange={(e) => setSimPriceFloor(e.target.checked)}
                    className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Penny Floor (&lt; Rp 80)
                  </span>
                </label>
              </div>
            </div>

            {/* Calculated Output Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-2xs">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Simulation Score Result</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-black text-xs ${simResult.levelColor === "red"
                      ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400"
                      : simResult.levelColor === "amber"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400"
                      }`}
                  >
                    {simResult.level}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-slate-100">
                    {simResult.score}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${simResult.score >= 75
                      ? "bg-red-500"
                      : simResult.score >= 40
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                      }`}
                    style={{ width: `${simResult.score}%` }}
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-700/60">
                  <div className="text-[11px] uppercase font-bold text-slate-400">
                    Primary Anomaly Trigger
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                    {simResult.primaryDriver}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                The model formula combines solvency weights, short-term liquidity, and official IDX regulatory criteria.
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: POINT-IN-TIME (PIT) ISOLATION FRAMEWORK ── */}
        <section className="mt-8 rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            Point-in-Time Principle (Free of Look-Ahead Bias)
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            One of the most critical flaws in financial prediction systems is <em>look-ahead bias</em> — when a model incorrectly uses information that was not yet publicly available at the time. LIMINA strictly enforces Point-in-Time (PIT) isolation protocols:
          </p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#f26a4d]">
                4:00 PM WIB Snapshot
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Price, volume, and market capitalisation data are recorded only after the official exchange close each business day.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#f26a4d]">
                Official Publication Date
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Financial reports are not timestamped by the book-close date (31 Dec), but by the actual date they were uploaded to the IDXnet disclosure portal.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#f26a4d]">
                Temporal Training Split
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Training data is split by historical time range (pre-2025 for training, 2025–2026 for forward test), not by random sampling.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: KAMUS NOTASI KHUSUS BURSA (IDX SPECIAL NOTATIONS) ── */}
        <section className="mt-8 rounded-2xl border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f26a4d]">
                <BookOpen className="h-4 w-4" />
                Regulatory Decoder
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
                IDX Special Notation Dictionary &amp; Risk Weighting
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official exchange notation criteria and penalty weights incorporated into the LIMINA EWS model.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Solvency", "Compliance", "Audit", "Liquidity"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedNotationCat(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${selectedNotationCat === cat
                    ? "bg-[#f26a4d] text-white"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotations.map((item) => (
              <div
                key={item.code}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-2xs flex items-start gap-3.5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/60 font-black text-red-600 text-lg border border-red-200 dark:border-red-900/40">
                  {item.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.name}
                    </div>
                    <span className="text-[11px] font-bold text-[#f26a4d]">
                      +{item.penaltyPoints} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.criteria}
                  </p>
                  <div className="mt-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Category: {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 4: STRICT LEGAL DISCLAIMER ── */}
        <section className="mt-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 text-lg font-bold text-red-700 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            Legal Compliance Statement &amp; Product Limitations
          </div>

          <div className="mt-3 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-5xl">
            <p>
              1. <strong>Not Investment Advice:</strong> All suspension probability scores, risk indicators, and rankings in the LIMINA system are presented purely for informational and academic research purposes. They do not constitute a recommendation to buy, sell, or hold any securities.
            </p>
            <p>
              2. <strong>Not a Substitute for Official Exchange Announcements:</strong> Suspension decisions, trading right revocations, or special notations are the sole authority of PT Bursa Efek Indonesia (IDX) and the Financial Services Authority (OJK). LIMINA data is sourced from public data and does not represent official exchange disclosures.
            </p>
            <p>
              3. <strong>User Responsibility:</strong> All investment transaction decisions rest entirely under each investor's own independent judgment and risk (<em>do your own research</em>).
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default MethodologyPage;
