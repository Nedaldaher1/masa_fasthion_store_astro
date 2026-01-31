// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import icon from 'astro-icon';
import svgr from 'vite-plugin-svgr';
import compress from 'astro-compress';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://masa-fashion.store', // 🔴 مهم جدًا (غيّر الدومين)

  vite: {
    plugins: [tailwindcss(), svgr()],
  },

  image: {
    experimentalLayout: 'responsive',
  },

  integrations: [
    react(),
    icon(),
    compress(),
    sitemap(), // ✅ إضافة sitemap
  ],

  adapter: cloudflare(),
});
