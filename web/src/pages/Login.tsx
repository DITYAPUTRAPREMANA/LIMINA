import { ArrowRight, Check, Circle, Eye, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type LoginPageProps = {
  onNavigate: (
    view:
      | "home"
      | "register"
      | "login"
      | "otp"
      | "not-found"
      | "success"
      | "dashboard"
      | "search"
      | "evidence"
      | "methodology"
      | "forgot-password",
  ) => void;
};

const riskBars = [
  { value: 12, color: "bg-[#b6c6d8]", label: "BBCA", tone: "normal" },
  { value: 45, color: "bg-[#ffb066]", label: "TOTO", tone: "watch" },
  { value: 78, color: "bg-[#ff7d5a]", label: "GOTO", tone: "high" },
  { value: 85, color: "bg-[#ff6b4a]", label: "SRTG", tone: "crit" },
  { value: 92, color: "bg-[#ff5b57]", label: "BUMI", tone: "crit" },
];

const LoginPage = ({ onNavigate }: LoginPageProps) => {
  return (
    <div className="min-h-screen w-full bg-[#f5f3ee] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex min-h-screen flex-col bg-[#f3f2ee] dark:bg-[#13141a] px-5 py-6 sm:px-8 md:px-10 xl:px-14">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center">
              <BrandLogo className="h-9 w-auto" alt="Limina logo" />
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-lg border border-[#d7d6d4] dark:border-slate-600 bg-white/40 dark:bg-slate-800/40 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a] dark:text-slate-300">
                Auth Gateway
              </span>
              <span className="flex items-center gap-2 rounded-full border border-[#d7d6d4] dark:border-slate-600 bg-white/40 dark:bg-slate-800/40 px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a] dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-[#25c28a]" />
                PIT Feed Live
              </span>
            </div>
          </header>

          <main className="mt-14 flex flex-1 flex-col justify-center pb-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f26a4d]">
              — Independent Market Intelligence
            </div>

            <h1 className="max-w-105 text-4xl font-semibold leading-[0.95] tracking-[-0.07em] text-[#111827] dark:text-slate-50 sm:text-5xl xl:text-[3.7rem]">
              Log in to the System
            </h1>

            <p className="mt-4 max-w-130 text-[17px] leading-relaxed text-[#536174] dark:text-slate-400">
              Enter your credentials to access deterministic IDX early warning
              analytics, suspension probability matrices, and live order-flow
              alerts.
            </p>

            <form className="mt-9 w-full max-w-140 space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                  <label htmlFor="email">Analyst Email</label>
                  <span className="text-[#6d788a]">Primary Access Point</span>
                </div>
                <div className="flex items-center rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white/80 dark:bg-slate-800 px-3 py-3 shadow-sm">
                  <span className="mr-2 text-gray-500 dark:text-slate-400">
                    <Circle className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    defaultValue="retail.analyst@limina.market"
                    className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                  <label htmlFor="password">Password</label>
                  <button
                    type="button"
                    onClick={() => onNavigate("forgot-password")}
                    className="text-[#f26a4d] transition hover:text-[#d95e39]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex items-center rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white/80 dark:bg-slate-800 px-3 py-3 shadow-sm">
                  <span className="mr-2 text-gray-500 dark:text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type="password"
                    defaultValue="1234567890"
                    className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none"
                  />
                  <button
                    type="button"
                    className="ml-2 text-slate-400 hover:text-slate-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-[#526074]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-300 text-[#f26a4d] accent-[#f26a4d]"
                />
                <span>Remember session (Deterministic PIT cache)</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0f172a] px-5 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition hover:bg-[#18273d]"
              >
                Enter Dashboard <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-5 w-full max-w-140 rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white/40 dark:bg-slate-800/60 px-4 py-3 text-sm text-[#4c5d72] dark:text-slate-400 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#7db7b8] bg-[#ecfafa] text-[#1e7a73]">
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  Demo Prototype: Click{" "}
                  <span className="font-semibold text-[#111827] dark:text-slate-200">
                    Enter Dashboard
                  </span>{" "}
                  to authenticate and seamlessly view the active RISK Rankings table.
                </span>
              </div>
            </div>

            <div className="mt-8 flex w-full max-w-140 items-center justify-between gap-4 text-sm text-[#4c5d72]">
              <span>Don&apos;t have an analyst account?</span>
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="font-medium text-[#f26a4d] transition hover:text-[#d95e39]"
              >
                Create Account ↗
              </button>
            </div>
          </main>

          <footer className="flex items-center justify-between gap-3 border-t border-[#ddd7cf] dark:border-slate-700 pt-4 text-[11px] text-[#7a8190] dark:text-slate-500">
            <span>© 2025 Lima Financial Analytics</span>
            <span>Zero Server Footprint</span>
          </footer>
        </div>

        <aside className="relative hidden overflow-hidden bg-[#070d17] text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,140,80,0.18),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,118,0,0.15),transparent_30%),linear-gradient(180deg,#070d17_0%,#0d1525_100%)]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(#f7a45b 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              maskImage:
                "radial-gradient(circle at 50% 50%, black, transparent 85%)",
            }}
          />

          <div className="relative z-10 flex w-full flex-col px-10 py-8 xl:px-12 xl:py-10">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d5dff5]">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f9a15d] text-[8px] text-[#0b1222]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0b1222]" />
              </span>
              Cluster // IDX-PWA-Engine
              <span className="text-[#8ea4c7]">// Static Deterministic</span>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ad6c0]">
              <span className="rounded-md border border-[#2b9f7a] bg-[#0e1e1b] px-2 py-1 text-[#98f0c7]">
                Precision 89.4%
              </span>
              <span className="text-[#8ea4c7]">• Sync: Realtime</span>
            </div>

            <div className="mt-10 rounded-md border border-[#2b394d] bg-[#0d1728]/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#f5b96d]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full border border-[#f5b96d] bg-[#f5b96d]" />
                T-30 Day Suspension Radar
              </span>
            </div>

            <h2 className="mt-8 max-w-145 text-[3.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white xl:text-[3.4rem]">
              Continuous mathematical telemetry before official trading halts.
            </h2>

            <p className="mt-5 max-w-150 text-lg leading-relaxed text-[#a9b8d0]">
              Zero black-box ML. Direct 4-factor scoring against IDX Listing
              Rules I-A, I-E, and UMA threshold spikes.
            </p>

            <div className="mt-10 rounded-2xl border border-[#243451] bg-[#0d1728]/95 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(138,167,204,0.08)]">
              <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d5dff5]">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-md bg-[#0c1a2d] text-[#ff9b65]">
                    <span className="h-2 w-2 rounded-sm bg-[#ff9b65]" />
                  </span>
                  Live Risk Proximity Index
                </span>
                <span className="text-[#8ea4c7]">
                  T-minus 14 Days (Nemiand)
                </span>
              </div>

              <div className="mt-6 flex h-36 items-end justify-between gap-3">
                {riskBars.map((bar) => (
                  <div
                    key={bar.label}
                    className="flex flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="flex h-24 w-full items-end justify-center">
                      <div
                        className={`w-full rounded-t-lg ${bar.color}`}
                        style={{ height: `${bar.value}%` }}
                      />
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b8c6df]">
                      {bar.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#a8bad8]">
                <div>
                  <div className="text-[#cfdcf3]">Total Equities</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    924
                  </div>
                  <div className="mt-1 text-[9px] text-[#7faad8]">Tickers</div>
                </div>
                <div>
                  <div className="text-[#cfdcf3]">Active High Risk</div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    14
                  </div>
                  <div className="mt-1 text-[9px] text-[#7faad8]">Issuers</div>
                </div>
                <div>
                  <div className="text-[#cfdcf3]">Audit SLA</div>
                  <div className="mt-2 text-lg font-semibold text-[#3ae1ad]">
                    0.000 ms
                  </div>
                  <div className="mt-1 text-[9px] text-[#7faad8]">
                    Deterministic
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 border-t border-[#1d2d46] pt-5 text-[11px] uppercase tracking-[0.18em] text-[#9ab0d6]">
              <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-[#fe9e63] text-[#fe9e63]">
                <Check className="h-2.5 w-2.5" />
              </span>
              Part of Track 03: Market Intelligence • Sectors API Integration
            </div>
            <div className="mt-2 text-[11px] font-medium text-[#d4dff7]">
              Limina Kernel v2.4.8-rc • IDX Feeds
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LoginPage;
