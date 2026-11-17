import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const pages = process.env.GITHUB_ACTIONS === 'true';
export default defineConfig({
  site: process.env.SITE_URL || 'https://sewstie.github.io',
  base: process.env.SITE_BASE || '/demo-baystate-plumbing',
  adapter: pages ? undefined : vercel(),
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [react(), ...(pages ? [{ name: 'static-demo', hooks: { 'astro:route:setup': ({ route }) => { if (route.component.startsWith('src/pages/api/')) route.prerender = true; } } }] : [])],
  vite: {
    plugins: [tailwindcss()],
  },
});
