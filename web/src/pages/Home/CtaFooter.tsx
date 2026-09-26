import { ArrowRight, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { View } from "../../App";

interface CTASectionProps {
  onNavigate?: (view: View) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  const { session } = useAuth();

  const handleLaunch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onNavigate) {
      setTimeout(() => {
        onNavigate(session ? "dashboard" : "login");
      }, 350);
    }
  };

  const handleReviewFormulas = () => {
    const el = document.getElementById("rankings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (onNavigate) {
      onNavigate("dashboard");
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-10">
      <div className="w-full bg-slate-900 dark:bg-slate-800 rounded-4xl p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative border border-slate-800 dark:border-slate-700">
        {/* Subtle breathing ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none animate-ambient-glow"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none animate-ambient-glow"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            READY TO PROTECT YOUR PORTFOLIO?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Get Started with Limina Today
          </h2>
          <p className="text-slate-300 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Jump straight into the full interactive PWA or review the exact
            mathematical formulas behind our Point-in-Time surveillance
            calculations.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
          <button
            type="button"
            id="cta-launch-btn"
            onClick={handleLaunch}
            className="group cursor-pointer relative overflow-hidden bg-red-500 hover:bg-red-600 text-white px-7 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-red-500/40 whitespace-nowrap btn-hover-lift"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            <span>{session ? "Launch Dashboard" : "Back to Top & Launch"}</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            id="cta-review-formulas-btn"
            onClick={handleReviewFormulas}
            className="group cursor-pointer bg-slate-800/90 dark:bg-slate-700/90 hover:bg-slate-750 dark:hover:bg-slate-650 border border-slate-700 dark:border-slate-600 hover:border-slate-500 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap btn-hover-lift shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
            <span>Review Rankings</span>
          </button>
        </div>
      </div>
    </section>
  );
};

type FooterSectionProps = Record<string, never>;

export const FooterSection: React.FC<FooterSectionProps> = () => {
  const scrollToSection = (e: React.MouseEvent, id?: string) => {
    e.preventDefault();
    if (!id || id === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={(e) => scrollToSection(e, "#")}
            className="cursor-pointer font-extrabold text-red-500 text-base tracking-tight hover:opacity-85 transition-opacity"
          >
            LIMINA
          </button>
          <span className="text-xs text-slate-400">
            — IDX Risk Surveillance
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          {[
            { label: "Home", href: "#" },
            { label: "Vision", href: "#vision" },
            { label: "News", href: "#case-studies" },
            { label: "Ranking", href: "#rankings" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors relative py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Powered by Sectors API. Static Artifacts.
        </div>
      </div>
    </footer>
  );
};
