import { Moon, Sun, User } from "lucide-react";
import { type ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import type { View } from "../App";

type AppShellItem = {
  label: string;
  icon: React.ElementType;
  view: string;
  active?: boolean;
  onClick: () => void;
};

type AppShellProps = {
  children: ReactNode;
  sidebarOpen: boolean;
  onSidebarOpen: () => void;
  onSidebarClose: () => void;
  navItems: AppShellItem[];
  onNavigate?: (view: View) => void;
  currentView?: View;
};

const AppShell = ({
  children,
  sidebarOpen,
  onSidebarOpen,
  onSidebarClose,
  navItems,
  onNavigate,
  currentView,
}: AppShellProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0] ?? "")
      .join("")
      .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User Profile";
  const displayEmail = user?.email || "Investor / Analyst";

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="flex min-h-screen">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onSidebarOpen}
          className="fixed left-4 top-4 z-40 inline-flex items-center justify-center rounded-lg border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 p-3 shadow-sm lg:hidden"
        >
          <svg className="h-5 w-5 text-[#1f2937] dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          className={[
            "fixed inset-0 z-30 bg-slate-950/25 dark:bg-slate-950/60 transition-opacity lg:hidden",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={onSidebarClose}
        />

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-[#d8d3cd] dark:border-slate-700 bg-[#f3f2ef] dark:bg-[#13141a] px-5 py-6 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:shrink-0 flex flex-col justify-between",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <div>
            <div className="mb-10 flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-3">
                <BrandLogo className="h-8 w-auto" alt="Limina logo" />
                <span className="rounded bg-[#eae5de] dark:bg-slate-700 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5f6875] dark:text-slate-400">
                  IDX Monitor
                </span>
              </div>

              <div className="flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={onSidebarClose}
                  className="inline-flex items-center justify-center rounded-lg p-2"
                >
                  <svg className="h-5 w-5 text-[#1f2937] dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ label, icon: Icon, onClick, active }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={[
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[1.05rem] font-medium transition",
                    active
                      ? "bg-[#e7e3df] dark:bg-slate-700 text-[#111827] dark:text-slate-100 shadow-inner"
                      : "text-[#465267] dark:text-slate-400 hover:bg-[#ece8e3] dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d8d3cd]/70 dark:border-slate-800 space-y-2.5">
            {onNavigate && (
              <button
                type="button"
                id="sidebar-profile-button"
                onClick={() => {
                  onSidebarClose();
                  onNavigate("profile");
                }}
                className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition shadow-2xs group ${currentView === "profile"
                    ? "border-[#f26a4d] bg-[#fdf5f2] dark:bg-slate-700/80 ring-1 ring-[#f26a4d]/30"
                    : "border-[#d8d3cd] dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#f26a4d]/60 hover:bg-[#ece8e3] dark:hover:bg-slate-700"
                  }`}
                title="Buka Halaman Profile"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#f26a4d]/15 text-[#f26a4d] font-bold text-xs">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold text-[#111827] dark:text-slate-100 flex items-center gap-1.5">
                    <span className="truncate">{displayName}</span>
                  </div>
                  <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {displayEmail}
                  </div>
                </div>
                <User className="h-4 w-4 text-slate-400 group-hover:text-[#f26a4d] transition-colors flex-shrink-0" />
              </button>
            )}

            <button
              type="button"
              id="theme-toggle-sidebar"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-3 py-2 text-xs font-medium text-[#465267] dark:text-slate-400 transition hover:bg-[#ece8e3] dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 px-4 py-5 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
