import { ArrowRight, LayoutDashboard, Menu, Moon, Sun, User, X } from "lucide-react";
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
    { label: "Methodology", href: "#methodology" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Risk Rankings", href: "#rankings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <BrandLogo className="h-8 w-auto" alt="LIMINA logo" />
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 lg:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-slate-900 dark:hover:text-slate-100"
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
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform duration-300 rotate-0" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 rotate-0" />
            )}
          </button>

          {session ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 rounded-lg bg-[#f26a4d] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#f26a4d]/20 transition-all hover:bg-[#d95e39]"
              >
                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => onNavigate("profile")}
                className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <User className="h-4 w-4 text-[#f26a4d]" /> Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-violet-500"
            >
              Launch App <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {/* Theme toggle — mobile */}
          <button
            type="button"
            id="theme-toggle-mobile"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition-all"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMenuOpen(false)}
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
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#f26a4d] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#f26a4d]/20"
                >
                  <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigate("profile");
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200"
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
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 dark:bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
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

