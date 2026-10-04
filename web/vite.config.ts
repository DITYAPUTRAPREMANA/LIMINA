import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // VITE_MODEL_API_URL may be either the base URL or the full .../scores URL.
  const modelUrl = new URL(
    env.VITE_MODEL_API_URL || "http://127.0.0.1:8000",
  );
  const modelBasePath = modelUrl.pathname
    .replace(/\/+$/, "")
    .replace(/\/scores$/, "");

  return {
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
            Authorization: env.SECTORS_API_KEY || "",
          },
        },
        "/api/model": {
          target: modelUrl.origin,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/model/, modelBasePath),
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
  };
});
