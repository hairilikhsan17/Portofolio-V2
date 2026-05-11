import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Code2, Palette, Cloud, ChevronDown, Github } from "lucide-react";
import { GithubContributions } from "../components/GithubContributions";
import profile from "../assets/profile.jpg";

/* ─── Gradient Section Header (replaces imported Section for About) ── */
const SECTION_GRADIENTS: Record<string, string> = {
  "Tentang Saya":        "linear-gradient(120deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)",
  "Hairil Ikhsan":       "linear-gradient(120deg, #c4b5fd 0%, #a78bfa 40%, #60a5fa 100%)",
  "Coding Activity":     "linear-gradient(120deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%)",
  "Keahlian & Spesialisasi": "linear-gradient(120deg, #f472b6 0%, #a78bfa 50%, #818cf8 100%)",
  "Connect With Me":     "linear-gradient(120deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%)",
  "Pertanyaan Umum":     "linear-gradient(120deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%)",
};

function Section({ title, badge, subtitle, children, icon }: { title: string; badge: string; subtitle: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const grad = SECTION_GRADIENTS[title] ?? "linear-gradient(120deg, #a78bfa, #60a5fa)";
  return (
    <section className="max-w-6xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        {/* Badge with gradient border */}
        <motion.span
          className="pill"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
          whileHover={{ scale: 1.06 }}
        >
          <span
            style={{
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        </motion.span>

        {/* Title with animated gradient + optional icon */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            {title}
          </motion.h2>
        </div>

        {/* Subtitle with subtle gradient */}
        <motion.p
          className="mt-3 text-sm"
          style={{
            background: "linear-gradient(120deg, rgba(200,200,235,0.7), rgba(167,139,250,0.6), rgba(147,197,253,0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative underline */}
        <motion.div
          className="mx-auto mt-4 h-px rounded-full"
          style={{ background: grad, maxWidth: 120 }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
      {children}
    </section>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hairil Ikhsan" },
      { name: "description", content: "Full-Stack Developer passionate about scalable, user-friendly applications." },
    ],
  }),
  component: AboutPage,
});

/* ─── Page stagger variants ────────────────────────────────────── */
const pageVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const sectionVariant = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── Cursor Trail ─────────────────────────────────────────────── */
function CursorTrail() {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const counter = useRef(0);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      counter.current += 1;
      const id = counter.current;
      setTrail(prev => [...prev.slice(-18), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setTrail(prev => prev.filter(p => p.id !== id)), 700);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {trail.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: p.x - 4, top: p.y - 4, width: 8, height: 8, background: `hsl(${260 + i * 5}, 80%, 65%)` }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </div>
  );
}

/* ─── Magnetic Card ────────────────────────────────────────────── */
function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={reset} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TECH ICONS PHYSICS HERO
   Menggantikan OrbitingPlanetsHero — background ikon teknologi
   dengan collision physics, glow, dan efek ledakan saat diklik.
   ═══════════════════════════════════════════════════════════════ */

interface Ball {
  el: HTMLDivElement;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  pulsePhase: number;
}

const TECH_ICONS = [
  {
    name: "React",
    color: "#61DAFB",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="2"/><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="2" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="18" ry="7" fill="none" stroke="#61DAFB" stroke-width="2" transform="rotate(120 20 20)"/><circle cx="20" cy="20" r="3" fill="#61DAFB"/></svg>`,
  },
  {
    name: "Vue",
    color: "#42B883",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><polygon points="20,6 34,6 20,30 6,6" fill="none" stroke="#42B883" stroke-width="2.5"/><polygon points="20,12 28,12 20,26 12,12" fill="#42B883" opacity="0.5"/></svg>`,
  },
  {
    name: "TypeScript",
    color: "#3178C6",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" fill="#3178C6"/><text x="8" y="28" font-size="18" font-weight="bold" fill="white" font-family="monospace">TS</text></svg>`,
  },
  {
    name: "JavaScript",
    color: "#F7DF1E",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="4" fill="#F7DF1E"/><text x="8" y="28" font-size="18" font-weight="bold" fill="#1a1a1a" font-family="monospace">JS</text></svg>`,
  },
  {
    name: "Python",
    color: "#3776AB",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#3776AB"/><text x="20" y="26" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-family="monospace">Py</text></svg>`,
  },
  {
    name: "Laravel",
    color: "#FF2D20",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#FF2D20"/><text x="20" y="27" font-size="16" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">La</text></svg>`,
  },
  {
    name: "Node.js",
    color: "#339933",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#339933"/><text x="20" y="26" font-size="13" font-weight="bold" fill="white" text-anchor="middle">Node</text></svg>`,
  },
  {
    name: "HTML",
    color: "#E34F26",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><polygon points="6,4 34,4 31,36 20,39 9,36" fill="#E34F26"/><text x="20" y="27" font-size="13" font-weight="bold" fill="white" text-anchor="middle">HTML</text></svg>`,
  },
  {
    name: "CSS",
    color: "#1572B6",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><polygon points="6,4 34,4 31,36 20,39 9,36" fill="#1572B6"/><text x="20" y="27" font-size="15" font-weight="bold" fill="white" text-anchor="middle">CSS</text></svg>`,
  },
  {
    name: "GitHub",
    color: "#FFFFFF",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#1a1a2e" stroke="#555" stroke-width="1"/><path d="M20 8a12 12 0 00-3.8 23.4c.6.1.8-.26.8-.58v-2.22c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0020 8z" fill="white"/></svg>`,
  },
  {
    name: "Docker",
    color: "#2496ED",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#0D1B2A"/><rect x="8" y="14" width="6" height="5" rx="1" fill="#2496ED"/><rect x="16" y="14" width="6" height="5" rx="1" fill="#2496ED"/><rect x="24" y="14" width="6" height="5" rx="1" fill="#2496ED"/><rect x="16" y="22" width="6" height="5" rx="1" fill="#2496ED"/><rect x="8" y="22" width="6" height="5" rx="1" fill="#2496ED"/></svg>`,
  },
  {
    name: "Tailwind",
    color: "#38BDF8",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#0F172A"/><path d="M10 20c1.5-6 6-9 10.5-7.5-2 4-1 7 2.5 7.5C27 20.5 30 18 32 14c-1.5 6-6 9-10.5 7.5 2-4 1-7-2.5-7.5C14.5 13.5 11.5 16 10 20z" fill="#38BDF8"/></svg>`,
  },
  {
    name: "Next.js",
    color: "#FFFFFF",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#000"/><text x="20" y="25" font-size="13" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">Next</text></svg>`,
  },
  {
    name: "Bootstrap",
    color: "#7952B3",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#7952B3"/><text x="20" y="28" font-size="20" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">B</text></svg>`,
  },
  {
    name: "AWS",
    color: "#FF9900",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#232F3E"/><text x="20" y="26" font-size="12" font-weight="bold" fill="#FF9900" text-anchor="middle" font-family="monospace">AWS</text></svg>`,
  },
  {
    name: "Figma",
    color: "#A259FF",
    svg: `<svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="6" fill="#1E1E1E"/><circle cx="24" cy="20" r="5" fill="#1ABCFE"/><rect x="13" y="10" width="10" height="10" rx="5" fill="#F24E1E"/><rect x="13" y="20" width="10" height="10" rx="2" fill="#0ACF83"/></svg>`,
  },
];

/* Stars — static data (deterministik, tidak pakai Math.random) */
const STAR_DATA = [
  { id:0,  left:6.2,  top:12.4, size:1.1, color:"white",   dur:3.2, delay:0   },
  { id:1,  left:17.4, top:4.8,  size:0.8, color:"white",   dur:4.1, delay:0.4 },
  { id:2,  left:29.3, top:18.7, size:1.3, color:"#c4b5fd", dur:2.9, delay:0.8 },
  { id:3,  left:42.6, top:7.1,  size:0.7, color:"white",   dur:3.7, delay:0.2 },
  { id:4,  left:52.1, top:22.3, size:0.9, color:"white",   dur:5.0, delay:1.1 },
  { id:5,  left:64.8, top:3.5,  size:1.0, color:"#93c5fd", dur:3.5, delay:0.6 },
  { id:6,  left:76.3, top:14.9, size:0.8, color:"white",   dur:4.4, delay:1.4 },
  { id:7,  left:87.9, top:8.2,  size:1.2, color:"white",   dur:3.9, delay:0.3 },
  { id:8,  left:95.4, top:28.5, size:0.7, color:"#a5f3fc", dur:4.7, delay:0.9 },
  { id:9,  left:10.3, top:42.1, size:0.9, color:"white",   dur:3.3, delay:1.7 },
  { id:10, left:21.7, top:58.6, size:0.6, color:"white",   dur:4.0, delay:0.5 },
  { id:11, left:34.9, top:73.2, size:1.1, color:"#c4b5fd", dur:3.6, delay:1.2 },
  { id:12, left:47.0, top:86.4, size:0.8, color:"white",   dur:5.2, delay:0.1 },
  { id:13, left:58.2, top:66.8, size:0.6, color:"white",   dur:4.2, delay:1.8 },
  { id:14, left:69.4, top:51.3, size:1.0, color:"#93c5fd", dur:3.1, delay:0.7 },
  { id:15, left:81.1, top:79.7, size:0.7, color:"white",   dur:4.8, delay:1.3 },
  { id:16, left:92.6, top:44.0, size:0.9, color:"white",   dur:3.4, delay:0.2 },
  { id:17, left:3.3,  top:34.6, size:0.8, color:"white",   dur:4.6, delay:0.8 },
  { id:18, left:13.2, top:91.2, size:1.0, color:"#c4b5fd", dur:3.2, delay:1.5 },
  { id:19, left:25.8, top:37.4, size:0.7, color:"white",   dur:4.0, delay:0.3 },
  { id:20, left:89.0, top:62.1, size:1.1, color:"#a5f3fc", dur:3.3, delay:1.8 },
  { id:21, left:97.2, top:17.3, size:0.8, color:"white",   dur:5.0, delay:0.5 },
  { id:22, left:44.1, top:95.4, size:0.9, color:"white",   dur:3.8, delay:1.2 },
  { id:23, left:72.6, top:88.3, size:1.0, color:"#c4b5fd", dur:4.3, delay:0.6 },
  { id:24, left:55.0, top:47.9, size:0.7, color:"white",   dur:3.5, delay:1.0 },
];

const BALL_W = 56;
const BALL_H = 68;

interface Ripple { id: number; x: number; y: number; }

/* ─── Tech Icons Physics Hero ─────────────────────────────────── */
function TechIconsHero() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animFrameRef = useRef<number>(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounter = useRef(0);

  /* Explosion on click */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    rippleCounter.current += 1;
    const id = rippleCounter.current;
    setRipples(prev => [...prev, { id, x: cx, y: cy }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);

    ballsRef.current.forEach(b => {
      const dx = b.x + BALL_W / 2 - cx;
      const dy = b.y + BALL_H / 2 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.max(0, (180 - dist) / 180) * 6;
      b.vx += (dx / dist) * force;
      b.vy += (dy / dist) * force;
    });
  };

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    ballsRef.current.forEach(b => b.el.remove());
    ballsRef.current = [];

    const W = () => arena.offsetWidth;
    const H = () => arena.offsetHeight;

    /* Seed positions deterministically */
    let seed = 7;
    const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

    TECH_ICONS.forEach(icon => {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;width:${BALL_W}px;height:${BALL_H}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;pointer-events:none;user-select:none;`;
      el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;">${icon.svg}</div><span style="font-size:9px;font-weight:500;color:rgba(255,255,255,0.6);letter-spacing:0.04em;white-space:nowrap;">${icon.name}</span>`;
      arena.appendChild(el);

      const angle = rng() * Math.PI * 2;
      const speed = 0.6 + rng() * 0.8;
      ballsRef.current.push({
        el,
        color: icon.color,
        x: rng() * Math.max(1, W() - BALL_W),
        y: rng() * Math.max(1, H() - BALL_H),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: 0,
        rotSpeed: (rng() - 0.5) * 0.8,
        pulsePhase: rng() * Math.PI * 2,
      });
    });

    /* Physics loop */
    const tick = (t: number) => {
      const w = W();
      const h = H();
      const balls = ballsRef.current;

      balls.forEach((b, i) => {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.998;
        b.vy *= 0.998;

        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > 3) { b.vx = (b.vx / spd) * 3; b.vy = (b.vy / spd) * 3; }
        if (spd < 0.3) { const a = Math.random() * Math.PI * 2; b.vx += Math.cos(a) * 0.1; b.vy += Math.sin(a) * 0.1; }

        /* Wall bounce */
        if (b.x < 0)          { b.x = 0;          b.vx =  Math.abs(b.vx); }
        if (b.x > w - BALL_W) { b.x = w - BALL_W; b.vx = -Math.abs(b.vx); }
        if (b.y < 0)          { b.y = 0;           b.vy =  Math.abs(b.vy); }
        if (b.y > h - BALL_H) { b.y = h - BALL_H;  b.vy = -Math.abs(b.vy); }

        /* Ball-to-ball collision */
        for (let j = i + 1; j < balls.length; j++) {
          const o = balls[j];
          const dx = (o.x + BALL_W / 2) - (b.x + BALL_W / 2);
          const dy = (o.y + BALL_H / 2) - (b.y + BALL_H / 2);
          const d = Math.sqrt(dx * dx + dy * dy);
          const minD = BALL_W * 0.9;
          if (d < minD && d > 0) {
            const overlap = (minD - d) / 2;
            const nx = dx / d, ny = dy / d;
            b.x -= nx * overlap; b.y -= ny * overlap;
            o.x += nx * overlap; o.y += ny * overlap;
            const relVx = b.vx - o.vx, relVy = b.vy - o.vy;
            const dot = relVx * nx + relVy * ny;
            if (dot > 0) { b.vx -= dot * nx; b.vy -= dot * ny; o.vx += dot * nx; o.vy += dot * ny; }
          }
        }

        b.rot += b.rotSpeed;
        const glow = 6 + Math.sin(t * 0.002 + b.pulsePhase) * 4;
        const svgEl = b.el.querySelector("svg") as SVGSVGElement | null;
        if (svgEl) svgEl.style.filter = `drop-shadow(0 0 ${glow}px ${b.color})`;
        b.el.style.transform = `translate(${b.x}px,${b.y}px) rotate(${b.rot}deg)`;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ballsRef.current.forEach(b => b.el.remove());
      ballsRef.current = [];
    };
  }, []);

  return (
    <section className="relative max-w-5xl mx-auto py-16" style={{ minHeight: 520 }}>
      {/* ── Physics Arena (background layer) ── */}
      <div
        ref={arenaRef}
        onClick={handleClick}
        className="absolute inset-0 rounded-3xl overflow-hidden cursor-crosshair"
        style={{ background: "radial-gradient(ellipse 140% 100% at 50% 50%, #09061e 0%, #04040f 55%, #020208 100%)" }}
      >
        {/* Nebula clouds */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute rounded-full" style={{ left: "-5%", top: "-10%", width: "55%", height: "65%", background: "radial-gradient(ellipse, rgba(139,92,246,.12) 0%, transparent 65%)" }} />
          <div className="absolute rounded-full" style={{ right: "-5%", top: "5%", width: "45%", height: "55%", background: "radial-gradient(ellipse, rgba(59,130,246,.09) 0%, transparent 65%)" }} />
          <div className="absolute rounded-full" style={{ left: "30%", bottom: "-5%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(6,182,212,.07) 0%, transparent 65%)" }} />
        </motion.div>

        {/* Stars */}
        {STAR_DATA.map(s => (
          <motion.div
            key={s.id}
            className="absolute rounded-full pointer-events-none"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, background: s.color }}
            animate={{ opacity: [s.size * 0.1, s.size * 0.7, s.size * 0.1] }}
            transition={{ duration: s.dur, delay: s.delay, repeat: Infinity }}
          />
        ))}

        {/* Click ripples */}
        <AnimatePresence>
          {ripples.map(r => (
            <motion.div
              key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40, border: "2px solid rgba(167,139,250,0.7)" }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Hero Text (foreground, centered) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: 520,
          padding: "0 40px",
          gap: 16,
          pointerEvents: "none",
        }}
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              "0 0 0 0px rgba(139,92,246,.5)",
              "0 0 0 8px rgba(139,92,246,0)",
              "0 0 0 0px rgba(139,92,246,0)",
            ],
          }}
          transition={{
            opacity: { duration: 0.4 },
            y: { duration: 0.4 },
            boxShadow: { duration: 2.5, repeat: Infinity, delay: 0.5 },
          }}
          className="pill"
          style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa", display: "inline-block" }} />
          About Me
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ margin: 0, fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "white" }}
        >
          Building{" "}
          <motion.span
            style={{ background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            animate={{ textShadow: ["0 0 40px rgba(139,92,246,.4)", "0 0 80px rgba(139,92,246,.8)", "0 0 40px rgba(139,92,246,.4)"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Modern Digital
          </motion.span>{" "}
          Experiences
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ margin: 0, fontSize: 15, color: "rgba(200,200,235,.65)", maxWidth: 440, lineHeight: 1.7 }}
        >
          Full-Stack Web Developer passionate about creating scalable and user-friendly applications.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 8 }}
        >
          <motion.div
            style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, rgba(167,139,250,.9))" }}
            animate={{ scaleY: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span style={{ fontSize: 10, color: "#a78bfa", letterSpacing: "0.12em" }}>scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   END TECH ICONS PHYSICS HERO
   ═══════════════════════════════════════════════════════════════ */

/* ─── Stat Button (About) — wiggle + ripple + glow ────────────── */
function StatButtonAbout({ label, value, color, href }: {
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
            className="absolute inset-0 pointer-events-none"
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
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={hovered ? { opacity: 0.45, scale: 1.4 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: color, filter: "blur(10px)", zIndex: 0 }}
      />

      <Tag
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : { type: "button" as const })}
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
          background: hovered ? `linear-gradient(135deg, ${color}25, ${color}15)` : "rgba(255,255,255,0.04)",
          border: hovered ? `1px solid ${color}70` : "1px solid rgba(255,255,255,0.1)",
          boxShadow: hovered ? `0 0 0 1px ${color}30, 0 8px 28px -6px ${color}60` : "none",
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
          animate={hovered ? { color: [color, "#ffffff", color] } : { color: "#ffffff" }}
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
        >
          {value}
        </motion.p>
      </Tag>
    </div>
  );
}

/* ─── Coding Activity — real GitHub contributions ──────────────── */
function CodingActivity() {
  return (
    <div>
      {/* Calendar + badge contributions — semua dari GithubContributions */}
      <GithubContributions />

      {/* Stats row — 2 kolom di mobile, GitHub full width di bawah */}
      <motion.div
        className="mt-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <StatButtonAbout label="Repositories"  value="38"       color="#39d353" />
          <StatButtonAbout label="Active Streak" value="42 days"  color="#60a5fa" />
        </div>
        <div className="sm:contents">
          <StatButtonAbout label="GitHub" value="@hairilikhsan17" color="#a78bfa" href="https://github.com/hairilikhsan17" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Profile Card ─────────────────────────────────────────────── */
function ProfileCard() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 150, damping: 20 });
  const ry = useSpring(y, { stiffness: 150, damping: 20 });
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientY - rect.top) / rect.height - 0.5) * 14);
    y.set(((e.clientX - rect.left) / rect.width - 0.5) * -14);
  };

  const tags = ["Makassar, Indonesia", "Universitas Dipa Makassar", "3+ Tahun Pengalaman", "10+ Sertifikasi", "100+ Proyek"];

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ boxShadow: "0 0 0 2px rgba(139,92,246,0.7), 0 24px 80px -15px rgba(139,92,246,0.5), 0 0 60px -20px rgba(96,165,250,0.3)" }}
    >
      {/* Animated top bar */}
      <motion.div
        className="h-1.5 rounded-t-3xl"
        style={{ background: "linear-gradient(to right, #7c3aed, #3b82f6, #06b6d4)" }}
        animate={hovered ? { scaleX: [1, 1.02, 1], opacity: [1, 0.8, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      <div className="relative glass rounded-b-3xl p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-8 items-start overflow-hidden">
        {/* Shimmer sweep on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              style={{ background: "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.1) 50%, transparent 65%)", zIndex: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Glow bg on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-b-3xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(139,92,246,0.08), transparent 70%)", zIndex: 0 }}
        />

        <motion.div
          animate={{
            boxShadow: hovered
              ? "0 0 0 3px rgba(139,92,246,0.9), 0 0 40px 8px rgba(139,92,246,0.4), 0 0 80px 20px rgba(96,165,250,0.2)"
              : "0 0 0 0px transparent",
            scale: hovered ? 1.04 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden flex-shrink-0"
          style={{ transform: "translateZ(24px)", position: "relative", zIndex: 2 }}
        >
          <motion.img
            src={profile}
            alt="Hairil Ikhsan"
            loading="lazy"
            className="w-full h-60 object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Overlay glow on photo */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 60%)" }}
          />
        </motion.div>

        <div style={{ transform: "translateZ(32px)", position: "relative", zIndex: 2 }}>
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.span
              className="text-xl"
              animate={hovered ? { rotate: [0, -20, 20, -10, 0] } : {}}
              transition={{ duration: 0.6 }}
            >👋</motion.span>
            <span className="text-muted-foreground text-sm">Halo, Saya</span>
          </motion.div>

          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              background: hovered
                ? "linear-gradient(120deg, #a78bfa, #60a5fa, #22d3ee)"
                : "none",
              WebkitBackgroundClip: hovered ? "text" : "unset",
              WebkitTextFillColor: hovered ? "transparent" : "inherit",
              backgroundClip: hovered ? "text" : "unset",
              transition: "all 0.3s ease",
            }}
          >
            Hairil Ikhsan
          </motion.h3>

          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Programmer & Full Stack Developer dari <span className="text-primary font-medium">Makassar, Sulawesi Selatan</span>
          </motion.p>

          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {[
              <>
                Saya adalah seorang <span className="text-foreground font-medium">programmer</span> dan{" "}
                <span className="text-foreground font-medium">Full Stack Developer</span> yang berasal dari{" "}
                <span className="text-foreground font-medium">Makassar, Sulawesi Selatan</span>, Indonesia.
                Saat ini saya sedang menempuh pendidikan di{" "}
                <span className="text-foreground font-medium">Universitas Dipa Makassar</span> dan aktif sebagai anggota{" "}
                <span className="text-foreground font-medium">Diponegara Computer Club (DCC)</span>, sebuah komunitas IT terbesar di kampus saya.
              </>,
              <>
                Dengan pengalaman lebih dari <span className="text-foreground font-medium">3 tahun</span> di dunia pemrograman,
                saya telah menyelesaikan <span className="text-foreground font-medium">30+ proyek</span> dan meraih{" "}
                <span className="text-foreground font-medium">10+ sertifikasi</span> profesional. Keahlian utama saya meliputi{" "}
                <span className="text-foreground font-medium">Full-Stack Web Development</span> (React, TypeScript, Next.js, Node.js, Laravel),{" "}
                <span className="text-foreground font-medium">Cloud Computing</span>,{" "}
                <span className="text-foreground font-medium">UI/UX Design</span>,{" "}
                <span className="text-foreground font-medium">Data Engineering</span>, dan{" "}
                <span className="text-foreground font-medium">Computer Networking</span>.
              </>,
              <>
                Saya percaya bahwa teknologi adalah alat terbaik untuk memecahkan masalah nyata. Setiap proyek yang saya kerjakan selalu
                mengutamakan <span className="text-foreground font-medium">kualitas kode</span>,{" "}
                <span className="text-foreground font-medium">performa</span>, dan{" "}
                <span className="text-foreground font-medium">pengalaman pengguna</span> yang luar biasa. Saya berkomitmen untuk terus
                belajar dan berkontribusi di ekosistem teknologi Indonesia.
              </>,
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {tags.map((t, i) => (
              <motion.span
                key={t}
                className="pill text-[11px]"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
                whileHover={{
                  scale: 1.14,
                  y: -5,
                  boxShadow: "0 6px 24px -4px rgba(139,92,246,0.6)",
                  background: "linear-gradient(120deg, rgba(139,92,246,0.3), rgba(96,165,250,0.3))",
                  borderColor: "rgba(139,92,246,0.8)",
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Social Icons ─────────────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#0077b5"/>
    <path d="M14 19h-4v14h4V19zm-2-7a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm9 7h-4v14h4v-7.5c0-3.8 5-4.1 5 0V33h4v-8.5c0-6.8-8-6.5-9-3.2V19z" fill="white"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1a1a2e"/>
    <path d="M22 9a13 13 0 00-4.1 25.3c.65.12.89-.28.89-.63v-2.4c-3.6.78-4.36-1.73-4.36-1.73-.59-1.5-1.44-1.9-1.44-1.9-1.18-.8.09-.79.09-.79 1.3.09 1.99 1.34 1.99 1.34 1.16 1.98 3.04 1.41 3.78 1.08.12-.84.45-1.41.82-1.73-2.88-.33-5.91-1.44-5.91-6.4 0-1.41.5-2.57 1.33-3.47-.13-.53-.58-1.65.13-3.44 0 0 1.08-.35 3.55 1.32A12.35 12.35 0 0122 14.8c1.1.01 2.2.15 3.24.43 2.46-1.67 3.54-1.32 3.54-1.32.71 1.79.26 3.11.13 3.44.83.9 1.33 2.06 1.33 3.47 0 4.97-3.03 6.06-5.92 6.38.47.4.88 1.2.88 2.42v3.58c0 .35.23.76.89.63A13 13 0 0022 9z" fill="white"/>
  </svg>
);
const ScholarIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#4285f4"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="serif">g</text>
    <text x="32" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="serif" fontStyle="italic">s</text>
  </svg>
);
const KaggleIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#20beff"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">K</text>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <defs>
      <linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#f09433"/>
        <stop offset="30%"  stopColor="#e6683c"/>
        <stop offset="55%"  stopColor="#dc2743"/>
        <stop offset="75%"  stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" rx="10" fill="url(#ig2)"/>
    <rect x="12" y="12" width="20" height="20" rx="6" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="22" cy="22" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="29.5" cy="14.5" r="1.8" fill="white"/>
  </svg>
);
const MediumIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1a1a1a"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">M</text>
  </svg>
);
const OrcidIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#a6ce39"/>
    <text x="22" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">iD</text>
  </svg>
);
const GoogleDevIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1e1e2e"/>
    <text x="14" y="27" fontSize="13" fontWeight="bold" fill="#ea4335">&lt;</text>
    <text x="22" y="27" fontSize="13" fontWeight="bold" fill="#34a853">&gt;</text>
    <circle cx="33" cy="22" r="4" fill="none" stroke="#4285f4" strokeWidth="2"/>
    <circle cx="33" cy="22" r="1.5" fill="#4285f4"/>
  </svg>
);

const SOCIALS = [
  { name: "LinkedIn",       Icon: LinkedInIcon  },
  { name: "GitHub",         Icon: GithubIcon    },
  { name: "Google Scholar", Icon: ScholarIcon   },
  { name: "Kaggle",         Icon: KaggleIcon    },
  { name: "Instagram",      Icon: InstagramIcon },
  { name: "Medium",         Icon: MediumIcon    },
  { name: "ORCID",          Icon: OrcidIcon     },
  { name: "Google Dev",     Icon: GoogleDevIcon },
];

/* ─── Connect Section ──────────────────────────────────────────── */
function ConnectSection() {
  const [liHovered, setLiHovered] = useState(false);

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-5 items-stretch">

      {/* ── LinkedIn Floating Card ── */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 380 }}>

        {/* Outer glow blob — biru dominan seperti di gambar */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: -28,
            borderRadius: 32,
            background: "radial-gradient(ellipse at 40% 60%, rgba(30,100,220,0.55) 0%, rgba(59,130,246,0.3) 40%, rgba(14,30,80,0.15) 70%, transparent 100%)",
            filter: "blur(18px)",
            zIndex: 0,
          }}
          animate={{
            opacity: liHovered ? [0.85, 1, 0.85] : [0.55, 0.75, 0.55],
            scale:   liHovered ? [1, 1.05, 1]    : [1, 1.02, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Border ring — biru terang tipis */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: -3,
            borderRadius: 22,
            border: "1.5px solid rgba(59,130,246,0.55)",
            zIndex: 1,
          }}
          animate={{
            boxShadow: liHovered
              ? "0 0 0 4px rgba(59,130,246,0.18), 0 0 50px rgba(59,130,246,0.35), 0 0 90px rgba(30,80,200,0.2)"
              : "0 0 0 2px rgba(59,130,246,0.1), 0 0 28px rgba(59,130,246,0.2)",
            borderColor: liHovered ? "rgba(96,165,250,0.8)" : "rgba(59,130,246,0.55)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* The card — floating */}
        <motion.div
          onHoverStart={() => setLiHovered(true)}
          onHoverEnd={() => setLiHovered(false)}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          whileHover={{ scale: 1.025 }}
          className="relative w-full overflow-hidden flex flex-col"
          style={{
            borderRadius: 18,
            border: "1px solid rgba(59,130,246,0.35)",
            background: "#0a0e1a",
            zIndex: 2,
          }}
        >
          {/* ── Row 1: nama di header abu gelap ── */}
          <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              Hairil Ikhsan
            </p>
          </div>

          {/* ── Row 2: LinkedIn logo bar ── */}
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {/* "Linked" teks putih + kotak biru "in" */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}>Linked</span>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: 4,
                background: "#0a66c2",
                fontSize: 14, fontWeight: 700, color: "white",
                fontFamily: "Arial, sans-serif",
                marginLeft: 1,
              }}>in</span>
            </div>
          </div>

          {/* ── Row 3: body hitam pekat ── */}
          <div style={{ background: "#000000", padding: "16px 16px 20px" }}>
            {/* Foto profil bulat */}
            <motion.div
              className="rounded-full overflow-hidden"
              style={{
                width: 64, height: 64,
                border: "2.5px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.7)",
                marginBottom: 14,
                background: "white",
              }}
              whileHover={{ scale: 1.08, boxShadow: "0 0 0 3px rgba(59,130,246,0.6), 0 4px 20px rgba(59,130,246,0.3)" }}
            >
              <img src={profile} alt="Hairil Ikhsan" className="w-full h-full object-cover" />
            </motion.div>

            {/* Nama bold */}
            <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 6px" }}>
              Hairil Ikhsan
            </p>

            {/* Deskripsi — ukuran lebih besar dari sebelumnya, sesuai gambar */}
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, margin: "0 0 6px" }}>
              Tech Enthusiast | Web Developer | Public Relations | Digital Business | AI Enthusiast
            </p>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: "0 0 18px" }}>
              Google Student Ambassador Indonesia | Universitas Dipa Makassar
            </p>

            {/* Tombol oval "Lihat profil" */}
            <motion.a
              href="#"
              whileHover={{ background: "rgba(255,255,255,0.1)", scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-block",
                padding: "9px 24px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.6)",
                background: "transparent",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Lihat profil
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-3">
        {SOCIALS.map(({ name, Icon }, i) => (
          <motion.a key={name} href="#"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 250 }}
            whileHover={{
              y: -8,
              scale: 1.08,
              boxShadow: "0 0 0 1px rgba(139,92,246,0.6), 0 16px 40px -8px rgba(139,92,246,0.4), 0 0 30px -10px rgba(96,165,250,0.3)",
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(96,165,250,0.1))",
            }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-2xl flex flex-col items-center justify-center gap-2.5 py-5 cursor-pointer overflow-hidden relative"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Icon />
            </motion.div>
            <motion.span
              className="text-[11px] text-muted-foreground font-medium"
              whileHover={{ color: "#a78bfa" }}
            >
              {name}
            </motion.span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────── */
const faqs = [
  { q: "Siapa Hairil Ikhsan?",                  a: "Saya seorang full-stack developer & cloud enthusiast yang berbasis di Makassar, Indonesia." },
  { q: "Apa saja keahlian Hairil Ikhsan?",       a: "Pengembangan web modern dengan React, Next.js, Laravel, dan platform cloud seperti AWS. Juga UI/UX Design dan Data Engineering." },
  { q: "Programmer terbaik di Makassar siapa?",  a: "Hehe, mungkin saya bisa masuk daftar — tapi yang pasti saya terus belajar dan berkembang setiap hari 😄" },
  { q: "Di mana Hairil Ikhsan berkuliah?",       a: "Saya berkuliah di Universitas Dipa Makassar, mengambil program studi Teknologi Informasi." },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -10 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.015,
        boxShadow: "0 0 0 1px rgba(139,92,246,0.45), 0 10px 40px -10px rgba(139,92,246,0.3)",
      }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Animated left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        animate={{
          background: open
            ? "linear-gradient(to bottom, #a78bfa, #60a5fa)"
            : hovered
            ? "linear-gradient(to bottom, rgba(139,92,246,0.5), rgba(96,165,250,0.5))"
            : "transparent",
          opacity: open || hovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute" }}
      />
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="w-full p-5 flex justify-between items-center text-left"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span
          className="font-semibold"
          animate={{ color: open ? "#a78bfa" : hovered ? "#c4b5fd" : "inherit" }}
          transition={{ duration: 0.2 }}
        >
          {q}
        </motion.span>
        <motion.div
          animate={{ rotate: open ? 180 : 0, color: open ? "#a78bfa" : "inherit" }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.p
              className="px-5 pb-5 text-sm text-muted-foreground"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── About Page ───────────────────────────────────────────────── */
function AboutPage() {
  return (
    <>
      <CursorTrail />
      <motion.div
        className="px-4"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── 1. Hero — tech icons physics + hero text ── */}
        <motion.div variants={sectionVariant}>
          <TechIconsHero />
        </motion.div>

        {/* ── 2. Profile / Tentang Saya ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Tentang Saya" title="Hairil Ikhsan" subtitle="Programmer & Full Stack Developer dari Makassar, Sulawesi Selatan">
            <ProfileCard />
          </Section>
        </motion.div>

        {/* ── 3. Coding Activity (separate section) ── */}
        <motion.div variants={sectionVariant}>
          <Section
            badge="Activity"
            title="Coding Activity"
            subtitle="Year of consistent development"
            icon={
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #1a1a2e 0%, #0d1117 100%)",
                  border: "1.5px solid rgba(52,211,153,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(52,211,153,0.25), 0 0 32px rgba(34,211,238,0.15)",
                }}
              >
                <Github size={22} style={{ color: "#34d399" }} />
              </motion.div>
            }
          >
            <CodingActivity />
          </Section>
        </motion.div>

        {/* ── 4. Keahlian & Spesialisasi ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Specialization" title="Keahlian & Spesialisasi" subtitle="Areas where I bring the most value">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  Icon: Code2,
                  title: "Full-Stack Web Development",
                  desc: "Membangun aplikasi web modern dan scalable menggunakan React, TypeScript, Next.js, Node.js, dan Laravel. Ahli dalam domain frontend dan backend development.",
                  gradient: "from-violet-500 to-indigo-500",
                  glow: "rgba(139,92,246,0.5)",
                },
                {
                  Icon: Palette,
                  title: "UI/UX Design",
                  desc: "Mendesain antarmuka pengguna yang intuitif dan menarik dengan Figma dan Adobe XD. Fokus pada user experience, aksesibilitas, dan responsive design.",
                  gradient: "from-pink-500 to-rose-500",
                  glow: "rgba(236,72,153,0.5)",
                },
                {
                  Icon: Cloud,
                  title: "Cloud & Data Engineering",
                  desc: "Mengelola infrastruktur cloud, data pipeline, dan analisis data. Berpengalaman dengan Google Cloud, Python, dan platform Kaggle untuk data science.",
                  gradient: "from-cyan-500 to-blue-500",
                  glow: "rgba(6,182,212,0.5)",
                },
              ].map(({ Icon, title, desc, gradient, glow }, i) => (
                <MagneticCard key={title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 180 }}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 0 0 1px ${glow.replace("0.5", "0.6")}, 0 20px 60px -12px ${glow}, 0 0 40px -20px ${glow}`,
                    }}
                    className="glass rounded-3xl p-6 h-full relative overflow-hidden"
                  >
                    {/* Animated bg glow on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-3xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{ background: `radial-gradient(ellipse 80% 60% at 20% 30%, ${glow.replace("0.5", "0.08")}, transparent 70%)` }}
                    />
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}
                      whileHover={{ rotate: 12, scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="text-white" size={22} />
                    </motion.div>
                    <motion.h3
                      className="font-bold text-lg"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {title}
                    </motion.h3>
                    <p className="text-sm text-muted-foreground mt-2">{desc}</p>
                  </motion.div>
                </MagneticCard>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* ── 5. Connect With Me ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Connect" title="Connect With Me" subtitle="Mari berkolaborasi! Hubungi saya melalui platform profesional berikut">
            <ConnectSection />
          </Section>
        </motion.div>

        {/* ── 6. FAQ + Stats ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="FAQ" title="Pertanyaan Umum" subtitle="Hal yang sering ditanyakan tentang saya">
            <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
              <div className="space-y-3">
                {faqs.map((f, i) => <FAQItem key={i} {...f} index={i} />)}
              </div>
              <div className="grid grid-cols-2 gap-3 md:mt-10">
                {[
                  { v: "3+",  l: "Years Experience", color: "from-violet-500 to-indigo-600" },
                  { v: "50+", l: "Happy Clients",    color: "from-pink-500 to-rose-600"    },
                  { v: "30+", l: "Projects Done",    color: "from-orange-400 to-amber-500" },
                  { v: "10+", l: "Certifications",   color: "from-yellow-400 to-orange-400"},
                ].map((s, i) => (
                  <motion.div key={s.l}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                    whileHover={{
                      scale: 1.08,
                      y: -6,
                      boxShadow: "0 0 0 1px rgba(139,92,246,0.5), 0 16px 50px -10px rgba(139,92,246,0.4)",
                      background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(96,165,250,0.08))",
                    }}
                    className="glass rounded-3xl p-5 text-center cursor-default"
                  >
                    <motion.div
                      className={`text-3xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 250 }}
                      whileHover={{ scale: 1.15 }}
                    >
                      {s.v}
                    </motion.div>
                    <div className="text-[10px] text-muted-foreground mt-1">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </motion.div>

      </motion.div>
    </>
  );
}