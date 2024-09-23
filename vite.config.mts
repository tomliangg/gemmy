// this file use .mts extension instead of .ts because Vite deprecated CJS:
// https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated
// can't use { "type": "module" } in package.json because it can break vs code extension compile completely.

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "bundle.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
