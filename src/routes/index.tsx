import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, Instagram, ArrowRight, Download, Code2, Database, Cloud, Boxes, Cpu, Layers } from "lucide-react";
import profile from "../assets/profile.jpg";

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

const techIcons = [
  { Icon: Layers, name: "Laravel", color: "oklch(0.65 0.25 25)", x: -180, y: -40, delay: 0 },
  { Icon: Code2, name: "React", color: "oklch(0.75 0.2 230)", x: 180, y: -80, delay: 0.4 },
  { Icon: Cpu, name: "Python", color: "oklch(0.8 0.18 95)", x: -220, y: 120, delay: 0.55 },
  { Icon: Boxes, name: "Docker", color: "oklch(0.7 0.18 230)", x: 200, y: 140, delay: 0.7 },
  { Icon: Cloud, name: "Cloud", color: "oklch(0.75 0.15 200)", x: 0, y: -180, delay: 0.85 },
  { Icon: Database, name: "DB", color: "oklch(0.7 0.2 290)", x: 0, y: 200, delay: 1 },
];

function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className="px-4">
      {/* HERO */}
      <section ref={heroRef} className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-16">
        <motion.div style={{ y: yParallax }} className="relative h-[480px] order-2 lg:order-1 flex items-center justify-center">
          {/* glow */}
          <div className="absolute inset-10 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, var(--neon), transparent 60%)" }} />
          {/* profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.25, duration: 0.9, ease: "easeOut" }}
            className="relative z-10 w-64 h-80 rounded-3xl overflow-hidden glass glow"
          >
            <img src={profile} alt="Hairil Ikhsan" className="w-full h-full object-cover" width={768} height={1024} />
          </motion.div>
          {/* floating tech */}
          {techIcons.map(({ Icon, name, color, x, y, delay }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, filter: "blur(15px)" }}
              animate={{ opacity: 1, x, y, scale: 1, filter: "blur(0px)" }}
              transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                className="glass-strong rounded-2xl px-3 py-2 flex items-center gap-2 text-xs font-medium"
                style={{ boxShadow: `0 8px 30px -10px ${color}` }}
              >
                <Icon size={16} style={{ color }} />
                {name}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <span className="pill">👋 Hi there, I'm</span>
          <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Hairil <span className="text-gradient">Ikhsan</span>
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">Cloud Enthusiast · Full-Stack Developer</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {["Full Stack", "Cloud", "UI/UX", "Data Engineer", "AI"].map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
          <p className="mt-6 text-muted-foreground max-w-lg leading-relaxed">
            A technology student passionate about building scalable systems, modern web apps,
            cloud-native architectures and meaningful AI experiences.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <a href="#" className="btn-primary">
              <Download size={16} /> View CV
            </a>
            <a href="#" className="btn-ghost">
              Contact Me <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex gap-3 mt-6">
            {[Github, Linkedin, Mail, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="p-2.5 rounded-full glass hover:glow-sm transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CODING HISTORY */}
      <Section title="Coding History" badge="Activity" subtitle="Real-time contribution graph from @hairilikhsan17">
        <div className="glass rounded-3xl p-6 md:p-10">
          <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] sm:grid-cols-[repeat(52,minmax(0,1fr))] gap-1">
            {Array.from({ length: 52 * 7 }).map((_, i) => {
              const intensity = Math.random();
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 52) * 0.005, duration: 0.3 }}
                  className="aspect-square rounded-[3px]"
                  style={{
                    background: intensity > 0.7
                      ? `oklch(${0.5 + intensity * 0.3} 0.25 290)`
                      : intensity > 0.4
                      ? `oklch(${0.4 + intensity * 0.2} 0.18 280 / 0.7)`
                      : "color-mix(in oklab, var(--neon) 8%, transparent)",
                  }}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { v: "1,247", l: "Contributions" },
              { v: "42 days", l: "Active streak" },
              { v: "38", l: "Repositories" },
              { v: "1,820 h", l: "Coding hours" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4">
                <div className="text-2xl font-bold text-gradient">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <a href="/about" className="btn-ghost">Learn More About Me <ArrowRight size={16} /></a>
          </div>
        </div>
      </Section>

      {/* FEATURED PROJECTS */}
      <Section title="Featured Projects" badge="Showcase" subtitle="Selected works built with passion & precision">
        <div className="grid gap-6">
          {featured.map((p, i) => (
            <motion.a
              key={p.title}
              href="/projects"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="glass rounded-3xl p-5 md:p-6 grid md:grid-cols-[280px_1fr] gap-6 hover:glow group"
            >
              <div className="aspect-video md:aspect-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/40 to-accent/40 relative">
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white/20">
                  {p.title.charAt(0)}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="pill w-fit">{p.category}</span>
                <h3 className="text-2xl font-bold mt-3 group-hover:text-gradient transition">{p.title}</h3>
                <p className="text-muted-foreground mt-2">{p.desc}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {p.stack.map(s => <span key={s} className="pill !text-[10px] !py-1">{s}</span>)}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gradient">
                  View Project <ArrowRight size={14} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function Section({ title, badge, subtitle, children }: { title: string; badge: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="max-w-6xl mx-auto py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="pill">{badge}</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-3">{subtitle}</p>
      </motion.div>
      {children}
    </section>
  );
}

const featured = [
  { title: "AI Dashboard Platform", category: "AI · Dashboard", desc: "Real-time analytics dashboard powered by machine learning for actionable insights.", stack: ["Next.js", "Python", "TensorFlow", "Tailwind"] },
  { title: "DCI UNDIPA Website", category: "Community", desc: "Community organization website for the Dicoding Indonesia UNDIPA chapter.", stack: ["Laravel", "MySQL", "Tailwind"] },
  { title: "Modern Portfolio Website", category: "Personal", desc: "Premium developer portfolio with motion design and glassmorphism UI.", stack: ["React", "Framer Motion", "Tailwind"] },
];
