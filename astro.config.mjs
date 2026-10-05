import {defineConfig} from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
export default defineConfig({site:'https://ryu-jemu-marginalia.onrender.com',devToolbar:{enabled:false},trailingSlash:'always',build:{format:'directory'},integrations:[mdx(),sitemap({filter:page=>!new URL(page).pathname.startsWith('/ko/')})]});
