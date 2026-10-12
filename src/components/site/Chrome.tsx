import { useEffect, useState } from "react";
import { ALL_IMAGES } from "@/cinematic/timeline";
import { products } from "@/data/products";
import { isSoundEnabled, setSoundEnabled } from "@/cinematic/sound";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const srcs = [...ALL_IMAGES, ...products.map((p) => p.image)];
    let n = 0;
    const tick = () => { n++; setPct(n / srcs.length); };
    srcs.forEach((s) => { const i = new Image(); i.onload = tick; i.onerror = tick; i.src = s; });
    const fallback = setTimeout(() => setPct(1), 8000);
    return () => clearTimeout(fallback);
  }, []);
  useEffect(() => {
    if (pct >= 1) { const t = setTimeout(() => { setGone(true); onDone(); }, 500); return () => clearTimeout(t); }
    return undefined;
  }, [pct, onDone]);
  if (gone) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${pct >= 1 ? "opacity-0" : "opacity-100"}`} role="status" aria-live="polite">
      <svg width="64" height="170" viewBox="0 0 64 170" aria-hidden>
        <path id="can" d="M14 22 h36 v-8 a4 4 0 0 0 -4 -4 h-28 a4 4 0 0 0 -4 4z M8 30 q0 -8 8 -8 h32 q8 0 8 8 v128 q0 6 -6 6 h-36 q-6 0 -6 -6z" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40" />
        <path d="M8 30 q0 -8 8 -8 h32 q8 0 8 8 v128 q0 6 -6 6 h-36 q-6 0 -6 -6z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - pct} style={{ transition: "stroke-dashoffset .3s" }} />
      </svg>
      <p className="mt-8 text-eyebrow text-muted-foreground">Loading the effect</p>
    </div>
  );
}

export function Header({ cinematic }: { cinematic: boolean }) {
  const [sound, setSound] = useState(isSoundEnabled());
  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-colors duration-500 ${cinematic ? "" : "border-b border-border bg-background/85 backdrop-blur"}`}>
      <a href="#top" className="font-display text-2xl tracking-wide text-foreground" aria-label="AXE home">AXE</a>
      <nav aria-label="Main" className={`hidden gap-8 text-sm md:flex transition-opacity ${cinematic ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <a href="#range" className="link-u">Range</a>
        <a href="#inside" className="link-u">Inside</a>
        <a href="#formats" className="link-u">Formats</a>
        <a href="#products" className="link-u">Shop</a>
        <a href="#culture" className="link-u">Culture</a>
      </nav>
      <div className="flex items-center gap-4">
        <button
          onClick={() => { const v = !sound; setSoundEnabled(v); setSound(v); }}
          aria-pressed={sound}
          className="text-eyebrow text-muted-foreground hover:text-foreground"
        >
          Sound {sound ? "On" : "Off"}
        </button>
        {cinematic && (
          <a href="#range" className="rounded-full border border-foreground/30 px-4 py-2 text-eyebrow text-foreground hover:border-primary hover:text-primary">
            Skip experience
          </a>
        )}
      </div>
    </header>
  );
}

