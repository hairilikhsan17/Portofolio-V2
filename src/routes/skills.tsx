import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Server, Database, Cloud, Wrench, Palette, Zap, Sparkles, ShieldCheck, Send } from "lucide-react";
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
  Frontend: { Icon: Code2, items: [{ name: "React.js", v: 95 }, { name: "Next.js", v: 90 }, { name: "TypeScript", v: 88 }, { name: "Tailwind CSS", v: 93 }] },
  Backend: { Icon: Server, items: [{ name: "Laravel", v: 92 }, { name: "Node.js", v: 87 }, { name: "Python", v: 85 }, { name: "Express", v: 82 }] },
  Database: { Icon: Database, items: [{ name: "MySQL", v: 88 }, { name: "PostgreSQL", v: 85 }, { name: "MongoDB", v: 78 }, { name: "Oracle", v: 75 }] },
  Cloud: { Icon: Cloud, items: [{ name: "AWS", v: 80 }, { name: "Azure", v: 78 }, { name: "Docker", v: 85 }, { name: "Firebase", v: 82 }] },
  Tools: { Icon: Wrench, items: [{ name: "Git", v: 92 }, { name: "GitHub Actions", v: 80 }, { name: "Vite", v: 88 }, { name: "Postman", v: 85 }] },
  "UI/UX": { Icon: Palette, items: [{ name: "Figma", v: 88 }, { name: "Framer Motion", v: 85 }, { name: "Design Systems", v: 82 }] },
};

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
          {(Object.keys(categories) as (keyof typeof categories)[]).map(k => {
            const { Icon } = categories[k];
            const isActive = active === k;
            return (
              <button key={k} onClick={() => setActive(k)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm whitespace-nowrap transition ${isActive ? "btn-primary !rounded-2xl" : "hover:bg-secondary text-muted-foreground"}`}>
                <Icon size={16} /> {k}
              </button>
            );
          })}
        </aside>
        <div className="grid sm:grid-cols-2 gap-4">
          {categories[active].items.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="glass rounded-3xl p-5 hover:glow">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold">{s.name}</h3>
                <span className="text-gradient font-bold">{s.v}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.v}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--neon), var(--neon-2))" }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Section badge="Tech Stack" title="Tools I Love" subtitle="">
        <div className="flex flex-wrap gap-3 justify-center">
          {["React","Next.js","Laravel","TypeScript","MySQL","Tailwind","Docker","Firebase","GitHub","Figma","Python","Node.js","AWS"].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.1, y: -3 }} className="pill !text-sm !py-2 !px-4 hover:glow-sm cursor-default">{t}</motion.span>
          ))}
        </div>
      </Section>

      <Section badge="Why Me" title="What You Get" subtitle="">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Zap, t: "Fast Delivery", d: "Quick turnaround without sacrificing quality." },
            { Icon: Sparkles, t: "Modern Design", d: "Premium aesthetics built for 2026." },
            { Icon: ShieldCheck, t: "Clean Code", d: "Maintainable architecture you can trust." },
          ].map((c, i) => (
            <motion.div key={c.t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="glass rounded-3xl p-6 hover:glow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
                <c.Icon className="text-white" size={22} />
              </div>
              <h3 className="font-bold text-lg">{c.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section badge="Stats" title="By The Numbers" subtitle="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{v:"3+",l:"Years"},{v:"25+",l:"Projects"},{v:"15+",l:"Tech"},{v:"100%",l:"Satisfaction"}].map(s => (
            <div key={s.l} className="glass rounded-3xl p-6 text-center hover:glow transition">
              <div className="text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section badge="Hire Me" title="Let's Collaborate" subtitle="Tell me about your project">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[{t:"🌐 Web Development",d:"Modern marketing sites & web apps."},{t:"📱 Mobile Development",d:"Cross-platform mobile experiences."},{t:"🎨 UI/UX Design",d:"Beautiful, accessible interfaces."},{t:"📊 Dashboard Systems",d:"Data-rich analytics dashboards."}].map(s => (
              <motion.div key={s.t} whileHover={{ x: 4 }} className="glass rounded-2xl p-4 hover:glow-sm">
                <h4 className="font-bold">{s.t}</h4>
                <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <form onSubmit={e => e.preventDefault()} className="glass rounded-3xl p-6 space-y-4">
            <input placeholder="Full Name" className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm" />
            <input placeholder="Email" type="email" className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm" />
            <textarea placeholder="Project Description" rows={4} className="w-full bg-secondary/60 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary text-sm resize-none" />
            <div>
              <label className="text-xs text-muted-foreground">Project Type</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Website","Dashboard","Mobile App","UI/UX"].map(t => <button key={t} type="button" className="pill hover:glow-sm">{t}</button>)}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timeline</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["1 Week","2 Weeks","1 Month","Flexible"].map(t => <button key={t} type="button" className="pill hover:glow-sm">{t}</button>)}
              </div>
            </div>
            <button className="btn-primary w-full justify-center">Let's Build Together <Send size={14} /></button>
          </form>
        </div>
      </Section>
    </div>
  );
}
