import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://ryosuke-horie.pages.dev.com',
	integrations: [sitemap()],
});
