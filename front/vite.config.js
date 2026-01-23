// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets", // Garante que os assets sejam gerados na pasta `dist/assets`
  },
  base: "./", // Importante para garantir que os caminhos sejam relativos
});
