import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
type Activity = {
  date:  string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type WeekCell = Activity | null;

type MonthLabel = {
  col:   number;
  month: number;
};

type TooltipState = {
  visible: boolean;
  x:       number;
  y:       number;
  text:    string;
};

type ApiResponse = {
  contributions: Activity[];
};

/* ─── Config ─────────────────────────────────────────────────── */
const USERNAME   = "hairilikhsan17";
const API        = "https://github-contributions-api.jogruber.de/v4";
const COLORS     = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const MONTHS     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/* ─── Fetch ──────────────────────────────────────────────────── */
async function fetchContributions(): Promise<{ data: Activity[]; total: number }> {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;

  // Kalau ada token → pakai GitHub GraphQL API (dapat data private juga = 103)
  // Kalau tidak ada token → fallback ke jogruber API (data public saja = 80)
  if (token) {
    const query = `{
      user(login: "${USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }`;

    const res  = await fetch("https://api.github.com/graphql", {
      method:  "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ query }),
    });
    const json = await res.json() as {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
              weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
            };
          };
        };
      };
    };

    const cal   = json.data.user.contributionsCollection.contributionCalendar;
    const total = cal.totalContributions;

    // Level mapping dari string ke number
    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE:        0,
      FIRST_QUARTILE:  1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE:  3,
      FOURTH_QUARTILE: 4,
    };

    const data: Activity[] = cal.weeks.flatMap(w =>
      w.contributionDays.map(d => ({
        date:  d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? 0,
      }))
    );

    return { data, total };
  }

  // Fallback: jogruber API (public only)
  const res  = await fetch(`${API}/${USERNAME}?y=last`);
  const json = await res.json() as ApiResponse;
  const data  = json.contributions ?? [];
  const total = data.reduce((s: number, d: Activity) => s + d.count, 0);
  return { data, total };
}

/* ─── Group into weeks ───────────────────────────────────────── */
function groupIntoWeeks(data: Activity[]): WeekCell[][] {
  if (!data.length) return [];
  const weeks: WeekCell[][] = [];
  let week: WeekCell[]      = [];
  const firstDow = new Date(data[0].date).getDay();
  for (let i = 0; i < firstDow; i++) week.push(null);
  data.forEach((item: Activity) => {
    const dow = new Date(item.date).getDay();
    if (dow === 0 && week.length > 0) { weeks.push(week); week = []; }
    week.push(item);
  });
  while (week.length < 7) week.push(null);
  if (week.length > 0) weeks.push(week);
  return weeks;
}

/* ─── Month label positions ──────────────────────────────────── */
function getMonthLabels(weeks: WeekCell[][]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;
  weeks.forEach((w: WeekCell[], wi: number) => {
    w.forEach((cell: WeekCell) => {
      if (!cell) return;
      const m = new Date(cell.date).getMonth();
      if (m !== lastMonth) { labels.push({ col: wi, month: m }); lastMonth = m; }
    });
  });
  return labels;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ─── Tooltip ────────────────────────────────────────────────── */
function Tooltip({ visible, x, y, text }: TooltipState) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", left: x + 12, top: y - 36,
      background: "rgba(22,27,34,0.98)", border: "1px solid rgba(48,54,61,0.9)",
      borderRadius: 6, padding: "5px 10px", fontSize: 12, color: "white",
      pointerEvents: "none", zIndex: 9999, whiteSpace: "nowrap",
    }}>
      {text}
    </div>
  );
}

/* ─── Calendar ───────────────────────────────────────────────── */
function Calendar({ data, isMobile }: { data: Activity[]; isMobile: boolean }) {
  const [tooltip, setTooltip]  = useState<TooltipState>({ visible: false, x: 0, y: 0, text: "" });
  const containerRef            = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(13);

  const weeks     = groupIntoWeeks(data);
  const totalCols = weeks.length;

  useEffect(() => {
    function calculate() {
      if (!containerRef.current || totalCols === 0) return;

      if (isMobile) {
        // Mobile: cell size fixed 11px, bisa scroll horizontal
        setCellSize(11);
        return;
      }

      // Desktop: cell size menyesuaikan lebar container
      const containerW = containerRef.current.offsetWidth;
      const DAY_W      = 28;
      const available  = containerW - DAY_W;
      const GAP_FIXED  = 3;
      const renderCols = totalCols - 1;
      const computed   = Math.floor((available - (renderCols - 1) * GAP_FIXED) / renderCols);
      setCellSize(Math.max(7, Math.min(computed, 16)));
    }
    calculate();
    const ro = new ResizeObserver(calculate);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [totalCols, isMobile]);

  const CELL        = cellSize;
  const GAP         = 3;
  const STEP        = CELL + GAP;
  const monthLabels = getMonthLabels(weeks);

  function handleEnter(e: React.MouseEvent, item: Activity) {
    const label = item.count === 0
      ? `No contributions on ${formatDate(item.date)}`
      : `${item.count} contribution${item.count !== 1 ? "s" : ""} on ${formatDate(item.date)}`;
    setTooltip({ visible: true, x: e.clientX, y: e.clientY, text: label });
  }
  function handleMove(e: React.MouseEvent)  { setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY })); }
  function handleLeave()                    { setTooltip(t => ({ ...t, visible: false })); }

  return (
    /* Wrapper: di mobile pakai overflow-x scroll, di desktop full width */
    <div
      ref={containerRef}
      style={{
        width:      "100%",
        overflowX:  isMobile ? "auto" : "visible",
        overflowY:  "visible",
        WebkitOverflowScrolling: "touch", // smooth scroll di iOS
        paddingBottom: isMobile ? 4 : 0,  // ruang untuk scrollbar
      }}
    >
      {/* Inner: di mobile lebar natural (tidak dipaksa 100%) */}
      <div style={{ minWidth: isMobile ? "max-content" : "100%" }}>
        <Tooltip {...tooltip} />

      {/* Month labels — paddingLeft harus sama persis dengan lebar day label column */}
      <div style={{ display: "flex", paddingLeft: 28, marginBottom: 4 }}>
        {monthLabels.map((ml, i) => {
          const nextCol = monthLabels[i + 1]?.col ?? totalCols;
          const width   = (nextCol - ml.col) * STEP;
          return (
            <div key={i} style={{
              width, minWidth: width, flexShrink: 0,
              fontSize: 11, color: "var(--muted-foreground)",
            }}>
              {MONTHS[ml.month]}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: "flex" }}>

        {/* Day labels — lebar 28px, teks rata kanan */}
        <div style={{ width: 28, flexShrink: 0, display: "flex", flexDirection: "column", paddingTop: 1 }}>
          {DAY_LABELS.map((d, i) => (
            <div key={i} style={{
              height: CELL + GAP, fontSize: 10,
              color: "var(--muted-foreground)",
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 6,
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Week columns — mulai dari kolom pertama yang ada data (skip padding null di awal) */}
        <div style={{ display: "flex", gap: GAP }}>
          {weeks.map((week, wi) => {
            // Skip kolom pertama jika semua null (padding awal)
            const hasData = week.some(c => c !== null);
            if (!hasData && wi === 0) return null;
            return (
              <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {week.map((cell, di) => (
                  <div key={di} style={{
                    width: CELL, height: CELL, flexShrink: 0,
                    borderRadius: 2,
                    background: cell ? COLORS[cell.level] : "color-mix(in oklab, var(--border, rgba(22,27,34,0.6)) 60%, transparent)",
                    cursor: cell ? "pointer" : "default",
                  }}
                    onMouseEnter={cell ? (e) => handleEnter(e, cell) : undefined}
                    onMouseMove={cell  ? handleMove                  : undefined}
                    onMouseLeave={cell ? handleLeave                 : undefined}
                  />
                ))}
              </div>
            );
          })}
        </div>

      </div>
      </div>
    </div>
  );
}

/* ─── Cycling gradient colors untuk teks contributions ──────── */
const CYCLE_COLORS = [
  "#39d353", "#26a641", "#22d3ee", "#60a5fa",
  "#a78bfa", "#f472b6", "#34d399", "#fbbf24",
];

function CyclingText({ text }: { text: string }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CYCLE_COLORS.length), 800);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.span
      animate={{ color: CYCLE_COLORS[idx] }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ fontWeight: 600 }}
    >
      {text}
    </motion.span>
  );
}

/* ─── Hook: deteksi lebar layar ─────────────────────────────── */
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

/* ─── Main export ────────────────────────────────────────────── */
export function GithubContributions() {
  const [data,    setData]    = useState<Activity[]>([]);
  const [total,   setTotal]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const windowWidth            = useWindowWidth();
  const isMobile               = windowWidth < 640;

  useEffect(() => {
    fetchContributions()
      .then(({ data, total }) => { setData(data); setTotal(total); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.01, y: -4 }}
      style={{
        background:     "var(--card, rgba(13,17,23,0.92))",
        border:         "1px solid color-mix(in oklab, var(--border, rgba(48,54,61,0.8)) 100%, transparent)",
        backdropFilter: "blur(12px)",
        borderRadius:   isMobile ? 16 : 24,
        padding:        isMobile ? "16px 14px" : "24px 28px",
        position:       "relative",
        cursor:         "default",
        transition:     "box-shadow 0.35s ease",
        boxShadow: hovered
          ? "0 0 0 1px rgba(57,211,83,0.5), 0 12px 50px -10px rgba(57,211,83,0.3), 0 0 80px -30px rgba(34,211,238,0.2)"
          : "none",
      }}
    >
      {/* Scan line animasi saat hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="pointer-events-none"
            style={{
              position: "absolute", insetInline: 0, height: 2, zIndex: 10,
              background: "linear-gradient(to right, transparent, rgba(57,211,83,0.7), rgba(34,211,238,0.5), transparent)",
            }}
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "linear", repeat: Infinity }}
          />
        )}
      </AnimatePresence>

      {/* Glow background saat hover */}
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: isMobile ? 16 : 24, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(57,211,83,0.06), transparent 80%)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Header — stack di mobile, row di desktop */}
      <div style={{
        display:        "flex",
        flexDirection:  isMobile ? "column" : "row",
        alignItems:     isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        gap:            isMobile ? 8 : 0,
        marginBottom:   isMobile ? 14 : 20,
        position:       "relative",
        zIndex:         1,
      }}>
        <h2 style={{ fontSize: isMobile ? 14 : 18, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
          {loading
            ? <span style={{ color: "var(--muted-foreground)" }}>Loading contributions…</span>
            : error
            ? <span style={{ color: "var(--foreground)" }}>GitHub Contributions</span>
            : (
              <>
                <CyclingText text={`${total!.toLocaleString()}`} />
                <span style={{ color: "var(--foreground)" }}> contributions in the last year</span>
              </>
            )}
        </h2>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", gap: 4,
            color: "var(--muted-foreground)", fontSize: isMobile ? 11 : 13,
            textDecoration: "none", position: "relative", zIndex: 1,
            whiteSpace: "nowrap",
          }}
        >
          Contribution settings <ChevronDown size={isMobile ? 12 : 14} />
        </a>
      </div>

      {/* Calendar box */}
      <div style={{
        border:       "1px solid color-mix(in oklab, var(--border, rgba(48,54,61,0.7)) 100%, transparent)",
        background:   "color-mix(in oklab, var(--card, rgba(9,14,20,0.45)) 60%, transparent)",
        borderRadius: isMobile ? 12 : 16,
        padding:      isMobile ? "12px 10px 10px" : "16px 16px 12px",
        position:     "relative",
        zIndex:       1,
      }}>
        {loading ? (
          <div style={{ height: isMobile ? 80 : 120, background: "rgba(255,255,255,0.04)", borderRadius: 10 }} />
        ) : error ? (
          <p style={{ color: "rgba(200,200,235,0.4)", textAlign: "center", padding: "24px 0", margin: 0, fontSize: 13 }}>
            Gagal memuat data. Coba refresh halaman.
          </p>
        ) : (
          <Calendar data={data} isMobile={isMobile} />
        )}

        {/* Footer — stack di mobile, row di desktop */}
        {!loading && !error && (
          <div style={{
            display:        "flex",
            flexDirection:  isMobile ? "column" : "row",
            alignItems:     isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap:            isMobile ? 8 : 0,
            marginTop:      12,
            fontSize:       isMobile ? 11 : 12,
            color:          "var(--muted-foreground)",
          }}>
            <a
              href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--muted-foreground)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-foreground)")}
            >
              Learn how we count contributions
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span>Less</span>
              {COLORS.map(c => (
                <div key={c} style={{
                  width:        isMobile ? 11 : 13,
                  height:       isMobile ? 11 : 13,
                  borderRadius: 2,
                  background:   c,
                }} />
              ))}
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
