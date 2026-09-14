import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: "127.0.0.1",
    port: 5173,

    headers: {
      "X-Frame-Options": "DENY",
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
      "/api/model": {
        target: process.env.VITE_MODEL_API_URL || "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/model/, ""),
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            if (res && "writeHead" in res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "model_server_offline" }));
            }
          });
        },
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("@supabase")) return "supabase";
        },
      },
    },
  },
});
