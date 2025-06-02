import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// import tsconfigPaths from "vite-tsconfig-paths";

// todo: absolute path not working as intended
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    //  tsconfigPaths()
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: [
      {
        find: "@types",
        replacement: path.resolve(__dirname, "../shared/types"),
      },
    ],
  },
});
