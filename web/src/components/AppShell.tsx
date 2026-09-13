import { Moon, Sun } from "lucide-react";
import { type ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import { useTheme } from "../context/ThemeContext";

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
};

/** Shared sidebar + layout shell for all authenticated app pages. */
const AppShell = ({
  children,
  sidebarOpen,
  onSidebarOpen,
  onSidebarClose,
  navItems,
}: AppShellProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#f3f2ef] dark:bg-[#13141a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Mobile hamburger */}
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

        {/* Overlay */}
        <div
          className={[
            "fixed inset-0 z-30 bg-slate-950/25 dark:bg-slate-950/60 transition-opacity lg:hidden",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={onSidebarClose}
        />

        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-[#d8d3cd] dark:border-slate-700 bg-[#f3f2ef] dark:bg-[#13141a] px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <div className="mb-12 flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <BrandLogo className="h-8 w-auto" alt="Limina logo" />
              <span className="rounded bg-[#eae5de] dark:bg-slate-700 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#5f6875] dark:text-slate-400">
                IDX Monitor
              </span>
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              {/* Theme toggle inside mobile sidebar */}
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

          {/* Theme toggle — desktop sidebar bottom */}
          <div className="mt-8 hidden lg:block">
            <button
              type="button"
              id="theme-toggle-sidebar"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg border border-[#d8d3cd] dark:border-slate-700 bg-[#f7f5f3] dark:bg-slate-800 px-3 py-2.5 text-sm font-medium text-[#465267] dark:text-slate-400 transition hover:bg-[#ece8e3] dark:hover:bg-slate-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-5 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
