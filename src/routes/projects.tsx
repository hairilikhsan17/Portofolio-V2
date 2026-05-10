import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, X, ExternalLink } from "lucide-react";
import { Section } from "./index";

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
  { title: "Company Profile", cat: "Company Profile", new: false, desc: "Modern corporate site with CMS.", stack: ["Next.js", "Tailwind"] },
  { title: "Web Portfolio V1", cat: "UI/UX", new: false, desc: "First version of a developer portfolio.", stack: ["React", "Tailwind"] },
  { title: "Organize Website DCC", cat: "Web App", new: true, desc: "Internal organization management.", stack: ["Laravel", "MySQL"] },
  { title: "Laundry Apps", cat: "Web App", new: true, desc: "Laundry management with real-time tracking.", stack: ["Laravel", "React", "Oracle", "Docker"] },
  { title: "petShop Regression", cat: "Dashboard", new: false, desc: "Linear regression analytics dashboard.", stack: ["Python", "Next.js"] },
  { title: "Portfolio V2", cat: "UI/UX", new: true, desc: "Premium animated portfolio.", stack: ["React", "Framer Motion"] },
  { title: "Dicoding UNDIPA", cat: "Company Profile", new: false, desc: "Community website.", stack: ["Laravel", "Tailwind"] },
  { title: "Dipatalent", cat: "Web App", new: false, desc: "Achievement management system.", stack: ["Laravel", "MySQL"] },
  { title: "Monitoring Keuangan", cat: "Dashboard", new: false, desc: "Finance monitoring system.", stack: ["Next.js", "Tailwind"] },
  { title: "Teman Bus", cat: "Mobile App", new: false, desc: "Bus information system.", stack: ["React Native"] },
];

const cats = ["All", "Web App", "Dashboard", "Company Profile", "Mobile App", "UI/UX"];

function ProjectsPage() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<typeof projects[number] | null>(null);

  const filtered = projects.filter(p =>
    (active === "All" || p.cat === active) &&
    (p.title.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="px-4">
      <section className="max-w-5xl mx-auto text-center py-16">
        <span className="pill">PORTFOLIO</span>
        <h1 className="mt-4 text-5xl md:text-6xl font-bold tracking-tight">Featured <span className="text-gradient">Projects</span></h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Selected works and applications I've built with passion & precision.</p>
      </section>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="glass rounded-full px-4 py-2.5 flex items-center gap-2 w-full md:max-w-sm">
          <Search size={16} className="text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search projects..." className="bg-transparent outline-none text-sm flex-1" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {cats.map(c => (
            <button key={c} onClick={() => setActive(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${active === c ? "btn-primary !py-1.5 !px-4" : "glass hover:glow-sm"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <Section badge="Works" title="" subtitle="">
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div
                key={p.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                onClick={() => setOpen(p)}
                className="glass rounded-3xl p-5 cursor-pointer hover:glow relative group"
              >
                {p.new && <span className="absolute top-4 right-4 pill !bg-primary !text-white !text-[10px]">NEW</span>}
                <div className="aspect-video rounded-2xl mb-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, color-mix(in oklab,var(--neon) 35%,transparent), color-mix(in oklab,var(--neon-2) 35%,transparent))" }}>
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/30">{p.title.charAt(0)}</div>
                </div>
                <span className="pill !text-[10px] !py-0.5">{p.cat}</span>
                <h3 className="font-bold text-lg mt-2 group-hover:text-gradient">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.stack.map(s => <span key={s} className="pill !text-[10px] !py-0.5">{s}</span>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-strong rounded-3xl p-6 md:p-8 max-w-2xl w-full glow relative max-h-[85vh] overflow-y-auto"
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary"><X size={18} /></button>
              <span className="pill">{open.cat}</span>
              <h3 className="text-3xl font-bold mt-3"><span className="text-gradient">{open.title}</span></h3>
              <p className="text-muted-foreground mt-3">{open.desc}</p>
              <div className="aspect-video mt-5 rounded-2xl" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }} />
              <h4 className="font-semibold mt-5">Tech Stack</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {open.stack.map(s => <span key={s} className="pill">{s}</span>)}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setOpen(null)} className="btn-ghost">Close</button>
                <a href="#" className="btn-primary">Visit Project <ExternalLink size={14} /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
