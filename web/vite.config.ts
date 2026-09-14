import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite Configuration — LIMINA
 *
 * Security headers configured for the dev server.
 * For production, these headers MUST be configured on the hosting platform
 * (Vercel, Nginx, Cloudflare, etc.) as Vite dev server headers don't apply to builds.
 *
 * TODO(security): Configure equivalent headers in your hosting platform:
 * - Vercel: vercel.json headers field
 * - Nginx: add_header directives
 * - Cloudflare Pages: _headers file
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // Security: only listen on localhost during development (MUST NOT listen on 0.0.0.0)
    host: "127.0.0.1",
    port: 5173,

    headers: {
      // Prevent clickjacking
      "X-Frame-Options": "DENY",

      // Prevent MIME type sniffing
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },

    proxy: {
      "/api/sectors": {
        target: "https://api.sectors.app/v2",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/sectors/, ""),
        headers: {
          Authorization: "95a384b1890f8b9f41d0c764591e19ce72c38f78e67bd87e984991ae81e85072",
        },
      },
      // Proxy untuk server FastAPI model AI yang dijalankan terpisah
      "/api/model": {
        target: process.env.VITE_MODEL_API_URL || "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/model/, ""),
      },
    },
  },

  build: {
    // Raise warning limit for Supabase bundle (it's a large but trusted library)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split Supabase into its own chunk for better caching
        manualChunks(id: string) {
          if (id.includes("@supabase")) return "supabase";
        },
      },
    },
  },
});
