import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type EmailOtpPageProps = {
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
      | "methodology",
  ) => void;
};

const otpDigits = ["4", "8", "1", "9", "", ""];

const EmailOtpPage = ({ onNavigate }: EmailOtpPageProps) => {
  return (
    <div className="min-h-screen w-full bg-[#f5f3ee] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex min-h-screen flex-col bg-[#f5f3ee] dark:bg-[#13141a] px-5 py-6 sm:px-8 md:px-10 xl:px-14">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center">
              <BrandLogo className="h-9 w-auto" alt="Limina logo" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2b3c4a]">
                Verification
              </span>
              <span className="flex items-center gap-2 rounded-full border border-[#cfe9dd] bg-[#ebfff6] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0f7a59]">
                <span className="h-2 w-2 rounded-full bg-[#25c28a]" />
                Secure Auth Session
              </span>
            </div>
          </header>

          <main className="mt-14 flex flex-1 flex-col justify-center pb-8">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f26a4d]">
              — Two-factor Identity Protocol
            </div>

            <h1 className="max-w-105t-4xl font-semibold leading-[0.95] tracking-[-0.07em] text-[#111827] dark:text-slate-50 sm:text-5xl xl:text-[3.7rem]">
              Verify Your Email
            </h1>

            <p className="mt-4 max-w-130t-[17px] leading-relaxed text-[#536174]">
              We&apos;ve dispatched a 6-digit cryptographic verification token
              to your registered address. Enter the code below to activate your
              analyst access.
            </p>

            <div className="mt-8 w-full max-w-130nded-xl border border-[#dfe2ea] dark:border-slate-600 bg-[#f1f4f5] dark:bg-slate-800 px-3 py-3 shadow-sm">
              <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                <span className="flex items-center gap-2 text-[#6d788a]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#dff8ee] text-[#1d9d75]">
                    <Check className="h-3 w-3" />
                  </span>
                  Destination Endpoint
                </span>
                <span className="text-[#f26a4d]">Wrong email? Edit</span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[15px] font-medium text-slate-700">
                <span className="text-[#2c4a5f]">arya.investor@gmail.com</span>
              </div>
            </div>

            <div className="mt-8 w-full max-w-130">
              <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                <span>Authentication Passcode</span>
                <span>6-digit numeric</span>
              </div>

              <div className="grid grid-cols-6 gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    defaultValue={digit}
                    className={`h-16 rounded-xl border bg-white text-center text-2xl font-semibold text-slate-700 outline-none transition focus:border-[#2f6ef4] focus:ring-2 focus:ring-[#2f6ef4]/20 ${
                      index === 4 || index === 5
                        ? "border-[#d8dfe9] bg-white/90"
                        : "border-[#dfe2ea]"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[12px] text-[#6d788a]">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f3f5f7] text-[#8895a6]">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  Code expires in: 04:42
                </span>
                <button type="button" className="font-medium text-[#f26a4d]">
                  Resend Code (42s)
                </button>
              </div>
            </div>

            <div className="mt-6 w-full max-w-[520px] rounded-xl border border-[#dfe2ea] bg-white/40 px-4 py-3 text-sm text-[#4c5d72] shadow-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#d5dfe5] bg-[#eef3f7] text-[#7d8ca0]">
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  Tokens are time-locked and cryptographically bound to your
                  current browser session. Never disclose this code to anyone.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="mt-8 flex w-full max-w-[520px] items-center justify-center gap-3 rounded-xl bg-[#101a2b] px-5 py-4 text-lg font-semibold text-white shadow-[0_12px_30px_rgba(16,26,43,0.22)] transition hover:bg-[#18273d]"
            >
              Confirm &amp; Enter Dashboard <ArrowRight className="h-5 w-5" />
            </button>

            <div className="mt-6 flex w-full max-w-[520px] items-center justify-between text-sm text-[#4c5d72]">
              <button
                type="button"
                onClick={() => onNavigate("register")}
                className="font-medium text-[#2a3547]"
              >
                ← Back to Registration
              </button>
              <button type="button" className="font-medium text-[#4d5c72]">
                Use Hardware Key instead
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
              Identity Federation
              <span className="text-[#8ea4c7]">// Cluster: IDX-JKT-01</span>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9ad6c0]">
              <span className="rounded-md border border-[#2b9f7a] bg-[#0e1e1b] px-2 py-1 text-[#98f0c7]">
                Encryption: AES-GCM-256
              </span>
              <span className="text-[#8ea4c7]">• Sync: Active</span>
            </div>

            <div className="mt-10 flex items-center gap-2 rounded-full border border-[#f7a15d]/50 bg-[#20160d] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f7b364]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Zero-Trust Retail Defense
            </div>

            <h2 className="mt-8 max-w-[580px] text-[3.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white xl:text-[3.4rem]">
              Protecting your portfolio with mathematical rigor.
            </h2>

            <p className="mt-5 max-w-[600px] text-lg leading-relaxed text-[#a9b8d0]">
              Limina executes deterministic market-suspension modeling inside
              isolated browser memory. Confirmation of your primary endpoint
              guarantees exclusive custody of early alerts.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Instant Activation",
                  detail:
                    "Upon verification, your workspace unlocks instant point-in-time scanning across all IDX listed equities without server latency.",
                  tag: "920+ Tickers",
                  icon: "⚡",
                  accent: "bg-[#1f2d3d] text-[#c7d9ff]",
                },
                {
                  title: "FIDO2 & TOTP Compatibility",
                  detail:
                    "Pair physical YubiKeys or offline authenticator applications in Settings to enforce stronger biometrics for all session refreshes.",
                  tag: "Hardware Ready",
                  icon: "🔐",
                  accent: "bg-[#183b31] text-[#9fe7d9]",
                },
                {
                  title: "Client-Side Zero Query Telemetry",
                  detail:
                    "Calculations operate locally on pre-compiled WASM binaries. Your watchlists, open positions, and queries are never logged off-device.",
                  tag: "WASM Enclave",
                  icon: "🛰️",
                  accent: "bg-[#1b2c46] text-[#b8c9ff]",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#23314f] bg-[#0d1728]/90 px-4 py-4 shadow-[inset_0_0_0_1px_rgba(138,167,204,0.08)]"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[15px] font-semibold text-[#eef5ff]">
                          {item.title}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8ea4c7]">
                          {item.tag}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#a9b8d0]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid max-w-[620px] grid-cols-3 gap-3 rounded-2xl border border-[#213150] bg-[#0b1424] px-4 py-4 text-left">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3c3]">
                  Disp. SLA
                </div>
                <div className="mt-2 text-[30px] font-semibold text-[#ffc77f]">
                  142 ms
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3c3]">
                  Cipher Suite
                </div>
                <div className="mt-2 text-[30px] font-semibold text-[#ffc77f]">
                  TLS 1.3
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa3c3]">
                  Auth Level
                </div>
                <div className="mt-2 text-[30px] font-semibold text-[#49e2a5]">
                  2- Tier
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#1d2d46] pt-5 text-[11px] uppercase tracking-[0.18em] text-[#9ab0d6]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-[#fe9e63] text-[#fe9e63]">
                  <Check className="h-2.5 w-2.5" />
                </span>
                Part of Track 03: Market Intelligence • Secure Gateway Auth
              </div>
              <div className="mt-2 font-medium text-[#d4dff7]">
                Limina Kernel v2.4.8-rc • IDX Feeds
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EmailOtpPage;
