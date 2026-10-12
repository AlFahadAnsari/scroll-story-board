# Fix headline overlap + bring the site to life

## 1. Headlines never covered by the can
- Product scenes (Indigo Haze, Marshmallow Smoke): split the name around the can. "INDIGO" goes on the left and "HAZE" on the right, both vertically centred and kept clear of the can's width. On mobile, the words stack above and below the can.
- Other scenes: "SMELL READY." stays below the can, and the apartment lines sit in the left third. "72H" stays as a giant faint word behind the can, with "FRESH." moved to the right of it. "YOU'RE READY." and "FIND YOUR AXE." keep their current spots (no can in the way).
- Each line gets a placement setting (left / right / above / below / behind) in the film timeline, so it's easy to adjust later.

## 2. More life in the film
- **Can rotates and tilts:** the can sways a few degrees and leans with scroll. A moving light sweep (sheen) crosses its surface. It also bobs slightly when idle.
- **Words slide in:** headlines reveal letter by letter with an upward mask slide, and slide out in reverse when you scroll back.
- **Floating particles:** a light layer of mist drifts across every scene. It moves faster and stretches when you scroll faster, then settles. There are fewer particles on mobile.
- **Depth layers:** the background, mist, can and text move at different speeds, and slightly follow the mouse on desktop for a 3D feel.

## 3. Sections below (a mix of subtle and bold)
**Subtle everywhere**
- Headings and cards slide up and unmask as they come into view.
- Photos drift slowly (parallax) and product cards tilt toward the mouse.
- Buttons have a small magnetic pull, and the light shifts under the cursor.

**Two big moments**
- **The range:** this section stays put while scrolling moves the five products sideways past you. The background colour shifts to each product's accent as it reaches the centre.
- **Performance:** a giant "72H" counts up and scales while the can sweeps across it. "FRESH." and the pack claims slide in from the sides.

## 4. Comfort and speed
- All new motion switches off for visitors who prefer reduced motion.
- Mobile gets lighter versions: no tilt-to-mouse, fewer particles, and a swipeable range instead of the pinned one.

## Technical details
- In `timeline.ts`, add `place` and `split` fields to each copy line. Overlays render from them.
- `CinematicFilm`: add a second canvas for ambient particles driven by scroll velocity (from the ScrollTrigger `getVelocity`). Add a per-segment `rotate`/`tilt` and CSS sheen gradient on the can. Add pointer parallax via CSS variables updated in the existing rAF loop, with no React state per frame. Split the text into per-letter spans with clip-path reveals keyed to the segment's progress.
- New `src/lib/motion.ts` hooks: `useReveal` (GSAP ScrollTrigger batch), `useParallax`, `useTilt`, `useMagnetic`.
- FindYourAxe: a GSAP pinned horizontal scroll on desktop (≥768px) that keeps its accent background in sync. Mobile keeps snap scrolling.
- Performance: a pinned ScrollTrigger timeline for the counter, the can sweep and the claims.
