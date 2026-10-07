// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Dominio da cui il sito risponderà davvero: alimenta canonical, hreflang e sitemap.
  // Il dominio nudo, non www: www rimanda qui (vedi docs/dns-cutover.md).
  site: 'https://adventurelab.cc',

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
