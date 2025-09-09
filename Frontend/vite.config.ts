import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // ← compose のサービス名 backend:8080 に転送
      "/api": { target: "http://backend:8080", changeOrigin: true },
      "/login": { target: "http://backend:8080", changeOrigin: true },
      "/signup": { target: "http://backend:8080", changeOrigin: true },
    },
    host: true, // 必須: コンテナ外(ホスト)からアクセス可能に
    strictPort: true,
  },
});
