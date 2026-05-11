import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import profile from "../assets/profile.jpg";

/* ─── CSS ────────────────────────────────────────────────────── */
const NAVBAR_STYLE = `
@keyframes navGradientCycle {
  0%   { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
  16%  { background-image: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%); }
  33%  { background-image: linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%); }
  50%  { background-image: linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%); }
  66%  { background-image: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%); }
  83%  { background-image: linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #a3e635 100%); }
  100% { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
}
.nav-text-cycle {
  background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: navGradientCycle 18s steps(1, end) infinite;
}
`;

/* ─── Per-link accent colors ─────────────────────────────────── */
const links = [
  { to: "/",            label: "Home",         color: "#a78bfa", color2: "#60a5fa" },
  { to: "/about",       label: "About",        color: "#f472b6", color2: "#fb923c" },
  { to: "/projects",    label: "Projects",     color: "#34d399", color2: "#22d3ee" },
  { to: "/certificates",label: "Certificates", color: "#38bdf8", color2: "#6366f1" },
  { to: "/skills",      label: "Skills",       color: "#fbbf24", color2: "#f472b6" },
] as const;

/* ─── Particle data ──────────────────────────────────────────── */
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const PARTICLE_COLORS = ["#a78bfa", "#60a5fa", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#f43f5e", "#38bdf8"];

function useParticleBurst() {
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBursting(true);
    timerRef.current = setTimeout(() => setBursting(false), 650);
  };
  return { bursting, trigger };
}

function ParticleBurst({
  children, className, count = 8, radius = 28, as: Tag = "div", ...props
}: {
  children: React.ReactNode; className?: string; count?: number;
  radius?: number; as?: React.ElementType; [key: string]: any;
}) {
  const { bursting, trigger } = useParticleBurst();
  return (
    <Tag className={`relative ${className ?? ""}`} onMouseEnter={trigger} {...props}>
      {children}
      <AnimatePresence>
        {bursting && PARTICLE_ANGLES.slice(0, count).map((angle, p) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.span
              key={p}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 1.2, x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-50"
              style={{ background: PARTICLE_COLORS[p % PARTICLE_COLORS.length] }}
            />
          );
        })}
      </AnimatePresence>
    </Tag>
  );
}

/* ─── Desktop NavLink ────────────────────────────────────────── */
function DesktopNavLink({
  to, label, color, color2, index, active,
}: {
  to: string; label: string; color: string; color2: string; index: number; active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const show = hovered || active;

  return (
    <div className="relative inline-flex">
      {/* Ripple rings on hover */}
      <AnimatePresence>
        {hovered && [0, 0.1, 0.2].map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.0 + r * 0.35, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 + r * 0.08, delay, ease: "easeOut" }}
            style={{ border: `1.5px solid ${color}`, borderRadius: 999 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={show ? { opacity: 0.35, scale: 1.4 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: color, filter: "blur(10px)", zIndex: 0 }}
      />

      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative z-10 px-3.5 py-2 rounded-full text-sm font-medium overflow-hidden flex items-center"
        style={{
          background: show
            ? `linear-gradient(135deg, ${color}22, ${color2}18)`
            : "transparent",
          border: show
            ? `1px solid ${color}55`
            : "1px solid transparent",
          boxShadow: active
            ? `0 0 0 1px ${color}40, 0 4px 16px -4px ${color}60`
            : "none",
          transition: "background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* Shimmer sweep */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{
                background: `linear-gradient(105deg, transparent 30%, ${color}35 50%, transparent 70%)`,
                borderRadius: 999,
              }}
            />
          )}
        </AnimatePresence>

        {/* Wiggle + lift wrapper */}
        <motion.span
          animate={hovered ? {
            y: -3,
            rotate: [0, -8, 6, -3, 0],
            transition: {
              y: { type: "spring", stiffness: 400, damping: 14 },
              rotate: { duration: 0.38, ease: "easeInOut" },
            },
          } : { y: 0, rotate: 0 }}
          className="relative z-10"
          style={{
            display: "inline-block",
            backgroundImage: show
              ? `linear-gradient(135deg, ${color}, ${color2})`
              : `linear-gradient(135deg, #a78bfa, #60a5fa)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {label}
        </motion.span>

        {/* Active underline dot */}
        {active && (
          <motion.span
            layoutId="nav-active-dot"
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: `linear-gradient(135deg, ${color}, ${color2})` }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        )}
      </Link>
    </div>
  );
}

/* ─── Mobile NavLink ─────────────────────────────────────────── */
function MobileNavLink({
  to, label, color, color2, index, active, onClick,
}: {
  to: string; label: string; color: string; color2: string;
  index: number; active: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <ParticleBurst count={6} radius={20} as="div" className="block">
      <Link
        to={to}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center px-4 py-3 rounded-xl text-sm font-medium overflow-hidden"
        style={{
          border: active
            ? `1px solid ${color}50`
            : "1px solid transparent",
          transition: "border 0.2s ease",
        }}
      >
        {/* Background fill — aktif ATAU hover */}
        <motion.span
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={
            active
              ? { opacity: 1, scaleX: 1 }
              : hovered
              ? { opacity: 0.7, scaleX: 1 }
              : { opacity: 0, scaleX: 0.85 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}30, ${color2}20)`,
            transformOrigin: "left",
          }}
        />

        {/* Shimmer on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute inset-0 pointer-events-none rounded-xl"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              style={{ background: `linear-gradient(105deg, transparent 30%, ${color}30 50%, transparent 70%)` }}
            />
          )}
        </AnimatePresence>

        {/* Active left bar — thin indicator only */}
        {active && (
          <motion.span
            layoutId="mobile-active-bar"
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
            style={{ background: `linear-gradient(to bottom, ${color}, ${color2})` }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        )}

        {/* Label — gradient on hover, muted when just active */}
        <motion.span
          animate={hovered ? {
            x: 4,
            rotate: [0, -5, 4, -2, 0],
            transition: {
              x: { type: "spring", stiffness: 350, damping: 16 },
              rotate: { duration: 0.35, ease: "easeInOut" },
            },
          } : { x: active ? 6 : 0, rotate: 0 }}
          className="relative z-10 font-medium"
          style={{
            display: "inline-block",
            backgroundImage: hovered
              ? `linear-gradient(135deg, ${color}, ${color2})`
              : active
              ? `linear-gradient(135deg, ${color}cc, ${color2}99)`
              : `linear-gradient(135deg, rgba(167,139,250,0.6), rgba(96,165,250,0.6))`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {label}
        </motion.span>
      </Link>
    </ParticleBurst>
  );
}

/* ── Animated hamburger icon ── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between relative">
      <motion.span
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="block h-0.5 w-full rounded-full"
        style={{ background: open ? "var(--neon)" : "currentColor" }}
      />
      <motion.span
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
        className="block h-0.5 w-full rounded-full"
        style={{ background: open ? "var(--neon)" : "currentColor" }}
      />
      <motion.span
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="block h-0.5 w-full rounded-full"
        style={{ background: open ? "var(--neon)" : "currentColor" }}
      />
    </div>
  );
}

export function Navbar() {
  const { location } = useRouterState();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [hamHovered, setHamHovered] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4">
      <style>{NAVBAR_STYLE}</style>

      <nav className="glass mx-auto max-w-6xl flex items-center justify-between rounded-full px-4 py-2.5">

        {/* ── LEFT: Profile photo + name ── */}
        <div className="flex items-center gap-3">
          <ParticleBurst count={8} radius={26} className="flex-shrink-0">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  boxShadow: "0 0 0 2px color-mix(in oklab, var(--neon) 60%, transparent), 0 0 12px color-mix(in oklab, var(--neon) 30%, transparent)",
                }}
              >
                <img src={profile} alt="Hairil Ikhsan" className="w-full h-full object-cover" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </motion.div>
            </Link>
          </ParticleBurst>

          <ParticleBurst count={6} radius={22} className="hidden sm:block leading-none">
            <Link to="/" className="block">
              <span className="nav-text-cycle font-bold text-sm" style={{ display: "block", lineHeight: 1.2 }}>
                Hairil Ikhsan S.Kom
              </span>
              <span
                className="nav-text-cycle text-[10px]"
                style={{ display: "block", marginTop: 2, animationDelay: "-6s", opacity: 0.75 }}
              >
                Tech Enthusiast
              </span>
            </Link>
          </ParticleBurst>
        </div>

        {/* ── CENTER: Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l, i) => (
            <DesktopNavLink
              key={l.to}
              to={l.to}
              label={l.label}
              color={l.color}
              color2={l.color2}
              index={i}
              active={location.pathname === l.to}
            />
          ))}
        </div>

        {/* ── RIGHT: Theme toggle + hamburger ── */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLight((v) => !v)}
            className="p-2 rounded-full hover:bg-secondary transition"
            aria-label="Toggle theme"
          >
            {light ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          {/* Hamburger — clean, no colored fill, just a subtle ring on hover */}
          <motion.button
            className="md:hidden p-2 rounded-full relative transition-all duration-200"
            onClick={() => setOpen((v) => !v)}
            onHoverStart={() => setHamHovered(true)}
            onHoverEnd={() => setHamHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            aria-label="Menu"
            style={{
              background: "transparent",
              border: hamHovered
                ? "1px solid color-mix(in oklab, var(--neon) 45%, transparent)"
                : "1px solid transparent",
              boxShadow: hamHovered
                ? "0 0 12px color-mix(in oklab, var(--neon) 30%, transparent)"
                : "none",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            <HamburgerIcon open={open} />
          </motion.button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, scale: 0.96, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="md:hidden mx-auto max-w-6xl mt-2 rounded-2xl p-2 flex flex-col overflow-hidden relative"
            style={{
              background: "color-mix(in oklab, var(--card) 75%, transparent)",
              backdropFilter: "blur(24px) saturate(160%)",
              border: "1px solid color-mix(in oklab, var(--neon) 20%, transparent)",
              boxShadow: "0 8px 40px -8px color-mix(in oklab, var(--neon) 25%, transparent)",
            }}
          >
            {/* Subtle top accent line */}
            <motion.div
              className="absolute top-0 left-4 right-4 h-px rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ background: "linear-gradient(90deg, transparent, var(--neon), var(--neon-2), transparent)" }}
            />

            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -28, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  x: -20,
                  filter: "blur(4px)",
                  transition: { duration: 0.15, delay: (links.length - 1 - i) * 0.04 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 26,
                  delay: i * 0.06,
                }}
              >
                <MobileNavLink
                  to={l.to}
                  label={l.label}
                  color={l.color}
                  color2={l.color2}
                  index={i}
                  active={location.pathname === l.to}
                  onClick={() => setOpen(false)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
