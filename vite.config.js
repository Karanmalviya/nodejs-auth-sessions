import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      // port: env.VITE_API_PORT,
      // proxy: {
      //   "/server": {
      //     target: env.VITE_API_URL + "/api/v1",
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/server/, ""),
      //   },
      // },
    },
  };
});
