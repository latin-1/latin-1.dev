import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://latin-1.dev",

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Fredoka",
      cssVariable: "--font-fredoka",
      weights: ["400 700"],
      fallbacks: [],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Figtree",
      cssVariable: "--font-figtree",
      weights: ["400 700"],
      fallbacks: [],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Source Serif 4",
      cssVariable: "--font-source-serif-4",
      weights: ["400 700"],
      fallbacks: [],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Iosevka",
      cssVariable: "--font-iosevka",
      weights: ["400", "700"],
      fallbacks: [],
    },
  ],

  markdown: {
    shikiConfig: {
      theme: "catppuccin-latte",
    },
  },

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
