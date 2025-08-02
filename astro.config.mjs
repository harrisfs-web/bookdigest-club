import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://bookdigest.club",

  // …other config
  integrations: [
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});