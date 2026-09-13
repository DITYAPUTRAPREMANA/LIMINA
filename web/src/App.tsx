import { useState } from "react";
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

type View =
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

function App() {
  const [view, setView] = useState<View>("home");

  if (view === "register") {
    return <RegisterPage onNavigate={setView} />;
  }

  if (view === "login") {
    return <LoginPage onNavigate={setView} />;
  }

  if (view === "otp") {
    return <EmailOtpPage onNavigate={setView} />;
  }

  if (view === "not-found") {
    return <NotFoundPage onNavigate={setView} />;
  }

  if (view === "success") {
    return <SuccessPage onNavigate={setView} />;
  }

  if (view === "dashboard") {
    return <DashboardPage onNavigate={setView} />;
  }

  if (view === "search") {
    return <SearchPage onNavigate={setView} />;
  }

  if (view === "evidence") {
    return <EvidencePage onNavigate={setView} />;
  }

  if (view === "methodology") {
    return <MethodologyPage onNavigate={setView} />;
  }

  if (view === "profile") {
    return <ProfilePage onNavigate={setView} />;
  }

  if (view === "forgot-password") {
    return <ForgotPasswordPage onNavigate={setView} />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
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
}

export default App;
