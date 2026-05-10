import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Code2, Palette, Cloud, ChevronDown, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Section } from "./index";
import profile from "../assets/profile.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hairil Ikhsan" },
      { name: "description", content: "Full-Stack Developer passionate about scalable, user-friendly applications." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="px-4">
      <section className="max-w-5xl mx-auto text-center py-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pill">About Me</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">
          Building <span className="text-gradient">Modern Digital</span> Experiences
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Full-Stack Web Developer passionate about creating scalable and user-friendly applications.
        </motion.p>
      </section>

      <Section badge="Profile" title="Who I Am" subtitle="A short story about my journey">
        <div className="glass rounded-3xl p-6 md:p-10 grid md:grid-cols-[280px_1fr] gap-8 items-center">
          <div className="rounded-2xl overflow-hidden glow">
            <img src={profile} alt="" loading="lazy" className="w-full h-72 object-cover" width={768} height={1024} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Hairil Ikhsan</h3>
            <p className="text-sm text-gradient font-semibold">Full-Stack Developer · Cloud Enthusiast</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              I'm a technology student & developer focused on crafting beautiful, performant web applications.
              I love working with modern frameworks, clean architecture and cloud-native systems — turning ideas
              into elegant, maintainable products.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              {["React", "Next.js", "Laravel", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"].map(t => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section badge="Specialization" title="What I Do" subtitle="Areas where I bring the most value">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Code2, title: "Full-Stack Web", desc: "End-to-end product engineering with modern stacks." },
            { Icon: Palette, title: "UI/UX Design", desc: "Clean, accessible interfaces that feel premium." },
            { Icon: Cloud, title: "Cloud & Data", desc: "Scalable cloud-native systems and data pipelines." },
          ].map(({ Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }} className="glass rounded-3xl p-6 hover:glow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
                <Icon className="text-white" size={22} />
              </div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section badge="Connect" title="Find Me Online" subtitle="Let's build something great together">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { Icon: Linkedin, name: "LinkedIn" },
            { Icon: Github, name: "GitHub" },
            { Icon: Instagram, name: "Instagram" },
            { Icon: Mail, name: "Gmail" },
          ].map(({ Icon, name }) => (
            <motion.a key={name} href="#" whileHover={{ y: -4 }} className="glass rounded-2xl p-5 flex flex-col items-center gap-2 hover:glow text-sm">
              <Icon size={22} />
              {name}
            </motion.a>
          ))}
        </div>
      </Section>

      <Section badge="Stats" title="By The Numbers" subtitle="A quick snapshot">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{v:"3+",l:"Years Experience"},{v:"25+",l:"Projects Done"},{v:"15+",l:"Happy Clients"},{v:"10+",l:"Certifications"}].map(s => (
            <div key={s.l} className="glass rounded-3xl p-6 text-center hover:glow transition">
              <div className="text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section badge="FAQ" title="Common Questions" subtitle="Things people ask me">
        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
        </div>
      </Section>
    </div>
  );
}

const faqs = [
  { q: "Who are you?", a: "I'm a full-stack developer & cloud enthusiast based in Makassar, Indonesia." },
  { q: "What are your skills?", a: "Modern web development with React, Next.js, Laravel, and cloud platforms like AWS." },
  { q: "Are you available for projects?", a: "Yes! I'm open to freelance, collaboration and full-time roles." },
  { q: "What technologies do you use?", a: "React, Next.js, TypeScript, Laravel, Node.js, Python, PostgreSQL, Docker, and AWS." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full p-5 flex justify-between items-center text-left">
        <span className="font-semibold">{q}</span>
        <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} size={18} />
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p>
      </motion.div>
    </div>
  );
}
