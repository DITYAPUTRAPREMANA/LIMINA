import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Info,
  Search,
} from "lucide-react";
import type { View } from "../../App";

interface HeroSectionProps {
  onNavigate?: (view: View) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const handleExploreRankings = () => {
    const el = document.getElementById("rankings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const searchInput = el.querySelector<HTMLInputElement>("input");
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 600);
      }
    } else if (onNavigate) {
      onNavigate("dashboard");
    }
  };

  const handleExploreMethodology = () => {
    const el = document.getElementById("methodology");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (onNavigate) {
      onNavigate("home");
    }
  };

  return (
    <header className="relative w-full pt-20 pb-32 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Subtle ambient lighting loop in background */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-500/10 dark:bg-red-500/15 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />

      <div className="relative z-10 w-full max-w-full mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-8 xl:gap-12 items-center">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Real-time IDX Quantitative Surveillance
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-slate-50">
            IDX Stock Suspension Risk{" "}
            <span className="text-red-500">Early Warning System</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Empowering retail investors holding second- and third-tier
            Indonesian stocks. Limina mathematically computes an issuer's
            proximity to regulatory thresholds before official Unusual Market
            Activity (UMA) or trading halts are declared by exchange
            authorities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              id="hero-explore-rankings"
              onClick={handleExploreRankings}
              className="group cursor-pointer bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/15 btn-hover-lift"
            >
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 text-red-400 dark:text-red-500" />
              <span>Explore Risk Rankings</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              id="hero-explore-methodology"
              onClick={handleExploreMethodology}
              className="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/50 hover:bg-red-50/30 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xs hover:shadow-md btn-hover-lift"
            >
              <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors duration-200 group-hover:-rotate-6" />
              <span>Explore Methodology</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <Info className="w-4 h-4 text-slate-400" /> Strictly informational
            research; not a recommendation to buy, sell, or hold.
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                30 Days
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Average Lead Time
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                820+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                IDX Issuers Tracked
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-500 flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                0.0 ms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Static PWA Latency
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:flex justify-center items-center perspective-1000">
          <div className="relative w-[320px] h-162.5 bg-white dark:bg-slate-800 border-8 border-slate-900 dark:border-slate-700 rounded-[3rem] shadow-2xl animate-float-device shadow-slate-900/20 flex flex-col overflow-hidden transition-all">
            <div className="h-6 w-full flex justify-center absolute top-0 z-10">
              <div className="w-1/3 h-4 bg-slate-900 dark:bg-slate-700 rounded-b-xl"></div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-slate-900 pt-10 px-4">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  LIMINA RADAR
                </div>
                <div className="text-[10px] text-slate-400">10:45 AM WIB</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 rounded-xl p-4 mb-4 transition-all hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-500 animate-bounce" />{" "}
                    CRITICAL RISK
                  </div>
                  <div className="text-xl font-bold text-red-600">
                    92<span className="text-xs text-red-400">/100</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  BUMI{" "}
                  <span className="font-normal text-xs text-slate-500 dark:text-slate-400 block">
                    Bumi Resources Tbk.
                  </span>
                </div>
                <div className="text-[10px] text-red-500 mt-2 font-medium">
                  Threshold Breach: Negative Equity
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center">
                  <span>SRTG Risk Trajectory</span>
                  <span className="text-[9px] font-mono text-orange-500 bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                </div>
                <div className="h-20 flex items-end justify-between gap-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div className="w-1/5 bg-slate-200 dark:bg-slate-600 rounded-t h-[30%] transition-all"></div>
                  <div className="w-1/5 bg-slate-300 dark:bg-slate-500 rounded-t h-[45%] transition-all"></div>
                  <div className="w-1/5 bg-slate-400 rounded-t h-[60%] transition-all"></div>
                  <div className="w-1/5 bg-orange-300 rounded-t h-[80%] transition-all"></div>
                  <div className="w-1/5 bg-red-500 rounded-t h-full animate-live-bar"></div>
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-mono">
                  <span>Day -30</span>
                  <span>Day -15</span>
                  <span className="text-red-500 font-bold">Today (Alert)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-20 -left-12 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-float-badge cursor-default">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Backtest Validated
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                89.4% Precision
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
