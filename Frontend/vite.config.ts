import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://backend:8080",
        changeOrigin: true,
        // rewriteは付けない（/apiをそのままバックエンドへ）
      },
    },
  },
});
