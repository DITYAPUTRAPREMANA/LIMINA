import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { isSupabaseConfigured } from "./lib/supabase";
import Navbar from "./pages/Home/Navbar";
import HeroSection from "./pages/Home/HeroSection";
import VisionSection from "./pages/Home/VisionSection";
import MethodologySection from "./pages/Home/MethodologySection";
import CaseStudiesSection from "./pages/Home/CaseStudiesSection";
import RankingsSection from "./pages/Home/RankingsSection";
import { CTASection, FooterSection } from "./pages/Home/CtaFooter";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import EmailOtpPage from "./pages/EmailOtp";
import NotFoundPage from "./pages/NotFound";
import SuccessPage from "./pages/Success";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import EvidencePage from "./pages/Evidence";
import MethodologyPage from "./pages/Methodology";
import ProfilePage from "./pages/Profile";
import ForgotPasswordPage from "./pages/ForgotPassword";

export type View =
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
  | "forgot-password";

const PROTECTED_VIEWS: View[] = [
  "dashboard",
  "search",
  "evidence",
  "methodology",
  "profile",
];

function AppInner() {
  const { session, loading } = useAuth();

  // Detect if we arrived via a password reset link
  const isPasswordReset =
    typeof window !== "undefined" &&
    (window.location.search.includes("reset=true") ||
      window.location.hash.includes("type=recovery"));

  // Detect if user arrived via magic link / email confirmation callback
  const isAuthCallback =
    typeof window !== "undefined" &&
    (window.location.search.includes("code=") ||
      window.location.search.includes("token_hash=") ||
      window.location.hash.includes("access_token") ||
      window.location.hash.includes("type=magiclink") ||
      window.location.hash.includes("type=signup"));

  const [view, setView] = useState<View>(() => {
    if (isPasswordReset) return "forgot-password";
    if (isAuthCallback) return "dashboard";
    return "home";
  });

  // Auto-navigate to dashboard as soon as session is ready after clicking magic link
  useEffect(() => {
    if (session) {
      // If we have auth callback params in URL, clean them and go to dashboard
      const hasAuthParams =
        window.location.search.includes("code=") ||
        window.location.search.includes("token_hash=") ||
        window.location.hash.includes("access_token") ||
        window.location.hash.includes("type=magiclink") ||
        window.location.hash.includes("type=signup");

      if (hasAuthParams) {
        // Clean URL to keep it pristine and prevent re-evaluating tokens
        window.history.replaceState(null, "", window.location.pathname);
        setView("dashboard");
      } else if (view === "login" || view === "register" || view === "otp") {
        // Already authenticated, no need to stay on auth pages
        setView("dashboard");
      }
    }
  }, [session, view]);

  const navigate = (nextView: View) => {
    if (PROTECTED_VIEWS.includes(nextView) && !session) {
      setView("login");
      return;
    }
    setView(nextView);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ee] dark:bg-[#13141a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f26a4d] border-t-transparent" />
      </div>
    );
  }

  const setupBanner = !isSupabaseConfigured && (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t-4 border-[#f26a4d] bg-[#0f172a] px-4 py-4 shadow-2xl"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f26a4d] text-white text-lg font-black">
          !
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#f26a4d]">
            Supabase Belum Dikonfigurasi
          </div>
          <p className="mt-1 text-sm text-slate-300">
            Edit file <code className="rounded bg-slate-700 px-1.5 py-0.5 text-[#f9a15d] font-mono text-xs">.env</code> di folder{" "}
            <code className="rounded bg-slate-700 px-1.5 py-0.5 text-[#f9a15d] font-mono text-xs">web/</code> dan isi{" "}
            <code className="rounded bg-slate-700 px-1.5 py-0.5 text-[#f9a15d] font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{" "}
            dari <strong className="text-white">Supabase Dashboard → Settings → API</strong>.
            Setelah disimpan, refresh halaman ini.
          </p>
          <p className="mt-1.5 text-xs text-slate-500">
            Auth (login/register/OTP) tidak akan berfungsi sampai konfigurasi selesai. Halaman publik tetap bisa dilihat.
          </p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    if (view === "register") return <RegisterPage onNavigate={navigate} />;
    if (view === "login") return <LoginPage onNavigate={navigate} />;
    if (view === "otp") return <EmailOtpPage onNavigate={navigate} />;
    if (view === "not-found") return <NotFoundPage onNavigate={navigate} />;
    if (view === "success") return <SuccessPage onNavigate={navigate} />;

    if (view === "dashboard") {
      if (!session) { navigate("login"); return null; }
      return <DashboardPage onNavigate={navigate} />;
    }
    if (view === "search") {
      if (!session) { navigate("login"); return null; }
      return <SearchPage onNavigate={navigate} />;
    }
    if (view === "evidence") {
      if (!session) { navigate("login"); return null; }
      return <EvidencePage onNavigate={navigate} />;
    }
    if (view === "methodology") {
      if (!session) { navigate("login"); return null; }
      return <MethodologyPage onNavigate={navigate} />;
    }
    if (view === "profile") {
      if (!session) { navigate("login"); return null; }
      return <ProfilePage onNavigate={navigate} />;
    }
    if (view === "forgot-password") return <ForgotPasswordPage onNavigate={navigate} />;

    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-100 selection:text-red-900 transition-colors duration-300">
        <Navbar onNavigate={setView} />
        <HeroSection />
        <VisionSection />
        <MethodologySection />
        <CaseStudiesSection />
        <RankingsSection />
        <CTASection />
        <FooterSection />
      </div>
    );
  };

  return (
    <>
      {renderPage()}
      {setupBanner}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
