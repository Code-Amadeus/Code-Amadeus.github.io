import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://code-amadeus.github.io",
  // Keep the authored markup as-is so the output matches the previous static build.
  compressHTML: false,
});
