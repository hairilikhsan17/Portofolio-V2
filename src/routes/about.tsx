import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Code2, Palette, Cloud, ChevronDown, Github } from "lucide-react";
import { GithubContributions } from "../components/GithubContributions";
import profile from "../assets/profile.png";

/* ─── Gradient Section Header (replaces imported Section for About) ── */
const SECTION_GRADIENTS: Record<string, string> = {
  "Tentang Saya":        "linear-gradient(120deg, #a78bfa 0%, #818cf8 50%, #60a5fa 100%)",
  "Hairil Ikhsan":       "linear-gradient(120deg, #c4b5fd 0%, #a78bfa 40%, #60a5fa 100%)",
  "Coding Activity":     "linear-gradient(120deg, #34d399 0%, #22d3ee 50%, #60a5fa 100%)",
  "Keahlian & Spesialisasi": "linear-gradient(120deg, #f472b6 0%, #a78bfa 50%, #818cf8 100%)",
  "Connect With Me":     "linear-gradient(120deg, #38bdf8 0%, #818cf8 50%, #f472b6 100%)",
  "Pertanyaan Umum":     "linear-gradient(120deg, #fbbf24 0%, #f472b6 50%, #a78bfa 100%)",
};

function Section({ title, badge, subtitle, children, icon }: { title: string; badge: string; subtitle: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const grad = SECTION_GRADIENTS[title] ?? "linear-gradient(120deg, #a78bfa, #60a5fa)";
  return (
    <section className="max-w-6xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        {/* Badge with gradient border */}
        <motion.span
          className="pill"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
          whileHover={{ scale: 1.06 }}
        >
          <span
            style={{
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 600,
            }}
          >
            {badge}
          </span>
        </motion.span>

        {/* Title with animated gradient + optional icon */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {icon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              {icon}
            </motion.div>
          )}
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            {title}
          </motion.h2>
        </div>

        {/* Subtitle with subtle gradient */}
        <motion.p
          className="mt-3 text-sm"
          style={{
            background: "linear-gradient(120deg, rgba(200,200,235,0.7), rgba(167,139,250,0.6), rgba(147,197,253,0.7))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {subtitle}
        </motion.p>

        {/* Decorative underline */}
        <motion.div
          className="mx-auto mt-4 h-px rounded-full"
          style={{ background: grad, maxWidth: 120 }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </motion.div>
      {children}
    </section>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hairil Ikhsan" },
      { name: "description", content: "Full-Stack Developer passionate about scalable, user-friendly applications." },
    ],
  }),
  component: AboutPage,
});

/* ─── Page stagger variants ────────────────────────────────────── */
const pageVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const sectionVariant = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── Cursor Trail ─────────────────────────────────────────────── */
function CursorTrail() {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const counter = useRef(0);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      counter.current += 1;
      const id = counter.current;
      setTrail(prev => [...prev.slice(-18), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setTrail(prev => prev.filter(p => p.id !== id)), 700);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {trail.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: p.x - 4, top: p.y - 4, width: 8, height: 8, background: `hsl(${260 + i * 5}, 80%, 65%)` }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </div>
  );
}

/* ─── Magnetic Card ────────────────────────────────────────────── */
function MagneticCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={reset} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAC-MAN HERO GAME
   Game Pac-Man style — Pac-Man memakan dot hijau, ghost berwarna
   merah, toska, kuning, pink, ungu bergerak di maze.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Pac-Man Hero Game ────────────────────────────────────────── */

// Cell size for the maze grid
const CELL = 20;

// Maze layout: 1=wall, 0=path. 40 cols x 13 rows — wide banner proportions
const MAZE_COLS = 40;
const MAZE_ROWS = 13;

/* 1=wall, 0=path */
const MAZE_LAYOUT: number[] = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,
  1,0,1,1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1,
  1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,
  1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,
  1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,
  1,0,1,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
  1,0,1,1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,
  1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
];

// Get all walkable cells
function getWalkableCells(): Array<{col: number; row: number}> {
  const cells: Array<{col: number; row: number}> = [];
  for (let r = 0; r < MAZE_ROWS; r++) {
    for (let c = 0; c < MAZE_COLS; c++) {
      if (MAZE_LAYOUT[r * MAZE_COLS + c] === 0) cells.push({ col: c, row: r });
    }
  }
  return cells;
}

function isWalkable(col: number, row: number): boolean {
  if (col < 0 || col >= MAZE_COLS || row < 0 || row >= MAZE_ROWS) return false;
  return MAZE_LAYOUT[row * MAZE_COLS + col] === 0;
}

interface PacState {
  col: number; row: number;
  px: number; py: number; // pixel pos (interpolated)
  dx: number; dy: number; // current direction
  mouthOpen: number; // 0..1 for mouth animation
  mouthDir: number; // 1 open, -1 close
}

interface GhostState {
  col: number; row: number;
  px: number; py: number;
  dc: number; dr: number;
  progress: number; // 0..1 between current and next cell
  color: string;
  name: string;
}

interface DotState {
  col: number; row: number;
  eaten: boolean;
  id: number;
}

const GHOST_CONFIGS = [
  { color: "#ef4444", name: "Blinky" },
  { color: "#22d3ee", name: "Inky" },
  { color: "#f97316", name: "Clyde" },
  { color: "#ec4899", name: "Pinky" },
  { color: "#a855f7", name: "Sue" },
];

const GHOST_SPEED = 0.045; // pelan — biar terlihat berjalan
const PAC_SPEED   = 0.10;
const DOT_RESPAWN_INTERVAL = 1800; // ms
const MAX_DOTS = 55;

function PacManHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<{
    pac: PacState;
    ghosts: GhostState[];
    dots: DotState[];
    score: number;
    dotCounter: number;
    lastRespawn: number;
  } | null>(null);
  const animRef = useRef<number>(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const W = MAZE_COLS * CELL;
    const H = MAZE_ROWS * CELL;
    canvas.width  = W;
    canvas.height = H;

    // Initialize walkable cells for dots
    const walkable = getWalkableCells();

    // Shuffle walkable deterministically
    let seed = 42;
    const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    const shuffled = [...walkable].sort(() => rng() - 0.5);

    // Pac-Man starts at col 1, row 3
    const pac: PacState = {
      col: 1, row: 3,
      px: 1 * CELL + CELL / 2,
      py: 3 * CELL + CELL / 2,
      dx: 1, dy: 0,
      mouthOpen: 0.5,
      mouthDir: 1,
    };

    // Ghosts start spread out
    const ghostStarts = [
      { col: 20, row: 1 }, { col: 20, row: 3 }, { col: 20, row: 5 },
      { col: 20, row: 7 }, { col: 20, row: 9 },
    ];
    const ghosts: GhostState[] = GHOST_CONFIGS.map((cfg, i) => {
      const sc = ghostStarts[i] ?? ghostStarts[0];
      return {
        col: sc.col, row: sc.row,
        px: sc.col * CELL + CELL / 2,
        py: sc.row * CELL + CELL / 2,
        dc: i % 2 === 0 ? 1 : -1, dr: 0,
        progress: 0,
        color: cfg.color,
        name: cfg.name,
      };
    });

    // Seed initial dots
    const initCount = Math.min(MAX_DOTS, shuffled.length);
    let dotCounter = 0;
    const dots: DotState[] = shuffled.slice(0, initCount).map(c => ({
      col: c.col, row: c.row, eaten: false, id: dotCounter++,
    }));

    stateRef.current = { pac, ghosts, dots, score: 0, dotCounter, lastRespawn: performance.now() };

    /* ── PAC-MAN MOVEMENT ── */
    let pacTargetCol = pac.col + pac.dx;
    let pacTargetRow = pac.row + pac.dy;
    let pacProgress = 0; // 0..1

    function advancePac() {
      const s = stateRef.current!;
      const { pac } = s;

      pacProgress += PAC_SPEED;

      // Animate mouth
      pac.mouthOpen += pac.mouthDir * 0.07;
      if (pac.mouthOpen >= 1) { pac.mouthOpen = 1; pac.mouthDir = -1; }
      if (pac.mouthOpen <= 0.05) { pac.mouthOpen = 0.05; pac.mouthDir = 1; }

      if (pacProgress >= 1) {
        pacProgress -= 1;
        // Arrived at target
        pac.col = pacTargetCol;
        pac.row = pacTargetRow;

        // Eat dot at current cell
        const dotIdx = s.dots.findIndex(d => !d.eaten && d.col === pac.col && d.row === pac.row);
        if (dotIdx !== -1) {
          s.dots[dotIdx].eaten = true;
          s.score += 10;
          setScore(s.score);
        }

        // Pick next cell — continue direction if possible, else turn
        if (isWalkable(pac.col + pac.dx, pac.row + pac.dy)) {
          pacTargetCol = pac.col + pac.dx;
          pacTargetRow = pac.row + pac.dy;
        } else {
          // find any valid dir
          const dirs = [
            { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
            { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
          ].filter(d => !(d.dc === -pac.dx && d.dr === -pac.dy) && isWalkable(pac.col + d.dc, pac.row + d.dr));
          if (dirs.length > 0) {
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            pac.dx = d.dc; pac.dy = d.dr;
            pacTargetCol = pac.col + d.dc;
            pacTargetRow = pac.row + d.dr;
          } else {
            // reverse
            pac.dx = -pac.dx; pac.dy = -pac.dy;
            pacTargetCol = pac.col + pac.dx;
            pacTargetRow = pac.row + pac.dy;
          }
        }
      }

      pac.px = (pac.col + (pacTargetCol - pac.col) * pacProgress) * CELL + CELL / 2;
      pac.py = (pac.row + (pacTargetRow - pac.row) * pacProgress) * CELL + CELL / 2;
    }

    /* ── BFS: cari dot terdekat dan kembalikan arah langkah pertama ── */
    function bfsToNearestDot(startCol: number, startRow: number): { dc: number; dr: number } | null {
      const s = stateRef.current!;
      const activeDots = s.dots.filter(d => !d.eaten);
      if (activeDots.length === 0) return null;

      // BFS
      type Node = { col: number; row: number; firstDc: number; firstDr: number };
      const visited = new Set<string>();
      const queue: Node[] = [];

      const dirs = [
        { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
        { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
      ];

      dirs.forEach(d => {
        if (isWalkable(startCol + d.dc, startRow + d.dr)) {
          queue.push({ col: startCol + d.dc, row: startRow + d.dr, firstDc: d.dc, firstDr: d.dr });
          visited.add(`${startCol + d.dc},${startRow + d.dr}`);
        }
      });

      visited.add(`${startCol},${startRow}`);

      while (queue.length > 0) {
        const cur = queue.shift()!;
        // Cek apakah ada dot di sini
        if (activeDots.some(d => d.col === cur.col && d.row === cur.row)) {
          return { dc: cur.firstDc, dr: cur.firstDr };
        }
        dirs.forEach(d => {
          const nc = cur.col + d.dc;
          const nr = cur.row + d.dr;
          const key = `${nc},${nr}`;
          if (!visited.has(key) && isWalkable(nc, nr)) {
            visited.add(key);
            queue.push({ col: nc, row: nr, firstDc: cur.firstDc, firstDr: cur.firstDr });
          }
        });
      }
      return null;
    }

    /* ── GHOST MOVEMENT — BFS menuju dot hijau terdekat ── */
    function advanceGhost(g: GhostState) {
      g.progress += GHOST_SPEED;
      if (g.progress >= 1) {
        g.progress -= 1;
        // Pindah ke sel berikutnya
        g.col = g.col + g.dc;
        g.row = g.row + g.dr;

        // Gunakan BFS untuk mencari arah menuju dot terdekat
        const best = bfsToNearestDot(g.col, g.row);
        if (best) {
          g.dc = best.dc;
          g.dr = best.dr;
        } else {
          // Tidak ada dot — jalan random, jangan balik arah kecuali terpaksa
          const dirs = [
            { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
            { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
          ].filter(d => !(d.dc === -g.dc && d.dr === -g.dr) && isWalkable(g.col + d.dc, g.row + d.dr));
          if (dirs.length > 0) {
            const d = dirs[Math.floor(Math.random() * dirs.length)];
            g.dc = d.dc; g.dr = d.dr;
          } else {
            g.dc = -g.dc; g.dr = -g.dr;
          }
        }
      }
      g.px = (g.col + g.dc * g.progress) * CELL + CELL / 2;
      g.py = (g.row + g.dr * g.progress) * CELL + CELL / 2;
    }

    /* ── DOT RESPAWN ── */
    function respawnDots(now: number) {
      const s = stateRef.current!;
      if (now - s.lastRespawn < DOT_RESPAWN_INTERVAL) return;
      s.lastRespawn = now;

      const active = s.dots.filter(d => !d.eaten).length;
      if (active < MAX_DOTS) {
        const occupied = new Set(s.dots.filter(d => !d.eaten).map(d => `${d.col},${d.row}`));
        const candidates = walkable.filter(c => !occupied.has(`${c.col},${c.row}`));
        const toAdd = Math.min(8, MAX_DOTS - active, candidates.length);
        const picked = candidates.sort(() => Math.random() - 0.5).slice(0, toAdd);
        picked.forEach(c => {
          s.dots.push({ col: c.col, row: c.row, eaten: false, id: s.dotCounter++ });
        });
        // Keep array from growing unboundedly
        s.dots = s.dots.filter(d => !d.eaten);
      }
    }

    /* ── DRAW ── */
    function draw(now: number) {
      const s = stateRef.current!;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0a0a18";
      ctx.fillRect(0, 0, W, H);

      // Draw maze walls
      for (let r = 0; r < MAZE_ROWS; r++) {
        for (let c = 0; c < MAZE_COLS; c++) {
          if (MAZE_LAYOUT[r * MAZE_COLS + c] === 1) {
            const x = c * CELL;
            const y = r * CELL;
            // Wall glow
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(x, y, CELL, CELL);
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
          }
        }
      }

      // Draw dots
      s.dots.forEach(dot => {
        if (dot.eaten) return;
        const x = dot.col * CELL + CELL / 2;
        const y = dot.row * CELL + CELL / 2;
        const pulse = 0.7 + 0.3 * Math.sin(now * 0.003 + dot.id * 0.7);
        ctx.beginPath();
        ctx.arc(x, y, 3.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${0.7 + 0.3 * pulse})`;
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 6 * pulse;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Pac-Man
      const pac = s.pac;
      const angle = Math.atan2(pac.dy, pac.dx);
      const mouthAngle = pac.mouthOpen * 0.4; // max ~0.4 rad ≈ 23°
      ctx.beginPath();
      ctx.moveTo(pac.px, pac.py);
      ctx.arc(pac.px, pac.py, CELL * 0.44, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
      ctx.closePath();
      ctx.fillStyle = "#facc15";
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw ghosts
      s.ghosts.forEach(g => {
        const x = g.px;
        const y = g.py;
        const r = CELL * 0.42;
        const glow = 8 + 4 * Math.sin(now * 0.004 + g.px);

        ctx.shadowColor = g.color;
        ctx.shadowBlur = glow;

        // Ghost body
        ctx.beginPath();
        ctx.arc(x, y - r * 0.1, r, Math.PI, 0);
        // Wavy bottom
        const waveSegs = 4;
        const segW = (r * 2) / waveSegs;
        for (let i = 0; i < waveSegs; i++) {
          const cx1 = (x - r) + segW * (i + 0.25);
          const cx2 = (x - r) + segW * (i + 0.75);
          const topY = y - r * 0.1 + r;
          const botY = topY + r * 0.35;
          const endX = (x - r) + segW * (i + 1);
          const endY = i % 2 === 0 ? botY : topY;
          ctx.quadraticCurveTo(cx1, i % 2 === 0 ? topY : botY, (x - r) + segW * (i + 0.5), endY);
          ctx.quadraticCurveTo(cx2, endY, endX, topY);
        }
        ctx.closePath();
        ctx.fillStyle = g.color;
        ctx.fill();

        // Eyes
        ctx.shadowBlur = 0;
        [[-r * 0.35, -r * 0.25], [r * 0.35, -r * 0.25]].forEach(([ox, oy]) => {
          ctx.beginPath();
          ctx.arc(x + ox, y + oy - r * 0.1, r * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + ox + g.dc * r * 0.08, y + oy + g.dr * r * 0.08 - r * 0.1, r * 0.1, 0, Math.PI * 2);
          ctx.fillStyle = "#1e3a8a";
          ctx.fill();
        });
      });

      ctx.shadowBlur = 0;
    }

    /* ── GAME LOOP ── */
    let lastTime = 0;
    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      if (dt > 0 && dt < 100) {
        advancePac();
        stateRef.current!.ghosts.forEach(advanceGhost);
        respawnDots(now);
      }
      draw(now);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const W = MAZE_COLS * CELL;
  const H = MAZE_ROWS * CELL;

  return (
    <section className="relative max-w-5xl mx-auto py-8">
      {/* Game container */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "#060614",
          boxShadow: "0 0 0 1px rgba(167,139,250,0.2), 0 0 60px -10px rgba(139,92,246,0.3)",
        }}
      >
        {/* Score badge */}
        <div
          className="absolute top-3 right-4 z-20 flex items-center gap-2"
          style={{ pointerEvents: "none" }}
        >
          <motion.span
            className="pill"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11 }}
            animate={{ boxShadow: ["0 0 0 0px rgba(250,204,21,.4)", "0 0 0 6px rgba(250,204,21,0)", "0 0 0 0px rgba(250,204,21,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span style={{ fontSize: 14 }}>🟡</span>
            <span style={{ color: "#facc15", fontWeight: 700 }}>Score: {score}</span>
          </motion.span>
        </div>

        {/* Badge overlay */}
        <div
          className="absolute top-3 left-4 z-20"
          style={{ pointerEvents: "none" }}
        >
          <motion.span
            className="pill"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(139,92,246,.5)",
                "0 0 0 8px rgba(139,92,246,0)",
                "0 0 0 0px rgba(139,92,246,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa", display: "inline-block" }} />
            About Me
          </motion.span>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            imageRendering: "pixelated",
          }}
          width={W}
          height={H}
          aria-label="Pac-Man game"
        />
      </div>

      {/* Ghost legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mt-4"
      >
        {GHOST_CONFIGS.map(g => (
          <span
            key={g.name}
            className="pill !text-[11px] flex items-center gap-1.5"
            style={{ borderColor: `${g.color}50`, background: `${g.color}12` }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: g.color, display: "inline-block", boxShadow: `0 0 6px ${g.color}` }} />
            <span style={{ color: g.color }}>{g.name}</span>
          </span>
        ))}
        <span className="pill !text-[11px] flex items-center gap-1.5" style={{ borderColor: "#22c55e50", background: "#22c55e12" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ color: "#22c55e" }}>Dots</span>
        </span>
      </motion.div>
    </section>
  );
}
/* ═══════════════════════════════════════════════════════════════
   END PAC-MAN HERO GAME
   ═══════════════════════════════════════════════════════════════ */

/* ─── Stat Button (About) — wiggle + ripple + glow ────────────── */
function StatButtonAbout({ label, value, color, href }: {
  label: string; value: string; color: string; href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const Tag = href ? motion.a : motion.button;

  return (
    <div className="relative inline-flex">
      {/* Ripple rings */}
      <AnimatePresence>
        {hovered && [0, 0.12, 0.25].map((delay, r) => (
          <motion.span
            key={r}
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 2.0 + r * 0.35, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 + r * 0.1, delay, ease: "easeOut" }}
            style={{ border: `1.5px solid ${color}`, borderRadius: 12 }}
          />
        ))}
      </AnimatePresence>

      {/* Glow blob */}
      <motion.span
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={hovered ? { opacity: 0.45, scale: 1.4 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ background: color, filter: "blur(10px)", zIndex: 0 }}
      />

      <Tag
        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : { type: "button" as const })}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{
          scale: 1.1,
          y: -4,
          rotate: [0, -6, 5, -3, 0],
          transition: {
            scale: { type: "spring", stiffness: 380, damping: 14 },
            y: { type: "spring", stiffness: 380, damping: 14 },
            rotate: { duration: 0.4, ease: "easeInOut" },
          },
        }}
        whileTap={{ scale: 0.93 }}
        className="relative z-10 px-4 py-3 rounded-xl text-left cursor-pointer overflow-hidden"
        style={{
          background: hovered ? `linear-gradient(135deg, ${color}25, ${color}15)` : "rgba(255,255,255,0.04)",
          border: hovered ? `1px solid ${color}70` : "1px solid rgba(255,255,255,0.1)",
          boxShadow: hovered ? `0 0 0 1px ${color}30, 0 8px 28px -6px ${color}60` : "none",
          transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
          minWidth: 0,
          width: "100%",
        }}
      >
        {/* Shimmer sweep */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                background: `linear-gradient(105deg, transparent 30%, ${color}35 50%, transparent 70%)`,
                borderRadius: 12,
              }}
            />
          )}
        </AnimatePresence>
        <p className="text-xs text-muted-foreground m-0 relative z-10">{label}</p>
        <motion.p
          className="text-sm font-bold m-0 mt-0.5 relative z-10"
          animate={hovered ? { color: [color, "#ffffff", color] } : { color: "#ffffff" }}
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
        >
          {value}
        </motion.p>
      </Tag>
    </div>
  );
}

/* ─── Coding Activity — real GitHub contributions ──────────────── */
function CodingActivity() {
  return (
    <div>
      {/* Calendar + badge contributions — semua dari GithubContributions */}
      <GithubContributions />

      {/* Stats row — 2 kolom di mobile, GitHub full width di bawah */}
      <motion.div
        className="mt-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-2 sm:contents">
          <StatButtonAbout label="Repositories"  value="38"       color="#39d353" />
          <StatButtonAbout label="Active Streak" value="42 days"  color="#60a5fa" />
        </div>
        <div className="sm:contents">
          <StatButtonAbout label="GitHub" value="@hairilikhsan17" color="#a78bfa" href="https://github.com/hairilikhsan17" />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Profile Card ─────────────────────────────────────────────── */
function ProfileCard() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(x, { stiffness: 150, damping: 20 });
  const ry = useSpring(y, { stiffness: 150, damping: 20 });
  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((e.clientY - rect.top) / rect.height - 0.5) * 14);
    y.set(((e.clientX - rect.left) / rect.width - 0.5) * -14);
  };

  const tags = ["Makassar, Indonesia", "Universitas Dipa Makassar", "3+ Tahun Pengalaman", "10+ Sertifikasi", "100+ Proyek"];

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ boxShadow: "0 0 0 2px rgba(139,92,246,0.7), 0 24px 80px -15px rgba(139,92,246,0.5), 0 0 60px -20px rgba(96,165,250,0.3)" }}
    >
      {/* Animated top bar */}
      <motion.div
        className="h-1.5 rounded-t-3xl"
        style={{ background: "linear-gradient(to right, #7c3aed, #3b82f6, #06b6d4)" }}
        animate={hovered ? { scaleX: [1, 1.02, 1], opacity: [1, 0.8, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      <div className="relative glass rounded-b-3xl p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-8 items-start overflow-hidden">
        {/* Shimmer sweep on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "200%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              style={{ background: "linear-gradient(105deg, transparent 35%, rgba(139,92,246,0.1) 50%, transparent 65%)", zIndex: 1 }}
            />
          )}
        </AnimatePresence>

        {/* Glow bg on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-b-3xl"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(139,92,246,0.08), transparent 70%)", zIndex: 0 }}
        />

        <motion.div
          animate={{
            boxShadow: hovered
              ? "0 0 0 3px rgba(139,92,246,0.9), 0 0 40px 8px rgba(139,92,246,0.4), 0 0 80px 20px rgba(96,165,250,0.2)"
              : "0 0 0 0px transparent",
            scale: hovered ? 1.04 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden flex-shrink-0"
          style={{ transform: "translateZ(24px)", position: "relative", zIndex: 2 }}
        >
          <motion.img
            src={profile}
            alt="Hairil Ikhsan"
            loading="lazy"
            className="w-full h-60 object-cover"
            style={{ objectPosition: "center 10%" }}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Overlay glow on photo */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 60%)" }}
          />
        </motion.div>

        <div style={{ transform: "translateZ(32px)", position: "relative", zIndex: 2 }}>
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <motion.span
              className="text-xl"
              animate={hovered ? { rotate: [0, -20, 20, -10, 0] } : {}}
              transition={{ duration: 0.6 }}
            >👋</motion.span>
            <span className="text-muted-foreground text-sm">Halo, Saya</span>
          </motion.div>

          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{
              background: hovered
                ? "linear-gradient(120deg, #a78bfa, #60a5fa, #22d3ee)"
                : "none",
              WebkitBackgroundClip: hovered ? "text" : "unset",
              WebkitTextFillColor: hovered ? "transparent" : "inherit",
              backgroundClip: hovered ? "text" : "unset",
              transition: "all 0.3s ease",
            }}
          >
            Hairil Ikhsan
          </motion.h3>

          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Programmer & Full Stack Developer dari <span className="text-primary font-medium">Makassar, Sulawesi Selatan</span>
          </motion.p>

          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            {[
              <>
                Saya adalah seorang <span className="text-foreground font-medium">programmer</span> dan{" "}
                <span className="text-foreground font-medium">Full Stack Developer</span> yang berasal dari{" "}
                <span className="text-foreground font-medium">Makassar, Sulawesi Selatan</span>, Indonesia.
                Saat ini saya sedang menempuh pendidikan di{" "}
                <span className="text-foreground font-medium">Universitas Dipa Makassar</span> dan aktif sebagai anggota{" "}
                <span className="text-foreground font-medium">Diponegara Computer Club (DCC)</span>, sebuah komunitas IT terbesar di kampus saya.
              </>,
              <>
                Dengan pengalaman lebih dari <span className="text-foreground font-medium">3 tahun</span> di dunia pemrograman,
                saya telah menyelesaikan <span className="text-foreground font-medium">30+ proyek</span> dan meraih{" "}
                <span className="text-foreground font-medium">10+ sertifikasi</span> profesional. Keahlian utama saya meliputi{" "}
                <span className="text-foreground font-medium">Full-Stack Web Development</span> (React, TypeScript, Next.js, Node.js, Laravel),{" "}
                <span className="text-foreground font-medium">Cloud Computing</span>,{" "}
                <span className="text-foreground font-medium">UI/UX Design</span>,{" "}
                <span className="text-foreground font-medium">Data Engineering</span>, dan{" "}
                <span className="text-foreground font-medium">Computer Networking</span>.
              </>,
              <>
                Saya percaya bahwa teknologi adalah alat terbaik untuk memecahkan masalah nyata. Setiap proyek yang saya kerjakan selalu
                mengutamakan <span className="text-foreground font-medium">kualitas kode</span>,{" "}
                <span className="text-foreground font-medium">performa</span>, dan{" "}
                <span className="text-foreground font-medium">pengalaman pengguna</span> yang luar biasa. Saya berkomitmen untuk terus
                belajar dan berkontribusi di ekosistem teknologi Indonesia.
              </>,
            ].map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {tags.map((t, i) => (
              <motion.span
                key={t}
                className="pill text-[11px]"
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 300 }}
                whileHover={{
                  scale: 1.14,
                  y: -5,
                  boxShadow: "0 6px 24px -4px rgba(139,92,246,0.6)",
                  background: "linear-gradient(120deg, rgba(139,92,246,0.3), rgba(96,165,250,0.3))",
                  borderColor: "rgba(139,92,246,0.8)",
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Social Icons ─────────────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#0077b5"/>
    <path d="M14 19h-4v14h4V19zm-2-7a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm9 7h-4v14h4v-7.5c0-3.8 5-4.1 5 0V33h4v-8.5c0-6.8-8-6.5-9-3.2V19z" fill="white"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1a1a2e"/>
    <path d="M22 9a13 13 0 00-4.1 25.3c.65.12.89-.28.89-.63v-2.4c-3.6.78-4.36-1.73-4.36-1.73-.59-1.5-1.44-1.9-1.44-1.9-1.18-.8.09-.79.09-.79 1.3.09 1.99 1.34 1.99 1.34 1.16 1.98 3.04 1.41 3.78 1.08.12-.84.45-1.41.82-1.73-2.88-.33-5.91-1.44-5.91-6.4 0-1.41.5-2.57 1.33-3.47-.13-.53-.58-1.65.13-3.44 0 0 1.08-.35 3.55 1.32A12.35 12.35 0 0122 14.8c1.1.01 2.2.15 3.24.43 2.46-1.67 3.54-1.32 3.54-1.32.71 1.79.26 3.11.13 3.44.83.9 1.33 2.06 1.33 3.47 0 4.97-3.03 6.06-5.92 6.38.47.4.88 1.2.88 2.42v3.58c0 .35.23.76.89.63A13 13 0 0022 9z" fill="white"/>
  </svg>
);
const ScholarIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#4285f4"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white" fontFamily="serif">g</text>
    <text x="32" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="serif" fontStyle="italic">s</text>
  </svg>
);
const KaggleIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#20beff"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">K</text>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <defs>
      <linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#f09433"/>
        <stop offset="30%"  stopColor="#e6683c"/>
        <stop offset="55%"  stopColor="#dc2743"/>
        <stop offset="75%"  stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <rect width="44" height="44" rx="10" fill="url(#ig2)"/>
    <rect x="12" y="12" width="20" height="20" rx="6" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="22" cy="22" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
    <circle cx="29.5" cy="14.5" r="1.8" fill="white"/>
  </svg>
);
const MediumIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1a1a1a"/>
    <text x="22" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">M</text>
  </svg>
);
const OrcidIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#a6ce39"/>
    <text x="22" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">iD</text>
  </svg>
);
const GoogleDevIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect width="44" height="44" rx="10" fill="#1e1e2e"/>
    <text x="14" y="27" fontSize="13" fontWeight="bold" fill="#ea4335">&lt;</text>
    <text x="22" y="27" fontSize="13" fontWeight="bold" fill="#34a853">&gt;</text>
    <circle cx="33" cy="22" r="4" fill="none" stroke="#4285f4" strokeWidth="2"/>
    <circle cx="33" cy="22" r="1.5" fill="#4285f4"/>
  </svg>
);

const SOCIALS = [
  { name: "LinkedIn",       Icon: LinkedInIcon,  href: "https://www.linkedin.com/in/hairil-ikhsan-688709404" },
  { name: "GitHub",         Icon: GithubIcon,    href: "https://github.com/hairilikhsan17" },
  { name: "Google Scholar", Icon: ScholarIcon,   href: "#" },
  { name: "Kaggle",         Icon: KaggleIcon,    href: "#" },
  { name: "Instagram",      Icon: InstagramIcon, href: "https://www.instagram.com/hairilikhsan17?igsh=bXBrYmt3cnRvMWt2" },
  { name: "Medium",         Icon: MediumIcon,    href: "#" },
  { name: "ORCID",          Icon: OrcidIcon,     href: "#" },
  { name: "Google Dev",     Icon: GoogleDevIcon, href: "#" },
];

/* ─── Connect Section ──────────────────────────────────────────── */
function ConnectSection() {
  const [liHovered, setLiHovered] = useState(false);

  return (
    <div className="grid md:grid-cols-[260px_1fr] gap-5 items-stretch">

      {/* ── LinkedIn Floating Card ── */}
      <div className="relative flex items-center justify-center" style={{ minHeight: 380 }}>

        {/* Outer glow blob — biru dominan seperti di gambar */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: -28,
            borderRadius: 32,
            background: "radial-gradient(ellipse at 40% 60%, rgba(30,100,220,0.55) 0%, rgba(59,130,246,0.3) 40%, rgba(14,30,80,0.15) 70%, transparent 100%)",
            filter: "blur(18px)",
            zIndex: 0,
          }}
          animate={{
            opacity: liHovered ? [0.85, 1, 0.85] : [0.55, 0.75, 0.55],
            scale:   liHovered ? [1, 1.05, 1]    : [1, 1.02, 1],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Border ring — biru terang tipis */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            inset: -3,
            borderRadius: 22,
            border: "1.5px solid rgba(59,130,246,0.55)",
            zIndex: 1,
          }}
          animate={{
            boxShadow: liHovered
              ? "0 0 0 4px rgba(59,130,246,0.18), 0 0 50px rgba(59,130,246,0.35), 0 0 90px rgba(30,80,200,0.2)"
              : "0 0 0 2px rgba(59,130,246,0.1), 0 0 28px rgba(59,130,246,0.2)",
            borderColor: liHovered ? "rgba(96,165,250,0.8)" : "rgba(59,130,246,0.55)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* The card — floating */}
        <motion.div
          onHoverStart={() => setLiHovered(true)}
          onHoverEnd={() => setLiHovered(false)}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          whileHover={{ scale: 1.025 }}
          className="relative w-full overflow-hidden flex flex-col"
          style={{
            borderRadius: 18,
            border: "1px solid rgba(59,130,246,0.35)",
            background: "#0a0e1a",
            zIndex: 2,
          }}
        >
          {/* ── Row 1: nama di header abu gelap ── */}
          <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              Hairil Ikhsan
            </p>
          </div>

          {/* ── Row 2: LinkedIn logo bar ── */}
          <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {/* "Linked" teks putih + kotak biru "in" */}
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: "-0.5px" }}>Linked</span>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: 4,
                background: "#0a66c2",
                fontSize: 14, fontWeight: 700, color: "white",
                fontFamily: "Arial, sans-serif",
                marginLeft: 1,
              }}>in</span>
            </div>
          </div>

          {/* ── Row 3: body hitam pekat ── */}
          <div style={{ background: "#000000", padding: "16px 16px 20px" }}>
            {/* Foto profil bulat */}
            <motion.div
              className="rounded-full overflow-hidden"
              style={{
                width: 64, height: 64,
                border: "2.5px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.7)",
                marginBottom: 14,
                background: "white",
              }}
              whileHover={{ scale: 1.08, boxShadow: "0 0 0 3px rgba(59,130,246,0.6), 0 4px 20px rgba(59,130,246,0.3)" }}
            >
              <img src={profile} alt="Hairil Ikhsan" className="w-full h-full object-cover" style={{ objectPosition: "center 10%" }} />
            </motion.div>

            {/* Nama bold */}
            <p style={{ fontSize: 15, fontWeight: 700, color: "white", margin: "0 0 6px" }}>
              Hairil Ikhsan
            </p>

            {/* Deskripsi — ukuran lebih besar dari sebelumnya, sesuai gambar */}
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.55, margin: "0 0 6px" }}>
              Tech Enthusiast | Web Developer | Public Relations | Digital Business | AI Enthusiast
            </p>

            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: "0 0 18px" }}>
              Google Student Ambassador Indonesia | Universitas Dipa Makassar
            </p>

            {/* Tombol oval "Lihat profil" */}
            <motion.a
              href="https://www.linkedin.com/in/hairil-ikhsan-688709404"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ background: "rgba(255,255,255,0.1)", scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-block",
                padding: "9px 24px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.6)",
                background: "transparent",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Lihat profil
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-3">
        {SOCIALS.map(({ name, Icon, href }, i) => (
          <motion.a key={name} href={href}
            target={href !== "#" ? "_blank" : undefined}
            rel={href !== "#" ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 250 }}
            whileHover={{
              y: -8,
              scale: 1.08,
              boxShadow: "0 0 0 1px rgba(139,92,246,0.6), 0 16px 40px -8px rgba(139,92,246,0.4), 0 0 30px -10px rgba(96,165,250,0.3)",
              background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(96,165,250,0.1))",
            }}
            whileTap={{ scale: 0.95 }}
            className="glass rounded-2xl flex flex-col items-center justify-center gap-2.5 py-5 cursor-pointer overflow-hidden relative"
          >
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Icon />
            </motion.div>
            <motion.span
              className="text-[11px] text-muted-foreground font-medium"
              whileHover={{ color: "#a78bfa" }}
            >
              {name}
            </motion.span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ──────────────────────────────────────────────────────── */
const faqs = [
  { q: "Siapa Hairil Ikhsan?",                  a: "Saya seorang full-stack developer & cloud enthusiast yang berbasis di Makassar, Indonesia." },
  { q: "Apa saja keahlian Hairil Ikhsan?",       a: "Pengembangan web modern dengan React, Next.js, Laravel, dan platform cloud seperti AWS. Juga UI/UX Design dan Data Engineering." },
  { q: "Programmer terbaik di Makassar siapa?",  a: "Hehe, mungkin saya bisa masuk daftar — tapi yang pasti saya terus belajar dan berkembang setiap hari 😄" },
  { q: "Di mana Hairil Ikhsan berkuliah?",       a: "Saya berkuliah di Universitas Dipa Makassar, mengambil program studi Teknologi Informasi." },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -10 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.015,
        boxShadow: "0 0 0 1px rgba(139,92,246,0.45), 0 10px 40px -10px rgba(139,92,246,0.3)",
      }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Animated left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
        animate={{
          background: open
            ? "linear-gradient(to bottom, #a78bfa, #60a5fa)"
            : hovered
            ? "linear-gradient(to bottom, rgba(139,92,246,0.5), rgba(96,165,250,0.5))"
            : "transparent",
          opacity: open || hovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute" }}
      />
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="w-full p-5 flex justify-between items-center text-left"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.span
          className="font-semibold"
          animate={{ color: open ? "#a78bfa" : hovered ? "#c4b5fd" : "inherit" }}
          transition={{ duration: 0.2 }}
        >
          {q}
        </motion.span>
        <motion.div
          animate={{ rotate: open ? 180 : 0, color: open ? "#a78bfa" : "inherit" }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.p
              className="px-5 pb-5 text-sm text-muted-foreground"
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── About Page ───────────────────────────────────────────────── */
function AboutPage() {
  return (
    <>
      <CursorTrail />
      <motion.div
        className="px-4"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── 1. Hero — Pac-Man game ── */}
        <motion.div variants={sectionVariant}>
          <PacManHero />
        </motion.div>

        {/* ── 2. Profile / Tentang Saya ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Tentang Saya" title="Hairil Ikhsan" subtitle="Programmer & Full Stack Developer dari Makassar, Sulawesi Selatan">
            <ProfileCard />
          </Section>
        </motion.div>

        {/* ── 3. Coding Activity (separate section) ── */}
        <motion.div variants={sectionVariant}>
          <Section
            badge="Activity"
            title="Coding Activity"
            subtitle="Year of consistent development"
            icon={
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #1a1a2e 0%, #0d1117 100%)",
                  border: "1.5px solid rgba(52,211,153,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(52,211,153,0.25), 0 0 32px rgba(34,211,238,0.15)",
                }}
              >
                <Github size={22} style={{ color: "#34d399" }} />
              </motion.div>
            }
          >
            <CodingActivity />
          </Section>
        </motion.div>

        {/* ── 4. Keahlian & Spesialisasi ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Specialization" title="Keahlian & Spesialisasi" subtitle="Areas where I bring the most value">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  Icon: Code2,
                  title: "Full-Stack Web Development",
                  desc: "Membangun aplikasi web modern dan scalable menggunakan React, TypeScript, Next.js, Node.js, dan Laravel. Ahli dalam domain frontend dan backend development.",
                  gradient: "from-violet-500 to-indigo-500",
                  glow: "rgba(139,92,246,0.5)",
                },
                {
                  Icon: Palette,
                  title: "UI/UX Design",
                  desc: "Mendesain antarmuka pengguna yang intuitif dan menarik dengan Figma dan Adobe XD. Fokus pada user experience, aksesibilitas, dan responsive design.",
                  gradient: "from-pink-500 to-rose-500",
                  glow: "rgba(236,72,153,0.5)",
                },
                {
                  Icon: Cloud,
                  title: "Cloud & Data Engineering",
                  desc: "Mengelola infrastruktur cloud, data pipeline, dan analisis data. Berpengalaman dengan Google Cloud, Python, dan platform Kaggle untuk data science.",
                  gradient: "from-cyan-500 to-blue-500",
                  glow: "rgba(6,182,212,0.5)",
                },
              ].map(({ Icon, title, desc, gradient, glow }, i) => (
                <MagneticCard key={title}>
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, type: "spring", stiffness: 180 }}
                    whileHover={{
                      y: -10,
                      boxShadow: `0 0 0 1px ${glow.replace("0.5", "0.6")}, 0 20px 60px -12px ${glow}, 0 0 40px -20px ${glow}`,
                    }}
                    className="glass rounded-3xl p-6 h-full relative overflow-hidden"
                  >
                    {/* Animated bg glow on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-3xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{ background: `radial-gradient(ellipse 80% 60% at 20% 30%, ${glow.replace("0.5", "0.08")}, transparent 70%)` }}
                    />
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${gradient}`}
                      whileHover={{ rotate: 12, scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="text-white" size={22} />
                    </motion.div>
                    <motion.h3
                      className="font-bold text-lg"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {title}
                    </motion.h3>
                    <p className="text-sm text-muted-foreground mt-2">{desc}</p>
                  </motion.div>
                </MagneticCard>
              ))}
            </div>
          </Section>
        </motion.div>

        {/* ── 5. Connect With Me ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="Connect" title="Connect With Me" subtitle="Mari berkolaborasi! Hubungi saya melalui platform profesional berikut">
            <ConnectSection />
          </Section>
        </motion.div>

        {/* ── 6. FAQ + Stats ── */}
        <motion.div variants={sectionVariant}>
          <Section badge="FAQ" title="Pertanyaan Umum" subtitle="Hal yang sering ditanyakan tentang saya">
            <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
              <div className="space-y-3">
                {faqs.map((f, i) => <FAQItem key={i} {...f} index={i} />)}
              </div>
              <div className="grid grid-cols-2 gap-3 md:mt-10">
                {[
                  { v: "3+",  l: "Years Experience", color: "from-violet-500 to-indigo-600" },
                  { v: "50+", l: "Happy Clients",    color: "from-pink-500 to-rose-600"    },
                  { v: "30+", l: "Projects Done",    color: "from-orange-400 to-amber-500" },
                  { v: "10+", l: "Certifications",   color: "from-yellow-400 to-orange-400"},
                ].map((s, i) => (
                  <motion.div key={s.l}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                    whileHover={{
                      scale: 1.08,
                      y: -6,
                      boxShadow: "0 0 0 1px rgba(139,92,246,0.5), 0 16px 50px -10px rgba(139,92,246,0.4)",
                      background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(96,165,250,0.08))",
                    }}
                    className="glass rounded-3xl p-5 text-center cursor-default"
                  >
                    <motion.div
                      className={`text-3xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}
                      initial={{ scale: 0, rotate: -10 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 250 }}
                      whileHover={{ scale: 1.15 }}
                    >
                      {s.v}
                    </motion.div>
                    <div className="text-[10px] text-muted-foreground mt-1">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>
        </motion.div>

      </motion.div>
    </>
  );
}