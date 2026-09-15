import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { maskEmail, validateOtp } from "../lib/validation";
import { OTP_EMAIL_KEY } from "./Register";
import type { View } from "../App";

type EmailOtpPageProps = {
  onNavigate: (view: View) => void;
};

const RESEND_COOLDOWN_SECONDS = 60;

const EmailOtpPage = ({ onNavigate }: EmailOtpPageProps) => {
  const { verifyEmailOtp, sendMagicLink, resendOtp } = useAuth();

  const [pendingEmail] = useState<string>(() => {
    return sessionStorage.getItem(OTP_EMAIL_KEY) ?? "";
  });

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);
  const [showManualCode, setShowManualCode] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to register if no pending email
  useEffect(() => {
    if (!pendingEmail) {
      onNavigate("register");
    }
  }, [pendingEmail, onNavigate]);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(
      () => setResendCooldown((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [resendCooldown]);

  // Determine webmail link based on email domain
  const getWebmailUrl = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    if (domain.includes("gmail")) return "https://mail.google.com";
    if (domain.includes("outlook") || domain.includes("hotmail"))
      return "https://outlook.live.com";
    if (domain.includes("yahoo")) return "https://mail.yahoo.com";
    return `https://${domain}`;
  };

  // Handle manual digit input
  const handleDigitChange = useCallback((index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  }, []);

  const handleVerifyManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = digits.join("");
    const result = validateOtp(token);
    if (!result.valid) {
      setError(result.error);
      return;
    }

    setLoading(true);
    const { error: authError } = await verifyEmailOtp(pendingEmail, token);
    setLoading(false);

    if (authError) {
      setError(authError);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      return;
    }

    sessionStorage.removeItem(OTP_EMAIL_KEY);
    onNavigate("dashboard");
  };

  const handleResendMagicLink = async () => {
    if (resendCooldown > 0 || resendLoading) return;
    setResendLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Try sending magic link first
    const { error: magicErr } = await sendMagicLink(pendingEmail);
    if (magicErr) {
      // Fallback to resendOtp
      const { error: fallbackErr } = await resendOtp(pendingEmail);
      if (fallbackErr) {
        setError(fallbackErr);
        setResendLoading(false);
        return;
      }
    }

    setResendLoading(false);
    setSuccessMsg("A new sign-in link has been sent to your email!");
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f3ee] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ── Left panel: Magic Link status & actions ── */}
        <div className="flex min-h-screen flex-col bg-[#f5f3ee] dark:bg-[#13141a] px-5 py-6 sm:px-8 md:px-10 xl:px-14">
          <header className="flex items-center justify-between gap-3">
            <BrandLogo className="h-9 w-auto" alt="Limina logo" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2b3c4a] dark:text-slate-300">
                Magic Link
              </span>
              <span className="flex items-center gap-2 rounded-full border border-[#cfe9dd] bg-[#ebfff6] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0f7a59]">
                <span className="h-2 w-2 rounded-full bg-[#25c28a]" />
                Passwordless Auth
              </span>
            </div>
          </header>

          <main className="mt-10 flex flex-1 flex-col justify-center pb-8">
            {/* Tagline */}
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f26a4d]">
              — Instant Verification Link
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-[#111827] dark:text-slate-50 sm:text-5xl">
              Check Your Email
            </h1>

            <p className="mt-4 text-[16px] leading-relaxed text-[#536174] dark:text-slate-400">
              We have sent a <strong>Magic Link</strong> to your email.
              Simply open the email and click the link to immediately sign in to LIMINA without needing a password.
            </p>

            {/* Email destination pill */}
            {pendingEmail && (
              <div className="mt-6 w-full max-w-130 rounded-xl border border-[#dfe2ea] dark:border-slate-700 bg-[#f1f4f5] dark:bg-slate-800/80 px-4 py-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                  <span className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#dff8ee] text-[#1d9d75]">
                      <Check className="h-3 w-3" />
                    </span>
                    Delivery Target
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate("login")}
                    className="text-[#f26a4d] hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <div className="mt-2 text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                  {maskEmail(pendingEmail)}
                </div>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <div
                role="alert"
                className="mt-4 w-full max-w-130 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </div>
            )}

            {successMsg && (
              <div
                role="alert"
                className="mt-4 w-full max-w-130 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
              >
                <Check className="h-4 w-4 shrink-0" />
                {successMsg}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-8 w-full max-w-130 space-y-3">
              {/* Primary: Open Webmail */}
              <a
                href={getWebmailUrl(pendingEmail)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f26a4d] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f26a4d]/25 transition hover:bg-[#d95e39] active:scale-[0.99]"
              >
                <Mail className="h-4 w-4" />
                Open Email Client
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              </a>

              {/* Secondary: Resend Link */}
              <button
                type="button"
                onClick={handleResendMagicLink}
                disabled={resendCooldown > 0 || resendLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe2ea] dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-50"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending New Link...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {resendCooldown > 0
                      ? `Resend Link (${resendCooldown}s)`
                      : "Resend Magic Link"}
                  </>
                )}
              </button>
            </div>

            {/* Optional Fallback: Manual 6-digit Code */}
            <div className="mt-8 w-full max-w-130 border-t border-slate-200 dark:border-slate-800 pt-6">
              {!showManualCode ? (
                <button
                  type="button"
                  onClick={() => setShowManualCode(true)}
                  className="flex items-center gap-2 text-xs font-semibold text-[#6d788a] dark:text-slate-400 hover:text-[#f26a4d] transition"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Received a 6-digit code in your email? Enter code manually
                </button>
              ) : (
                <form onSubmit={handleVerifyManual} className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#6d788a]">
                    <span>Enter 6-Digit Code</span>
                    <button
                      type="button"
                      onClick={() => setShowManualCode(false)}
                      className="text-xs text-[#f26a4d] hover:underline normal-case"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        aria-label={`Digit ${index + 1}`}
                        className="h-14 rounded-xl border border-[#dfe2ea] dark:border-slate-600 bg-white dark:bg-slate-800 text-center text-xl font-semibold text-slate-700 dark:text-slate-200 outline-none transition focus:border-[#f26a4d] focus:ring-2 focus:ring-[#f26a4d]/20"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || digits.join("").length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-700 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Back to Login */}
            <div className="mt-8 text-center text-xs text-slate-500 w-full max-w-130">
              Already verified or want to try another method?{" "}
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="font-bold text-[#f26a4d] hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </main>
        </div>

        {/* ── Right panel: Visual decoration ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#1a1c24] p-12 text-white lg:flex xl:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(#2d3345_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#f26a4d]/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#3b82f6]/15 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-400 backdrop-blur-md">
              Passwordless · PKCE Flow
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-[#25c28a]" />
              End-to-End Encrypted Session
            </div>
          </div>

          <div className="relative z-10 my-auto max-w-lg space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f26a4d]/10 border border-[#f26a4d]/30 text-[#f26a4d]">
              <Mail className="h-8 w-8 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Secure, Instant, Passwordless Authentication.
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              Magic Link uses single-use cryptographic tokens ensuring only the verified email owner can access their LIMINA market intelligence workspace.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "No vulnerable passwords susceptible to credential theft or leaks",
                "One-click automated verification directly from your browser",
                "Encrypted session compliant with enterprise protection standards",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500">
            &copy; 2026 LIMINA · Market Intelligence Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOtpPage;
