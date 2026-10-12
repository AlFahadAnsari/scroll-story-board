# Tighter storyboard: one can, one continuous shot

## What's wrong now
The can pops in and out between scenes. It jumps size and position, floats over the apartment dresser, and vanishes in the spray scene (which shows a different, generic can). It then switches to Marshmallow Smoke with no reason and reappears tiny in the freeze scene. Every scene is framed on its own, so nothing connects.

## The fix: one rule
**The can never cuts. The world changes around it.**
The Indigo Haze can stays locked in the centre of the screen for the whole film. Each spray is what changes the world behind it, which is the brief's core idea ("one spray changes everything around you"). When the can does move, it is always for a visible reason: the camera pushes in, it turns, or the camera pulls back.

## New storyboard

```text
01 OBJECT
  1  Silhouette    dark outline, rim light               "AXE"
  2  Reveal        same spot, can lights up              "SMELL READY."
  3  Push-in       camera glides up the can to the nozzle (no cut)
  4  Spray #1      nozzle fires at camera, mist fills the screen
02 READY
  5  Apartment     mist clears; can now STANDING on the dresser
                   (shadow + reflection), camera slowly orbits
                   SHOWERED. / DRESSED. / READY? ... NOT YET.
  6  Spray #2      can fires again; room fractures and is pulled
                   into the mist, can stays put
03 EFFECT
  7  Indigo world  fragments become indigo silk + embers   INDIGO | HAZE
  8  The turn      can spins on its axis; it comes round as
                   Marshmallow Smoke while the world turns to smoke
                                                          MARSHMALLOW | SMOKE
  9  72H           world freezes into cold crystal; can hangs still
                   giant faint 72H behind it, FRESH. beside it
04 NIGHT
 10  Spray #3      can fires; mist clears into the city at night.
                   Camera tilts up from the can to the street, so it
                   drops out of the bottom of the frame
 11  The night     friends at the restaurant              YOU'RE READY.
 12  Freeze        everything stops and drains of colour; camera
                   pushes through to the can standing alone in the centre
05 YOUR AXE
 13  Rewind        worlds flick backwards behind the locked can
 14  Lineup        back on the rocky set; the hero can stays centre
                   and the other four slide in beside it
                                    FIND YOUR AXE. / ONE SPRAY. YOUR MOVE.
```

## Specific changes
- **Spray scenes:** remove the generic-can spray photo. The mist now comes out of our can's actual nozzle position on screen, so every spray visibly comes from the hero can.
- **Grounding:** a soft shadow and floor reflection under the can whenever it stands on something (rocks, dresser, lineup), so it never floats.
- **Product switch:** Indigo Haze changes to Marshmallow Smoke only through a spin, and swaps back to Indigo Haze through the same spin during the rewind.
- **Transitions:** scenes are timed to overlap. The next world fades in through the mist while the can holds still, with no black gaps or hard cuts.
- **Freeze:** the can is already in position before the freeze, rather than appearing tiny out of nowhere.
- **Lineup:** the four other products slide in from the sides next to the hero can, instead of all five appearing at once.

## Technical details
- `timeline.ts`: replace per-segment `canFrom`/`canTo` with continuous can keyframes across the whole film (`{ at, x, y, scale, rotY, light, ground, product }`), interpolated by global progress. This means the can's position never resets at a segment boundary. Segments keep only the background, the copy and the effects.
- Spray origin is computed from the can keyframe (nozzle = can top), and `spray1` drops the `03-spray.jpg` background in favour of the darkened previous world plus particles.
- Spin swap: `rotY` goes 0 to 90 degrees (swap the image source at 90) then 90 to 0. The same keyframe in the rewind swaps back.
- Ground shadow: a blurred ellipse plus a flipped, faded copy of the can, with opacity driven by the `ground` value.
- City exit: the can's `y` animates off the bottom while the background pans up, then the can returns at centre for the freeze.
- Lineup: the side products get x offsets from outside the screen to their slots. The hero image doubles as the centre slot.
