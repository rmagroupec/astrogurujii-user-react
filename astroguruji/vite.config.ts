import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // All requests to /api/* are forwarded to the backend
      "/api": {
        target: "https://admin.astrogurujii.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // strips /api prefix
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});