import type { Lang } from '../content/types';
import { withBase } from './paths';

/**
 * Le pagine del sito e il loro indirizzo in ogni lingua. Gli slug inglesi non
 * ricalcano quelli italiani (/territori/ ↔ /en/destinations/), quindi hreflang,
 * canonical e selettore di lingua passano tutti da qui.
 */
export type PageKey = 'home' | 'territori' | 'aziende' | 'privacy' | 'cookie';

export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { it: '/', en: '/en/' },
  territori: { it: '/territori/', en: '/en/destinations/' },
  aziende: { it: '/aziende/', en: '/en/brands/' },
  privacy: { it: '/privacy/', en: '/en/privacy/' },
  cookie: { it: '/cookie/', en: '/en/cookie/' },
};

export const href = (page: PageKey, lang: Lang, hash = ''): string => withBase(routes[page][lang]) + hash;
