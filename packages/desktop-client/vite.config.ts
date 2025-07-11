import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "../desktop-electron/dist/desktop-client",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
