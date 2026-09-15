import { useMemo, useRef, useState } from "react";
import { Activity, ArrowRight, Check, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordMatch,
} from "../lib/validation";
import type { View } from "../App";

export const OTP_EMAIL_KEY = "limina_pending_otp_email";

type RegisterPageProps = {
  onNavigate: (view: View) => void;
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
      "Point-in-time backtested formulas explicitly mapped to Indonesia Stock Exchange Special Monitoring criteria.",
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
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Ref to prevent double-submit
  const submitting = useRef(false);

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
    strength < 30 ? "Weak" : strength < 70 ? "Medium" : "Strong (256-bit)";
  const strengthColor =
    strength < 30
      ? "from-[#ff7d5a] to-[#f26a4d]"
      : strength < 70
        ? "from-[#f8b84d] to-[#ff9e53]"
        : "from-[#2fc483] to-[#16a673]";

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    const nameResult = validateName(fullName);
    if (!nameResult.valid && nameResult.error) errors.fullName = nameResult.error;

    const emailResult = validateEmail(email);
    if (!emailResult.valid && emailResult.error) errors.email = emailResult.error;

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid && passwordResult.error) errors.password = passwordResult.error;

    const matchResult = validatePasswordMatch(password, confirm);
    if (!matchResult.valid && matchResult.error) errors.confirm = matchResult.error;

    if (!agreed) errors.agreed = "You must accept the terms of use.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    if (submitting.current) return; // prevent double submit
    submitting.current = true;

    setLoading(true);
    const { error: authError } = await signUp(email, password, {
      full_name: fullName,
      alias,
    });
    setLoading(false);
    submitting.current = false;

    if (authError) {
      setError(authError);
      return;
    }

    sessionStorage.setItem(OTP_EMAIL_KEY, email.trim().toLowerCase());
    onNavigate("otp");
  };

  const clearFieldError = (field: string) =>
    setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  return (
    <div className="min-h-screen w-full bg-[#f5f3ee] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="bg-[#f5f3ee] dark:bg-[#13141a] px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <BrandLogo className="h-10 w-auto" alt="Limina logo" />
            <div className="flex items-center gap-3">
              <span className="rounded-lg border border-[#d7d6d4] dark:border-slate-600 bg-white/40 dark:bg-slate-800/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a] dark:text-slate-300">
                Registration
              </span>
              <span className="rounded-lg border border-[#d7d6d4] dark:border-slate-600 bg-white/40 dark:bg-slate-800/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f3b4a] dark:text-slate-300">
                Free Retail Tier
              </span>
            </div>
          </div>

          <div className="mt-2 flex-1">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f26a4d]">
              Independent Market Intelligence
            </div>
            <h1 className="max-w-105 text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[0.95] tracking-[-0.07em] text-[#0f172a] dark:text-slate-50">
              Create Your Account
            </h1>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-[#536174] dark:text-slate-400">
              Gain immediate access to verified point-in-time suspension models,
              issuer watchlists, and algorithmic lead-time metrics.
            </p>

            {/* Global error */}
            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Name row */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Full Name *
                  </label>
                  <div className={`flex items-center rounded-xl border bg-white/70 dark:bg-slate-800 px-3 py-3 shadow-sm ${fieldErrors.fullName ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                    <input
                      id="reg-fullname"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); clearFieldError("fullName"); }}
                      placeholder="Your full name"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {fieldErrors.fullName && <p className="mt-1 text-xs text-red-500">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Alias / Pseudonym
                  </label>
                  <div className="rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white/70 dark:bg-slate-800 px-3 py-3 shadow-sm">
                    <input
                      id="reg-alias"
                      type="text"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                      placeholder="Alias (optional)"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                  Email *
                </label>
                <div className={`flex items-center rounded-xl border bg-white/70 dark:bg-slate-800 px-3 py-3 shadow-sm ${fieldErrors.email ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
              </div>

              {/* Password row */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Password *
                  </label>
                  <div className={`flex items-center rounded-xl border bg-white/70 dark:bg-slate-800 px-3 py-3 shadow-sm ${fieldErrors.password ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                      placeholder="Create password"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                    <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="ml-2 text-gray-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                    Confirm Password *
                  </label>
                  <div className={`flex items-center rounded-xl border bg-white/70 dark:bg-slate-800 px-3 py-3 shadow-sm ${fieldErrors.confirm ? "border-red-400" : "border-[#dfe2ea] dark:border-slate-600"}`}>
                    <input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); clearFieldError("confirm"); }}
                      placeholder="Repeat password"
                      className="w-full bg-transparent text-[15px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400"
                    />
                    <button type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm((v) => !v)} className="ml-2 text-gray-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirm && <p className="mt-1 text-xs text-red-500">{fieldErrors.confirm}</p>}
                </div>
              </div>

              {/* Password strength meter */}
              <div className="pt-1">
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d788a]">
                  <span>Entropy Strength</span>
                  <span className={strength < 30 ? "text-[#f26a4d]" : strength < 70 ? "text-[#d98a26]" : "text-[#12a66d]"}>
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

              {/* Terms */}
              <label className="mt-4 flex items-start gap-3 text-sm text-[#526074] cursor-pointer">
                <input
                  type="checkbox"
                  id="reg-terms"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); clearFieldError("agreed"); }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#f26a4d] accent-[#f26a4d]"
                />
                <span>
                  I understand that Limina is a non-advisory mathematical early warning tool and agree to the{" "}
                  <span className="font-semibold text-[#2d6f9d]">Methodology Disclaimer.</span>
                </span>
              </label>
              {fieldErrors.agreed && <p className="text-xs text-red-500">{fieldErrors.agreed}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-[#101a2b] px-5 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(16,26,43,0.22)] transition hover:bg-[#18273d] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Creating account…</>
                ) : (
                  <>Register Account <ArrowRight className="h-5 w-5" /></>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-[#4c5d72]">
              <span>Already have an analyst account?</span>
              <button type="button" onClick={() => onNavigate("login")} className="font-medium text-[#2ab38b]">
                Log in →
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#ddd7cf] dark:border-slate-700 pt-4 text-[11px] text-[#7a8190] dark:text-slate-500">
            <span>© 2025 Limina Financial Analytics</span>
            <span>TLS 1.3 Encrypted</span>
          </div>
        </div>

        <div className="relative hidden lg:flex overflow-hidden bg-[#070d17] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,140,80,0.18),transparent_28%),radial-gradient(circle_at_70%_20%,rgba(255,118,0,0.15),transparent_30%),linear-gradient(180deg,#070d17_0%,#0d1525_100%)]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: "radial-gradient(#f7a45b 1px, transparent 1px)",
              backgroundSize: "12px 12px",
              maskImage: "radial-gradient(circle at 50% 50%, black, transparent 85%)",
            }}
          />
          <div className="relative z-10 flex w-full flex-col px-10 xl:px-12 py-12">
            <div className="mb-9 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d5dff5]">
              <span className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#ff8b5c] text-[8px] text-[#0b1222]">
                <Activity className="h-2.5 w-2.5" />
              </span>
              Retail Protection Protocol
              <span className="text-[#8ea4c7]">// Cluster: IDX-KT-01</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f5f8ff]">
              <span className="rounded bg-[#1b4d3d] px-2 py-1 text-[#73e0b0]">Free Forever Tier</span>
              <span className="text-[#eb8f6e]">• Sync: Live</span>
            </div>

            <div className="mt-8 max-w-140 text-[3.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white">
              Never be blind-sided by{" "}
              <span className="text-[#ff8d5e]">illiquid</span>
              <span className="block">trading halts again.</span>
            </div>

            <div className="mt-8 space-y-4">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-[#22314d] bg-[#0d1728]/90 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(138,167,204,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.accent}`}>
                      <span className="text-xl font-bold">{card.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold text-[#eef5ff]">{card.title}</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6ac9ac]">{card.tag}</div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#a9b8d0]">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-155 grid-cols-3 gap-3 rounded-2xl border border-[#213150] bg-[#0b1424] px-4 py-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3c3]">{stat.label}</div>
                  <div className="mt-2 text-xl font-semibold text-[#f7a45b]">{stat.value}</div>
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
              <div className="mt-2 font-medium text-[#d4dff7]">Limina Kernel v2.4.8-rc • IDX Feeds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
