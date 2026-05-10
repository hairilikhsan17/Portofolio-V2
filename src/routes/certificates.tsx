import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Award, X, ExternalLink, Download } from "lucide-react";
import { Section } from "./index";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — Hairil Ikhsan" },
      { name: "description", content: "Professional credentials and continuous learning journey." },
    ],
  }),
  component: CertificatesPage,
});

const certs = [
  { title: "Microsoft Azure AI Foundry", issuer: "Microsoft", year: "2026", cat: "Cloud", featured: true },
  { title: "Junior Web Developer", issuer: "BNSP", year: "2025", cat: "Web Development" },
  { title: "Junior Network Administrator", issuer: "BNSP", year: "2025", cat: "Networking" },
  { title: "AI Talent Development Nation", issuer: "Kominfo", year: "2025", cat: "AI & Data" },
  { title: "Dicoding AI Engineer Entry", issuer: "Dicoding", year: "2025", cat: "AI & Data" },
  { title: "IBM Granite", issuer: "IBM", year: "2026", cat: "AI & Data" },
  { title: "Pemrograman Python", issuer: "Dicoding", year: "2024", cat: "Programming" },
  { title: "Pemateri Cyber Security", issuer: "UNDIPA", year: "2025", cat: "Cyber Security" },
  { title: "Hackathon BIKN", issuer: "BIKN", year: "2025", cat: "Workshop" },
  { title: "Asisten Dosen", issuer: "UNDIPA", year: "2024", cat: "Workshop" },
];

const cats = ["All", "Web Development", "Cloud", "AI & Data", "Cyber Security", "Networking", "Programming", "Workshop"];

function CertificatesPage() {
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<typeof certs[number] | null>(null);
  const filtered = certs.filter(c => active === "All" || c.cat === active);
  const featured = certs.find(c => c.featured)!;

  return (
    <div className="px-4">
      <section className="max-w-5xl mx-auto text-center py-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div animate={{ y: [0, 20, 0], x: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-10 left-1/4 w-32 h-32 rounded-full blur-3xl" style={{ background: "var(--neon)" }} />
          <motion.div animate={{ y: [0, -30, 0], x: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: "var(--neon-2)" }} />
        </div>
        <span className="pill">CERTIFICATIONS</span>
        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">Professional <span className="text-gradient">Credentials</span></h1>
        <p className="text-muted-foreground mt-4">Continuous learning & professional development journey.</p>
      </section>

      {/* Featured */}
      <div className="max-w-6xl mx-auto">
        <motion.div whileHover={{ y: -4 }} onClick={() => setOpen(featured)} className="glass-strong rounded-3xl p-6 md:p-8 grid md:grid-cols-[1fr_1.2fr] gap-6 cursor-pointer glow">
          <div className="aspect-video rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
            <Award className="text-white" size={64} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="pill w-fit">⭐ Featured</span>
            <h2 className="text-3xl font-bold mt-3">{featured.title}</h2>
            <p className="text-muted-foreground mt-1">{featured.issuer} · {featured.year}</p>
            <div className="flex gap-2 mt-3">
              <span className="pill">{featured.cat}</span>
            </div>
            <button className="btn-primary w-fit mt-5">View Certificate <ExternalLink size={14} /></button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center mt-12">
        {cats.map(c => (
          <button key={c} onClick={() => setActive(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${active === c ? "btn-primary !py-1.5 !px-4" : "glass hover:glow-sm"}`}>
            {c}
          </button>
        ))}
      </div>

      <Section badge="Achievements" title="All Certificates" subtitle="">
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.filter(c => !c.featured).map(c => (
              <motion.div key={c.title} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                whileHover={{ y: -6 }} onClick={() => setOpen(c)}
                className="glass rounded-3xl p-5 cursor-pointer hover:glow">
                <div className="aspect-video rounded-2xl mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, color-mix(in oklab,var(--neon) 30%,transparent), color-mix(in oklab,var(--neon-2) 30%,transparent))" }}>
                  <Award className="text-white/80" size={36} />
                </div>
                <span className="pill !text-[10px]">{c.cat}</span>
                <h3 className="font-bold mt-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{c.issuer} · {c.year}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <Section badge="Timeline" title="Learning Journey" subtitle="Year over year">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, var(--neon), var(--neon-2))" }} />
          {["2024", "2025", "2026"].map((y, i) => (
            <motion.div key={y} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative pl-12 pb-10">
              <div className="absolute left-2 w-4 h-4 rounded-full glow-sm" style={{ background: "var(--neon)" }} />
              <div className="glass rounded-2xl p-5">
                <div className="text-xl font-bold text-gradient">{y}</div>
                <p className="text-sm text-muted-foreground mt-1">{certs.filter(c => c.year === y).length} certifications earned</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section badge="Stats" title="Achievements" subtitle="">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{v:"10+",l:"Certifications"},{v:"500+",l:"Learning Hours"},{v:"8",l:"Workshops"},{v:"15+",l:"Tech Skills"}].map(s => (
            <div key={s.l} className="glass rounded-3xl p-6 text-center hover:glow transition">
              <div className="text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-strong rounded-3xl p-6 md:p-8 max-w-2xl w-full glow relative">
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary"><X size={18} /></button>
              <div className="aspect-video rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
                <Award className="text-white" size={64} />
              </div>
              <span className="pill">{open.cat}</span>
              <h3 className="text-2xl font-bold mt-3">{open.title}</h3>
              <p className="text-muted-foreground mt-1">Issued by {open.issuer} · {open.year}</p>
              <div className="flex gap-3 mt-6">
                <a href="#" className="btn-ghost"><Download size={14} /> Download</a>
                <a href="#" className="btn-primary">Verify <ExternalLink size={14} /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
