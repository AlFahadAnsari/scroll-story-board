# Film rework: "Inside the Mist"

The opening stays as it is: the dark outline of the can, the reveal, and the first spray. After the first spray, the camera goes into the mist and the film becomes a journey through scent worlds, each with its own colour. The can stays on screen the whole time, and every change of world is hidden by a spray.

## New storyline (after the first spray, about 16% of the scroll)

```text
16-22  INTO THE MIST   camera pushes through the spray; stage fades into soft grey fog
22-38  INDIGO WORLD    deep indigo fog, slow drifting particles; INDIGO | HAZE split around the can
38-42  SPRAY 2         the can sprays and the mist turns warm
42-56  MARSHMALLOW     soft pink-cream smoke curls; the can spins to Marshmallow Smoke while the screen is mid-mist
56-60  SPRAY 3         the smoke thins into droplets
60-74  AQUA            cool water light, ripples; the can stays lit; "72H FRESH." behind it,
                       "0% ALUMINIUM SALTS" below (only claims printed on the packs)
74-78  SPRAY 4         droplets darken
78-90  BLACK VANILLA   near-black, amber embers rising; "YOU'RE READY."
90-100 OUT OF THE MIST the mist clears back to the rocky stage; the lineup slides in; "FIND YOUR AXE."
```

Note: the can only spins between the two sprays it really is (Indigo Haze, then Marshmallow Smoke). The washes (Aqua Bergamot, Black Vanilla) appear as a small packshot that floats in their own world beside the can, so the spray can is never relabelled as a wash.

## What gets removed
- The dresser/"Showered. Dressed." scene, the fracture, the city, the night, the freeze and the rewind. Those were the jumps that felt random.

## Visual approach
- New backgrounds: four soft, nearly abstract colour worlds (indigo fog, marshmallow smoke, aqua water light, black vanilla with embers). They are generated stills with slow zoom, plus colour-matched particles drawn live.
- The floating particles and the spray mist take on each world's colour, so every change of world is one continuous colour shift.
- Wording is slower and fewer: one idea per world, with longer pauses between lines.

## Technical details
- `timeline.ts`: rewrite SEGMENTS after `mist1`, add world `tint` colours, add SPRAYS at the boundaries listed above, and rework CAN_KEYS as one continuous path (the swap happens mid-spray while the can is hidden by mist, which also fixes the moment it vanishes mid-spin). Remove the dresser/ground keys.
- `CinematicFilm.tsx`: mist and particle colour reads from the current world's tint (lerped), and a small floating packshot is added for the wash worlds. Remove the freeze and rewind effects.
- Generate four new backdrops (`src/assets/frames/w1-indigo … w4-vanilla.jpg`) and drop the unused old frames.
- Run a browser check through the whole film at desktop and mobile sizes.
