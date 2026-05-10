import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Code2, Server, Database, Cloud, Wrench, Palette, Zap, Sparkles, ShieldCheck, Send, Rocket, Heart, Trophy, Brain } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiLaravel, SiNodedotjs, SiPython, SiExpress,
  SiMysql, SiPostgresql, SiMongodb, SiOracle, SiAmazon, SiDocker, SiFirebase,
  SiGit, SiGithubactions, SiVite, SiPostman, SiFigma, SiFramer, SiVercel, SiGithub,
} from "react-icons/si";
import { Section } from "./index";

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
    { name: "Oracle", v: 75, Logo: SiOracle, color: "#F80000" },
  ]},
  Cloud: { Icon: Cloud, items: [
    { name: "AWS", v: 80, Logo: SiAmazon, color: "#FF9900" },
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
  { name: "AWS", Logo: SiAmazon, color: "#FF9900" },
  { name: "Vite", Logo: SiVite, color: "#646CFF" },
  { name: "Vercel", Logo: SiVercel, color: "#ffffff" },
  { name: "Postman", Logo: SiPostman, color: "#FF6C37" },
];

// Animated counter
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toString() + suffix);
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 2 });
  }, [inView, to, mv]);
  return <motion.span ref={ref}>{display}</motion.span>;
}

// Falling tool icon
function ToolIcon({ tool, idx }: { tool: typeof allTools[0]; idx: number }) {
  const [fallen, setFallen] = useState(false);
  const Logo = tool.Logo;
  return (
    <motion.button
      type="button"
      onClick={() => { setFallen(true); setTimeout(() => setFallen(false), 2200); }}
      initial={{ opacity: 0, y: -80, rotate: -180, scale: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 12, delay: idx * 0.06 }}
      animate={fallen ? {
        y: [0, -30, 600],
        x: [0, (Math.random() - 0.5) * 200],
        rotate: [0, (Math.random() - 0.5) * 720],
        opacity: [1, 1, 0],
      } : {}}
      whileHover={{ scale: 1.15, y: -6, rotate: [0, -8, 8, 0] }}
      transition-duration={fallen ? 2 : undefined}
      className="glass rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer group hover:glow min-w-[100px]"
      style={fallen ? { transition: "all 2s cubic-bezier(.55,.06,.68,.19)" } : {}}
    >
      <Logo size={36} style={{ color: tool.color }} className="drop-shadow-[0_0_10px_currentColor] transition-transform group-hover:scale-110" />
      <span className="text-xs font-medium">{tool.name}</span>
    </motion.button>
  );
}

function SkillsPage() {
  const [active, setActive] = useState<keyof typeof categories>("Frontend");

  return (
    <div className="px-4">
      <section className="max-w-5xl mx-auto text-center py-16">
        <span className="pill">SKILLS & SERVICES</span>
        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">Skills & <span className="text-gradient">Expertise</span></h1>
        <p className="text-muted-foreground mt-4">Building scalable, modern, and user-focused digital experiences.</p>
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
              <div className="text-4xl md:text-5xl font-bold text-gradient">
                <Counter to={s.v} suffix={s.suffix} />
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
              { t: "🌐 Web Development", d: "Modern marketing sites & web apps." },
              { t: "📱 Mobile Development", d: "Cross-platform mobile experiences." },
              { t: "🎨 UI/UX Design", d: "Beautiful, accessible interfaces." },
              { t: "📊 Dashboard Systems", d: "Data-rich analytics dashboards." },
            ].map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="glass rounded-2xl p-4 hover:glow-sm cursor-pointer"
              >
                <h4 className="font-bold">{s.t}</h4>
                <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="glass rounded-3xl p-6 space-y-4">
            <input placeholder="Full Name" className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm" />
            <input placeholder="Email" type="email" className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm" />
            <textarea placeholder="Project Description" rows={4} className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm resize-none" />
            <div>
              <label className="text-xs text-muted-foreground">Project Type</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Website", "Dashboard", "Mobile App", "UI/UX"].map((t) => (
                  <button key={t} type="button" className="pill hover:glow-sm">{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timeline</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["1 Week", "2 Weeks", "1 Month", "Flexible"].map((t) => (
                  <button key={t} type="button" className="pill hover:glow-sm">{t}</button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full justify-center">Let's Build Together <Send size={14} /></button>
          </form>
        </div>
      </Section>
    </div>
  );
}
