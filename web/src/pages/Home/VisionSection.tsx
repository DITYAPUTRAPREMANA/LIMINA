import { Activity, BookOpen, Lock, Shield } from "lucide-react";

const VisionSection: React.FC = () => {
  return (
    <section
      id="vision"
      className="w-full py-24 bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-10 border-y border-slate-200 dark:border-slate-700"
    >
      <div className="w-full mx-auto">
        <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" /> LIMINA VISION &amp; PROJECT GENESIS
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Democratizing Market Intelligence for
          <br />
          Indonesian Retail Investors
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-3xl mb-12">
          Developed as part of <strong>Track 03: Market Intelligence</strong>,
          Limina directly addresses the structural information asymmetry
          prevalent across the Indonesia Stock Exchange (IDX), especially among
          retail participants holding second- and third-tier equities.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: "The Information Gap",
              desc: "Institutional desks utilize proprietary compliance scripts to forecast UMA and Special Monitoring Board placements. Retail investors are historically left holding suspended shares when trading halts occur without prior disclosure.",
              pillar: "01 • Asymmetry Reducer",
            },
            {
              icon: Lock,
              title: "Serverless & Censorship-Resistant",
              desc: "Zero dependency on vulnerable live web servers. Limina runs entirely on client-side static JSON artifacts generated via an offline Python data pipeline from the Sectors API. It guarantees 100% uptime at zero hosting cost.",
              pillar: "02 • Deterministic Tech",
            },
            {
              icon: Shield,
              title: "Development & Governance",
              desc: "Built by market structure engineers and quant researchers adhering to strict open methodology. No black-box ML hallucination: all logic is derived from public IDX regulatory threshold criteria and mathematical formulas.",
              pillar: "03 • Open Governance",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-500 flex items-center justify-center mb-6">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-700">
                {item.pillar}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
