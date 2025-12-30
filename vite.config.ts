import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mantineAutoloadCSS } from "unplugin-mantine-autoload-css";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    mantineAutoloadCSS(),
  ],
  resolve: {
    alias: {
      // Ensure React is resolved correctly for Recharts compatibility
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
});
