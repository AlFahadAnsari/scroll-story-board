# AXE India — "The AXE Effect" Website

A scroll-controlled AXE commercial that hands off to an elegant, usable product website. Built from the Master Prompt and 16-Frame Pack, adapted to the real products you uploaded.

## Products (from your uploads only)
- Indigo Haze — Premium Deodorant Body Spray
- Marshmallow Smoke — Premium Deodorant Body Spray
- Aqua Bergamot — Fine Fragrance Body Wash
- Black Vanilla — Fine Fragrance Body Wash
- Number 10 — 3-in-1 Body, Face & Hair Wash

Claims and notes use only the wording printed on the packs (for example "72H fresh", "0% aluminium salts", "Infused with essential oils", "All day fresh", "Feel clean"). Anything else stays as a clearly marked, editable placeholder.

## The film (first ~700vh, scroll = playhead)
The brief's chapters, with the fragrance worlds re-themed to the real products:

```text
01 OBJECT   black, rim-lit can reveal -> macro details -> "SMELL READY."
02 READY    Spray #1 -> apartment -> SHOWERED. DRESSED. READY? NOT YET.
            Spray #2 -> room fractures into aerosol
03 EFFECT   Indigo Haze world (deep indigo + ember amber)
            Marshmallow Smoke world (soft white smoke on graphite)
            Aqua / Black Vanilla / Number 10 material glimpses
            "72H FRESH." held typography around a floating can
04 NIGHT    Spray #3 -> Indian city at night -> editorial glimpses
            "YOU'RE READY." -> FREEZE
05 YOUR AXE rapid rewind -> black studio -> lineup
            "FIND YOUR AXE. / ONE SPRAY. YOUR MOVE." -> EXPLORE THE RANGE
```

- Scrolling forward plays, backward reverses, stopping pauses.
- I generate ~16 cinematic stand-in stills (one per keyframe in the prompt pack). The real can photo sits on top so the packaging is always accurate. Stills crossfade/dolly with scroll on a canvas, and each is labelled so your final Runway frames can replace it.
- Spray transitions use a real particle burst out of the nozzle, not a plain fade.
- Overlays: tiny nav, chapter indicator (01–05), Skip Experience, sound toggle (off by default).

## Website after the film (calm, fast, product-led)
- A. Find Your AXE: large horizontal selector. Hover gives each product its own light. Clicking zooms the product into a detail panel.
- B. What's Inside: big editorial cards built only from pack wording.
- C. Performance: oversized "72H FRESH" typography with macro can details.
- D. Choose Your Format: big switch for Body Spray / Body Wash / 3-in-1.
- E. Product Grid: filterable, with name, format, pack claims and a "Buy" button (placeholder links).
- F. AXE Culture: magazine tiles for music, gaming, fashion and sport.
- G. Footer: minimal, near-black.
- Loading screen: black, thin can outline, "LOADING THE EFFECT" line filling along it.

## Look and feel
- About 85% black and graphite, off-white type, each product brings its own accent colour.
- Very large condensed display type (Anton or Bebas Neue style) with a clean sans for body text. No Inter.
- Minimal dot cursor on desktop that grows over buttons.
- Separate vertical art direction on mobile, with fewer frames and effects.
- Reduced-motion version: static images and the same copy and buttons.

## Technical details
- Single page at `/`, with its own title and description tags. GSAP + ScrollTrigger drive one pinned canvas.
- `src/cinematic/timeline.ts` holds one chapter config (object 0–.16, ready .16–.38, effect .38–.74, night .74–.91, your-axe .91–1) shared by canvas and copy overlays.
- `ScrollFrameSequence` reads a frame manifest (desktop/mobile sets). It handles DPR-aware cover drawing, rAF-throttled drawing, staged preloading (poster, first frames, then nearby, then the rest), missing-frame fallback and an outside-viewport pause. When you add real frames (`frame-0001.avif`…), the engine switches from keyframe-blend mode to true frame scrubbing.
- `src/data/products.ts` is the central editable product data (id, name, slug, category, image, accent, packClaims, notes placeholder, url).
- The 5 can/bottle photos are uploaded as CDN assets. Generated stills go in `src/assets/frames/`.
- Audio hooks (click, spray, whoosh) wired but silent until you add sound files.
- No backend needed.

## Build order
1. Structure, product data, all website sections.
2. Generate the 16 stills and build the scroll film engine and overlays.
3. Preloader, mobile frames, reduced motion, skip.
4. Polish: cursor, hover worlds, micro-interactions. Then a browser check by scrolling forward and back.
