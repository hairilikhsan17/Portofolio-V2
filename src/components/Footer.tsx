import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 px-4 pb-10">
      <div className="glass max-w-6xl mx-auto rounded-3xl p-8 md:p-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold"><span className="text-gradient">Hairil Ikhsan</span></h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Full-Stack Developer & Cloud Enthusiast crafting modern, scalable digital experiences.
            </p>
            <div className="flex gap-3 mt-4">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full glass hover:glow-sm transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Home","About","Projects","Certificates","Skills"].map(l => (
                <li key={l}><Link to={"/" + (l === "Home" ? "" : l.toLowerCase())} className="hover:text-foreground transition">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hairil@example.com</li>
              <li>+62 812 3456 7890</li>
              <li>Makassar, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© 2026 Hairil Ikhsan. Made with ♥ using React & Tailwind CSS.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn-ghost !py-1.5 !px-3 text-xs">
            <ArrowUp size={14} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
