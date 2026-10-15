import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fieldAskPlugin } from "./server/ask-plugin";

export default defineConfig({
  plugins: [react(), fieldAskPlugin()],
  server: { port: 5173, strictPort: true },
});
