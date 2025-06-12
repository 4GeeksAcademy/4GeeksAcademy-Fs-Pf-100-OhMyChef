import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    historyApiFallback: true, // ✅ Esta línea es la clave
  },
  build: {
    outDir: "dist",
  },
});
