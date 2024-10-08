import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Ensure correct base path for production

  // Only relevant for development mode
  server: {
    proxy: {
      "/api": {
        target: "https://msadmin.onrender.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist", // Ensure output directory is properly set
  },
});
