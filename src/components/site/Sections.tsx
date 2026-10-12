import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FORMATS, products, type Format, type Product } from "@/data/products";
import macro from "@/assets/frames/02-macro.jpg";
import indigoWorld from "@/assets/frames/06-indigo.jpg";
import marshWorld from "@/assets/frames/07-marshmallow.jpg";
import freshWorld from "@/assets/frames/08-fresh.jpg";
import city from "@/assets/frames/09-city.jpg";
import night from "@/assets/frames/10-night.jpg";
import ready from "@/assets/frames/04-ready.jpg";
import spray from "@/assets/frames/03-spray.jpg";

const accent = (p: Product) => ({ "--accent": p.accent }) as CSSProperties;
const motionOK = () =>
  typeof window !== "undefined" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  window.matchMedia("(min-width: 768px)").matches;

/* A — FIND YOUR AXE (pinned horizontal on desktop, swipe on mobile) */
export function FindYourAxe() {
  const [open, setOpen] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionOK()) return;
    gsap.registerPlugin(ScrollTrigger);
    sectionRef.current!.style.minHeight = "100vh";
    const track = trackRef.current!;
    const dist = () => track.scrollWidth - window.innerWidth + 48;
    const tw = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => setActive(Math.min(products.length - 1, Math.round(self.progress * (products.length - 1)))),
      },
    });
    return () => { tw.scrollTrigger?.kill(true); tw.kill(); };
  }, []);

  const cur = products[active]!;
  return (
    <div>
    <section id="range" ref={sectionRef} className="relative flex scroll-mt-0 flex-col justify-center overflow-hidden py-16 md:py-20" style={accent(cur)}>
      <div aria-hidden className="range-bg absolute inset-0 transition-[background] duration-700" />
      <p aria-hidden className="pointer-events-none absolute -bottom-[4vw] left-0 whitespace-nowrap font-display text-[24vw] uppercase leading-none text-foreground/[0.04] transition-all duration-700">
        {cur.name}
      </p>
      <div className="relative flex items-end justify-between px-6 md:px-12">
        <div>
          <p data-reveal className="text-eyebrow text-primary">01 — The range</p>
          <h2 data-reveal className="mt-3 text-display-lg">Find your AXE.</h2>
        </div>
        <p className="hidden font-display text-6xl tabular-nums text-muted-foreground/40 md:block">
          0{active + 1}<span className="text-2xl">/0{products.length}</span>
        </p>
      </div>
      <div ref={trackRef} className="relative mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 md:overflow-visible md:px-12" role="list">
        {products.map((p, i) => (
          <button
            key={p.id}
            role="listitem"
            onClick={() => setOpen(p)}
            style={accent(p)}
            data-tilt
            className={`world-card group relative flex h-[60vh] min-w-[78vw] snap-center flex-col justify-end overflow-hidden bg-card p-6 text-left transition-opacity duration-500 sm:min-w-[340px] md:min-w-[400px] ${i === active ? "md:opacity-100" : "md:opacity-60"}`}
            aria-label={`${p.name} — view details`}
          >
            <span className="world-glow" aria-hidden />
            <img src={p.image} alt="" loading="lazy" className="absolute left-1/2 top-[8%] h-[66%] w-auto -translate-x-1/2 transition-transform duration-700 group-hover:-translate-y-3 group-hover:rotate-[-4deg] group-hover:scale-110 group-focus-visible:scale-105" />
            <div className="relative">
              <p className="text-eyebrow text-muted-foreground">{p.formatLabel}</p>
              <p className="mt-1 font-display text-4xl uppercase">{p.name}</p>
              <p className="mt-2 text-eyebrow text-primary opacity-0 transition-opacity group-hover:opacity-100">View →</p>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={open.name} className="fixed inset-0 z-[80] grid animate-in fade-in bg-background/95 backdrop-blur md:grid-cols-2" style={accent(open)} onClick={() => setOpen(null)}>
          <div className="relative flex items-center justify-center overflow-hidden">
            <span className="world-glow opacity-100" aria-hidden />
            <img src={open.image} alt={open.name} className="relative h-[70vh] w-auto animate-in zoom-in-50 slide-in-from-bottom-10 duration-700" />
          </div>
          <div className="flex flex-col justify-center gap-6 p-8 animate-in slide-in-from-right-10 duration-700 md:p-16" onClick={(e) => e.stopPropagation()}>
            <p className="text-eyebrow text-muted-foreground">{open.line} · {open.formatLabel}</p>
            <h3 className="text-display-lg">{open.name}</h3>
            <ul className="flex flex-wrap gap-2">
              {open.packClaims.map((c) => <li key={c} className="border border-border px-3 py-1.5 text-eyebrow">{c}</li>)}
            </ul>
            <p className="text-sm text-muted-foreground">
              {open.description ?? "[Placeholder] Approved product description and fragrance notes to be supplied."}
            </p>
            <div className="flex gap-3">
              <a href={open.url} target="_blank" rel="noreferrer" className="btn-primary">Buy now →</a>
              <button onClick={() => setOpen(null)} className="btn-ghost">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
    </div>
  );
}

/* B — WHAT'S INSIDE */
export function WhatsInside() {
  const cards = [
    { p: products[0]!, img: indigoWorld },
    { p: products[1]!, img: marshWorld },
    { p: products[2]!, img: freshWorld },
  ];
  return (
    <section id="inside" className="scroll-mt-20 px-6 py-16 md:px-12 md:py-20">
      <p data-reveal className="text-eyebrow text-primary">02 — What's inside the effect</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map(({ p, img }, i) => (
          <article key={p.id} data-reveal className={`group relative overflow-hidden ${i === 0 ? "h-[70vh] md:col-span-2 md:row-span-2" : "h-[34vh]"}`}>
            <img src={img} alt="" loading="lazy" data-parallax="8" className="absolute inset-0 h-[120%] w-full -translate-y-[10%] object-cover transition-[filter] duration-700 group-hover:brightness-125" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <img src={p.image} alt={p.name} loading="lazy" className="absolute bottom-0 right-6 h-[70%] w-auto translate-y-6 transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[-5deg]" />
            <div className="absolute bottom-6 left-6 max-w-[55%]">
              <h3 className={`font-display uppercase leading-[0.85] transition-transform duration-700 group-hover:-translate-y-2 ${i === 0 ? "text-7xl md:text-9xl" : "text-5xl"}`}>{p.name}</h3>
              <p className="mt-3 text-eyebrow text-muted-foreground">{p.line}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">[Fragrance notes — awaiting approved copy]</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* C — PERFORMANCE (pinned moment) */
export function Performance() {
  const ref = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const bigRef = useRef<HTMLParagraphElement>(null);
  const canRef = useRef<HTMLImageElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const freshRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!motionOK()) { numRef.current!.textContent = "72"; return; }
    gsap.registerPlugin(ScrollTrigger);
    numRef.current!.textContent = "0";
    ref.current!.style.minHeight = "100vh";
    const counter = { v: 0 };
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: "top top", end: "+=140%", pin: true, scrub: 0.8 },
    });
    tl.fromTo(counter, { v: 0 }, { v: 72, ease: "power2.out", duration: 1, onUpdate: () => { numRef.current!.textContent = String(Math.round(counter.v)); } }, 0)
      .fromTo(bigRef.current, { scale: 0.6, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1 }, 0)
      .fromTo(canRef.current, { xPercent: -260, rotate: -24, opacity: 0 }, { xPercent: 160, rotate: 18, opacity: 1, duration: 1.6, ease: "power1.inOut" }, 0.1)
      .fromTo(freshRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.6)
      .fromTo(leftRef.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.9)
      .fromTo(rightRef.current, { x: 200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 1);
    return () => { tl.scrollTrigger?.kill(true); tl.kill(); };
  }, []);

  return (
    <div>
    <section ref={ref} className="relative flex items-center overflow-hidden py-16 md:py-20">
      <img src={macro} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <img ref={canRef} src={products[0]!.image} alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden h-[70vh] w-auto -translate-y-1/2 drop-shadow-2xl md:block" />
      <div className="relative w-full px-6 md:px-12">
        <p className="text-eyebrow text-primary">03 — Performance</p>
        <p ref={bigRef} className="mt-6 origin-left font-display text-[32vw] leading-[0.9] md:text-[20vw]">
          <span ref={numRef} className="tabular-nums" data-n="72" />H
        </p>
        <p ref={freshRef} className="font-display text-6xl uppercase md:text-8xl">Fresh.</p>
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4 font-display text-3xl uppercase text-muted-foreground md:text-5xl">
          <div ref={leftRef}>0% Aluminium salts</div>
          <div ref={rightRef}>Essential oils</div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground/70">As printed on Indigo Haze and Marshmallow Smoke body spray packs.</p>
      </div>
    </section>
    </div>
  );
}

/* D + E — FORMAT + GRID */
export function FormatsAndGrid() {
  const [fmt, setFmt] = useState<Format | "all">("all");
  const list = fmt === "all" ? products : products.filter((p) => p.format === fmt);
  return (
    <section id="formats" className="scroll-mt-20 px-6 py-16 md:px-12 md:py-20">
      <p data-reveal className="text-eyebrow text-primary">04 — Choose your format</p>
      <div data-reveal className="mt-8 flex flex-wrap gap-x-10 gap-y-2" role="tablist" aria-label="Product format">
        {[{ id: "all" as const, label: "All" }, ...FORMATS].map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={fmt === f.id}
            onClick={() => setFmt(f.id)}
            className={`relative font-display text-5xl uppercase transition-colors md:text-7xl ${fmt === f.id ? "text-foreground" : "text-muted-foreground/30 hover:text-muted-foreground"}`}
          >
            {f.label}
            <span className={`absolute -bottom-1 left-0 h-1 bg-primary transition-all duration-500 ${fmt === f.id ? "w-full" : "w-0"}`} />
          </button>
        ))}
      </div>

      <div id="products" className="mt-16 grid scroll-mt-24 border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <article key={`${fmt}-${p.id}`} style={{ ...accent(p), animationDelay: `${i * 80}ms` }} data-tilt className="world-card group relative flex border-b border-r border-border animate-in fade-in slide-in-from-bottom-6 flex-col bg-background p-8 duration-700 fill-mode-both">
            <span className="world-glow" aria-hidden />
            <div className="relative flex h-80 items-center justify-center">
              <img src={p.image} alt={p.name} loading="lazy" className="h-full w-auto transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:rotate-[-3deg]" />
            </div>
            <div className="relative mt-8 flex-1">
              <p className="text-eyebrow text-muted-foreground">{p.formatLabel}</p>
              <h3 className="mt-1 font-display text-3xl uppercase">{p.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.packClaims.join(" · ")}</p>
              <p className="mt-1 text-xs text-muted-foreground/60">{p.size ?? "[Size — to be confirmed]"}</p>
            </div>
            <a href={p.url} target="_blank" rel="noreferrer" className="btn-primary relative mt-6 self-start">Buy now →</a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* F — CULTURE */
export function Culture() {
  const tiles = [
    { t: "Music", img: night, c: "md:col-span-2 md:row-span-2" },
    { t: "Fashion", img: ready, c: "" },
    { t: "Sport", img: spray, c: "" },
    { t: "Gaming", img: city, c: "md:col-span-2" },
  ];
  return (
    <section id="culture" className="scroll-mt-20 overflow-hidden px-6 py-16 md:px-12 md:py-20">
      <p data-reveal className="text-eyebrow text-primary">05 — AXE culture</p>
      <h2 data-reveal className="mt-3 text-display-lg">After dark.</h2>
      <div className="mt-12 grid auto-rows-[30vh] gap-4 md:grid-cols-4">
        {tiles.map((x) => (
          <a key={x.t} href="#culture" data-reveal className={`group relative overflow-hidden ${x.c}`}>
            <img src={x.img} alt="" loading="lazy" data-parallax="10" className="absolute inset-0 h-[125%] w-full -translate-y-[10%] object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <span className="absolute bottom-5 left-5 font-display text-5xl uppercase transition-transform duration-500 group-hover:translate-x-2">{x.t} <span className="inline-block opacity-0 transition-opacity group-hover:opacity-100">→</span></span>
            <span className="absolute right-5 top-5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">[Story placeholder]</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* G — FOOTER */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border px-6 pt-16 md:px-12">
      <div className="flex flex-col justify-between gap-10 md:flex-row">
        <p className="text-sm text-muted-foreground">One spray. Your move.</p>
        <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm text-muted-foreground md:grid-cols-3">
          <a href="#range" className="link-u">Range</a>
          <a href="#products" className="link-u">Shop</a>
          <a href="#culture" className="link-u">Culture</a>
          <a href="https://www.axe.com/in/en/products.html" className="link-u">axe.com/in</a>
          <a href="#top" className="link-u">Privacy</a>
          <a href="#top" className="link-u">Contact</a>
        </div>
      </div>
      <p className="mt-12 text-xs text-muted-foreground/60">© AXE India. Concept redesign — not an official site.</p>
      <p data-reveal aria-hidden className="mt-6 font-display text-[38vw] leading-[0.75] text-foreground/[0.06]">AXE</p>
    </footer>
  );
}
