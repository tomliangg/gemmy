// this file use .mts extension instead of .ts because Vite deprecated CJS:
// https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated
// can't use { "type": "module" } in package.json because it can break vs code extension compile completely.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "bundle.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
