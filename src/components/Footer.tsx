import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp, Instagram, Twitter, MapPin, Phone, Heart, Sparkles } from "lucide-react";

const socials = [
  { Icon: Github, label: "GitHub", color: "#ffffff" },
  { Icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
  { Icon: Twitter, label: "Twitter", color: "#1DA1F2" },
  { Icon: Instagram, label: "Instagram", color: "#E4405F" },
  { Icon: Mail, label: "Email", color: "#a855f7" },
];

export function Footer() {
  return (
    <footer className="mt-32 px-4 pb-10 relative">
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
        className="glass-strong max-w-6xl mx-auto rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 h-[2px] w-full"
          style={{ background: "linear-gradient(90deg, transparent, var(--neon), var(--neon-2), transparent)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        />

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 pb-10 border-b"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Sparkles size={28} className="text-gradient mx-auto mb-3" style={{ color: "var(--neon)" }} />
          </motion.div>
          <h3 className="text-2xl md:text-3xl font-bold">
            Let's build something <span className="text-gradient">amazing</span> together
          </h3>
          <p className="text-sm text-muted-foreground mt-2">Available for freelance & full-time opportunities</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <motion.h3
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold"
            >
              <span className="text-gradient">Hairil Ikhsan</span>
            </motion.h3>
            <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed">
              Full-Stack Developer & Cloud Enthusiast crafting modern, scalable digital experiences with passion and precision.
            </p>
            <div className="flex gap-2 mt-5">
              {socials.map(({ Icon, label, color }, i) => (
                <motion.a
                  key={label}
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
              ))}
            </div>
          </div>

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
                  <Link
                    to={"/" + (l === "Home" ? "" : l.toLowerCase())}
                    className="hover:text-foreground transition-all inline-flex items-center gap-1.5 hover:gap-2.5 group"
                  >
                    <span className="w-0 h-[1px] bg-gradient-to-r from-[var(--neon)] to-[var(--neon-2)] group-hover:w-3 transition-all" />
                    {l}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gradient">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <motion.li whileHover={{ x: 4 }} className="flex items-center gap-2">
                <Mail size={14} className="text-[color:var(--neon)]" /> hairil@example.com
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-center gap-2">
                <Phone size={14} className="text-[color:var(--neon)]" /> +62 812 3456 7890
              </motion.li>
              <motion.li whileHover={{ x: 4 }} className="flex items-center gap-2">
                <MapPin size={14} className="text-[color:var(--neon)]" /> Makassar, Indonesia
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            © 2026 Hairil Ikhsan. Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block"
            >
              <Heart size={12} className="fill-rose-500 text-rose-500" />
            </motion.span>{" "}
            using React & Tailwind CSS.
          </p>
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
        </div>
      </motion.div>
    </footer>
  );
}
