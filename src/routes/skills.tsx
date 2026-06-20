import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Code2, Server, Database, Cloud, Wrench, Palette, Zap, Sparkles, ShieldCheck, Send, Rocket, Heart, Trophy, Brain, Briefcase } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiLaravel, SiNodedotjs, SiPython, SiExpress,
  SiMysql, SiPostgresql, SiMongodb, SiDocker, SiFirebase,
  SiGit, SiGithubactions, SiVite, SiPostman, SiFigma, SiFramer, SiVercel, SiGithub,
} from "react-icons/si";
import { FaAws, FaDatabase } from "react-icons/fa";
import { PiMicrosoftExcelLogo, PiMicrosoftPowerpointLogo, PiMicrosoftWordLogo } from "react-icons/pi";

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
/* Fix: counter numbers inside gradient wrapper must be visible */
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

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Hairil Ikhsan" },
      { name: "description", content: "Skills, expertise and services for modern web & cloud development." },
    ],
  }),
  component: SkillsPage,
});

const categories = {
  Frontend: { Icon: Code2, items: [
    { name: "React.js", v: 95, Logo: SiReact, color: "#61DAFB" },
    { name: "Next.js", v: 90, Logo: SiNextdotjs, color: "#ffffff" },
    { name: "TypeScript", v: 88, Logo: SiTypescript, color: "#3178C6" },
    { name: "Tailwind CSS", v: 93, Logo: SiTailwindcss, color: "#06B6D4" },
  ]},
  Backend: { Icon: Server, items: [
    { name: "Laravel", v: 92, Logo: SiLaravel, color: "#FF2D20" },
    { name: "Node.js", v: 87, Logo: SiNodedotjs, color: "#339933" },
    { name: "Python", v: 85, Logo: SiPython, color: "#3776AB" },
    { name: "Express", v: 82, Logo: SiExpress, color: "#ffffff" },
  ]},
  Database: { Icon: Database, items: [
    { name: "MySQL", v: 88, Logo: SiMysql, color: "#4479A1" },
    { name: "PostgreSQL", v: 85, Logo: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", v: 78, Logo: SiMongodb, color: "#47A248" },
    { name: "Oracle", v: 75, Logo: FaDatabase, color: "#F80000" },
  ]},
  Cloud: { Icon: Cloud, items: [
    { name: "AWS", v: 80, Logo: FaAws, color: "#FF9900" },
    { name: "Vercel", v: 88, Logo: SiVercel, color: "#ffffff" },
    { name: "Docker", v: 85, Logo: SiDocker, color: "#2496ED" },
    { name: "Firebase", v: 82, Logo: SiFirebase, color: "#FFCA28" },
  ]},
  Tools: { Icon: Wrench, items: [
    { name: "Git", v: 92, Logo: SiGit, color: "#F05032" },
    { name: "GitHub Actions", v: 80, Logo: SiGithubactions, color: "#2088FF" },
    { name: "Vite", v: 88, Logo: SiVite, color: "#646CFF" },
    { name: "Postman", v: 85, Logo: SiPostman, color: "#FF6C37" },
  ]},
  "UI/UX": { Icon: Palette, items: [
    { name: "Figma", v: 88, Logo: SiFigma, color: "#F24E1E" },
    { name: "Framer Motion", v: 85, Logo: SiFramer, color: "#ffffff" },
    { name: "Design Systems", v: 82, Logo: Sparkles as any, color: "#a855f7" },
  ]},
  "Microsoft Office": { Icon: Briefcase, items: [
    { name: "Excel", v: 95, Logo: PiMicrosoftExcelLogo, color: "#107C41" },
    { name: "PowerPoint", v: 97, Logo: PiMicrosoftPowerpointLogo, color: "#C43E1C" },
    { name: "Word", v: 100, Logo: PiMicrosoftWordLogo, color: "#2B579A" },
  ]},
};

const allTools = [
  { name: "React", Logo: SiReact, color: "#61DAFB" },
  { name: "Next.js", Logo: SiNextdotjs, color: "#ffffff" },
  { name: "Laravel", Logo: SiLaravel, color: "#FF2D20" },
  { name: "TypeScript", Logo: SiTypescript, color: "#3178C6" },
  { name: "MySQL", Logo: SiMysql, color: "#4479A1" },
  { name: "Tailwind", Logo: SiTailwindcss, color: "#06B6D4" },
  { name: "Docker", Logo: SiDocker, color: "#2496ED" },
  { name: "Firebase", Logo: SiFirebase, color: "#FFCA28" },
  { name: "GitHub", Logo: SiGithub, color: "#ffffff" },
  { name: "Figma", Logo: SiFigma, color: "#F24E1E" },
  { name: "Python", Logo: SiPython, color: "#3776AB" },
  { name: "Node.js", Logo: SiNodedotjs, color: "#339933" },
  { name: "AWS", Logo: FaAws, color: "#FF9900" },
  { name: "Vite", Logo: SiVite, color: "#646CFF" },
  { name: "Vercel", Logo: SiVercel, color: "#ffffff" },
  { name: "Postman", Logo: SiPostman, color: "#FF6C37" },
  { name: "Excel", Logo: PiMicrosoftExcelLogo, color: "#107C41" },
  { name: "PowerPoint", Logo: PiMicrosoftPowerpointLogo, color: "#C43E1C" },
  { name: "Word", Logo: PiMicrosoftWordLogo, color: "#2B579A" },
];

// Animated counter — mv is a stable MotionValue object, safe to omit from deps
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 2 });
    // mv is a stable MotionValue ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to]);
  return <motion.span ref={ref} style={{ display: "inline" }}>{display}</motion.span>;
}

// Pre-computed fall offsets per icon index — no Math.random() at render time
const FALL_OFFSETS = [
  { x: 60, rot: 200 }, { x: -80, rot: -300 }, { x: 40, rot: 250 }, { x: -60, rot: -180 },
  { x: 90, rot: 320 }, { x: -40, rot: -240 }, { x: 70, rot: 180 }, { x: -90, rot: 280 },
  { x: 50, rot: -350 }, { x: -70, rot: 220 }, { x: 80, rot: -260 }, { x: -50, rot: 300 },
  { x: 30, rot: -200 }, { x: -100, rot: 340 }, { x: 100, rot: -280 }, { x: -30, rot: 160 },
];

// Falling tool icon — fixed: don't pass empty {} to animate, use key to reset
function ToolIcon({ tool, idx }: { tool: typeof allTools[0]; idx: number }) {
  const [fallen, setFallen] = useState(false);
  const Logo = tool.Logo;
  const { x: fallX, rot: fallRot } = FALL_OFFSETS[idx % FALL_OFFSETS.length];

  const handleClick = () => {
    if (fallen) return;
    setFallen(true);
    setTimeout(() => setFallen(false), 2200);
  };

  return (
    <motion.button
      key={fallen ? "fallen" : "normal"}
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: -80, rotate: -180, scale: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: idx * 0.06 }}
      {...(fallen ? {
        animate: {
          y: [0, -30, 600],
          x: [0, fallX],
          rotate: [0, fallRot],
          opacity: [1, 1, 0],
        },
        transition: { duration: 0.9, ease: "easeIn" },
      } : {})}
      whileHover={fallen ? {} : { scale: 1.15, y: -6 }}
      className="glass rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer group hover:glow min-w-[100px]"
    >
      <Logo size={36} style={{ color: tool.color }} className="drop-shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-110" />
      <span className="text-xs font-medium">{tool.name}</span>
    </motion.button>
  );
}

function SkillsPage() {
  const [active, setActive] = useState<keyof typeof categories>("Frontend");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("Website");
  const [timeline, setTimeline] = useState("1 Week");

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !description) {
      alert("Please fill in all fields (Full Name, Email, and Project Description) first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://formsubmit.co/ajax/hairilikhsan17@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: fullName,
          Email: email,
          Description: description,
          "Project Type": projectType,
          Timeline: timeline
        })
      });

      const result = await response.json();

      if (response.ok && result.success === "true") {
        setSubmitStatus("success");
        // Clear fields on success
        setFullName("");
        setEmail("");
        setDescription("");
      } else {
        throw new Error(result.message || "Failed to send message.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4">
      {/* Single style injection for the whole page */}
      <style>{GRADIENT_CYCLE_STYLE}</style>

      <section className="max-w-5xl mx-auto text-center py-10">
        <span className="pill" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <span className="gradient-text-cycle" style={{ fontWeight: 600 }}>SKILLS & SERVICES</span>
        </span>
        <h1 className="gradient-text-cycle mt-3 text-5xl md:text-6xl font-bold tracking-tight">
          Skills &amp; Expertise
        </h1>
        <p className="gradient-text-cycle mt-3 text-sm" style={{ opacity: 0.8 }}>
          Building scalable, modern, and user-focused digital experiences.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="glass rounded-3xl p-3 h-fit lg:sticky lg:top-32 flex lg:flex-col gap-1 overflow-x-auto">
          {(Object.keys(categories) as (keyof typeof categories)[]).map((k) => {
            const { Icon } = categories[k];
            const isActive = active === k;
            return (
              <button
                key={k}
                onClick={() => setActive(k)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm whitespace-nowrap transition ${isActive ? "btn-primary !rounded-2xl" : "hover:bg-secondary text-muted-foreground"}`}
              >
                <Icon size={16} /> {k}
              </button>
            );
          })}
        </aside>
        <div className="grid sm:grid-cols-2 gap-4">
          {categories[active].items.map((s, i) => {
            const Logo: any = s.Logo;
            return (
              <motion.div
                key={s.name + active}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 120 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-3xl p-5 hover:glow group relative overflow-hidden"
              >
                <motion.div
                  className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl"
                  style={{ background: s.color }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-secondary/60 shrink-0"
                    style={{ boxShadow: `0 0 20px ${s.color}40` }}
                  >
                    <Logo size={26} style={{ color: s.color }} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold">{s.name}</h3>
                      <span className="text-gradient font-bold text-lg">
                        <Counter to={s.v} suffix="%" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.v}%` }}
                    transition={{ duration: 1.4, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full relative"
                    style={{ background: `linear-gradient(90deg, ${s.color}, var(--neon-2))` }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/30"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Section badge="Tech Stack" title="Tools I Love" subtitle="Scroll to expand · Tap an icon to drop it 🍂">
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {allTools.map((t, i) => <ToolIcon key={t.name} tool={t} idx={i} />)}
        </div>
      </Section>

      <Section badge="Why Me" title="What You Get" subtitle="Premium quality, every detail">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Zap, t: "Fast Delivery", d: "Quick turnaround without sacrificing quality.", color: "#fbbf24" },
            { Icon: Sparkles, t: "Modern Design", d: "Premium aesthetics built for 2026.", color: "#a855f7" },
            { Icon: ShieldCheck, t: "Clean Code", d: "Maintainable architecture you can trust.", color: "#22d3ee" },
            { Icon: Rocket, t: "Performance", d: "Optimized for blazing-fast load times.", color: "#f43f5e" },
            { Icon: Brain, t: "Smart Solutions", d: "AI-powered features when it matters.", color: "#34d399" },
            { Icon: Heart, t: "Crafted with Care", d: "Every pixel placed with intention.", color: "#fb7185" },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 30, rotateX: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={{ y: -10, rotateY: 5, scale: 1.03 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              className="glass rounded-3xl p-6 hover:glow group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: `radial-gradient(circle at 50% 0%, ${c.color}, transparent 70%)` }}
              />
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative"
                style={{ background: `linear-gradient(135deg, ${c.color}, var(--neon-2))`, boxShadow: `0 8px 30px ${c.color}50` }}
              >
                <c.Icon className="text-white" size={26} />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: `2px solid ${c.color}` }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              </motion.div>
              <h3 className="font-bold text-lg">{c.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section badge="Stats" title="By The Numbers" subtitle="Track record that speaks">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: 3, suffix: "+", l: "Years Experience", Icon: Trophy, color: "#fbbf24" },
            { v: 25, suffix: "+", l: "Projects Done", Icon: Rocket, color: "#a855f7" },
            { v: 15, suffix: "+", l: "Tech Mastered", Icon: Brain, color: "#22d3ee" },
            { v: 100, suffix: "%", l: "Satisfaction", Icon: Heart, color: "#f43f5e" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className="glass rounded-3xl p-6 text-center hover:glow transition relative overflow-hidden group"
            >
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity"
                style={{ background: s.color }}
              />
              <s.Icon size={24} className="mx-auto mb-2" style={{ color: s.color }} />
              {/* Use stat-number class directly — avoids text-gradient wrapper breaking Counter */}
              <div className="text-4xl md:text-5xl font-bold">
                <span className="stat-number">
                  <Counter to={s.v} suffix={s.suffix} />
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section badge="Hire Me" title="Let's Collaborate" subtitle="Tell me about your project">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { t: "🌐 Web Development", d: "Modern marketing sites & web apps.", color: "var(--neon)" },
              { t: "📱 Mobile Development", d: "Cross-platform mobile experiences.", color: "var(--neon-2)" },
              { t: "🎨 UI/UX Design", d: "Beautiful, accessible interfaces.", color: "#a855f7" },
              { t: "📊 Dashboard Systems", d: "Data-rich analytics dashboards.", color: "#fbbf24" },
            ].map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                whileHover={{
                  y: -5,
                  x: 5,
                  scale: 1.02,
                  boxShadow: `0 10px 30px -10px color-mix(in oklab, ${s.color} 50%, transparent)`,
                  borderColor: `color-mix(in oklab, ${s.color} 60%, transparent)`,
                }}
                className="glass rounded-2xl p-5 cursor-pointer border border-transparent transition-all duration-300 relative overflow-hidden group"
              >
                {/* Subtle radial glow inside card on hover */}
                <div
                  className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none"
                  style={{ background: s.color }}
                />
                <h4 className="font-bold text-base flex items-center gap-2 group-hover:text-primary transition-colors duration-300">{s.t}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 space-y-5 border border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden group shadow-xl"
            style={{
              background: "linear-gradient(135deg, rgba(25, 20, 35, 0.65), rgba(15, 10, 25, 0.75))",
              backdropFilter: "blur(24px) saturate(140%)",
            }}
          >
            {/* Ambient hover glow inside form */}
            <div className="absolute -left-20 -top-20 w-44 h-44 rounded-full bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-gradient-to-br from-accent to-neon-2 opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700 pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ml-1">Full Name</label>
              <input
                placeholder="e.g. Hairil"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-primary/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-300 text-foreground placeholder:text-muted-foreground/30 disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-1 relative z-10">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ml-1">Email Address</label>
              <input
                placeholder="e.g. hairilikhsan11@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-primary/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-300 text-foreground placeholder:text-muted-foreground/30 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1 relative z-10">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ml-1">Project Description</label>
              <textarea
                placeholder="Describe your project, features, goals..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-primary/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none transition-all duration-300 text-foreground placeholder:text-muted-foreground/30 disabled:opacity-50"
              />
            </div>

            <div className="relative z-10">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ml-1">Project Type</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Website", "Dashboard", "Mobile App", "UI/UX"].map((t) => {
                  const isSelected = projectType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setProjectType(t)}
                      className={`pill transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "!bg-gradient-to-r from-primary to-accent border-transparent text-white font-semibold shadow-[0_4px_12px_rgba(168,85,247,0.35)]"
                          : "hover:glow-sm text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground ml-1">Timeline</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["1 Week", "2 Weeks", "1 Month", "Flexible"].map((t) => {
                  const isSelected = timeline === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setTimeline(t)}
                      className={`pill transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "!bg-gradient-to-r from-primary to-accent border-transparent text-white font-semibold shadow-[0_4px_12px_rgba(168,85,247,0.35)]"
                          : "hover:glow-sm text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-xs border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 relative z-10"
              >
                🎉 <strong>Success!</strong> Your message has been sent. Please check your inbox (<strong>hairilikhsan17@gmail.com</strong>) for a verification link if this is the first submission.
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl text-xs border bg-rose-500/10 border-rose-500/30 text-rose-400 relative z-10"
              >
                ⚠️ <strong>Error:</strong> {errorMessage}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full justify-center cursor-pointer transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
              style={{
                display: "flex",
                justifyContent: "center",
                background: "linear-gradient(120deg, var(--neon), var(--neon-2))",
                boxShadow: "0 4px 20px -4px color-mix(in oklab, var(--neon) 60%, transparent)",
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending Message...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Let's Build Together <Send size={14} />
                </span>
              )}
            </motion.button>
          </form>
        </div>
      </Section>
    </div>
  );
}
