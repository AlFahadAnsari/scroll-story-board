import { describe, expect, it } from "vitest";
import { CAN_KEYS, SEGMENTS, canAt, productAt } from "../cinematic/timeline";

describe("Film product presentation", () => {
  it("matches opening geometry without opening copy", () => {
    expect(SEGMENTS[0]?.copy).toEqual([]);
    expect(SEGMENTS[0]?.image).toBe(SEGMENTS[1]?.image);
    expect(canAt(0.02).s).toBe(canAt(0.08).s);
    expect(canAt(0.02).y).toBe(canAt(0.08).y);
  });
  it("shows matching chapter products without rotation", () => {
    for (const [p, id] of [[0.3, "indigo-haze"], [0.49, "marshmallow-smoke"], [0.67, "aqua-bergamot"], [0.83, "black-vanilla"], [0.97, "indigo-haze"]] as const) {
      expect(productAt(p)).toEqual({ from: id, to: id, mix: 0 });
    }
    expect(CAN_KEYS.every((key) => key.rotY === 0)).toBe(true);
  });
  it("dissolves reversibly between intact products", () => {
    for (const p of [0.4, 0.58, 0.76, 0.9]) {
      expect(productAt(p).mix).toBeCloseTo(0.5);
      expect(productAt(p - 0.01).to).toBe(productAt(p).from);
      expect(productAt(p + 0.01).from).toBe(productAt(p).to);
    }
  });
  it("does not attach spray-only claims to Aqua wash", () => {
    expect(SEGMENTS.find((segment) => segment.id === "aqua")?.copy.map((line) => line.text)).not.toContain("72H");
  });
});