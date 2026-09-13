import { useMemo, useState } from "react";
import { Activity, ArrowRight, Check, Circle, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type RegisterPageProps = {
  onNavigate: (view: "home" | "register" | "login" | "otp") => void;
};

const featureCards = [
  {
    title: "Pre-UMA Volatility Triggers",
    description:
      "Automated 2-score dispersion warnings calculating abnormal volume velocity up to 30 days prior to exchange watchlist notices.",
    tag: "Lead: 30 days",
    accent: "bg-[#f0f4ff] text-[#cbd5ff]",
    icon: "🔔",
  },
  {
    title: "Zero Query Telemetry",
    description:
      "Runs entirely client-side with zero external analytics, no tracking cookies, and no network calls to third-party services.",
    tag: "Zero-knowledge",
    accent: "bg-[#ebfff8] text-[#9fe7d9]",
    icon: "◌",
  },
  {
    title: "Deterministic Exchange Mathematics",
    description:
      "Point-in-time backtested formulas explicitly mapped to Indonesia Stock Exchange Special Monitoring criteria (Nasional Khusus & PIAL).",
    tag: "Criteria 1 • 11",
    accent: "bg-[#eef6ff] text-[#b6d1ff]",
    icon: "∑",
  },
];

const stats = [
  { label: "Audit Latency", value: "0.000 ms" },
  { label: "Coverage Universe", value: "920+ Tickers" },
  { label: "Board Scope", value: "Main & Dev" },
];

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  const [password, setPassword] = useState("");

  const strength = useMemo(() => {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 10;

    return Math.min(100, score);
  }, [password]);

  const strengthLabel =
    strength < 30
      ? "Weak"
      : strength < 70
        ? "Moderate"
        : "Strong (256-bit hash)";

  const strengthColor =
    strength < 30
      ? "from-[#ff7d5a] to-[#f26a4d]"
      : strength < 70
        ? "from-[#f8b84d] to-[#ff9e53]"
        : "from-[#2fc483] to-[#16a673]";

  return (
    <div className="min-h-screen w-full bg-[#f5f3ee] text-slate-800">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-[#f5f3ee] px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <BrandLogo className="h-10 w-auto" alt="Limina logo" />
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-[#d7d6d4] bg-white/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a]">
                Registration
              </button>
              <button className="rounded-lg border border-[#d7d6d4] bg-white/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a]">
                Free Retail Tier
              </button>
            </div>
          </div>

          <div className="mt-2 flex-1">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f26a4d]">
              Independent Market Intelligence
            </div>

            <h1 className="max-w-105 text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[0.95] tracking-[-0.07em] text-[#0f172a]">
              Create Your Account
            </h1>

            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#536174]">
              Gain immediate access to verified point-in-time suspension models,
              issuer watchlists, and algorithmic lead-time metrics.
            </p>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Full Name
                  </label>
                  <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white/70 px-3 py-3 shadow-sm">
                    <span className="mr-2 text-gray-500">
                      <Circle className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      defaultValue="Raden Arya"
                      className="w-full bg-transparent text-[15px] text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Legal or Pseudonym
                  </label>
                  <div className="rounded-xl border border-[#dfe2ea] bg-white/70 px-3 py-3 shadow-sm">
                    <input
                      type="text"
                      placeholder="Enter your alias"
                      className="w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Email
                  </label>
                  <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white/70 px-3 py-3 shadow-sm">
                    <span className="mr-2 text-gray-500">
                      <Circle className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Password
                  </label>
                  <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white/70 px-3 py-3 shadow-sm">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <span className="ml-2 text-gray-400">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Confirm
                  </label>
                  <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white/70 px-3 py-3 shadow-sm">
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      className="w-full bg-transparent text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <span className="ml-2 text-gray-400">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d788a]">
                  <span>Entropy Strength</span>
                  <span
                    className={
                      strength < 30
                        ? "text-[#f26a4d]"
                        : strength < 70
                          ? "text-[#d98a26]"
                          : "text-[#12a66d]"
                    }
                  >
                    {strengthLabel}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#dfe5e6]">
                  <div
                    className={`h-full rounded-full bg-linear-to-r transition-all duration-500 ease-out ${strengthColor}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>

              <label className="mt-4 flex items-start gap-3 text-sm text-[#526074]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#f26a4d] accent-[#f26a4d]"
                />
                <span>
                  I understand that Limina is a non-advisory mathematical early
                  warning tool and agree to the{" "}
                  <span className="font-semibold text-[#2d6f9d]">
                    Methodology Disclaimer.
                  </span>
                </span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate("otp")}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#101a2b] px-5 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(16,26,43,0.22)] transition hover:bg-[#18273d]"
              >
                Register Account <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-[#4c5d72]">
              <span>Already have an analyst account?</span>
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-medium text-[#2ab38b]"
              >
                Log in →
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#ddd7cf] pt-4 text-[11px] text-[#7a8190]">
            <span>© 2025 Limina Financial Analytics</span>
            <span>Zero Server Footprint</span>
          </div>
        </div>

        <div className="relative hidden lg:flex overflow-hidden bg-[#070d17] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,140,80,0.18),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,118,0,0.15),transparent_30%),linear-gradient(180deg,#070d17_0%,#0d1525_100%)]"></div>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(#f7a45b 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              maskImage:
                "radial-gradient(circle at 50% 50%, black, transparent 85%)",
            }}
          ></div>

          <div className="relative z-10 flex w-full flex-col px-10 xl:px-12 py-12">
            <div className="mb-9 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d5dff5]">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#ff8b5c] text-[8px] text-[#0b1222]">
                <Activity className="h-2.5 w-2.5" />
              </span>
              Retail Protection Protocol
              <span className="text-[#8ea4c7]">// Cluster: IDX-KT-01</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f5f8ff]">
              <span className="rounded bg-[#1b4d3d] px-2 py-1 text-[#73e0b0]">
                Free Forever Tier
              </span>
              <span className="text-[#eb8f6e]">• Sync: Live</span>
            </div>

            <div className="mt-8 max-w-140 text-[3.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white">
              Never be blind-sided by{" "}
              <span className="text-[#ff8d5e]">illiquid</span>
              <span className="block">trading halts again.</span>
            </div>

            <p className="mt-6 max-w-150 text-lg leading-relaxed text-[#a9b8d0]">
              Limina monitors negative equity triggers, Unusual Market Activity
              volume clusters, and public float attrition against IDX listing
              rules before capital gets locked.
            </p>

            <div className="mt-8 space-y-4">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#22314d] bg-[#0d1728]/90 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(138,167,204,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}
                    >
                      <span className="text-xl font-bold">{card.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold text-[#eef5ff]">
                          {card.title}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6ac9ac]">
                          {card.tag}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#a9b8d0]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-155 grid-cols-3 gap-3 rounded-2xl border border-[#213150] bg-[#0b1424] px-4 py-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3c3]">
                    {stat.label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-[#f7a45b]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#1d2d46] pt-5 text-[11px] uppercase tracking-[0.18em] text-[#9ab0d6]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-[#fc9e5f] text-[#fc9e5f]">
                  <Check className="h-2.5 w-2.5" />
                </span>
                Part of Track 03: Market Intelligence • Sectors API Pipeline
              </div>
              <div className="mt-2 font-medium text-[#d4dff7]">
                Limina Kernel v2.4.8-rc • IDX Feeds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
