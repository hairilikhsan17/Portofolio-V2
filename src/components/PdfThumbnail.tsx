/**
 * PdfThumbnail
 * Renders the first page of a PDF as a <canvas> image.
 * Works on all devices including Android/iOS mobile browsers where
 * <iframe> PDF embedding is not supported.
 *
 * Uses pdf.js loaded from the official CDN — no extra npm dependency needed.
 */
import { useEffect, useRef, useState } from "react";

/* ── Load pdf.js once from CDN ──────────────────────────────── */
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
const WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

type PdfjsLib = {
  getDocument: (src: { url: string; cMapUrl?: string; cMapPacked?: boolean }) => {
    promise: Promise<{
      getPage: (n: number) => Promise<{
        getViewport: (opts: { scale: number }) => { width: number; height: number };
        render: (opts: {
          canvasContext: CanvasRenderingContext2D;
          viewport: ReturnType<ReturnType<ReturnType<PdfjsLib["getDocument"]>["promise"]["then"]>["then"]>; // typed loosely
        }) => { promise: Promise<void> };
      }>;
    }>;
  };
  GlobalWorkerOptions: { workerSrc: string };
};

let pdfjsPromise: Promise<PdfjsLib> | null = null;

function loadPdfjs(): Promise<PdfjsLib> {
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = import(/* @vite-ignore */ PDFJS_CDN).then((mod: unknown) => {
    const lib = mod as PdfjsLib;
    lib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
    return lib;
  });
  return pdfjsPromise;
}

/* ── Component ───────────────────────────────────────────────── */
interface PdfThumbnailProps {
  /** Imported PDF asset URL (from `import myPdf from "../assets/..."`) */
  src: string;
  /** Extra class names applied to the wrapper div */
  className?: string;
  /** Pixel width to render at — canvas is scaled to fill container via CSS */
  renderWidth?: number;
}

export function PdfThumbnail({ src, className = "", renderWidth = 800 }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        if (cancelled) return;

        const loadingTask = pdfjs.getDocument({ url: src });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        // Scale so the rendered width matches renderWidth
        const naturalViewport = page.getViewport({ scale: 1 });
        const scale = renderWidth / naturalViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport: viewport as never }).promise;
        if (!cancelled) setStatus("done");
      } catch (err) {
        console.warn("[PdfThumbnail] Failed to render PDF:", src, err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => { cancelled = true; };
  }, [src, renderWidth]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-2xl bg-white ${className}`}
      style={{ aspectRatio: status === "done" ? undefined : "16/9" }}
    >
      {/* Canvas — always mounted so the ref is ready */}
      <canvas
        ref={canvasRef}
        style={{
          display: status === "done" ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
        }}
      />

      {/* Loading shimmer */}
      {status === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/5">
          <svg
            className="animate-spin"
            style={{ width: 28, height: 28, color: "#a78bfa" }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Loading preview…</span>
        </div>
      )}

      {/* Error / not supported fallback */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/80">
          {/* PDF icon */}
          <svg viewBox="0 0 48 48" style={{ width: 40, height: 40 }} fill="none">
            <rect x="6" y="4" width="36" height="40" rx="4" fill="#ef4444" opacity="0.85" />
            <text x="24" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" fontFamily="monospace">PDF</text>
          </svg>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold"
            style={{ background: "#3b82f6", color: "white" }}
          >
            Buka PDF
          </a>
        </div>
      )}
    </div>
  );
}
