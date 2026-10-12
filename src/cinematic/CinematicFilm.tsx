import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ALL_IMAGES,
  CHAPTERS,
  SEGMENTS,
  SPRAYS,
  canAt,
  productAt,
  tintAt,
  chapterAt,
  segmentAt,
  type Place,
  type Segment,
} from "./timeline";
import { getProduct, products } from "@/data/products";
import { playSound } from "./sound";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, scale = 1, dx = 0, dy = 0) {
  if (!img.complete || !img.naturalWidth) return;
  const r = Math.max(w / img.naturalWidth, h / img.naturalHeight) * scale;
  const iw = img.naturalWidth * r;
  const ih = img.naturalHeight * r;
  ctx.drawImage(img, (w - iw) / 2 + dx, (h - ih) / 2 + dy, iw, ih);
}

function drawSpray(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, origin: [number, number], tint: [number, number, number]) {
  const [tr, tg, tb] = tint.map(Math.round) as [number, number, number];
  const n = w < 700 ? 110 : 240;
  const [ox, oy] = origin;
  const maxR = Math.hypot(w, h);
  const fog = Math.sin(Math.PI * t);
  ctx.save();
  ctx.fillStyle = `rgb(${tr},${tg},${tb})`;
  for (let i = 0; i < n; i++) {
    const a = (rand(i) - 0.5) * 1.3;
    const sp = 0.2 + rand(i + 99) * 0.9;
    const d = ease(clamp(t * 1.4 - rand(i + 7) * 0.3)) * sp * maxR;
    const x = ox + Math.cos(a) * d;
    const y = oy + Math.sin(a) * d * 0.8;
    const s = 1.2 + rand(i + 3) * 4 * (1 + t * 2);
    ctx.globalAlpha = clamp(fog * (0.25 + rand(i + 5) * 0.6));
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
  const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, maxR * 0.8);
  g.addColorStop(0, `rgba(${Math.min(255, tr + 30)},${Math.min(255, tg + 30)},${Math.min(255, tb + 30)},${0.6 * fog})`);
  g.addColorStop(1, `rgba(${tr >> 3},${tg >> 3},${tb >> 3},${0.3 * fog})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

const SIZE = { xl: "text-display-xl", lg: "text-display-lg", md: "text-display-md", sm: "text-eyebrow" } as const;

/** Positions keep copy clear of the centred can. Mobile: flanks stack above/below. */
const PLACE: Record<Place, string> = {
  left: "top-[14vh] inset-x-0 text-center md:inset-x-auto md:top-1/2 md:-translate-y-1/2 md:right-[calc(50%+min(13vh,16vw))] md:text-right",
  right: "bottom-[12vh] inset-x-0 text-center md:inset-x-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-[calc(50%+min(13vh,16vw))] md:text-left",
  above: "top-[12vh] inset-x-0 text-center",
  below: "bottom-[9vh] inset-x-0 text-center",
  top: "top-[12vh] inset-x-0 text-center",
  subtop: "top-[30vh] inset-x-0 text-center",
  behind: "inset-x-0 top-1/2 -translate-y-1/2 text-center text-[34vw] leading-none text-foreground/10",
};

function Letters({ text }: { text: string }) {
  const chars = Array.from(text);
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} className="film-letter inline-block" style={{ "--i": i, "--n": chars.length } as CSSProperties}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </>
  );
}

export function CinematicFilm({ onChapter }: { onChapter?: (i: number) => void }) {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mistRef = useRef<HTMLCanvasElement>(null);
  const canWrapRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLImageElement>(null);
  const incomingRef = useRef<HTMLImageElement>(null);
  const reflRef = useRef<HTMLImageElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const lineupRef = useRef<HTMLDivElement>(null);
  
  const copyRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [chapter, setChapter] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    const mist = mistRef.current;
    const stage = stageRef.current;
    const can = canRef.current;
    const incoming = incomingRef.current;
    const reflection = reflRef.current;
    const ground = groundRef.current;
    const lineup = lineupRef.current;
    const canWrap = canWrapRef.current;
    if (!canvas || !mist || !stage || !can || !incoming || !reflection || !ground || !lineup || !canWrap) return;
    const ctx = canvas.getContext("2d");
    const mctx = mist.getContext("2d");
    if (!ctx || !mctx) return;
    const imgs = new Map<string, HTMLImageElement>();
    ALL_IMAGES.forEach((src) => {
      const im = new Image();
      im.decoding = "async";
      im.src = src;
      im.onload = () => render();
      imgs.set(src, im);
    });
    const productImgs = new Map(products.map((p) => [p.id, p.image]));
    products.forEach((product) => { const image = new Image(); image.src = product.image; });
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let lastSpray = -1;
    let w = 0, h = 0, progress = 0, raf = 0, loop = 0, lastChapter = -1, active = true;
    let velocity = 0, smoothV = 0, mx = 0, my = 0, tmx = 0, tmy = 0;
    // can state computed by render(), applied each frame by the ambient loop (adds idle bob, pointer, lean)
    let canState = canAt(0);
    let tint = tintAt(0);
    let lastMx = "", lastMy = "";

    // ambient mist particles
    const MIST_N = window.innerWidth < 768 ? 30 : 70;
    const mistP = Array.from({ length: MIST_N }, (_, i) => ({
      x: rand(i) , y: rand(i + 50), z: 0.3 + rand(i + 9) * 0.7, r: 0.5 + rand(i + 21) * 1.8, ph: rand(i + 33) * 6.28,
    }));

    const resize = () => {
      const dpr = 1; // backdrops are soft photos — full DPR only costs fill-rate
      w = window.innerWidth;
      h = window.innerHeight;
      for (const c of [canvas, mist]) {
        c.width = w * dpr; c.height = h * dpr;
        c.style.width = w + "px"; c.style.height = h + "px";
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const drawSegment = (seg: Segment, t: number, alpha = 1) => {
      ctx.globalAlpha = alpha;
      const im = imgs.get(seg.image);
      if (im) {
        const z = 1.04 + seg.zoom * ease(t);
        drawCover(ctx, im, w, h, z + (seg.pan ? 0.2 : 0), 0, (seg.pan ?? 0) * (t - 0.5) * h * 0.02);
        if (seg.dim) { ctx.fillStyle = `rgba(0,0,0,${seg.dim * t})`; ctx.fillRect(0, 0, w, h); }
      }
      ctx.globalAlpha = 1;
    };

    const render = () => {
      if (!w) return;
      const p = progress;
      const seg = segmentAt(p);
      const i = SEGMENTS.indexOf(seg);
      const t = clamp((p - seg.start) / (seg.end - seg.start));
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);
      drawSegment(seg, t);
      const next = SEGMENTS[i + 1];
      if (next && t > 0.8) drawSegment(next, 0, (t - 0.8) / 0.2);
      if (seg.id === "silhouette") {
        ctx.fillStyle = `rgba(0,0,0,${0.75 * (1 - ease(t))})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Shared front-facing geometry; only opacity changes inside the mist.
      canState = canAt(p);
      const identity = productAt(p);
      for (const [image, id, opacity] of [[can, identity.from, 1 - identity.mix], [incoming, identity.to, identity.mix]] as const) {
        const src = productImgs.get(id);
        if (!src) continue;
        if (image.dataset["src"] !== src) {
          image.src = src; image.dataset["src"] = src; image.alt = getProduct(id).name;
        }
        image.style.opacity = String(opacity);
        image.dataset["product"] = id;
      }
      const reflectionSrc = productImgs.get(identity.mix >= 0.5 ? identity.to : identity.from);
      if (reflectionSrc && reflection.dataset["src"] !== reflectionSrc) {
        reflection.src = reflectionSrc; reflection.dataset["src"] = reflectionSrc;
      }
      const lt = canState.light.toFixed(2);
      if (canWrap.dataset["light"] !== lt) { canWrap.dataset["light"] = lt; canWrap.style.filter = `brightness(${lt})`; }
      ground.style.opacity = String(canState.ground);

      // lineup
      const lu = lineup;
      if (seg.lineup) {
        lu.style.opacity = "1";
        Array.from(lu.children).forEach((el, k) => {
          const slot = (el as HTMLElement).dataset["slot"];
          const n = Number(slot);
          const o = ease(clamp(t * 2.2 - (Math.abs(n) - 1) * 0.3));
          (el as HTMLElement).style.opacity = String(o);
          const gap = w < 768 ? 19 : 15;
          (el as HTMLElement).style.transform = `translateX(calc(-50% + ${n * gap + Math.sign(n) * (1 - o) * 40}vw))`;
          void k;
        });
      } else lu.style.opacity = "0";

      // copy: --r drives the per-letter mask reveal (scrubbed both ways)
      copyRefs.current.forEach((el, key) => {
        const [sid, idx] = key.split(":");
        if (sid !== seg.id) { el.style.opacity = "0"; el.style.setProperty("--r", "0"); return; }
        const line = seg.copy[Number(idx)];
        if (!line) return;
        const [a, b] = line.at;
        const rin = clamp((t - a) / 0.12);
        const rout = b >= 1 ? clamp((1 - t) / 0.12) : clamp((b - t) / 0.08);
        el.style.opacity = "1";
        el.style.setProperty("--r", String(Math.min(rin, rout)));
      });

      const sprayIdx = SPRAYS.findIndex(([a, b]) => p >= a && p < b);
      if (sprayIdx !== lastSpray) { if (sprayIdx >= 0) playSound("spray"); lastSpray = sprayIdx; }
      
      const c = chapterAt(p);
      if (c !== lastChapter) { lastChapter = c; setChapter(c); onChapter?.(c); }
    };

    // ambient loop: mist, idle bob, pointer depth, velocity lean
    const tick = (now: number) => {
      loop = requestAnimationFrame(tick);
      if (!active) return;
      smoothV += (velocity - smoothV) * 0.08;
      velocity *= 0.9;
      mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
      const sv = clamp(Math.abs(smoothV) / 3000, 0, 1);
      const dir = Math.sign(smoothV) || 1;

      // depth layers
      const mxs = mx.toFixed(3), mys = my.toFixed(3);
      if (mxs !== lastMx || mys !== lastMy) {
        lastMx = mxs; lastMy = mys;
        stage.style.setProperty("--mx", mxs);
        stage.style.setProperty("--my", mys);
      }
      canvas.style.transform = `translate3d(${mx * -12}px, ${my * -8}px, 0) scale(1.04)`;

      // Only translation and uniform scaling: no perspective, flip, or lean.
      const bob = Math.sin(now / 900) * 0.5 * (1 - canState.ground);
      canWrap.style.opacity = String(canState.op);
      canWrap.style.transform = `translate(-50%, calc(-50% + ${canState.y + bob}vh)) scale(${canState.s * (w < 768 ? 0.82 : 1)})`;

      // mist
      mctx.clearRect(0, 0, w, h);
      tint = tintAt(progress);
      mctx.fillStyle = `rgb(${tint.map(Math.round).join(",")})`;
      for (const pt of mistP) {
        pt.y -= (0.00008 + sv * 0.004 * dir) * pt.z * 16;
        pt.x += Math.sin(now / 3000 + pt.ph) * 0.00012;
        if (pt.y < -0.05) pt.y = 1.05;
        if (pt.y > 1.05) pt.y = -0.05;
        const x = pt.x * w + mx * 30 * pt.z;
        const y = pt.y * h + my * 20 * pt.z;
        const stretch = 1 + sv * 14 * pt.z;
        mctx.globalAlpha = (0.15 + pt.z * 0.35) * (0.7 + 0.3 * Math.sin(now / 1200 + pt.ph));
        const rr = pt.r * pt.z * 2;
        mctx.fillRect(x - rr / 2, y - (rr * stretch) / 2, rr, rr * stretch);
      }
      // sprays fire from the hero can's nozzle and cover the world change
      const sp = SPRAYS.find(([a, b]) => progress >= a && progress < b);
      if (sp) {
        const st = (progress - sp[0]) / (sp[1] - sp[0]);
        const nozzleY = h / 2 + ((canState.y - 31 * canState.s * (w < 768 ? 0.82 : 1)) / 100) * h;
        mctx.globalAlpha = 1;
        drawSpray(mctx, w, h, st, [w / 2, clamp(nozzleY, h * 0.1, h * 0.9)], tint);
      }
    };

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        velocity = self.getVelocity();
        if (progress > 0.01) setHintVisible(false);
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); });
      },
      onToggle: (self) => { active = self.isActive; },
    });
    active = st.isActive || st.progress === 0;

    const onPointer = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (finePointer) window.addEventListener("pointermove", onPointer);

    resize();
    loop = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
    };
  }, [onChapter]);

  return (
    <section ref={wrapRef} aria-label="The AXE Effect — scroll film" className="relative h-[1600vh] bg-background">
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden [perspective:1200px]">
        <canvas ref={canvasRef} className="absolute inset-0 will-change-transform" aria-hidden />

        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)]" />
        {/* copy behind the can */}
        <CopyLayer refs={copyRefs} behind />

        <div ref={canWrapRef} data-film-product className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[62vh] w-[34vh] max-w-[44vw] opacity-0 will-change-transform">
          <div ref={groundRef} aria-hidden className="absolute left-1/2 top-full h-full w-full -translate-x-1/2 opacity-0">
            <span className="absolute left-1/2 top-0 h-[6%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-background/90 blur-md" />
            <img ref={reflRef} alt="" className="absolute left-0 top-0 h-full w-full object-contain -scale-y-100 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_35%)]" />
          </div>
          <img ref={canRef} alt="" className="absolute inset-0 h-full w-full object-contain" />
          <img ref={incomingRef} alt="" className="absolute inset-0 h-full w-full object-contain opacity-0" />
        </div>

        <div ref={lineupRef} className="pointer-events-none absolute inset-0 z-[9] opacity-0">
          {products.filter((x) => x.id !== "indigo-haze").map((x, k) => (
            <img key={x.id} data-slot={[-2, -1, 1, 2][k]} src={x.image} alt={x.name} className="absolute left-1/2 h-[15vh] w-auto drop-shadow-2xl md:h-[30vh]" style={{ bottom: "calc(50vh - 29.4vh)" }} />
          ))}
        </div>

        

        <canvas ref={mistRef} className="pointer-events-none absolute inset-0 z-20" aria-hidden />

        <CopyLayer refs={copyRefs} />

        <nav aria-label="Film chapters" className="absolute bottom-8 left-6 z-30 hidden gap-5 md:flex">
          {CHAPTERS.map((c, i) => (
            <span key={c.id} className={`text-eyebrow transition-colors ${i === chapter ? "text-primary" : "text-muted-foreground/60"}`}>
              0{i + 1} {c.label}
            </span>
          ))}
        </nav>
        <div className={`absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-eyebrow text-muted-foreground transition-opacity duration-700 ${hintVisible ? "opacity-100" : "opacity-0"}`}>
          Scroll
          <span className="mx-auto mt-2 block h-8 w-px animate-pulse bg-primary" />
        </div>
        <span className="absolute right-6 top-20 z-30 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
          Stand-in frames · final CGI pending
        </span>
      </div>
    </section>
  );
}

function CopyLayer({ refs, behind = false }: { refs: RefObject<Map<string, HTMLElement>>; behind?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 px-6 ${behind ? "z-0" : "z-30"}`}
      style={{ transform: `translate3d(calc(var(--mx, 0) * ${behind ? -18 : 34}px), calc(var(--my, 0) * ${behind ? -10 : 20}px), 0)` }}
    >
      {SEGMENTS.map((s) =>
        s.copy.map((line, idx) =>
          (line.place === "behind") === behind ? (
            <p
              key={`${s.id}:${idx}`}
              ref={(el) => { if (el) refs.current.set(`${s.id}:${idx}`, el); }}
              className={`film-line absolute opacity-0 ${SIZE[line.size ?? "lg"]} ${PLACE[line.place]} ${line.place === "behind" ? "" : line.accent ? "text-primary" : "text-foreground"}`}
              aria-label={line.text}
            >
              <span aria-hidden><Letters text={line.text} /></span>
            </p>
          ) : null,
        ),
      )}
    </div>
  );
}
