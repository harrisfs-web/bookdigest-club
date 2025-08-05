import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://bookdigest.club",

  // …other config
  integrations: [
    // Removed automatic sitemap - using manual sitemap.xml in public folder
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});