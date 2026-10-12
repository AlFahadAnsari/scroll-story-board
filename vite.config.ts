// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel sets VERCEL=1 during its builds. Lovable's own builds are unaffected.
const isVercel = !!process.env["VERCEL"];

// Uploaded images (src/assets/**/*.asset.json) are served by Lovable at /__l5e/assets-v1/*,
// not bundled into the repo, so a Vercel deploy proxies that path back to the Lovable project.
const LOVABLE_ASSET_ORIGIN = "https://f673f218-9fab-4053-8185-bd880ff26dad.lovableproject.com";

// Lovable's option type only lists a subset of nitro's options, but they are all passed through.
const vercelNitro = {
  preset: "vercel",
  routeRules: {
    "/__l5e/assets-v1/**": {
      proxy: `${LOVABLE_ASSET_ORIGIN}/__l5e/assets-v1/**`,
      headers: { "cache-control": "public, max-age=31536000, immutable" },
    },
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  ...(isVercel ? { nitro: vercelNitro } : {}),
});
