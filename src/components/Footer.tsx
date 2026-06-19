import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Instagram, Twitter, MapPin, Phone, Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import profile from "../assets/profile.png";

/* ─── CSS: gradient cycling for footer text ─────────────────── */
const FOOTER_STYLE = `
@keyframes footerGradientCycle {
  0%   { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
  16%  { background-image: linear-gradient(135deg, #f472b6 0%, #fb923c 50%, #fbbf24 100%); }
  33%  { background-image: linear-gradient(135deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%); }
  50%  { background-image: linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%); }
  66%  { background-image: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%); }
  83%  { background-image: linear-gradient(135deg, #38bdf8 0%, #34d399 50%, #a3e635 100%); }
  100% { background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%); }
}
@keyframes footerBorderCycle {
  0%   { border-color: rgba(167,139,250,0.6); box-shadow: 0 0 0 1px rgba(167,139,250,0.3), 0 0 40px rgba(167,139,250,0.15); }
  16%  { border-color: rgba(244,114,182,0.6); box-shadow: 0 0 0 1px rgba(244,114,182,0.3), 0 0 40px rgba(244,114,182,0.15); }
  33%  { border-color: rgba(52,211,153,0.6);  box-shadow: 0 0 0 1px rgba(52,211,153,0.3),  0 0 40px rgba(52,211,153,0.15); }
  50%  { border-color: rgba(244,63,94,0.6);   box-shadow: 0 0 0 1px rgba(244,63,94,0.3),   0 0 40px rgba(244,63,94,0.15); }
  66%  { border-color: rgba(251,191,36,0.6);  box-shadow: 0 0 0 1px rgba(251,191,36,0.3),  0 0 40px rgba(251,191,36,0.15); }
  83%  { border-color: rgba(56,189,248,0.6);  box-shadow: 0 0 0 1px rgba(56,189,248,0.3),  0 0 40px rgba(56,189,248,0.15); }
  100% { border-color: rgba(167,139,250,0.6); box-shadow: 0 0 0 1px rgba(167,139,250,0.3), 0 0 40px rgba(167,139,250,0.15); }
}
.footer-text-cycle {
  background-image: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: footerGradientCycle 18s steps(1, end) infinite;
  display: inline;
}
.footer-card-hovered {
  animation: footerBorderCycle 18s steps(1, end) infinite;
  border-width: 1px;
  border-style: solid;
}
`;

/* ─── Pre-computed particle angles ──────────────────────────── */
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const PARTICLE_COLORS = ["#a78bfa", "#60a5fa", "#22d3ee", "#f472b6", "#34d399", "#fbbf24", "#f43f5e", "#38bdf8"];

/* ─── Particle burst hook ────────────────────────────────────── */
function useParticleBurst() {
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trigger = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setBursting(true);
    timerRef.current = setTimeout(() => setBursting(false), 700);
  };
  return { bursting, trigger };
}

/* ─── Particle Burst Wrapper ─────────────────────────────────── */
function ParticleBurst({
  children, className, count = 8, radius = 36, as: Tag = "div", ...props
}: {
  children: React.ReactNode; className?: string; count?: number;
  radius?: number; as?: React.ElementType; [key: string]: any;
}) {
  const { bursting, trigger } = useParticleBurst();
  return (
    <Tag className={`relative ${className ?? ""}`} onMouseEnter={trigger} {...props}>
      {children}
      <AnimatePresence>
        {bursting && PARTICLE_ANGLES.slice(0, count).map((angle, p) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <motion.span
              key={p}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{ opacity: 0, scale: 1.2, x: Math.cos(rad) * radius, y: Math.sin(rad) * radius }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-20"
              style={{ background: PARTICLE_COLORS[p % PARTICLE_COLORS.length] }}
            />
          );
        })}
      </AnimatePresence>
    </Tag>
  );
}

const socials = [
  { Icon: Github,    label: "GitHub",    color: "#ffffff" },
  { Icon: Linkedin,  label: "LinkedIn",  color: "#0A66C2" },
  { Icon: Twitter,   label: "Twitter",   color: "#1DA1F2" },
  { Icon: Instagram, label: "Instagram", color: "#E4405F" },
  { Icon: Mail,      label: "Email",     color: "#a855f7" },
];

export function Footer() {
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <footer className="mt-16 px-4 pb-10 relative">
      <style>{FOOTER_STYLE}</style>

      {/* Animated glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute left-1/4 top-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--neon)" }}
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-1/4 top-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--neon-2)" }}
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        className={`max-w-6xl mx-auto rounded-3xl p-8 md:p-12 relative overflow-hidden glass-strong ${cardHovered ? "footer-card-hovered" : ""}`}
      >
        {/* Top accent line — cycles gradient on hover */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] w-full"
          style={{
            background: cardHovered
              ? "linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee, #f472b6, #34d399)"
              : "linear-gradient(90deg, transparent, var(--neon), var(--neon-2), transparent)",
            transition: "background 0.6s ease",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />

        {/* Animated gradient sweep on hover */}
        <AnimatePresence>
          {cardHovered && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: "200%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(167,139,250,0.08) 50%, transparent 70%)",
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 pb-10 border-b relative z-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Sparkles size={28} className="mx-auto mb-3" style={{ color: "var(--neon)" }} />
          </motion.div>

          {/* "Let's build something amazing together" — all gradient cycling */}
          <h3 className="text-2xl md:text-3xl font-bold">
            <span className="footer-text-cycle">Let's build something </span>
            <span className="footer-text-cycle" style={{ animationDelay: "-3s" }}>amazing </span>
            <span className="footer-text-cycle" style={{ animationDelay: "-6s" }}>together</span>
          </h3>

          {/* Subtitle — gradient cycling */}
          <p className="mt-2 text-sm">
            <span className="footer-text-cycle" style={{ opacity: 0.8, animationDelay: "-9s" }}>
              Available for freelance &amp; full-time opportunities
            </span>
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid md:grid-cols-4 gap-8 relative z-10">

          {/* ── Col 1-2: Profile + bio + socials ── */}
          <div className="md:col-span-2">

            {/* Profile photo + name row */}
            <div className="flex items-center gap-4 mb-4">
              <ParticleBurst count={8} radius={32} className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-14 h-14 rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: "0 0 0 2px color-mix(in oklab, var(--neon) 50%, transparent), 0 0 20px color-mix(in oklab, var(--neon) 30%, transparent)",
                    isolation: "isolate",
                  }}
                >
                  <img src={profile} alt="Hairil Ikhsan" className="w-full h-full object-cover" style={{ objectPosition: "center 15%", transform: "translateZ(0)", willChange: "transform" }} />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                </motion.div>
              </ParticleBurst>

              <div>
                <ParticleBurst count={6} radius={28} as="div">
                  <motion.h3 whileHover={{ scale: 1.02 }} className="text-2xl font-bold">
                    {/* "Hairil Ikhsan" — gradient cycling */}
                    <span className="footer-text-cycle">Hairil Ikhsan</span>
                  </motion.h3>
                </ParticleBurst>
                {/* Subtitle — gradient cycling */}
                <p className="text-xs mt-0.5">
                  <span className="footer-text-cycle" style={{ opacity: 0.7, animationDelay: "-6s", fontSize: "0.75rem" }}>
                    Full-Stack Developer · Makassar
                  </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Crafting modern, scalable digital experiences with passion and precision.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mt-5">
              {socials.map(({ Icon, label, color }, i) => (
                <ParticleBurst key={label} count={6} radius={24} className="inline-flex">
                  <motion.a
                    href="#"
                    aria-label={label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.15, rotate: [0, -10, 10, 0] }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl glass hover:glow-sm transition-colors group"
                    style={{ ["--hover-color" as any]: color }}
                  >
                    <Icon size={16} className="transition-colors group-hover:text-[color:var(--hover-color)]" />
                  </motion.a>
                </ParticleBurst>
              ))}
            </div>
          </div>

          {/* ── Col 3: Quick Links ── */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gradient">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["Home", "About", "Projects", "Certificates", "Skills"].map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ParticleBurst count={5} radius={20} as="span" className="inline-block">
                    <Link
                      to={"/" + (l === "Home" ? "" : l.toLowerCase())}
                      className="hover:text-foreground transition-all inline-flex items-center gap-1.5 hover:gap-2.5 group"
                    >
                      <span className="w-0 h-[1px] bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] group-hover:w-3 transition-all" />
                      {l}
                    </Link>
                  </ParticleBurst>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gradient">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                { Icon: Mail,   text: "hairil@example.com" },
                { Icon: Phone,  text: "+62 812 3456 7890"  },
                { Icon: MapPin, text: "Makassar, Indonesia" },
              ].map(({ Icon, text }) => (
                <ParticleBurst key={text} count={6} radius={22} as="li" className="flex items-center gap-2">
                  <motion.span whileHover={{ x: 4 }} className="flex items-center gap-2 w-full">
                    <Icon size={14} className="text-[color:var(--neon)] flex-shrink-0" />
                    {text}
                  </motion.span>
                </ParticleBurst>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground relative z-10">
          <p className="flex items-center gap-1.5">
            © 2026 Hairil Ikhsan. Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block"
            >
              <Heart size={12} className="fill-rose-500 text-rose-500" />
            </motion.span>{" "}
            using React &amp; Tailwind CSS.
          </p>
          <ParticleBurst count={8} radius={28} className="inline-flex">
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-ghost !py-1.5 !px-3 text-xs group"
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-flex"
              >
                <ArrowUp size={14} />
              </motion.span>
              Back to top
            </motion.button>
          </ParticleBurst>
        </div>
      </motion.div>
    </footer>
  );
}
