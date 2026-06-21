// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, componentTagger (dev-only),
//     VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// On Vercel the VERCEL env var is set to "1". We use it to pick the correct
// Nitro preset: "vercel" outputs to .vercel/output (Build Output API),
// "node-server" is used for local development / other Node.js hosts.
const nitroPreset = process.env.VERCEL ? "vercel" : "node-server";

export default defineConfig({
  // Disable the @cloudflare/vite-plugin injected by lovable config.
  // Vercel uses Nitro — the Cloudflare Workers bundle is incompatible with Vercel.
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      nitro({
        preset: nitroPreset,
      }),
    ],
  },
});
