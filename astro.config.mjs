import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bookdigest.club",
  integrations: [
    sitemap(),
  ],
  // …other config
});