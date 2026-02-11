import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        editor: "editor.html",
      },
      output: {
        entryFileNames: "assets/editor.js"
      },
    },
  },
});
