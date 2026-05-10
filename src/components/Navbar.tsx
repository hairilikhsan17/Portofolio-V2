import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/certificates", label: "Certificates" },
  { to: "/skills", label: "Skills" },
] as const;

export function Navbar() {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <nav className="glass mx-auto max-w-6xl flex items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="font-bold text-lg">
          <span className="text-gradient">Hairil</span>.dev
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  active
                    ? "bg-[color-mix(in_oklab,var(--neon)_20%,transparent)] text-foreground glow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLight((v) => !v)}
            className="p-2 rounded-full hover:bg-secondary transition"
            aria-label="Toggle theme"
          >
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            className="md:hidden p-2 rounded-full hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden glass mx-auto max-w-6xl mt-2 rounded-2xl p-3 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl hover:bg-secondary text-sm"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
