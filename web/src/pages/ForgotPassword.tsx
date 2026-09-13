import { ArrowRight, Check, Mail, RotateCcw } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type ForgotPasswordPageProps = {
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
      | "profile"
      | "forgot-password",
  ) => void;
};

const ForgotPasswordPage = ({ onNavigate }: ForgotPasswordPageProps) => {
  return (
    <div className="min-h-screen w-full bg-[#f2f1ee] text-slate-800">
      <header className="flex items-center justify-between border-b border-[#dfe4ea] bg-[#f2f1ee] px-5 py-4 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-9 w-auto" alt="Limina logo" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#f26a4d]">
            Recovery Gate
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1f2d3d] transition hover:text-[#f26a4d]"
        >
          <span className="text-base">←</span>
          Back to Login
        </button>
      </header>

      <main className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-stretch lg:justify-center lg:gap-8 lg:py-16">
        <section className="w-full max-w-[520px] rounded-2xl border border-[#dfe4ea] bg-[#f8f7f5] p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f4b28f] bg-[#fff3ea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d26c3d]">
            Step 1: Request Recovery
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#fff2eb] text-[#f26a4d] shadow-inner ring-1 ring-[#f8d5c3]">
            <Mail className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-[#101827]">
            Forgot Password
          </h1>

          <p className="mt-4 max-w-[420px] text-[1.05rem] leading-relaxed text-[#546176]">
            Enter your registered email address below. We&apos;ll send you an
            encrypted, time-stamped recovery link to reset your account
            credentials.
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
              Account Email
            </label>
            <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 shadow-sm">
              <span className="mr-2 text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                defaultValue="retail.analyst@limina.market"
                className="w-full bg-transparent text-[15px] text-slate-700 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0c1526] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(12,21,38,0.18)] transition hover:bg-[#17253d]"
          >
            Send Reset Link <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-6 rounded-xl border border-[#cfe7dd] bg-[#ebfff7] p-3 text-sm text-[#1f7d5d]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#1db77b] text-white">
                <Check className="h-3 w-3" />
              </span>
              <span>
                Reset Link Dispatched: Check your inbox for the authorization
                token (expires in 15 minutes).
              </span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 text-sm text-[#4f5f75]">
            <span>Remembered your password?</span>
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="font-semibold text-[#f26a4d] transition hover:text-[#d95e39]"
            >
              Log in now
            </button>
          </div>
        </section>

        <section className="w-full max-w-[520px] rounded-2xl border border-[#dfe4ea] bg-[#f8f7f5] p-5 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d3e1ee] bg-[#edf4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d6f9a]">
            Step 2: Set New Password
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#eef5ff] text-[#4d6f9a] shadow-inner ring-1 ring-[#d7e2f4]">
            <RotateCcw className="h-7 w-7" />
          </div>

          <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.07em] text-[#101827]">
            Reset Password
          </h2>

          <p className="mt-4 max-w-[420px] text-[1.05rem] leading-relaxed text-[#546176]">
            Create a strong, new password for your Limina account. Must contain
            at least 8 characters including letters and symbols.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                New Password
              </label>
              <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 shadow-sm">
                <span className="mr-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  defaultValue="**************"
                  className="w-full bg-transparent text-[15px] text-slate-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#6d788a]">
                Confirm New Password
              </label>
              <div className="flex items-center rounded-xl border border-[#dfe2ea] bg-white px-3 py-3 shadow-sm">
                <span className="mr-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  defaultValue="**************"
                  className="w-full bg-transparent text-[15px] text-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#d6e8d9] bg-[#ebfff7] p-3 text-sm text-[#1d7e5d]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#22a56d] text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span>Minimum 8 characters</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#22a56d] text-white">
                  <Check className="h-3 w-3" />
                </span>
                <span>Contains number or symbol</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(180deg,#f48e62_0%,#f26a4d_100%)] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(242,106,77,0.25)] transition hover:brightness-105"
            >
              Save Password <Check className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-7 text-center text-sm text-[#536174]">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="font-medium text-[#1f2d3d] transition hover:text-[#f26a4d]"
            >
              Cancel and Return to Rankings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;
