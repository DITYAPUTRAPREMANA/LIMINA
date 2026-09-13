import { ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-10">
      <div className="w-full bg-slate-900 dark:bg-slate-800 rounded-4xl p-6 sm:p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
            READY TO PROTECT YOUR PORTFOLIO?
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Get Started with Limina Today
          </h2>
          <p className="text-slate-400 max-w-xl text-sm">
            Jump straight into the full interactive PWA or review the exact
            mathematical formulas behind our calculations.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
            <ArrowRight className="w-5 h-5" /> Back to Top &amp; Launch
          </button>
          <button className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 border border-slate-700 dark:border-slate-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap">
            Review Formulas
          </button>
        </div>
      </div>
    </section>
  );
};

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-10">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-red-500">Limina</span>
        </div>
        <div className="flex gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Home
          </a>
          <a href="#vision" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Vision
          </a>
          <a href="#methodology" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Methodology
          </a>
          <a href="#case-studies" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Evidence
          </a>
          <a href="#rankings" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Ranking
          </a>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
          Data powered by Sectors API. Static Artifacts.
        </div>
      </div>
    </footer>
  );
};
