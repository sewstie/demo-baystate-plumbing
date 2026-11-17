import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.SITE_URL || 'https://sewstie.github.io',
  base: process.env.SITE_BASE || '/demo-baystate-plumbing',
  adapter: vercel(),
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
