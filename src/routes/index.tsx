import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Github, Linkedin, Mail, Instagram, ArrowRight, Download,
} from "lucide-react";
import {
  SiReact, SiNextdotjs, SiLaravel, SiPython, SiDocker, SiTypescript,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { GithubContributions } from "../components/GithubContributions";
import { useIsMobile } from "../hooks/use-mobile";
import profile from "../assets/profile.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Hairil Ikhsan | Full-Stack Developer" },
      { name: "description", content: "Cloud Enthusiast & Full-Stack Developer building modern, scalable web experiences." },
      { property: "og:title", content: "Hairil Ikhsan — Developer Portfolio" },
      { property: "og:description", content: "Modern futuristic portfolio with featured projects and coding history." },
    ],
  }),
  component: HomePage,
});

/* ─── CSS injected once ──────────────────────────────────────── */
const HOME_STYLE = `
@keyframes homeGradientCycle {
  0%   { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
  16%  { background-image: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%); }
  33%  { background-image: linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%); }
  50%  { background-image: linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%); }
  66%  { background-image: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%); }
  83%  { background-image: linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #a3e635 100%); }
  100% { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
}
/* NOTE: never set display on this class — let the element's own tag control layout */
.home-text-cycle {
  background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: homeGradientCycle 18s steps(1, end) infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
.typing-cursor {
  display: inline-block;
  width: 3px;
  height: 1em;
  background: #a78bfa;
  margin-left: 3px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
  border-radius: 1px;
}
`;

/* ─── Typing animation hook ─────────────────────────────────── */
const TYPING_PHRASES = [
  "Full-Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Laravel Developer",
  "Cloud Enthusiast",
];

function useTypingEffect(phrases: string[], typeSpeed = 60, eraseSpeed = 35, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (typing) {
      if (displayed.length < phrase.length) {
        timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setTyping(false), pauseMs);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), eraseSpeed);
      } else {
        setPhraseIdx((i) => (i + 1) % phrases.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, phraseIdx, phrases, typeSpeed, eraseSpeed, pauseMs]);

  return displayed;
}

/* ─── Social Icon — wiggle + ripple rings + glow on hover ───── */
const RIPPLE_DELAYS = [0, 0.15, 0.3]; // 3 rings staggered

function SocialIcon({
  Icon, label, color, href, index,
}: {
  Icon: React.ElementType; label: string; color: string; href: string; index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 + index * 0.08, type: "spring", stiffness: 300 }}
    >
      {/* Ripple rings — 3 expanding rings fire simultaneously on hover */}
      <AnimatePresence>
        {hovered && RIPPLE_DELAYS.map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.8 + r * 0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 + r * 0.1, delay, ease: "easeOut" }}
            style={{ border: `1.5px solid ${color}`, borderRadius: "50%" }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob behind icon */}
      <motion.span
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={hovered
          ? { opacity: 1, scale: 1.6 }
          : { opacity: 0, scale: 1 }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: color,
          filter: "blur(10px)",
          zIndex: 0,
        }}
      />

      {/* The icon button */}
      <motion.a
        href={href}
        aria-label={label}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          scale: 1.25,
          rotate: [0, -12, 10, -6, 4, 0],
          y: -6,
          transition: {
            scale: { type: "spring", stiffness: 400, damping: 12 },
            rotate: { duration: 0.45, ease: "easeInOut" },
            y: { type: "spring", stiffness: 400, damping: 14 },
          },
        }}
        whileTap={{ scale: 0.88 }}
        className="relative z-10 p-2.5 rounded-full glass transition-all duration-200 flex items-center justify-center"
        style={{
          boxShadow: hovered
            ? `0 0 0 1px ${color}60, 0 8px 24px -6px ${color}80`
            : "none",
          transition: "box-shadow 0.25s ease",
        }}
      >
        <motion.span
          animate={{
            color: hovered
              ? color
              : [color, "#a78bfa", "#22d3ee", color],
          }}
          transition={hovered
            ? { duration: 0.15 }
            : { duration: 5 + index * 0.8, repeat: Infinity, ease: "linear" }
          }
          className="block"
        >
          <Icon size={17} />
        </motion.span>
      </motion.a>
    </motion.div>
  );
}
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const PARTICLE_COLORS = ["#a78bfa", "#60a5fa", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#f43f5e", "#38bdf8"];

function useParticleBurst() {
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBursting(true);
    timerRef.current = setTimeout(() => setBursting(false), 700);
  };
  return { bursting, trigger };
}

function ParticleBurst({
  children, className, count = 8, radius = 36, as: Tag = "div", ...props
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
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none z-30"
              style={{ background: PARTICLE_COLORS[p % PARTICLE_COLORS.length] }}
            />
          );
        })}
      </AnimatePresence>
    </Tag>
  );
}

/* ─── Real tech icons with proper SVG logos ─────────────────── */
const techIcons = [
  { Logo: SiReact,     name: "React",      color: "#61DAFB", x: -185, y: -50,  delay: 0,    floatDur: 3.2 },
  { Logo: SiNextdotjs, name: "Next.js",    color: "#ffffff", x: 185,  y: -85,  delay: 0.35, floatDur: 4.1 },
  { Logo: SiLaravel,   name: "Laravel",    color: "#FF2D20", x: -225, y: 110,  delay: 0.5,  floatDur: 3.7 },
  { Logo: SiDocker,    name: "Docker",     color: "#2496ED", x: 205,  y: 130,  delay: 0.65, floatDur: 4.5 },
  { Logo: FaAws,       name: "AWS",        color: "#FF9900", x: 0,    y: -185, delay: 0.8,  floatDur: 3.9 },
  { Logo: SiPython,    name: "Python",     color: "#3776AB", x: -100, y: 195,  delay: 0.95, floatDur: 4.3 },
  { Logo: SiTypescript,name: "TypeScript", color: "#3178C6", x: 110,  y: 195,  delay: 1.1,  floatDur: 3.6 },
];

/* ─── Pill tags — each with its own accent color ────────────── */
const TAGS = [
  { label: "Full Stack", color: "#a78bfa", color2: "#60a5fa" },
  { label: "Cloud",      color: "#38bdf8", color2: "#22d3ee" },
  { label: "UI/UX",      color: "#f472b6", color2: "#fb923c" },
  { label: "Data Engineer", color: "#34d399", color2: "#22d3ee" },
  { label: "AI",         color: "#f43f5e", color2: "#a855f7" },
];

/* ─── TagPill component ──────────────────────────────────────── */
function TagPill({ label, color, color2, index }: {
  label: string; color: string; color2: string; index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative inline-flex"
      initial={{ opacity: 0, scale: 0.6, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.65 + index * 0.08, type: "spring", stiffness: 320, damping: 18 }}
    >
      {/* Ripple rings on hover */}
      <AnimatePresence>
        {hovered && [0, 0.12, 0.24].map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2 + r * 0.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 + r * 0.08, delay, ease: "easeOut" }}
            style={{ border: `1.5px solid ${color}`, borderRadius: 999 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-full"
        animate={hovered ? { opacity: 0.55, scale: 1.5 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: color, filter: "blur(8px)", zIndex: 0 }}
      />

      {/* The pill button */}
      <motion.button
        type="button"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          scale: 1.18,
          y: -5,
          rotate: [0, -8, 6, -3, 0],
          transition: {
            scale: { type: "spring", stiffness: 380, damping: 14 },
            y: { type: "spring", stiffness: 380, damping: 14 },
            rotate: { duration: 0.4, ease: "easeInOut" },
          },
        }}
        whileTap={{ scale: 0.92 }}
        className="relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold overflow-hidden"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${color}30, ${color2}20)`
            : "color-mix(in oklab, var(--neon) 10%, transparent)",
          border: hovered
            ? `1px solid ${color}80`
            : "1px solid color-mix(in oklab, var(--neon) 25%, transparent)",
          boxShadow: hovered
            ? `0 0 0 1px ${color}40, 0 6px 20px -4px ${color}60`
            : "none",
          transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {/* Shimmer sweep on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                background: `linear-gradient(105deg, transparent 30%, ${color}40 50%, transparent 70%)`,
                borderRadius: 999,
              }}
            />
          )}
        </AnimatePresence>

        {/* Label — gradient text on hover */}
        <span
          style={hovered ? {
            background: `linear-gradient(135deg, ${color}, ${color2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          } : { color: "var(--foreground)" }}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}

/* ─── Social links ───────────────────────────────────────────── */
const socials = [
  { Icon: Github,   label: "GitHub",    color: "#ffffff", href: "#" },
  { Icon: Linkedin, label: "LinkedIn",  color: "#0A66C2", href: "#" },
  { Icon: Mail,     label: "Email",     color: "#a855f7", href: "#" },
  { Icon: Instagram,label: "Instagram", color: "#E4405F", href: "#" },
];

/* ─── Featured Project Card — per-project accent color on hover ── */
function FeaturedProjectCard({ p, i }: { p: typeof featured[number]; i: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="/projects"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl p-5 md:p-6 grid md:grid-cols-[260px_1fr] gap-6 overflow-hidden group"
      style={{
        background: hovered
          ? `linear-gradient(135deg, color-mix(in oklab,${p.accent} 18%,var(--card) 82%), color-mix(in oklab,${p.accent2} 14%,var(--card) 86%))`
          : "color-mix(in oklab, var(--card) 55%, transparent)",
        backdropFilter: "blur(16px) saturate(140%)",
        border: hovered
          ? `1px solid color-mix(in oklab, ${p.accent} 55%, transparent)`
          : "1px solid color-mix(in oklab, var(--neon) 22%, transparent)",
        boxShadow: hovered
          ? `0 0 0 1px color-mix(in oklab,${p.accent} 30%,transparent), 0 20px 60px -12px color-mix(in oklab,${p.accent} 50%,transparent)`
          : "none",
        transition: "background 0.35s ease, border 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      {/* Radial glow on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, color-mix(in oklab,${p.accent} 18%,transparent) 0%, transparent 65%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Thumbnail */}
      <div
        className="aspect-video md:aspect-auto rounded-2xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab,${p.accent} 45%,transparent), color-mix(in oklab,${p.accent2} 45%,transparent))`,
          minHeight: 140,
        }}
      >
        {/* Shimmer */}
        <motion.div
          animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 1.1, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-white/15 skew-x-12 blur-sm pointer-events-none"
        />
        <motion.div
          animate={hovered ? { scale: 1.15, opacity: 0.4 } : { scale: 1, opacity: 0.2 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white select-none"
        >
          {p.title.charAt(0)}
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center relative z-10">
        <span
          className="pill w-fit !text-[11px]"
          style={hovered ? {
            background: `color-mix(in oklab, ${p.accent} 20%, transparent)`,
            borderColor: `color-mix(in oklab, ${p.accent} 45%, transparent)`,
          } : {}}
        >
          {p.category}
        </span>
        <h3
          className="text-2xl font-bold mt-3 transition-all duration-300"
          style={hovered ? {
            background: `linear-gradient(120deg, ${p.accent}, ${p.accent2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          } : {}}
        >
          {p.title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{p.desc}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {p.stack.map(s => (
            <span
              key={s}
              className="pill !text-[10px] !py-1 transition-all duration-300"
              style={hovered ? {
                background: `color-mix(in oklab, ${p.accent} 12%, transparent)`,
                borderColor: `color-mix(in oklab, ${p.accent} 30%, transparent)`,
              } : {}}
            >
              {s}
            </span>
          ))}
        </div>
        <motion.span
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
          style={hovered ? {
            background: `linear-gradient(120deg, ${p.accent}, ${p.accent2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          } : { color: "var(--neon)" }}
          animate={hovered ? { x: 4 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          View Project <ArrowRight size={14} />
        </motion.span>
      </div>

      {/* Bottom accent line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})` }}
      />
    </motion.a>
  );
}

/* ─── Cycling gradient text colors ──────────────────────────── */
const STAT_COLORS = [
  "#a78bfa", "#60a5fa", "#22d3ee", "#34d399", "#f472b6", "#fbbf24", "#f43f5e", "#38bdf8",
];

function CyclingText({ children, className, style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  const [colorIdx, setColorIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setColorIdx(i => (i + 1) % STAT_COLORS.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.span
      className={className}
      animate={{ color: STAT_COLORS[colorIdx] }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={style}
    >
      {children}
    </motion.span>
  );
}

/* ─── Stat Button with wiggle + ripple ──────────────────────── */
function StatButton({ label, value, color, href }: {
  label: string; value: string; color: string; href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Tag = href ? motion.a : motion.button;

  return (
    <div className="relative inline-flex">
      {/* Ripple rings */}
      <AnimatePresence>
        {hovered && [0, 0.12, 0.25].map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 2.0 + r * 0.35, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 + r * 0.1, delay, ease: "easeOut" }}
            style={{ border: `1.5px solid ${color}`, borderRadius: 12 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob */}
      <motion.span
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={hovered ? { opacity: 0.45, scale: 1.4 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: color, filter: "blur(10px)", zIndex: 0 }}
      />

      {/* Button */}
      <Tag
        {...(href ? { href } : { type: "button" as const })}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          scale: 1.1,
          y: -4,
          rotate: [0, -6, 5, -3, 0],
          transition: {
            scale: { type: "spring", stiffness: 380, damping: 14 },
            y: { type: "spring", stiffness: 380, damping: 14 },
            rotate: { duration: 0.4, ease: "easeInOut" },
          },
        }}
        whileTap={{ scale: 0.93 }}
        className="relative z-10 px-4 py-3 rounded-xl text-left cursor-pointer overflow-hidden"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${color}25, ${color}15)`
            : "rgba(255,255,255,0.04)",
          border: hovered
            ? `1px solid ${color}70`
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: hovered
            ? `0 0 0 1px ${color}30, 0 8px 28px -6px ${color}60`
            : "none",
          transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
          minWidth: 0,
          width: "100%",
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
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                background: `linear-gradient(105deg, transparent 30%, ${color}35 50%, transparent 70%)`,
                borderRadius: 12,
              }}
            />
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground m-0 relative z-10">{label}</p>
        <motion.p
          className="text-sm font-bold m-0 mt-0.5 relative z-10"
          animate={hovered
            ? { color: [color, "#ffffff", color] }
            : { color: "#ffffff" }
          }
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
        >
          {value}
        </motion.p>
      </Tag>
    </div>
  );
}

/* ─── Learn More Button ──────────────────────────────────────── */
function LearnMoreButton() {
  const [lmHovered, setLmHovered] = useState(false);
  return (
    <div className="relative inline-flex">
      {/* Ripple rings */}
      <AnimatePresence>
        {lmHovered && [0, 0.13, 0.26].map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 2.2 + r * 0.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 + r * 0.1, delay, ease: "easeOut" }}
            style={{ border: "1.5px solid rgba(167,139,250,0.7)", borderRadius: 999 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob */}
      <motion.span
        className="absolute inset-0 pointer-events-none rounded-full"
        animate={lmHovered ? { opacity: 0.4, scale: 1.5 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: "#a78bfa", filter: "blur(14px)", zIndex: 0 }}
      />

      <ParticleBurst count={8} radius={32} className="inline-flex">
        <motion.a
          href="/about"
          className="btn-ghost relative overflow-hidden"
          onHoverStart={() => setLmHovered(true)}
          onHoverEnd={() => setLmHovered(false)}
          whileHover={{
            scale: 1.08,
            y: -5,
            rotate: [0, -5, 4, -2, 0],
            boxShadow: "0 0 0 1px rgba(167,139,250,0.6), 0 12px 40px -8px rgba(167,139,250,0.5)",
            transition: {
              scale: { type: "spring", stiffness: 380, damping: 14 },
              y: { type: "spring", stiffness: 380, damping: 14 },
              rotate: { duration: 0.4, ease: "easeInOut" },
            },
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shimmer sweep */}
          <AnimatePresence>
            {lmHovered && (
              <motion.span
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "200%", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  background: "linear-gradient(105deg, transparent 30%, rgba(167,139,250,0.35) 50%, transparent 70%)",
                  borderRadius: "inherit",
                }}
              />
            )}
          </AnimatePresence>

          {/* Text with cycling color */}
          <motion.span
            className="relative z-10 flex items-center gap-2"
            animate={lmHovered
              ? { color: ["#ffffff", "#a78bfa", "#60a5fa", "#22d3ee", "#ffffff"] }
              : { color: "#ffffff" }
            }
            transition={{ duration: 1.6, repeat: lmHovered ? Infinity : 0 }}
          >
            Learn More About Me
            {/* Arrow with wiggle */}
            <motion.span
              animate={lmHovered
                ? { x: [0, 5, -2, 4, 0], rotate: [0, -12, 10, -5, 0] }
                : { x: 0, rotate: 0 }
              }
              transition={{ duration: 0.5, repeat: lmHovered ? Infinity : 0, ease: "easeInOut" }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </motion.span>
        </motion.a>
      </ParticleBurst>
    </div>
  );
}
function GitHubStatsCard() {
  return (
    <div>
      {/* Calendar + badge contributions — semua dari GithubContributions */}
      <GithubContributions />

      {/* Stats row — 2 kolom di mobile (Repo + Streak), GitHub full width di bawah */}
      <motion.div
        className="mt-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {/* Baris 1: Repositories + Active Streak */}
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <StatButton label="Repositories"  value="38"        color="#39d353" />
          <StatButton label="Active Streak" value="42 days"   color="#60a5fa" />
        </div>
        {/* Baris 2: GitHub — full width di mobile */}
        <div className="sm:contents">
          <StatButton label="GitHub" value="@hairilikhsan17" color="#a78bfa" href="https://github.com/hairilikhsan17" />
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax  = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const typedText  = useTypingEffect(TYPING_PHRASES);
  const isMobile   = useIsMobile();

  return (
    <div className="px-4 overflow-x-hidden">
      <style>{HOME_STYLE}</style>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[88vh] py-20 overflow-x-hidden"
      >
        {/* ── Photo side — top on mobile, left on desktop ── */}
        <motion.div
          style={{ y: yParallax, overflow: "visible" }}
          className="relative h-[420px] lg:h-[500px] order-1 lg:order-1 flex items-center justify-center"
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-8 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, var(--neon), transparent 65%)" }}
            animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Profile card with particle burst */}
          <ParticleBurst count={8} radius={60} className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.75, filter: "blur(24px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="w-64 h-80 rounded-3xl overflow-hidden glass glow cursor-pointer"
              style={{
                boxShadow: "0 0 0 1px color-mix(in oklab,var(--neon) 40%,transparent), 0 30px 80px -20px color-mix(in oklab,var(--neon) 50%,transparent)",
              }}
            >
              <img
                src={profile}
                alt="Hairil Ikhsan"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 10%" }}
                width={768} height={1024}
              />
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Bottom gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
              />
            </motion.div>
          </ParticleBurst>

          {/* Floating tech icons — keluar dari bingkai foto */}
          {techIcons.map(({ Logo, name, color, x, y, delay, floatDur }, i) => {
            // Mobile: posisi 65% dari desktop, icon lebih besar dari sebelumnya
            const scale = isMobile ? 0.65 : 1;
            const mx    = x * scale;
            const my    = y * scale;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, filter: "blur(16px)" }}
                animate={{ opacity: 1, x: mx, y: my, scale: 1, filter: "blur(0px)" }}
                transition={{ delay, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-20"
              >
                <ParticleBurst count={6} radius={22} className="inline-flex">
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                    className="glass-strong rounded-2xl flex items-center gap-2 font-semibold cursor-pointer"
                    style={{
                      boxShadow: `0 8px 30px -10px ${color}80`,
                      border:    `1px solid ${color}40`,
                      padding:   isMobile ? "7px 10px" : "8px 12px",
                      fontSize:  isMobile ? 11 : 12,
                    }}
                  >
                    <motion.span
                      animate={{ color: [color, "#a78bfa", "#22d3ee", "#f472b6", color] }}
                      transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "linear" }}
                    >
                      <Logo size={isMobile ? 16 : 16} />
                    </motion.span>
                    {/* Label teks — sembunyikan di mobile */}
                    {!isMobile && (
                      <motion.span
                        animate={{ color: [color, "#a78bfa", "#22d3ee", "#f472b6", color] }}
                        transition={{ duration: 6 + i * 0.7, repeat: Infinity, ease: "linear" }}
                      >
                        {name}
                      </motion.span>
                    )}
                  </motion.div>
                </ParticleBurst>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Text content — bottom on mobile, right on desktop ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 lg:order-2 space-y-5 flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="pill inline-flex"
          >
            👋 Hi there, I'm
          </motion.span>

          {/* Name — gradient cycling, no S.Kom */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            <span className="home-text-cycle">Hairil Ikhsan</span>
          </motion.h1>

          {/* Typing animation — 3D perspective subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-xl md:text-2xl font-semibold"
            style={{ perspective: 600 }}
          >
            <motion.span
              animate={{ rotateX: [0, 4, 0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block", transformStyle: "preserve-3d" }}
              className="home-text-cycle"
              key={typedText}
            >
              {typedText}
            </motion.span>
            <span
              className="typing-cursor"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                WebkitTextFillColor: "unset",
                color: "transparent",
              }}
            />
          </motion.div>

          {/* Pill tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {TAGS.map(({ label, color, color2 }, i) => (
              <TagPill key={label} label={label} color={color} color2={color2} index={i} />
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0"
          >
            A technology student passionate about building scalable systems, modern web apps,
            cloud-native architectures and meaningful AI experiences.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="flex items-center gap-3 flex-wrap justify-center lg:justify-start"
          >
            <ParticleBurst count={8} radius={30} className="inline-flex">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary"
              >
                <Download size={16} /> View CV
              </motion.a>
            </ParticleBurst>
            <ParticleBurst count={8} radius={30} className="inline-flex">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-ghost"
              >
                Contact Me <ArrowRight size={16} />
              </motion.a>
            </ParticleBurst>
          </motion.div>

          {/* Social icons — wiggle + ripple + glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="flex gap-4 justify-center lg:justify-start"
          >
            {socials.map(({ Icon, label, color, href }, i) => (
              <SocialIcon
                key={label}
                Icon={Icon}
                label={label}
                color={color}
                href={href}
                index={i}
              />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CODING HISTORY ════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div>
            <span className="pill" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="home-text-cycle" style={{ fontWeight: 600 }}>Activity</span>
            </span>
          </div>
          {/* Title with GitHub icon */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 44, height: 44,
                background: "linear-gradient(135deg, #6e40c9 0%, #a855f7 100%)",
                boxShadow: "0 0 18px rgba(168,85,247,0.5)",
              }}
            >
              <Github size={24} color="white" />
            </motion.div>
            <h2 className="home-text-cycle text-4xl md:text-5xl font-bold tracking-tight" style={{ display: "block" }}>
              Coding History
            </h2>
          </div>
          <p className="home-text-cycle mt-3 text-sm" style={{ display: "block", opacity: 0.75 }}>
            Real-time contribution graph from @hairilikhsan17
          </p>
          <motion.div
            className="mx-auto mt-3 h-px rounded-full"
            style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #22d3ee)", maxWidth: 100 }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
        </motion.div>
        <GitHubStatsCard />
        <div className="flex justify-center mt-6">
          <LearnMoreButton />
        </div>
      </section>

      {/* ══ FEATURED PROJECTS ═════════════════════════════════════ */}
      <Section title="Featured Projects" badge="Showcase" subtitle="Selected works built with passion & precision">
        <div className="grid gap-5">
          {featured.map((p, i) => (
            <FeaturedProjectCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </Section>
    </div>
  );
}

export function Section({ title, badge, subtitle, children }: {
  title: string; badge: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <section className="max-w-6xl mx-auto py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        {/* Badge — own line */}
        <div>
          <span className="pill" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="home-text-cycle" style={{ fontWeight: 600 }}>{badge}</span>
          </span>
        </div>

        {/* Title — own line, block h2 */}
        <h2 className="home-text-cycle text-4xl md:text-5xl font-bold mt-4 tracking-tight" style={{ display: "block" }}>
          {title}
        </h2>

        {/* Subtitle — own line */}
        {subtitle && (
          <p className="home-text-cycle mt-3 text-sm" style={{ display: "block", opacity: 0.75 }}>
            {subtitle}
          </p>
        )}

        {/* Decorative underline */}
        <motion.div
          className="mx-auto mt-3 h-px rounded-full"
          style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa, #22d3ee)", maxWidth: 100 }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        />
      </motion.div>
      {children}
    </section>
  );
}

const featured = [
  {
    title: "AI Dashboard Platform",
    category: "AI · Dashboard",
    desc: "Real-time analytics dashboard powered by machine learning for actionable insights.",
    stack: ["Next.js", "Python", "TensorFlow", "Tailwind"],
    accent: "oklch(0.7 0.25 290)",
    accent2: "oklch(0.75 0.2 230)",
  },
  {
    title: "DCI UNDIPA Website",
    category: "Community",
    desc: "Community organization website for the Dicoding Indonesia UNDIPA chapter.",
    stack: ["Laravel", "MySQL", "Tailwind"],
    accent: "oklch(0.65 0.25 25)",
    accent2: "oklch(0.75 0.2 60)",
  },
  {
    title: "Modern Portfolio Website",
    category: "Personal",
    desc: "Premium developer portfolio with motion design and glassmorphism UI.",
    stack: ["React", "Framer Motion", "Tailwind"],
    accent: "oklch(0.75 0.2 180)",
    accent2: "oklch(0.7 0.2 230)",
  },
];
