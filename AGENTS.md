<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Scroll film config lives only in `src/cinematic/timeline.ts`: SEGMENTS (backgrounds+copy), CAN_KEYS (one continuous hero-can path), SPRAYS (mist windows that hide world changes) — the can never cuts, so its motion must not be tied to segment boundaries.
- Product data lives only in `src/data/products.ts`; claims must come from pack wording — brand-accuracy rule from the brief.
- Film identity changes are derived from CAN_KEYS and dissolve two aspect-preserving packshots inside the mist; shared geometry keeps silhouette/reveal aligned without separate wash overlays.
