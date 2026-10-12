import stage from "@/assets/frames/00-stage.jpg";
import w1 from "@/assets/frames/w1-indigo.jpg";
import w2 from "@/assets/frames/w2-marshmallow.jpg";
import w3 from "@/assets/frames/w3-aqua.jpg";
import w4 from "@/assets/frames/w4-vanilla.jpg";

/**
 * Single source of truth for the scroll film. Canvas and DOM overlays both read this.
 *
 * RULE: the can never cuts — the world changes around it.
 *  - SEGMENTS = backgrounds + copy (the world)
 *  - CAN_KEYS = one continuous path for the hero can across the whole film (global progress)
 *  - SPRAYS   = moments the can fires; mist originates at the can's nozzle and hides world changes
 * STAND-IN FRAMES: replace `image` with final Runway keyframes.
 */
export const CHAPTERS = [
  { id: "object", label: "Object", start: 0, end: 0.22 },
  { id: "indigo", label: "Indigo", start: 0.22, end: 0.4 },
  { id: "marshmallow", label: "Marshmallow", start: 0.4, end: 0.58 },
  { id: "aqua", label: "Aqua", start: 0.58, end: 0.76 },
  { id: "vanilla", label: "Vanilla", start: 0.76, end: 0.9 },
  { id: "your-axe", label: "Your AXE", start: 0.9, end: 1 },
] as const;

/**
 * place: where the line sits relative to the can so it never gets covered.
 * left/right = flank the can (stack above/below on mobile), behind = giant faint word under the can.
 */
export type Place = "left" | "right" | "above" | "below" | "behind" | "top" | "subtop";
export type CopyLine = { text: string; at: [number, number]; size?: "xl" | "lg" | "md" | "sm"; place: Place; accent?: boolean };

export interface Segment {
  id: string;
  start: number;
  end: number;
  image: string;
  zoom: number;
  /** vertical pan of the background in % of viewport over the segment (camera tilt) */
  pan?: number;
  dim?: number;
  lineup?: boolean;
  /** mist + particle colour of this world (r,g,b) */
  tint: [number, number, number];
  copy: CopyLine[];
  packFrame: string;
}

const WARM: [number, number, number] = [255, 228, 190];
export const SEGMENTS: Segment[] = [
  { id: "silhouette", start: 0, end: 0.05, image: stage, zoom: 0, tint: WARM, packFrame: "01a", copy: [] },
  { id: "reveal", start: 0.05, end: 0.1, image: stage, zoom: 0, tint: WARM, packFrame: "01b",
    copy: [{ text: "SMELL READY.", at: [0.3, 1], size: "md", place: "left" }] },
  { id: "push", start: 0.1, end: 0.16, image: stage, zoom: 0.6, dim: 0.4, tint: WARM, packFrame: "02", copy: [] },
  // INTO THE MIST — camera passes through the spray
  { id: "mist1", start: 0.16, end: 0.22, image: stage, zoom: 0.9, dim: 0.75, tint: [210, 210, 225], packFrame: "03", copy: [] },
  { id: "indigo", start: 0.22, end: 0.4, image: w1, zoom: 0.12, tint: [120, 130, 255], packFrame: "06",
    copy: [
      { text: "INDIGO", at: [0.15, 0.85], size: "lg", place: "left" },
      { text: "HAZE", at: [0.22, 0.85], size: "lg", place: "right" },
    ] },
  { id: "marshmallow", start: 0.4, end: 0.58, image: w2, zoom: 0.12, tint: [255, 200, 185], packFrame: "07",
    copy: [
      { text: "MARSHMALLOW", at: [0.18, 0.85], size: "md", place: "above" },
      { text: "SMOKE", at: [0.25, 0.85], size: "md", place: "below" },
    ] },
  { id: "aqua", start: 0.58, end: 0.76, image: w3, zoom: 0.1, tint: [140, 230, 240], packFrame: "09",
    copy: [
      { text: "AQUA BERGAMOT", at: [0.12, 0.88], size: "md", place: "above" },
      { text: "FINE FRAGRANCE BODY WASH", at: [0.3, 0.88], size: "sm", place: "below" },
    ] },
  { id: "vanilla", start: 0.76, end: 0.9, image: w4, zoom: 0.12, tint: [255, 170, 90], packFrame: "11",
    copy: [
      { text: "BLACK VANILLA", at: [0.12, 0.88], size: "md", place: "above" },
      { text: "YOU'RE READY.", at: [0.25, 0.88], size: "md", place: "below" },
    ] },
  // OUT OF THE MIST — back to the stage for the lineup
  { id: "lineup", start: 0.9, end: 1, image: stage, zoom: 0, lineup: true, tint: WARM, packFrame: "14-15",
    copy: [
      { text: "FIND YOUR AXE.", at: [0.3, 1], size: "lg", place: "top" },
      { text: "ONE SPRAY. YOUR MOVE.", at: [0.5, 1], size: "sm", place: "subtop" },
    ] },
];

/** Hero can path. y in vh from centre, scale of the 62vh can, rotY degrees, ground 0..1 = shadow/reflection. */
export interface CanKey { at: number; product: string; op: number; y: number; s: number; rotY: number; light: number; ground: number }
const IH = "indigo-haze", MS = "marshmallow-smoke", AB = "aqua-bergamot", BV = "black-vanilla";
const k = (at: number, product: string, op: number, y: number, s: number, rotY: number, light: number, ground: number): CanKey =>
  ({ at, product, op, y, s, rotY, light, ground });

export const CAN_KEYS: CanKey[] = [
  k(0, IH, 1, 6, 1, 0, 0.06, 1),
  k(0.04, IH, 1, 6, 1, 0, 0.06, 1),
  k(0.065, IH, 1, 6, 1, 0, 0.5, 1),
  k(0.1, IH, 1, 6, 1, 0, 1, 1),
  k(0.155, IH, 1, 78, 2.7, 0, 0.9, 0),
  k(0.185, IH, 1, 78, 2.7, 0, 0.9, 0),
  k(0.225, IH, 1, 0, 0.9, 0, 0.85, 0),
  k(0.38, IH, 1, 0, 1, 0, 1, 0),
  k(0.4, MS, 1, 0, 1, 0, 1, 0),
  k(0.425, MS, 1, 0, 1, 0, 1, 0),
  k(0.56, MS, 1, 0, 1, 0, 1, 0),
  k(0.58, AB, 1, 0, 0.92, 0, 1, 0),
  k(0.74, AB, 1, 0, 0.92, 0, 1, 0),
  k(0.76, BV, 1, 0, 0.92, 0, 1, 0),
  k(0.88, BV, 1, 0, 0.92, 0, 1, 0),
  k(0.9, IH, 1, 4, 0.9, 0, 1, 0.5),
  k(0.93, IH, 1, 6, 0.85, 0, 1, 1),
  k(0.97, IH, 1, 12, 0.56, 0, 1, 1),
  k(1, IH, 1, 12, 0.56, 0, 1, 1),
];

export function canAt(p: number) {
  const i = CAN_KEYS.findIndex((c) => c.at > p);
  const first = CAN_KEYS[0];
  if (!first) throw new Error("Missing hero product path");
  if (i === -1) return CAN_KEYS[CAN_KEYS.length - 1] ?? first;
  if (i === 0) return first;
  const a = CAN_KEYS[i - 1] ?? first, b = CAN_KEYS[i] ?? a;
  const raw = (p - a.at) / (b.at - a.at);
  const t = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
  const l = (x: number, y: number) => x + (y - x) * t;
  return { at: p, product: a.product, op: l(a.op, b.op), y: l(a.y, b.y), s: l(a.s, b.s), rotY: 0, light: l(a.light, b.light), ground: l(a.ground, b.ground) };
}

/** Intact, front-facing packshots dissolve inside the mist, never flip or morph. */
export function productAt(p: number) {
  let current = CAN_KEYS[0]?.product ?? IH;
  for (const key of CAN_KEYS) {
    if (key.product === current) continue;
    const start = key.at - 0.009, end = key.at + 0.009;
    if (p < start) break;
    if (p < end) return { from: current, to: key.product, mix: (p - start) / (end - start) };
    current = key.product;
  }
  return { from: current, to: current, mix: 0 };
}

/** Moments the can fires. The mist peaks mid-window, covering the world change. */
export const SPRAYS: [number, number][] = [
  [0.165, 0.235],
  [0.375, 0.425],
  [0.555, 0.605],
  [0.735, 0.785],
  [0.875, 0.925],
];

/** world colour at progress p — blends into the next world over the last 20% */
export function tintAt(p: number): [number, number, number] {
  const i = SEGMENTS.findIndex((s) => p >= s.start && p < s.end);
  const seg = SEGMENTS[i === -1 ? SEGMENTS.length - 1 : i]!;
  const next = SEGMENTS[i + 1];
  const t = (p - seg.start) / (seg.end - seg.start);
  if (!next || t < 0.8) return seg.tint;
  const m = (t - 0.8) / 0.2;
  return seg.tint.map((c, j) => c + (next.tint[j]! - c) * m) as [number, number, number];
}

export const ALL_IMAGES = Array.from(new Set(SEGMENTS.map((s) => s.image)));

/**
 * Optional true frame sequence (e.g. /axe/frames/desktop/frame-0001.avif).
 * When `count` > 0 the engine scrubs frames instead of blending keyframes.
 */
export const FRAME_MANIFEST = {
  desktop: { count: 0, path: (i: number) => `/axe/frames/desktop/frame-${String(i + 1).padStart(4, "0")}.avif` },
  mobile: { count: 0, path: (i: number) => `/axe/frames/mobile/frame-${String(i + 1).padStart(4, "0")}.avif` },
};

export const segmentAt = (p: number) =>
  SEGMENTS.find((s) => p >= s.start && p < s.end) ?? SEGMENTS[SEGMENTS.length - 1]!;

export const chapterAt = (p: number) =>
  CHAPTERS.findIndex((c) => p >= c.start && p < c.end) === -1
    ? CHAPTERS.length - 1
    : CHAPTERS.findIndex((c) => p >= c.start && p < c.end);
