import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Award, X, ExternalLink, Download, ChevronLeft, ChevronRight, BadgeCheck, Copy, Check, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — Hairil Ikhsan" },
      { name: "description", content: "Professional credentials and continuous learning journey." },
    ],
  }),
  component: CertificatesPage,
});

/* ─── CSS keyframe gradient cycling (every 3 s, 6 palettes) ──── */
const GRADIENT_CYCLE_STYLE = `
@keyframes gradientCycle {
  0%   { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
  16%  { background-image: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%); }
  33%  { background-image: linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%); }
  50%  { background-image: linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%); }
  66%  { background-image: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%); }
  83%  { background-image: linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #a3e635 100%); }
  100% { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
}
@keyframes gradientCycleBg {
  0%   { background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
  16%  { background: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%); }
  33%  { background: linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%); }
  50%  { background: linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%); }
  66%  { background: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%); }
  83%  { background: linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #a3e635 100%); }
  100% { background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
}
.gradient-text-cycle {
  background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: gradientCycle 18s steps(1, end) infinite;
}
.gradient-line-cycle {
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  animation: gradientCycleBg 18s steps(1, end) infinite;
}
.stat-number {
  background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: gradientCycle 18s steps(1, end) infinite;
  display: inline-block;
}
`;

/* ─── Compact Section Header ─────────────────────────────────── */
function Section({ title, badge, subtitle, children }: { title: string; badge: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="max-w-6xl mx-auto py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-7"
      >
        {/* Badge */}
        <span className="pill" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <span className="gradient-text-cycle" style={{ fontWeight: 600 }}>{badge}</span>
        </span>

        {/* Title */}
        <h2 className="gradient-text-cycle text-3xl md:text-4xl font-bold mt-3 tracking-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="gradient-text-cycle mt-2 text-sm" style={{ opacity: 0.85 }}>
            {subtitle}
          </p>
        )}

        {/* Decorative underline */}
        <motion.div
          className="gradient-line-cycle mx-auto mt-3 h-px rounded-full"
          style={{ maxWidth: 100 }}
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

const certs = [
  { title: "Microsoft Azure AI Foundry", issuer: "Microsoft", year: "2026", cat: "Cloud", featured: true, credentialId: "0LZ0Y33E3X65", skills: ["Azure", "AI", "Cloud", "Machine Learning"] },
  { title: "Junior Web Developer", issuer: "BNSP", year: "2025", cat: "Web Development", credentialId: "", skills: ["Laravel", "MySQL", "HTML", "CSS", "JavaScript"] },
  { title: "Junior Network Administrator", issuer: "BNSP", year: "2025", cat: "Networking", credentialId: "", skills: ["Cisco", "TCP/IP", "Routing"] },
  { title: "AI Talent Development Nation", issuer: "Kominfo", year: "2025", cat: "AI & Data", credentialId: "", skills: ["Python", "Machine Learning", "Deep Learning"] },
  { title: "Dicoding AI Engineer Entry", issuer: "Dicoding", year: "2025", cat: "AI & Data", credentialId: "", skills: ["TensorFlow", "Python", "Neural Networks"] },
  { title: "IBM Granite", issuer: "IBM", year: "2026", cat: "AI & Data", credentialId: "", skills: ["IBM Watson", "Generative AI", "LLM"] },
  { title: "Pemrograman Python", issuer: "Dicoding", year: "2024", cat: "Programming", credentialId: "", skills: ["Python", "OOP", "Data Structures"] },
  { title: "Pemateri Cyber Security", issuer: "UNDIPA", year: "2025", cat: "Cyber Security", credentialId: "", skills: ["Ethical Hacking", "Network Security", "OWASP"] },
  { title: "Hackathon BIKN", issuer: "BIKN", year: "2025", cat: "Workshop", credentialId: "", skills: ["Problem Solving", "Teamwork", "Innovation"] },
  { title: "Asisten Dosen", issuer: "UNDIPA", year: "2024", cat: "Workshop", credentialId: "", skills: ["Teaching", "Research", "Mentoring"] },
];

const cats = ["All", "Web Development", "Cloud", "AI & Data", "Cyber Security", "Networking", "Programming", "Workshop"];

const achievements = [
  { v: 10, suffix: "+", l: "Certifications" },
  { v: 500, suffix: "+", l: "Learning Hours" },
  { v: 8, suffix: "", l: "Workshops" },
  { v: 15, suffix: "+", l: "Tech Skills" },
];

const timelineData = [
  { year: "2024", color: "var(--neon)", desc: "Started professional certification journey" },
  { year: "2025", color: "var(--neon-2)", desc: "Expanded into AI, Cloud & Security domains" },
  { year: "2026", color: "var(--neon)", desc: "Advanced cloud & AI specializations" },
];

/* ── Animated counter — motionVal is stable, intentionally excluded from deps ── */
function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
    // motionVal is a stable MotionValue ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* ── Professional Credentials Slider ── */
const featuredCerts = certs.filter((c) => c.featured || ["Junior Web Developer", "IBM Granite", "AI Talent Development Nation"].includes(c.title));

function CredentialsSlider() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const cert = featuredCerts[idx];

  const go = (d: number) => {
    setDir(d);
    setIdx((i) => (i + d + featuredCerts.length) % featuredCerts.length);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="relative rounded-3xl glass-strong glow p-1">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={cert.title}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid md:grid-cols-[1fr_1.2fr] gap-6 p-6 md:p-8 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.03, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}
            >
              {/* shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 w-1/3 bg-white/20 skew-x-12 blur-sm"
              />
              <BadgeCheck className="text-white drop-shadow-lg" size={64} strokeWidth={1.5} />
            </motion.div>
            <div className="flex flex-col justify-center">
              <span className="pill w-fit">⭐ Featured</span>
              <h2 className="text-3xl font-bold mt-3">{cert.title}</h2>
              <p className="text-muted-foreground mt-1">
                {cert.issuer} · {cert.year}
              </p>
              <div className="flex gap-2 mt-3">
                <span className="pill">{cert.cat}</span>
              </div>
              <button className="btn-primary w-fit mt-5">
                View Certificate <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows + indicators — di BAWAH form */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Prev button */}
        <button
          onClick={() => go(-1)}
          className="p-2.5 rounded-full glass hover:glow-sm transition"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {featuredCerts.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
              animate={{ width: i === idx ? 28 : 8, opacity: i === idx ? 1 : 0.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="h-2 rounded-full"
              style={{ background: i === idx ? "var(--neon)" : "var(--muted-foreground)" }}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => go(1)}
          className="p-2.5 rounded-full glass hover:glow-sm transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ── Certificate Card ── */
function CertCard({ c, onClick, i }: { c: typeof certs[number]; onClick: () => void; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="relative rounded-3xl p-5 cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? "linear-gradient(135deg, color-mix(in oklab,var(--neon) 18%,var(--card) 82%), color-mix(in oklab,var(--neon-2) 18%,var(--card) 82%))"
          : "color-mix(in oklab, var(--card) 55%, transparent)",
        backdropFilter: "blur(16px) saturate(140%)",
        border: hovered
          ? "1px solid color-mix(in oklab, var(--neon) 60%, transparent)"
          : "1px solid color-mix(in oklab, var(--neon) 25%, transparent)",
        boxShadow: hovered
          ? "0 0 0 1px color-mix(in oklab,var(--neon) 40%,transparent), 0 12px 40px -10px color-mix(in oklab,var(--neon) 60%,transparent)"
          : "none",
      }}
    >
      {/* Animated gradient overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, color-mix(in oklab,var(--neon) 20%,transparent) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="aspect-video rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab,var(--neon) 30%,transparent), color-mix(in oklab,var(--neon-2) 30%,transparent))",
        }}
      >
        <motion.div
          animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 1.2, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-white/15 skew-x-12 blur-sm"
        />
        <motion.div animate={hovered ? { rotate: 360, scale: 1.15 } : { rotate: 0, scale: 1 }} transition={{ duration: 0.5 }}>
          <BadgeCheck className="text-white/80" size={36} strokeWidth={1.5} />
        </motion.div>
      </div>

      <span className="pill !text-[10px]">{c.cat}</span>
      <h3 className="font-bold mt-2 relative z-10">{c.title}</h3>
      <p className="text-xs text-muted-foreground mt-1 relative z-10">
        {c.issuer} · {c.year}
      </p>

      {/* Skills preview — max 2 + overflow badge */}
      <div className="flex flex-wrap gap-1.5 mt-2 relative z-10">
        {c.skills.slice(0, 2).map((s) => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "color-mix(in oklab, var(--neon) 12%, transparent)",
              border: "1px solid color-mix(in oklab, var(--neon) 28%, transparent)",
              color: "color-mix(in oklab, var(--neon) 90%, white)",
            }}
          >
            {s}
          </span>
        ))}
        {c.skills.length > 2 && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: "color-mix(in oklab, var(--neon-2) 15%, transparent)",
              border: "1px solid color-mix(in oklab, var(--neon-2) 30%, transparent)",
              color: "color-mix(in oklab, var(--neon-2) 90%, white)",
            }}
          >
            +{c.skills.length - 2}
          </span>
        )}
      </div>

      {/* View Details button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-3 w-full relative z-10 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: hovered
            ? "linear-gradient(120deg, var(--neon), var(--neon-2))"
            : "rgba(255,255,255,0.06)",
          border: hovered
            ? "1px solid transparent"
            : "1px solid rgba(255,255,255,0.1)",
          color: hovered ? "white" : "rgba(255,255,255,0.7)",
        }}
      >
        <ExternalLink size={11} />
        View Details
      </motion.button>

      {/* Bottom glow line on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        style={{ background: "linear-gradient(90deg, var(--neon), var(--neon-2))" }}
      />
    </motion.div>
  );
}

/* ── Timeline Item ── */
function TimelineItem({ y, i, color, desc }: { y: string; i: number; color: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = certs.filter((c) => c.year === y).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: i * 0.2, type: "spring", stiffness: 200, damping: 22 }}
      className="relative pl-12 pb-10"
    >
      {/* Dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: i * 0.2 + 0.1, type: "spring", stiffness: 400 }}
        className="absolute left-1.5 w-5 h-5 rounded-full border-2 border-background"
        style={{ background: color, boxShadow: `0 0 12px 3px ${color}80` }}
      />

      <motion.div
        whileHover={{ x: 6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="glass rounded-2xl p-5 cursor-default hover:glow transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">{y}</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
            className="pill"
          >
            {count} certs
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(count / 5) * 100}%` } : {}}
            transition={{ delay: i * 0.2 + 0.4, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, var(--neon-2))` }}
          />
        </div>

        {/* Cert list */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {certs
            .filter((c) => c.year === y)
            .map((c) => (
              <motion.span
                key={c.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.2 + 0.5 }}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in oklab, var(--neon) 10%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--neon) 20%, transparent)",
                }}
              >
                {c.title}
              </motion.span>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Achievement Card ── */
function AchievementCard({ v, suffix, l, i }: { v: number; suffix: string; l: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ y: -8, scale: 1.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-3xl p-6 text-center overflow-hidden cursor-default transition-all duration-300"
      style={{
        background: hovered
          ? "linear-gradient(135deg, color-mix(in oklab,var(--neon) 20%,var(--card) 80%), color-mix(in oklab,var(--neon-2) 20%,var(--card) 80%))"
          : "color-mix(in oklab, var(--card) 55%, transparent)",
        backdropFilter: "blur(16px)",
        border: hovered
          ? "1px solid color-mix(in oklab, var(--neon) 60%, transparent)"
          : "1px solid color-mix(in oklab, var(--neon) 25%, transparent)",
        boxShadow: hovered
          ? "0 0 0 1px color-mix(in oklab,var(--neon) 40%,transparent), 0 16px 50px -10px color-mix(in oklab,var(--neon) 70%,transparent)"
          : "none",
      }}
    >
      {/* Particle burst on hover */}
      <AnimatePresence>
        {hovered &&
          [0, 1, 2, 3, 4, 5].map((p) => (
            <motion.div
              key={p}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: Math.cos((p / 6) * Math.PI * 2) * 40,
                y: Math.sin((p / 6) * Math.PI * 2) * 40,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{ background: p % 2 === 0 ? "var(--neon)" : "var(--neon-2)" }}
            />
          ))}
      </AnimatePresence>

      <div className="text-4xl font-bold">
        <span className="stat-number">
          <AnimatedNumber target={v} suffix={suffix} />
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{l}</div>

      {/* Bottom glow line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-center"
        style={{ background: "linear-gradient(90deg, var(--neon), var(--neon-2))" }}
      />
    </motion.div>
  );
}

/* ── Credential ID Box — persis seperti gambar, klik untuk copy ── */
function CredentialIdBox({ credentialId }: { credentialId: string }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(credentialId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="mt-3 rounded-xl relative overflow-hidden cursor-pointer"
      style={{
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: hovered
          ? "1px solid rgba(167,139,250,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        transition: "background 0.25s ease, border 0.25s ease",
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleCopy}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      title="Click to copy"
    >
      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(167,139,250,0.15) 50%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      <div className="px-4 py-3 relative z-10">
        {/* Label kecil di atas */}
        <p className="text-xs text-muted-foreground mb-1">Credential ID</p>

        {/* ID bold di bawah — font mono seperti gambar */}
        <div className="flex items-center justify-between">
          <motion.p
            className="font-mono font-bold text-sm tracking-widest"
            animate={{ color: hovered ? "#a78bfa" : "rgba(255,255,255,0.92)" }}
            transition={{ duration: 0.2 }}
          >
            {credentialId}
          </motion.p>

          {/* Copy icon — muncul saat hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                className="ml-3 flex-shrink-0"
              >
                {copied
                  ? <Check size={13} style={{ color: "#39d353" }} />
                  : <Copy size={13} style={{ color: "rgba(167,139,250,0.7)" }} />
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Copied feedback */}
        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs mt-1"
              style={{ color: "#39d353" }}
            >
              ✓ Copied!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom glow line on hover */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)" }}
      />
    </motion.div>
  );
}

/* ── Skills Section — max 2 visible, +N overflow with expand popup ── */
function SkillsSection({ skills, cat }: { skills: string[]; cat: string }) {
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 2;
  const visible = skills.slice(0, MAX_VISIBLE);
  const overflow = skills.slice(MAX_VISIBLE);

  return (
    <div className="mt-3 relative">
      <p className="text-xs text-muted-foreground mb-2">Skills</p>
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category pill — always first */}
        <span
          className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{
            background: "linear-gradient(120deg, var(--neon), var(--neon-2))",
            color: "white",
            border: "none",
          }}
        >
          {cat}
        </span>

        {/* First 2 skills */}
        {visible.map((s) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              background: "color-mix(in oklab, var(--neon) 12%, transparent)",
              border: "1px solid color-mix(in oklab, var(--neon) 30%, transparent)",
              color: "color-mix(in oklab, var(--neon) 90%, white)",
            }}
          >
            {s}
          </motion.span>
        ))}

        {/* +N overflow button */}
        {overflow.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(true)}
            className="text-xs px-3 py-1 rounded-full font-bold cursor-pointer transition-all"
            style={{
              background: "linear-gradient(120deg, color-mix(in oklab, var(--neon-2) 25%, transparent), color-mix(in oklab, var(--neon) 25%, transparent))",
              border: "1px solid color-mix(in oklab, var(--neon-2) 45%, transparent)",
              color: "color-mix(in oklab, var(--neon-2) 95%, white)",
            }}
          >
            +{overflow.length}
          </motion.button>
        )}
      </div>

      {/* All skills popup overlay */}
      <AnimatePresence>
        {showAll && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200]"
              onClick={() => setShowAll(false)}
            />
            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="absolute left-0 z-[201] mt-2 rounded-2xl p-4 min-w-[220px]"
              style={{
                background: "color-mix(in oklab, var(--card) 92%, transparent)",
                backdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid color-mix(in oklab, var(--neon) 35%, transparent)",
                boxShadow: "0 8px 32px -8px color-mix(in oklab, var(--neon) 50%, transparent), 0 0 0 1px color-mix(in oklab, var(--neon) 15%, transparent)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Skills</p>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAll(false)}
                  className="p-1 rounded-full hover:bg-secondary transition"
                >
                  <X size={12} />
                </motion.button>
              </div>

              {/* All skills */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    background: "linear-gradient(120deg, var(--neon), var(--neon-2))",
                    color: "white",
                  }}
                >
                  {cat}
                </span>
                {skills.map((s, idx) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "color-mix(in oklab, var(--neon) 12%, transparent)",
                      border: "1px solid color-mix(in oklab, var(--neon) 30%, transparent)",
                      color: "color-mix(in oklab, var(--neon) 90%, white)",
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px rounded-b-2xl"
                style={{ background: "linear-gradient(90deg, var(--neon), var(--neon-2))" }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page entry animation ── */
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 } as never,
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

function CertificatesPage() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<(typeof certs)[number] | null>(null);
  const [modalIdx, setModalIdx] = useState(0);
  const [modalDir, setModalDir] = useState(1);
  const filtered = certs.filter((c) => active === "All" || c.cat === active);

  // When a card is clicked, find its index in the full certs list
  const openCert = (c: typeof certs[number]) => {
    setModalIdx(certs.indexOf(c));
    setModalDir(1);
    setOpen(c);
  };

  const goModal = (d: number) => {
    const next = (modalIdx + d + certs.length) % certs.length;
    setModalDir(d);
    setModalIdx(next);
    setOpen(certs[next]);
  };

  const modalVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  };

  return (
    <motion.div className="px-4" variants={pageVariants} initial="hidden" animate="visible">
      {/* Single style injection for the whole page */}
      <style>{GRADIENT_CYCLE_STYLE}</style>

      {/* Hero */}
      <motion.section variants={itemVariants} className="max-w-5xl mx-auto text-center py-10 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-1/4 w-32 h-32 rounded-full blur-3xl"
            style={{ background: "var(--neon)" }}
          />
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-50"
            style={{ background: "var(--neon-2)" }}
          />
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, -25, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full blur-3xl opacity-30"
            style={{ background: "var(--neon)" }}
          />
        </div>

        <motion.span variants={itemVariants} className="pill" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <span className="gradient-text-cycle" style={{ fontWeight: 600 }}>CERTIFICATIONS</span>
        </motion.span>

        <motion.h1 variants={itemVariants} className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">
          Professional{" "}
          <span className="gradient-text-cycle">Credentials</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="gradient-text-cycle mt-4 text-sm" style={{ opacity: 0.75 }}>
          Continuous learning &amp; professional development journey.
        </motion.p>
      </motion.section>

      {/* Slider */}
      <motion.div variants={itemVariants}>
        <CredentialsSlider />
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={itemVariants} className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center mt-6">
        {cats.map((c) => (
          <motion.button
            key={c}
            onClick={() => setActive(c)}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              active === c ? "btn-primary !py-1.5 !px-4" : "glass hover:glow-sm"
            }`}
          >
            {c}
          </motion.button>
        ))}
      </motion.div>

      {/* All Certificates */}
      <Section badge="Achievements" title="All Certificates" subtitle="">
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered
              .filter((c) => !c.featured)
              .map((c, i) => (
                <CertCard key={c.title} c={c} i={i} onClick={() => openCert(c)} />
              ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      {/* Learning Journey */}
      <Section badge="Timeline" title="Learning Journey" subtitle="Year over year">
        <div className="relative max-w-3xl mx-auto">
          {/* Animated vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-4 top-0 bottom-0 w-0.5 origin-top"
            style={{ background: "linear-gradient(to bottom, var(--neon), var(--neon-2))" }}
          />
          {timelineData.map((t, i) => (
            <TimelineItem key={t.year} y={t.year} i={i} color={t.color} desc={t.desc} />
          ))}
        </div>
      </Section>

      {/* Achievements */}
      <Section badge="Stats" title="Achievements" subtitle="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((s, i) => (
            <AchievementCard key={s.l} v={s.v} suffix={s.suffix} l={s.l} i={i} />
          ))}
        </div>
      </Section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-3xl max-w-3xl w-full glow relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Animated top accent line */}
              <div
                className="absolute top-0 left-0 h-[2px] w-full z-10"
                style={{ background: "linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee, #f472b6)" }}
              />

              {/* Close button */}
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition z-20"
              >
                <X size={18} />
              </button>

              {/* Sliding cert content */}
              <AnimatePresence custom={modalDir} mode="wait">
                <motion.div
                  key={open.title}
                  custom={modalDir}
                  variants={modalVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="grid md:grid-cols-[1fr_1fr] gap-0"
                >
                  {/* Kiri: info */}
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight pr-8">{open.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Issued by <span className="text-white font-semibold">{open.issuer}</span>
                      </p>

                      {/* Issued Date */}
                      <div className="mt-4 rounded-xl p-3 flex items-center gap-3"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <motion.div
                          animate={{ rotate: [0, -8, 8, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          style={{ color: "var(--neon)" }}
                        >
                          <CalendarDays size={20} />
                        </motion.div>
                        <div>
                          <p className="text-xs text-muted-foreground">Issued Date</p>
                          <p className="font-semibold text-sm">{open.year}</p>
                        </div>
                      </div>

                      {/* Credential ID — dengan copy button dan animasi */}
                      {open.credentialId && (
                        <CredentialIdBox credentialId={open.credentialId} />
                      )}

                      {/* Skills — max 2 visible + overflow popup */}
                      <SkillsSection skills={open.skills} cat={open.cat} />
                    </div>

                    <div className="flex gap-2 mt-6">
                      <a href="#" className="btn-ghost flex-1 justify-center text-sm">
                        <Download size={13} /> Download
                      </a>
                      <a href="#" className="btn-primary flex-1 justify-center text-sm">
                        Verify <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>

                  {/* Kanan: gambar sertifikat */}
                  <div className="p-4 md:p-6 flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.03)", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}
                    >
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                        className="absolute inset-0 w-1/3 bg-white/20 skew-x-12 blur-sm"
                      />
                      {/* Icon keren — BadgeCheck */}
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <BadgeCheck className="text-white drop-shadow-lg" size={72} strokeWidth={1.5} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* ── Nav arrows + counter di BAWAH — sejajar ── */}
              <div className="flex items-center justify-between px-6 py-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Prev */}
                <button
                  onClick={() => goModal(-1)}
                  className="p-2.5 rounded-full glass hover:glow-sm transition"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Counter */}
                <span className="text-sm text-muted-foreground font-medium">
                  {modalIdx + 1} / {certs.length}
                </span>

                {/* Next */}
                <button
                  onClick={() => goModal(1)}
                  className="p-2.5 rounded-full glass hover:glow-sm transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
