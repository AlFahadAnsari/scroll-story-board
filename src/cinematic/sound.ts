/** Sound hooks. Drop files into /public/axe/audio/{name}.mp3 to enable. Silent by default. */
export type SoundName = "click" | "spray" | "rewind";
let enabled = false;
const cache = new Map<SoundName, HTMLAudioElement>();

export const setSoundEnabled = (v: boolean) => { enabled = v; };
export const isSoundEnabled = () => enabled;

export function playSound(name: SoundName) {
  if (!enabled || typeof window === "undefined") return;
  let a = cache.get(name);
  if (!a) {
    a = new Audio(`/axe/audio/${name}.mp3`);
    a.volume = 0.5;
    cache.set(name, a);
  }
  a.currentTime = 0;
  a.play().catch(() => {});
}
