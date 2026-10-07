// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Dominio da cui il sito risponderà davvero: alimenta canonical, hreflang e sitemap.
  // Il dominio nudo, non www: www rimanda qui (vedi docs/dns-cutover.md).
  // L'anteprima su GitHub Pages li sovrascrive (vedi .github/workflows/pages.yml):
  // SITE_URL=https://advlabbik.github.io, SITE_BASE=/adventurelab-site/.
  site: process.env.SITE_URL ?? 'https://adventurelab.cc',
  base: process.env.SITE_BASE ?? '/',

  // Italiano alla radice, inglese sotto /en/.
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'it', locales: { it: 'it-IT', en: 'en-GB' } },
    }),
  ],
});
