import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const FORM_LIBS = [
  "formik",
  "yup",
  "lodash-es",
  "lodash",
  "tiny-warning",
  "tiny-case",
  "property-expr",
  "toposort",
  "deepmerge",
  "react-fast-compare",
  "hoist-non-react-statics",
  "react-is",
];

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    port: 5173,
    strictPort: false,
  },

  preview: {
    port: 4173,
    strictPort: false,
  },

  build: {
    target: "es2022",
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-dom") || id.includes("scheduler")) {
            return "react-dom";
          }
          if (id.includes("react-router") || id.includes("@remix-run/router")) {
            return "router";
          }
          if (FORM_LIBS.some((lib) => id.includes(`/${lib}/`))) {
            return "forms";
          }
          if (id.includes("/react/")) {
            return "react";
          }
          return "vendor";
        },
      },
    },
  },
});