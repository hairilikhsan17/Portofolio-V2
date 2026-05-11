import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useRef } from "react";
import { Search, X, ExternalLink, Github, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Hairil Ikhsan" },
      { name: "description", content: "Selected works and applications I've built with passion & precision." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  {
    title: "Company Profile",
    cat: "Company Profile",
    isNew: false,
    desc: "Modern corporate site with CMS integration and dynamic content management.",
    stack: ["Next.js", "Tailwind"],
    accent: "oklch(0.75 0.2 230)",
    accent2: "oklch(0.65 0.25 290)",
  },
  {
    title: "Web Portfolio V1",
    cat: "UI/UX",
    isNew: false,
    desc: "First version of a developer portfolio with clean minimal design.",
    stack: ["React", "Tailwind"],
    accent: "oklch(0.7 0.25 290)",
    accent2: "oklch(0.75 0.2 330)",
  },
  {
    title: "Organize Website DCC",
    cat: "Web App",
    isNew: true,
    desc: "Internal organization management system for Dicoding Community Chapter.",
    stack: ["Laravel", "MySQL"],
    accent: "oklch(0.65 0.25 25)",
    accent2: "oklch(0.75 0.2 60)",
  },
  {
    title: "Laundry Apps",
    cat: "Web App",
    isNew: true,
    desc: "Laundry management with real-time order tracking and customer portal.",
    stack: ["Laravel", "React", "Oracle", "Docker"],
    accent: "oklch(0.75 0.2 180)",
    accent2: "oklch(0.7 0.2 230)",
  },
  {
    title: "petShop Regression",
    cat: "Dashboard",
    isNew: false,
    desc: "Linear regression analytics dashboard for pet shop sales forecasting.",
    stack: ["Python", "Next.js"],
    accent: "oklch(0.8 0.18 95)",
    accent2: "oklch(0.75 0.2 130)",
  },
  {
    title: "Portfolio V2",
    cat: "UI/UX",
    isNew: true,
    desc: "Premium animated portfolio with glassmorphism and motion design.",
    stack: ["React", "Framer Motion"],
    accent: "oklch(0.7 0.25 290)",
    accent2: "oklch(0.75 0.2 230)",
  },
  {
    title: "Dicoding UNDIPA",
    cat: "Company Profile",
    isNew: false,
    desc: "Community website for the Dicoding Indonesia UNDIPA chapter.",
    stack: ["Laravel", "Tailwind"],
    accent: "oklch(0.65 0.25 330)",
    accent2: "oklch(0.7 0.25 290)",
  },
  {
    title: "Dipatalent",
    cat: "Web App",
    isNew: false,
    desc: "Achievement management system for tracking student accomplishments.",
    stack: ["Laravel", "MySQL"],
    accent: "oklch(0.75 0.2 200)",
    accent2: "oklch(0.7 0.2 230)",
  },
  {
    title: "Monitoring Keuangan",
    cat: "Dashboard",
    isNew: false,
    desc: "Finance monitoring system with real-time charts and budget tracking.",
    stack: ["Next.js", "Tailwind"],
    accent: "oklch(0.7 0.2 150)",
    accent2: "oklch(0.75 0.18 180)",
  },
  {
    title: "Teman Bus",
    cat: "Mobile App",
    isNew: false,
    desc: "Bus information system with live route tracking for commuters.",
    stack: ["React Native"],
    accent: "oklch(0.75 0.2 60)",
    accent2: "oklch(0.7 0.22 30)",
  },
];

const cats = ["All", "Web App", "Dashboard", "Company Profile", "Mobile App", "UI/UX"];

/* ── Page entry variants ── */
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 } as never,
  },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
};

/* ── Project Card ── */
function ProjectCard({
  p,
  i,
  onClick,
}: {
  p: (typeof projects)[number];
  i: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ delay: i * 0.07, type: "spring", stiffness: 240, damping: 22 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="relative rounded-3xl p-5 cursor-pointer overflow-hidden group"
      style={{
        background: hovered
          ? `linear-gradient(135deg, color-mix(in oklab,${p.accent} 18%,var(--card) 82%), color-mix(in oklab,${p.accent2} 14%,var(--card) 86%))`
          : "color-mix(in oklab, var(--card) 55%, transparent)",
        backdropFilter: "blur(16px) saturate(140%)",
        border: hovered
          ? `1px solid color-mix(in oklab, ${p.accent} 55%, transparent)`
          : "1px solid color-mix(in oklab, var(--neon) 22%, transparent)",
        boxShadow: hovered
          ? `0 0 0 1px color-mix(in oklab,${p.accent} 35%,transparent), 0 16px 50px -10px color-mix(in oklab,${p.accent} 55%,transparent)`
          : "none",
        transition: "background 0.35s ease, border 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      {/* Radial glow overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, color-mix(in oklab,${p.accent} 22%,transparent) 0%, transparent 65%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* NEW badge */}
      {p.isNew && (
        <motion.span
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, delay: i * 0.07 + 0.2 }}
          className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full text-white z-10"
          style={{ background: `linear-gradient(120deg, ${p.accent}, ${p.accent2})` }}
        >
          NEW
        </motion.span>
      )}

      {/* Thumbnail */}
      <div
        className="aspect-video rounded-2xl mb-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab,${p.accent} 40%,transparent), color-mix(in oklab,${p.accent2} 40%,transparent))`,
        }}
      >
        {/* Shimmer on hover */}
        <motion.div
          animate={hovered ? { x: ["-100%", "200%"] } : { x: "-100%" }}
          transition={{ duration: 1.0, ease: "linear" }}
          className="absolute inset-0 w-1/3 bg-white/15 skew-x-12 blur-sm pointer-events-none"
        />
        {/* Big letter */}
        <motion.div
          animate={hovered ? { scale: 1.15, opacity: 0.45 } : { scale: 1, opacity: 0.25 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center text-7xl font-black text-white select-none"
        >
          {p.title.charAt(0)}
        </motion.div>
        {/* Arrow icon on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `color-mix(in oklab, ${p.accent} 60%, transparent)` }}
            >
              <ArrowUpRight size={14} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category pill */}
      <motion.span
        animate={
          hovered
            ? { background: `color-mix(in oklab, ${p.accent} 25%, transparent)`, borderColor: `color-mix(in oklab, ${p.accent} 50%, transparent)` }
            : {}
        }
        className="pill !text-[10px] !py-0.5 transition-all duration-300"
      >
        {p.cat}
      </motion.span>

      {/* Title */}
      <h3
        className="font-bold text-lg mt-2 transition-all duration-300"
        style={
          hovered
            ? {
                background: `linear-gradient(120deg, ${p.accent}, ${p.accent2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }
            : {}
        }
      >
        {p.title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>

      {/* Stack pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {p.stack.map((s, si) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 + si * 0.04 + 0.15 }}
            className="pill !text-[10px] !py-0.5 transition-all duration-300"
            style={
              hovered
                ? {
                    background: `color-mix(in oklab, ${p.accent} 15%, transparent)`,
                    borderColor: `color-mix(in oklab, ${p.accent} 35%, transparent)`,
                  }
                : {}
            }
          >
            {s}
          </motion.span>
        ))}
      </div>

      {/* Bottom glow line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left"
        style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})` }}
      />
    </motion.div>
  );
}

function ProjectsPage() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<(typeof projects)[number] | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = projects.filter(
    (p) =>
      (active === "All" || p.cat === active) &&
      (p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.desc.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <motion.div className="px-4" variants={pageVariants} initial="hidden" animate="visible">
      {/* ── Hero ── */}
      <motion.section
        variants={heroItemVariants}
        className="max-w-5xl mx-auto text-center py-16 relative"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, 24, 0], x: [0, 32, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-8 left-1/4 w-36 h-36 rounded-full blur-3xl opacity-40"
            style={{ background: "var(--neon)" }}
          />
          <motion.div
            animate={{ y: [0, -28, 0], x: [0, -18, 0] }}
            transition={{ duration: 11, repeat: Infinity }}
            className="absolute bottom-0 right-1/4 w-44 h-44 rounded-full blur-3xl opacity-30"
            style={{ background: "var(--neon-2)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute top-1/2 right-1/3 w-28 h-28 rounded-full blur-3xl"
            style={{ background: "oklch(0.65 0.25 330)" }}
          />
        </div>

        <motion.span variants={heroItemVariants} className="pill">
          PORTFOLIO
        </motion.span>
        <motion.h1
          variants={heroItemVariants}
          className="mt-4 text-5xl md:text-6xl font-bold tracking-tight"
        >
          Featured{" "}
          <span className="text-gradient">Projects</span>
        </motion.h1>
        <motion.p
          variants={heroItemVariants}
          className="text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          Selected works and applications I've built with passion & precision.
        </motion.p>

        {/* Stats row */}
        <motion.div
          variants={heroItemVariants}
          className="flex flex-wrap justify-center gap-6 mt-8"
        >
          {[
            { v: projects.length, l: "Total Projects" },
            { v: projects.filter((p) => p.isNew).length, l: "Recent Works" },
            { v: cats.length - 1, l: "Categories" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Search + Filter — centered ── */}
      <motion.div
        variants={heroItemVariants}
        className="max-w-3xl mx-auto flex flex-col items-center gap-4 mb-10"
      >
        {/* Search bar */}
        <motion.div
          animate={
            searchFocused
              ? {
                  boxShadow:
                    "0 0 0 2px color-mix(in oklab,var(--neon) 50%,transparent), 0 8px 30px -8px color-mix(in oklab,var(--neon) 40%,transparent)",
                }
              : { boxShadow: "none" }
          }
          transition={{ duration: 0.25 }}
          className="glass rounded-full px-5 py-3 flex items-center gap-3 w-full max-w-sm"
          style={{
            border: searchFocused
              ? "1px solid color-mix(in oklab, var(--neon) 50%, transparent)"
              : "1px solid color-mix(in oklab, var(--neon) 22%, transparent)",
            transition: "border 0.25s ease",
          }}
        >
          <motion.div animate={searchFocused ? { rotate: 0, scale: 1.1 } : { rotate: 0, scale: 1 }}>
            <Search
              size={16}
              style={{ color: searchFocused ? "var(--neon)" : "var(--muted-foreground)" }}
              className="transition-colors duration-200 shrink-0"
            />
          </motion.div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search projects..."
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          <AnimatePresence>
            {q && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setQ("")}
                className="p-0.5 rounded-full hover:bg-secondary transition"
              >
                <X size={13} className="text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Category filter pills — centered */}
        <div className="flex flex-wrap gap-2 justify-center">
          {cats.map((c) => {
            const isActive = active === c;
            return (
              <motion.button
                key={c}
                onClick={() => setActive(c)}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.93 }}
                className="relative px-4 py-1.5 rounded-full text-xs font-medium overflow-hidden transition-colors duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(120deg, var(--neon), var(--neon-2))"
                    : "color-mix(in oklab, var(--card) 55%, transparent)",
                  backdropFilter: "blur(12px)",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid color-mix(in oklab, var(--neon) 22%, transparent)",
                  color: isActive ? "white" : "var(--muted-foreground)",
                  boxShadow: isActive
                    ? "0 4px 20px -6px color-mix(in oklab, var(--neon) 60%, transparent)"
                    : "none",
                }}
              >
                {/* Hover shimmer for inactive */}
                {!isActive && (
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "200%", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-1/2 bg-white/10 skew-x-12 pointer-events-none"
                  />
                )}
                {c}
                {/* Count badge */}
                <span
                  className="ml-1.5 text-[9px] opacity-70"
                >
                  {c === "All" ? projects.length : projects.filter((p) => p.cat === c).length}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto pb-24">
        {/* Result count */}
        <motion.div
          layout
          className="text-center mb-6 text-sm text-muted-foreground"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${active}-${q}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
            >
              Showing <span className="text-gradient font-semibold">{filtered.length}</span> project
              {filtered.length !== 1 ? "s" : ""}
              {active !== "All" && (
                <> in <span className="text-gradient font-semibold">{active}</span></>
              )}
              {q && (
                <> matching <span className="text-gradient font-semibold">"{q}"</span></>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} p={p} i={i} onClick={() => setOpen(p)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted-foreground">No projects found for "{q}"</p>
              <button
                onClick={() => { setQ(""); setActive("All"); }}
                className="btn-ghost mt-4 text-sm"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modal ── */}
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
              className="glass-strong rounded-3xl p-6 md:p-8 max-w-2xl w-full relative max-h-[85vh] overflow-y-auto"
              style={{
                boxShadow: `0 0 0 1px color-mix(in oklab,${open.accent} 35%,transparent), 0 30px 80px -20px color-mix(in oklab,${open.accent} 50%,transparent)`,
              }}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition"
              >
                <X size={18} />
              </button>

              {/* Modal thumbnail */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="aspect-video rounded-2xl flex items-center justify-center mb-5 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, color-mix(in oklab,${open.accent} 60%,transparent), color-mix(in oklab,${open.accent2} 60%,transparent))`,
                }}
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
                  className="absolute inset-0 w-1/3 bg-white/20 skew-x-12 blur-sm"
                />
                <span className="text-8xl font-black text-white/30 select-none">
                  {open.title.charAt(0)}
                </span>
              </motion.div>

              <span className="pill">{open.cat}</span>
              <h3 className="text-3xl font-bold mt-3">
                <span
                  style={{
                    background: `linear-gradient(120deg, ${open.accent}, ${open.accent2})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {open.title}
                </span>
              </h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{open.desc}</p>

              <h4 className="font-semibold mt-5 mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {open.stack.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="pill"
                    style={{
                      background: `color-mix(in oklab, ${open.accent} 15%, transparent)`,
                      borderColor: `color-mix(in oklab, ${open.accent} 35%, transparent)`,
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setOpen(null)} className="btn-ghost">
                  <X size={14} /> Close
                </button>
                <a
                  href="#"
                  className="btn-primary"
                  style={{
                    background: `linear-gradient(120deg, ${open.accent}, ${open.accent2})`,
                  }}
                >
                  <Github size={14} /> Source
                </a>
                <a href="#" className="btn-primary">
                  Visit Project <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
