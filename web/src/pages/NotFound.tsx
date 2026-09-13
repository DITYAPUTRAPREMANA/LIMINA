import { ArrowRight, Home } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

type NotFoundPageProps = {
  onNavigate?: (view: "home" | "register" | "login" | "otp") => void;
};

const NotFoundPage = ({ onNavigate }: NotFoundPageProps) => {
  return (
    <div className="min-h-screen w-full bg-[#030d1d] text-white transition-colors duration-300">
      <header className="border-b border-[#112239] bg-[#020d1a] px-6 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-7 w-auto" alt="Limina logo" />

            <div className="rounded border border-[#1b2a3c] bg-[#0a1527] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b3c3db]">
              IDX-EWS Router
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="text-[13px] font-medium text-[#dfe8f6] transition hover:text-white"
          >
            Return to Dashboard <ArrowRight className="ml-1 inline h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative isolate flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-6 py-16 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,99,71,0.18),transparent_26%),radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.2),transparent_60%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[980px] text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2a3d5c] bg-[#0a1728] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#dfe8f6] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ff8a5b]" />
            Error 404 • Route Not Found
          </div>

          <div className="text-[8rem] font-black leading-none tracking-[-0.08em] text-[#e7edf7] sm:text-[11rem] md:text-[13rem]">
            404
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl md:text-[4rem]">
            Requested page does not exist
          </h1>

          <p className="mx-auto mt-6 max-w-[760px] text-base text-[#9aa9bf] sm:text-xl">
            The link you followed may be broken or the page may have been moved,
            removed, or is temporarily unavailable.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#101a2b] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(16,26,43,0.28)] transition hover:bg-[#1a2740]"
            >
              <Home className="h-4 w-4" />
              Return to Dashboard
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("register")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2a3d5c] bg-[#0a1527] px-6 py-3.5 text-base font-semibold text-[#dfe8f6] transition hover:border-[#384f72] hover:text-white"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;
