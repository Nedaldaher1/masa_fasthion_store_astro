// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import icon from 'astro-icon';
import svgr from 'vite-plugin-svgr';

import compress from 'astro-compress';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(),svgr()]
  },

  image: {
    // تفعيل توليد صيغ WebP و AVIF تلقائياً
    experimentalLayout: 'responsive',
  },

  integrations: [react(), icon(), compress()],
  adapter: cloudflare(),
});