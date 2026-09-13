import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import BrandLogo from "../../components/BrandLogo";

type NavbarProps = {
  onNavigate: (view: "home" | "register" | "login" | "otp" | "success") => void;
};

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "#" },
    { label: "Our Vision", href: "#vision" },
    { label: "Methodology", href: "#methodology" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Risk Rankings", href: "#rankings" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <BrandLogo className="h-8 w-auto" alt="LIMINA logo" />
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-500 lg:flex">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
          >
            Launch App <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onNavigate("register");
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Launch App <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
