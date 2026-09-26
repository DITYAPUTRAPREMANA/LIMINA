import {
  ArrowRight,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import BrandLogo from "../../components/BrandLogo";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import type { View } from "../../App";

type NavbarProps = {
  onNavigate: (view: View) => void;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { session } = useAuth();

  const menuItems = [
    { label: "Home", href: "#" },
    { label: "Our Vision", href: "#vision" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Risk Rankings", href: "#rankings" },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (!href || href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <BrandLogo className="h-8 w-auto" alt="LIMINA logo" />
          </button>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 lg:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="cursor-pointer transition-colors duration-200 hover:text-red-500 dark:hover:text-red-400 py-1"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {/* Theme toggle — desktop */}
          <button
            type="button"
            id="theme-toggle-desktop"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
            className="cursor-pointer flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-750 shadow-2xs btn-hover-lift"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 text-slate-600" />
            )}
          </button>

          {session ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="cursor-pointer flex items-center gap-2 rounded-xl bg-[#f26a4d] hover:bg-[#d95e39] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#f26a4d]/25 transition-all duration-200 btn-hover-lift"
              >
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="cursor-pointer flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:border-[#f26a4d]/50 hover:bg-slate-50 dark:hover:bg-slate-750 btn-hover-lift shadow-2xs"
              >
                <User className="h-4 w-4 text-[#f26a4d]" /> Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="group cursor-pointer flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-red-500 hover:bg-slate-800 dark:hover:bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg shadow-slate-900/10 dark:shadow-red-500/20 btn-hover-lift"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Theme toggle — mobile */}
          <button
            type="button"
            id="theme-toggle-mobile"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-all shadow-2xs"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 lg:hidden transition-colors duration-300">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </a>
            ))}

            {session ? (
              <div className="mt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate("dashboard");
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-[#f26a4d] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#f26a4d]/20"
                >
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate("profile");
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  <User className="h-4 w-4 text-[#f26a4d]" /> Profile
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate("login");
                }}
                className="cursor-pointer mt-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-red-500 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Launch App <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
