// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ryu-jemu-marginalia.onrender.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    mdx(),
    // The two trees are the same document, so the sitemap has to say so;
    // otherwise a crawler picks one and treats the other as duplicated.
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', ko: 'ko' } },
    }),
  ],
});
