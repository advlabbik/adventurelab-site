# adventurelab.cc one-pager — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire il nuovo sito B2B di AdventureLab: one-pager statico IT/EN con form contatti → Brevo → Calendly, pronto per l'URL di anteprima `workers.dev`.

**Architecture:** Sito Astro 7 interamente statico servito come Cloudflare Worker con static assets (come `~/Repo/ttrefactor`). Testi in due file TypeScript per lingua, controllati in build (parità chiavi IT/EN; nessun `TODO:` in produzione). Un Worker separato `adventurelab-lead` riceve il form, valida (origine, rate limit, honeypot, email, consenso, Turnstile) e scrive il contatto su Brevo; il client apre poi Calendly precompilato, anche se il Worker fallisce.

**Tech Stack:** Astro 7, TypeScript, pnpm 10, Node ≥ 22 (in macchina: 25), `@astrojs/sitemap`, `sharp`, Cloudflare Workers + wrangler, Cloudflare Turnstile, Brevo API v3, Calendly inline embed, test con `node:test` (nessuna dipendenza in più).

**Spec:** `docs/superpowers/specs/2026-10-07-adventurelab-onepager-design.md`

## Global Constraints

- Lingue: italiano su `/` (default, `prefixDefaultLocale: false`), inglese su `/en/`.
- Account Cloudflare: `fe10f419d554dfcaca3986a6e7056944` (Adventure Lab).
- Turnstile sitekey: `0x4AAAAAAEl8e7Ux8o0mh37i` (widget "Brevo lead forms (tutti i siti)"); il secret si legge via `GET /accounts/{id}/challenges/widgets/{sitekey}` campo `secret`.
- Attributi Brevo: `LINGUA` (1 = it, 2 = en), `SIGNUP_SOURCE` = `adventurelab:contatti`, `FIRSTNAME`, `ADVLAB_TIPO` (territorio|brand|altro), `ADVLAB_ENTE`, `ADVLAB_OPTIN` (bool), `ADVLAB_LAST_SIGNUP_AT` (ISO, riscritto a ogni invio).
- `BREVO_LIST_ID = "0"` finché la lista non esiste → il worker rifiuta con `brevo_list_not_configured`.
- Worker fail-closed su Turnstile quando `TURNSTILE_REQUIRED="true"`.
- Rate limit worker: 5 richieste / 60 s per IP.
- Timeout client verso il worker: 8000 ms; dopo, Calendly si apre comunque.
- Nessun `TODO:` nei contenuti in produzione (`STRICT_CONTENT=1`).
- Produzione indicizzabile solo con `PUBLIC_SITE_ENV=production`; ogni altro build ha `noindex`.
- Dati societari footer: AdventureLab srl · Via Giulio Braga, 98 · 59100 Prato (PO) · P. IVA 02410590976 · REA 532864 · Capitale sociale 10.000 € i.v. · info@adventurelab.cc · LinkedIn https://www.linkedin.com/company/adventurelabco/
- Mai cancellare contatti Brevo di prova: metterli in blacklist.
- Azioni verso l'esterno (creare il repo GitHub, `wrangler deploy`, `wrangler secret put`, modifiche al widget Turnstile, creazione lista/attributi Brevo) richiedono conferma esplicita di Francesco prima di eseguirle.
- Copy e commenti nel codice in italiano, come negli altri repo della famiglia.

## Review Focus

1. Nome/ente con accenti, apostrofi, `&` o `+` nell'email (es. `Àlice D'Amico`, `a+b@x.it`) → l'URL Calendly deve essere codificato correttamente e Calendly mostrare i valori esatti. Test in Task 7 (`calendlyUrl`).
2. Doppio clic su "Scegli il giorno" → un solo POST; il bottone si disabilita durante l'invio. Test manuale in Task 7, step di verifica.
3. Secondo tentativo dopo un errore (es. email sbagliata) → il token Turnstile è già consumato: va resettato prima del nuovo invio, altrimenti `turnstile_failed`. Gestito e verificato in Task 7.
4. Worker lento o giù (> 8 s, 5xx, rete assente) → Calendly si apre comunque con i dati e compare l'email di riserva. Test in Task 7 (`submitLead` con fetch che non risponde).
5. Pagina `/en/` → il POST porta `lang: "en"` e il contatto ha `LINGUA = 2`; tipo non previsto (`"pippo"`) → `ADVLAB_TIPO = "altro"`, mai valori fuori lista. Test in Task 6.

---

## File structure

```
adventurelab-site/
├── package.json                      # script build/check/test
├── astro.config.mjs                  # site, i18n, sitemap
├── tsconfig.json                     # esclude workers/
├── wrangler.jsonc                    # worker del sito (static assets)
├── site.config.ts                    # endpoint, chiavi pubbliche, dati società
├── public/
│   ├── favicon.png
│   ├── robots.txt                    # generato? no: statico, punta alla sitemap
│   └── video/hero.mp4                # video compresso (≤ 3 MB)
├── scripts/
│   ├── lib/content-check.mjs         # diffKeys(), findTodos() — puri
│   └── check-content.mjs             # CLI: parità IT/EN + STRICT_CONTENT
├── tests/
│   ├── content-check.test.mjs
│   ├── calendly.test.mjs
│   ├── submit-lead.test.mjs
│   └── build-output.test.mjs         # controlla dist/ dopo il build
├── src/
│   ├── content/
│   │   ├── types.ts                  # tipo SiteContent
│   │   ├── it.ts                     # testi italiani
│   │   ├── en.ts                     # testi inglesi
│   │   └── index.ts                  # getContent(lang)
│   ├── lib/
│   │   ├── calendly.ts               # calendlyUrl() — puro
│   │   └── submit-lead.ts            # submitLead() — fetch con timeout
│   ├── styles/tokens.css             # token CSS (colori, font, spazi)
│   ├── styles/global.css
│   ├── assets/{logos,clients,events,photos}/   # immagini ottimizzate da astro:assets
│   ├── layouts/Base.astro            # <head>, SEO, hreflang, noindex, analytics
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── OnePager.astro            # compone le 10 sezioni per una lingua
│   │   └── sections/{Hero,Numbers,Clients,Services,Process,Cases,Brands,Events,About,Contact}.astro
│   └── pages/
│       ├── index.astro               # IT
│       ├── privacy.astro, cookie.astro, 404.astro
│       └── en/{index,privacy,cookie}.astro
├── workers/lead/
│   ├── wrangler.toml
│   ├── tsconfig.json
│   ├── src/index.js                  # handler + funzioni pure esportate
│   └── test/index.test.mjs
└── docs/dns-cutover.md               # runbook passaggio DNS (non eseguito qui)
```

---

### Task 1: Scaffold Astro + Worker statico, build IT/EN vuoto

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `wrangler.jsonc`, `site.config.ts`, `src/pages/index.astro`, `src/pages/en/index.astro`, `tests/build-output.test.mjs`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `site` (export di `site.config.ts`) con i campi usati dai task seguenti: `leadEndpoint: string`, `turnstileSiteKey: string`, `calendlyUrl: string`, `cfAnalyticsToken: string`, `contactEmail: string`, `company: {name, address, vat, rea, capital, linkedin}`.

- [ ] **Step 1: package.json**

```json
{
  "name": "adventurelab-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=22" },
  "packageManager": "pnpm@10.28.1",
  "scripts": {
    "dev": "astro dev",
    "check:content": "node scripts/check-content.mjs",
    "build": "pnpm check:content && astro build",
    "build:prod": "PUBLIC_SITE_ENV=production STRICT_CONTENT=1 pnpm build",
    "preview": "astro preview",
    "check": "astro check",
    "check:worker": "tsc --noEmit -p workers/lead/tsconfig.json",
    "test": "node --test tests/ workers/lead/test/",
    "test:build": "node --test tests/build-output.test.mjs"
  }
}
```

Poi:

```bash
pnpm add astro@^7.1.3 @astrojs/sitemap@^3.7.3
pnpm add -D @astrojs/check@^0.9.10 typescript@^6.0.3 sharp@^0.35.3 wrangler
```

Nota: finché `scripts/check-content.mjs` non esiste (Task 2) usare `astro build` diretto per provare il build di questo task.

- [ ] **Step 2: astro.config.mjs**

```js
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
```

- [ ] **Step 3: tsconfig.json e wrangler.jsonc**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "workers"]
}
```

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "adventurelab-site",
  "account_id": "fe10f419d554dfcaca3986a6e7056944",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

- [ ] **Step 4: site.config.ts**

```ts
/**
 * Configurazione di sito: dati che non sono testo da tradurre ma nemmeno logica.
 * Terze parti, endpoint, dati societari.
 */
export const site = {
  /** Worker che gira il form contatti a Brevo. Vedi workers/lead/. Riempito al primo deploy del worker. */
  leadEndpoint: '',

  /** Site key pubblica Turnstile, widget "Brevo lead forms (tutti i siti)". Vuota = widget spento. */
  turnstileSiteKey: '0x4AAAAAAEl8e7Ux8o0mh37i',

  /** URL dell'evento Calendly (es. https://calendly.com/adventurelab/call-30). Vuoto = niente Calendly, resta l'email. */
  calendlyUrl: '',

  /** Token Cloudflare Web Analytics. Vuoto = nessuno snippet. */
  cfAnalyticsToken: '',

  contactEmail: 'info@adventurelab.cc',

  company: {
    name: 'AdventureLab srl',
    address: 'Via Giulio Braga, 98 · 59100 Prato (PO), Italia',
    vat: '02410590976',
    rea: '532864',
    capital: '10.000 € i.v.',
    linkedin: 'https://www.linkedin.com/company/adventurelabco/',
  },
} as const;
```

- [ ] **Step 5: pagine minime**

`src/pages/index.astro`:

```astro
---
---
<html lang="it"><head><meta charset="utf-8" /><title>AdventureLab</title></head><body><h1>AdventureLab</h1></body></html>
```

`src/pages/en/index.astro`: uguale con `lang="en"`.

Aggiungere a `.gitignore`: `dist/`, `.astro/`, `.wrangler/`, `.dev.vars`.

- [ ] **Step 6: test sull'output del build (fallisce)**

`tests/build-output.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../dist/${p}`, import.meta.url), 'utf8');

test('esistono home IT e EN', () => {
  assert.ok(existsSync(new URL('../dist/index.html', import.meta.url)));
  assert.ok(existsSync(new URL('../dist/en/index.html', import.meta.url)));
});

test('la home IT dichiara lang="it", la EN lang="en"', () => {
  assert.match(read('index.html'), /<html[^>]*lang="it"/);
  assert.match(read('en/index.html'), /<html[^>]*lang="en"/);
});
```

Run: `pnpm test:build` → Expected: FAIL (`dist/` non esiste).

- [ ] **Step 7: build e test**

Run: `pnpm astro build && pnpm test:build` → Expected: PASS (2 test).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro con i18n IT/EN e worker statico"
```

---

### Task 2: Modello dei contenuti + controlli in build

**Files:**
- Create: `src/content/types.ts`, `src/content/it.ts`, `src/content/en.ts`, `src/content/index.ts`, `scripts/lib/content-check.mjs`, `scripts/check-content.mjs`, `tests/content-check.test.mjs`

**Interfaces:**
- Produces: `type Lang = 'it' | 'en'`; `type SiteContent` (sotto); `getContent(lang: Lang): SiteContent`; `diffKeys(a: object, b: object): string[]`; `findTodos(obj: object): string[]` (percorsi tipo `services.items.0.title`).

- [ ] **Step 1: test delle funzioni di controllo (falliscono)**

`tests/content-check.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffKeys, findTodos } from '../scripts/lib/content-check.mjs';

test('diffKeys: nessuna differenza se le chiavi coincidono', () => {
  assert.deepEqual(diffKeys({ a: 1, b: { c: 'x' } }, { a: 2, b: { c: 'y' } }), []);
});

test('diffKeys: segnala le chiavi presenti da un solo lato, in entrambe le direzioni', () => {
  assert.deepEqual(
    diffKeys({ a: 1, b: { c: 'x' } }, { a: 1, b: {}, d: 2 }).sort(),
    ['+d', '-b.c'],
  );
});

test('diffKeys: array confrontati per lunghezza e per chiavi di ogni elemento', () => {
  assert.deepEqual(diffKeys({ l: [{ t: 1 }, { t: 2 }] }, { l: [{ t: 1 }] }), ['-l.1']);
});

test('findTodos: trova i TODO: annidati con il loro percorso', () => {
  const c = { hero: { title: 'TODO: claim' }, list: [{ t: 'ok' }, { t: 'TODO: x' }] };
  assert.deepEqual(findTodos(c), ['hero.title', 'list.1.t']);
});

test('findTodos: ignora stringhe che contengono TODO non come prefisso', () => {
  assert.deepEqual(findTodos({ a: 'Il nostro TODO: niente' }), []);
});
```

Run: `node --test tests/content-check.test.mjs` → Expected: FAIL (modulo inesistente).

- [ ] **Step 2: implementazione**

`scripts/lib/content-check.mjs`:

```js
/**
 * Controlli sui testi del sito, puri e senza dipendenze: li usa check-content.mjs
 * in build e li provano i test.
 */

const isObj = (v) => v !== null && typeof v === 'object';

/** Chiavi presenti in `a` e non in `b` (prefisso "-") e viceversa ("+"). */
export function diffKeys(a, b, path = '') {
  const out = [];
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  for (const k of keys) {
    const p = path ? `${path}.${k}` : k;
    const inA = a != null && k in a;
    const inB = b != null && k in b;
    if (inA && !inB) out.push(`-${p}`);
    else if (!inA && inB) out.push(`+${p}`);
    else if (isObj(a[k]) && isObj(b[k])) out.push(...diffKeys(a[k], b[k], p));
  }
  return out;
}

/** Percorsi delle stringhe che iniziano con "TODO:". */
export function findTodos(obj, path = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string' && v.trimStart().startsWith('TODO:')) out.push(p);
    else if (isObj(v)) out.push(...findTodos(v, p));
  }
  return out;
}
```

Run: `node --test tests/content-check.test.mjs` → Expected: PASS (5 test).

- [ ] **Step 3: tipo dei contenuti**

`src/content/types.ts`:

```ts
export type Lang = 'it' | 'en';

export interface SiteContent {
  meta: { title: string; description: string };
  nav: { territories: string; cases: string; brands: string; events: string; about: string; cta: string };
  hero: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  numbers: { label: string; items: { value: string; label: string }[] };
  clients: { title: string };
  services: { title: string; intro: string; items: { title: string; text: string }[] };
  process: { title: string; steps: { title: string; text: string }[] };
  cases: {
    title: string;
    open: string;
    close: string;
    items: { place: string; event: string; summary: string; body: string; stats: { value: string; label: string }[] }[];
  };
  brands: { title: string; audienceTitle: string; audience: string; formatsTitle: string; formats: string; mediaKit: string };
  events: { title: string; items: { name: string; line: string; stat: string; url: string }[] };
  about: { title: string; body: string[] };
  contact: {
    title: string;
    intro: string;
    fields: { name: string; email: string; org: string; type: string; typeTerritory: string; typeBrand: string; typeOther: string };
    privacy: string;
    optin: string;
    submit: string;
    sending: string;
    errors: { invalid_email: string; consent_required: string; generic: string };
    fallback: string;
    calendlyTitle: string;
  };
  footer: { tagline: string; privacy: string; cookie: string; rights: string };
  legal: { privacyTitle: string; privacyBody: string[]; cookieTitle: string; cookieBody: string[] };
  langSwitch: { label: string };
}
```

- [ ] **Step 4: testi italiani**

`src/content/it.ts` — segnaposto marcati `TODO:` dove la spec li prevede; testi vecchi riscritti dove reggono. Gli `items` dei servizi sono 4 (la griglia regge 3–6).

```ts
import type { SiteContent } from './types';

export const it: SiteContent = {
  meta: {
    title: 'AdventureLab — eventi e turismo in bicicletta per i territori',
    description:
      'Portiamo ciclisti nei territori con eventi, itinerari e promozione verso una community europea. Dal 2012.',
  },
  nav: { territories: 'Territori', cases: 'Casi', brands: 'Brand', events: 'Eventi', about: 'Chi siamo', cta: 'Prenota una call' },
  hero: {
    title: 'TODO: Portiamo ciclisti nel tuo territorio.',
    subtitle: 'TODO: Eventi, itinerari e promozione per destinazioni che vogliono crescere con il turismo in bicicletta.',
    ctaPrimary: 'Prenota una call',
    ctaSecondary: 'Guarda i casi',
  },
  numbers: {
    label: 'TODO: dati 2025',
    items: [
      { value: '14', label: 'anni di esperienza' },
      { value: '19', label: 'paesi' },
      { value: 'TODO: n', label: 'partecipanti all’anno' },
      { value: 'TODO: n', label: 'pernottamenti generati' },
      { value: 'TODO: n', label: 'indotto stimato' },
    ],
  },
  clients: { title: 'Hanno lavorato con noi' },
  services: {
    title: 'Cosa facciamo per un territorio',
    intro: 'TODO: frase introduttiva sui servizi',
    items: [
      { title: 'TODO: Servizio 1', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 2', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 3', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 4', text: 'TODO: descrizione in due righe' },
    ],
  },
  process: {
    title: 'Come lavoriamo',
    steps: [
      { title: 'Sopralluogo e analisi', text: 'TODO: due righe' },
      { title: 'Percorso e format', text: 'TODO: due righe' },
      { title: 'Evento e promozione', text: 'TODO: due righe' },
      { title: 'Report', text: 'TODO: numeri e ricadute misurate sul territorio' },
    ],
  },
  cases: {
    title: 'Casi',
    open: 'Leggi il caso',
    close: 'Chiudi',
    items: [
      { place: 'Slovenia', event: 'The Grand Escape', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
      { place: 'Toscana', event: 'Tuscany Trail', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
      { place: 'Trentino', event: 'Trentino Gravel', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
    ],
  },
  brands: {
    title: 'Per brand e sponsor',
    audienceTitle: 'Chi raggiungi',
    audience: 'TODO: profilo della community — età, paesi, bici, spesa',
    formatsTitle: 'Formati',
    formats: 'TODO: presenza agli eventi, contenuti, prodotto nel pacco gara',
    mediaKit: 'Scarica il media kit',
  },
  events: {
    title: 'I nostri eventi',
    items: [
      { name: 'Tuscany Trail', line: 'L’avventura in bici unsupported più partecipata al mondo.', stat: 'TODO: n iscritti', url: 'https://tuscanytrail.it' },
      { name: 'The Grand Escape', line: 'Bikepacking su strada sulle strade più belle d’Europa.', stat: 'TODO: n edizioni', url: 'https://thegrandescape.cc' },
      { name: 'NorthCape4000', line: 'L’ultracycling più lungo e partecipato d’Europa, verso Capo Nord.', stat: 'TODO: ~4.000 km', url: 'https://northcape4000.com' },
      { name: 'Unpaved Roads', line: 'Circuito gravel in Italia, formula weekend.', stat: 'TODO: n tappe', url: 'https://unpavedroads.cc' },
      { name: 'Trentino Gravel', line: 'TODO: una riga', stat: 'TODO: n', url: 'https://trentinogravel.com' },
      { name: 'Cycling in Tuscany', line: 'TODO: una riga', stat: 'TODO: n', url: 'https://cyclingintuscany.com' },
    ],
  },
  about: {
    title: 'Chi siamo',
    body: [
      'Dal 2012, quando abbiamo portato il bikepacking in Italia, organizziamo eventi in bicicletta dedicati all’avventura in tutta Europa.',
      'I nostri eventi sono “no race”: niente classifiche, la strada e i luoghi al centro. Siamo a Prato.',
    ],
  },
  contact: {
    title: 'Prenota una call di 30 minuti',
    intro: 'Lasciaci due dati e scegli il giorno: ti richiamiamo per capire il tuo progetto.',
    fields: { name: 'Nome', email: 'Email', org: 'Ente o azienda', type: 'Sono', typeTerritory: 'un territorio', typeBrand: 'un brand o sponsor', typeOther: 'altro' },
    privacy: 'Ho letto l’informativa privacy',
    optin: 'Voglio ricevere aggiornamenti da AdventureLab',
    submit: 'Scegli il giorno →',
    sending: 'Un attimo…',
    errors: {
      invalid_email: 'Controlla l’indirizzo email.',
      consent_required: 'Serve il consenso all’informativa privacy.',
      generic: 'Qualcosa non è andato: puoi comunque scegliere il giorno qui sotto.',
    },
    fallback: 'Se preferisci, scrivici a',
    calendlyTitle: 'Scegli giorno e ora',
  },
  footer: { tagline: 'Turismo in bicicletta in tutta Europa.', privacy: 'Privacy', cookie: 'Cookie', rights: 'Tutti i diritti riservati' },
  legal: {
    privacyTitle: 'Informativa privacy',
    privacyBody: ['TODO: testo informativa privacy fornito dall’azienda (deve citare Brevo e Calendly)'],
    cookieTitle: 'Cookie',
    cookieBody: ['TODO: testo cookie policy fornito dall’azienda'],
  },
  langSwitch: { label: 'English' },
};
```

- [ ] **Step 5: testi inglesi**

`src/content/en.ts` — stessa struttura, stesse chiavi, stessa lunghezza degli array; i `TODO:` restano dove sono in italiano. Testi:

```ts
import type { SiteContent } from './types';

export const en: SiteContent = {
  meta: {
    title: 'AdventureLab — cycling events and bike tourism for destinations',
    description: 'We bring cyclists to destinations through events, routes and promotion to a European community. Since 2012.',
  },
  nav: { territories: 'Destinations', cases: 'Cases', brands: 'Brands', events: 'Events', about: 'About', cta: 'Book a call' },
  hero: {
    title: 'TODO: We bring cyclists to your destination.',
    subtitle: 'TODO: Events, routes and promotion for destinations that want to grow with bike tourism.',
    ctaPrimary: 'Book a call',
    ctaSecondary: 'See the cases',
  },
  numbers: {
    label: 'TODO: 2025 data',
    items: [
      { value: '14', label: 'years of experience' },
      { value: '19', label: 'countries' },
      { value: 'TODO: n', label: 'riders per year' },
      { value: 'TODO: n', label: 'overnight stays generated' },
      { value: 'TODO: n', label: 'estimated local spend' },
    ],
  },
  clients: { title: 'They worked with us' },
  services: {
    title: 'What we do for a destination',
    intro: 'TODO: intro sentence about services',
    items: [
      { title: 'TODO: Service 1', text: 'TODO: two-line description' },
      { title: 'TODO: Service 2', text: 'TODO: two-line description' },
      { title: 'TODO: Service 3', text: 'TODO: two-line description' },
      { title: 'TODO: Service 4', text: 'TODO: two-line description' },
    ],
  },
  process: {
    title: 'How we work',
    steps: [
      { title: 'Site visit and analysis', text: 'TODO: two lines' },
      { title: 'Route and format', text: 'TODO: two lines' },
      { title: 'Event and promotion', text: 'TODO: two lines' },
      { title: 'Report', text: 'TODO: measured numbers and local impact' },
    ],
  },
  cases: {
    title: 'Cases',
    open: 'Read the case',
    close: 'Close',
    items: [
      { place: 'Slovenia', event: 'The Grand Escape', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
      { place: 'Tuscany', event: 'Tuscany Trail', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
      { place: 'Trentino', event: 'Trentino Gravel', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
    ],
  },
  brands: {
    title: 'For brands and sponsors',
    audienceTitle: 'Who you reach',
    audience: 'TODO: community profile — age, countries, bikes, spending',
    formatsTitle: 'Formats',
    formats: 'TODO: event presence, content, product in the rider pack',
    mediaKit: 'Download the media kit',
  },
  events: {
    title: 'Our events',
    items: [
      { name: 'Tuscany Trail', line: 'The world’s most popular unsupported bike adventure.', stat: 'TODO: n riders', url: 'https://tuscanytrail.it/en/' },
      { name: 'The Grand Escape', line: 'Road bikepacking on Europe’s most beautiful roads.', stat: 'TODO: n editions', url: 'https://thegrandescape.cc' },
      { name: 'NorthCape4000', line: 'Europe’s longest and most popular ultracycling adventure, to the North Cape.', stat: 'TODO: ~4,000 km', url: 'https://northcape4000.com' },
      { name: 'Unpaved Roads', line: 'A gravel circuit across Italy, weekend format.', stat: 'TODO: n stages', url: 'https://unpavedroads.cc' },
      { name: 'Trentino Gravel', line: 'TODO: one line', stat: 'TODO: n', url: 'https://trentinogravel.com' },
      { name: 'Cycling in Tuscany', line: 'TODO: one line', stat: 'TODO: n', url: 'https://cyclingintuscany.com' },
    ],
  },
  about: {
    title: 'About us',
    body: [
      'Since 2012, when we brought bikepacking to Italy, we have been organising adventure cycling events across Europe.',
      'Our events are “no race”: no rankings, the road and the places come first. We are based in Prato, Italy.',
    ],
  },
  contact: {
    title: 'Book a 30-minute call',
    intro: 'Leave us a few details and pick a day: we will call you to understand your project.',
    fields: { name: 'Name', email: 'Email', org: 'Organisation or company', type: 'I am', typeTerritory: 'a destination', typeBrand: 'a brand or sponsor', typeOther: 'other' },
    privacy: 'I have read the privacy notice',
    optin: 'I want to receive updates from AdventureLab',
    submit: 'Pick a day →',
    sending: 'One moment…',
    errors: {
      invalid_email: 'Please check the email address.',
      consent_required: 'Please accept the privacy notice.',
      generic: 'Something went wrong: you can still pick a day below.',
    },
    fallback: 'If you prefer, write to us at',
    calendlyTitle: 'Pick a day and time',
  },
  footer: { tagline: 'Bike tourism across Europe.', privacy: 'Privacy', cookie: 'Cookies', rights: 'All rights reserved' },
  legal: {
    privacyTitle: 'Privacy notice',
    privacyBody: ['TODO: privacy notice text provided by the company (must mention Brevo and Calendly)'],
    cookieTitle: 'Cookies',
    cookieBody: ['TODO: cookie policy text provided by the company'],
  },
  langSwitch: { label: 'Italiano' },
};
```

`src/content/index.ts`:

```ts
import type { Lang, SiteContent } from './types';
import { it } from './it';
import { en } from './en';

const byLang: Record<Lang, SiteContent> = { it, en };

export const getContent = (lang: Lang): SiteContent => byLang[lang];
export type { Lang, SiteContent };
```

- [ ] **Step 6: CLI di controllo**

`scripts/check-content.mjs` (Node ≥ 23.6 importa i `.ts` togliendo i tipi; in macchina c'è Node 25):

```js
/**
 * Controllo dei testi prima del build.
 *  - Sempre: IT ed EN devono avere le stesse chiavi (una sezione tradotta a metà
 *    rende pagine diverse nelle due lingue senza che nessuno se ne accorga).
 *  - Con STRICT_CONTENT=1 (build di produzione): nessun "TODO:" ammesso.
 */
import { it } from '../src/content/it.ts';
import { en } from '../src/content/en.ts';
import { diffKeys, findTodos } from './lib/content-check.mjs';

let failed = false;

const diff = diffKeys(it, en);
if (diff.length) {
  console.error(`[content] IT ed EN non coincidono (- solo IT, + solo EN):\n  ${diff.join('\n  ')}`);
  failed = true;
}

const todos = [...findTodos(it).map((p) => `it.${p}`), ...findTodos(en).map((p) => `en.${p}`)];
if (process.env.STRICT_CONTENT === '1' && todos.length) {
  console.error(`[content] ${todos.length} segnaposto TODO ancora presenti:\n  ${todos.join('\n  ')}`);
  failed = true;
} else if (todos.length) {
  console.warn(`[content] ${todos.length} segnaposto TODO (ammessi fuori produzione).`);
}

process.exit(failed ? 1 : 0);
```

Run: `pnpm check:content` → Expected: exit 0, warning con il numero di TODO.
Run: `STRICT_CONTENT=1 pnpm check:content; echo $?` → Expected: elenco dei TODO e `1`.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: testi IT/EN tipizzati con controllo parità e TODO in build"
```

---

### Task 3: Layout, token, navigazione, footer, SEO, pagine legali e 404

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/pages/privacy.astro`, `src/pages/cookie.astro`, `src/pages/en/privacy.astro`, `src/pages/en/cookie.astro`, `src/pages/404.astro`, `public/robots.txt`, `public/favicon.png`, `src/assets/logos/adventurelab.png`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`, `tests/build-output.test.mjs`

**Interfaces:**
- Consumes: `getContent(lang)`, `site`.
- Produces: `<Base lang title description path>` (`path` = percorso della pagina **senza** prefisso lingua, es. `/` o `/privacy/`); `<Nav lang c>`; `<Footer lang c>`; classi CSS globali `.container`, `.section`, `.btn`, `.btn--primary`, `.grid`, `.sr-only`.

- [ ] **Step 1: test sull'output (falliscono)**

Aggiungere a `tests/build-output.test.mjs`:

```js
test('hreflang reciproci e canonical sulla home', () => {
  const itHtml = read('index.html');
  assert.match(itHtml, /<link rel="alternate" hreflang="en" href="https:\/\/adventurelab\.cc\/en\/"/);
  assert.match(itHtml, /<link rel="alternate" hreflang="it" href="https:\/\/adventurelab\.cc\/"/);
  assert.match(itHtml, /<link rel="canonical" href="https:\/\/adventurelab\.cc\/"/);
  assert.match(read('en/index.html'), /<link rel="canonical" href="https:\/\/adventurelab\.cc\/en\/"/);
});

test('noindex fuori produzione, assente in produzione', () => {
  const html = read('index.html');
  if (process.env.PUBLIC_SITE_ENV === 'production') assert.doesNotMatch(html, /noindex/);
  else assert.match(html, /<meta name="robots" content="noindex/);
});

test('pagine legali e 404 esistono in entrambe le lingue', () => {
  for (const p of ['privacy/index.html', 'cookie/index.html', 'en/privacy/index.html', 'en/cookie/index.html', '404.html']) {
    assert.ok(existsSync(new URL(`../dist/${p}`, import.meta.url)), p);
  }
});

test('footer con P.IVA su tutte e due le home', () => {
  assert.match(read('index.html'), /02410590976/);
  assert.match(read('en/index.html'), /02410590976/);
});
```

Run: `pnpm build && pnpm test:build` → Expected: FAIL sui nuovi test.

- [ ] **Step 2: token e stile globale**

`src/styles/tokens.css` — base sobria, unico punto da sostituire col design definitivo:

```css
:root {
  --c-bg: #ffffff;
  --c-surface: #f4f4f2;
  --c-text: #16181a;
  --c-muted: #5b6168;
  --c-line: #dcdcd8;
  --c-accent: #0a5cff;
  --c-accent-text: #ffffff;
  --font: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --fs-1: clamp(2rem, 4.5vw, 3.4rem);
  --fs-2: clamp(1.5rem, 3vw, 2.2rem);
  --fs-3: 1.15rem;
  --space: clamp(3.5rem, 8vw, 6.5rem);
  --radius: 10px;
  --max: 1160px;
}
```

`src/styles/global.css`:

```css
@import './tokens.css';
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: 72px; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body { margin: 0; font-family: var(--font); color: var(--c-text); background: var(--c-bg); line-height: 1.55; }
img, video { max-width: 100%; height: auto; display: block; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--c-accent); outline-offset: 3px; }
.container { width: min(100% - 2rem, var(--max)); margin-inline: auto; }
.section { padding-block: var(--space); }
.section--alt { background: var(--c-surface); }
.section h2 { font-size: var(--fs-2); margin: 0 0 1.5rem; line-height: 1.15; }
.grid { display: grid; gap: 1.25rem; }
.btn { display: inline-block; padding: .8rem 1.4rem; border-radius: 999px; border: 2px solid currentColor; text-decoration: none; font-weight: 600; cursor: pointer; background: none; font: inherit; }
.btn--primary { background: var(--c-accent); border-color: var(--c-accent); color: var(--c-accent-text); }
.btn[disabled] { opacity: .6; cursor: progress; }
.muted { color: var(--c-muted); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
```

- [ ] **Step 3: layout Base**

`src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';
import type { Lang } from '../content';
import { site } from '../../site.config';

interface Props { lang: Lang; title: string; description: string; path: string }
const { lang, title, description, path } = Astro.props;

const origin = Astro.site!.origin;
const urlFor = (l: Lang) => `${origin}${l === 'it' ? '' : '/en'}${path}`;
const indexable = import.meta.env.PUBLIC_SITE_ENV === 'production';
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {!indexable && <meta name="robots" content="noindex, nofollow" />}
    <link rel="canonical" href={urlFor(lang)} />
    <link rel="alternate" hreflang="it" href={urlFor('it')} />
    <link rel="alternate" hreflang="en" href={urlFor('en')} />
    <link rel="alternate" hreflang="x-default" href={urlFor('it')} />
    <link rel="icon" href="/favicon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={urlFor(lang)} />
    <meta property="og:image" content={`${origin}/og.jpg`} />
    <meta property="og:locale" content={lang === 'it' ? 'it_IT' : 'en_GB'} />
    {site.cfAnalyticsToken && (
      <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: site.cfAnalyticsToken })}></script>
    )}
  </head>
  <body>
    <slot />
  </body>
</html>
```

`public/og.jpg`: copia ridimensionata (1200×630) di `docs/contenuti-attuali/media/bikepacking-cicloturismo.jpg`:

```bash
sips -z 630 1200 docs/contenuti-attuali/media/bikepacking-cicloturismo.jpg --out public/og.jpg
cp docs/contenuti-attuali/media/favicon.png public/favicon.png
mkdir -p src/assets/logos && cp docs/contenuti-attuali/media/logo_footer.png src/assets/logos/adventurelab.png
```

(Se `sips -z` deforma le proporzioni, ritagliare prima con `sips -c 1260 2400` sull'originale e poi ridurre.)

- [ ] **Step 4: Nav e Footer**

`src/components/Nav.astro`:

```astro
---
import type { Lang, SiteContent } from '../content';
interface Props { lang: Lang; c: SiteContent; path?: string }
const { lang, c, path = '/' } = Astro.props;
const other = lang === 'it' ? `/en${path}` : path;
const links = [
  ['#territori', c.nav.territories], ['#casi', c.nav.cases], ['#brand', c.nav.brands],
  ['#eventi', c.nav.events], ['#chi-siamo', c.nav.about],
];
const home = lang === 'it' ? '/' : '/en/';
---
<header class="nav">
  <div class="container nav__in">
    <a href={home} class="nav__logo">AdventureLab</a>
    <nav aria-label="Principale">
      <ul class="nav__links">
        {links.map(([href, label]) => <li><a href={`${home}${href}`}>{label}</a></li>)}
      </ul>
    </nav>
    <a href={other} hreflang={lang === 'it' ? 'en' : 'it'} class="nav__lang">{c.langSwitch.label}</a>
    <a href={`${home}#contatti`} class="btn btn--primary nav__cta">{c.nav.cta}</a>
  </div>
</header>
<style>
  .nav { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--c-bg) 92%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--c-line); }
  .nav__in { display: flex; align-items: center; gap: 1.25rem; min-height: 64px; }
  .nav__logo { font-weight: 800; text-decoration: none; margin-right: auto; }
  .nav__links { display: flex; gap: 1.1rem; list-style: none; margin: 0; padding: 0; }
  .nav__links a, .nav__lang { text-decoration: none; font-size: .95rem; }
  .nav__cta { padding: .55rem 1.1rem; }
  @media (max-width: 860px) { .nav__links { display: none; } }
</style>
```

`src/components/Footer.astro`:

```astro
---
import type { Lang, SiteContent } from '../content';
import { site } from '../../site.config';
interface Props { lang: Lang; c: SiteContent }
const { lang, c } = Astro.props;
const p = lang === 'it' ? '' : '/en';
const co = site.company;
---
<footer class="footer">
  <div class="container footer__in">
    <p><strong>{co.name}</strong> — {c.footer.tagline}</p>
    <p class="muted">{co.address} · P. IVA {co.vat} · REA {co.rea} · Capitale sociale {co.capital}</p>
    <p>
      <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> ·
      <a href={co.linkedin} rel="noopener">LinkedIn</a> ·
      <a href={`${p}/privacy/`}>{c.footer.privacy}</a> ·
      <a href={`${p}/cookie/`}>{c.footer.cookie}</a>
    </p>
    <p class="muted">© {new Date().getFullYear()} AdventureLab — {c.footer.rights}</p>
  </div>
</footer>
<style>
  .footer { border-top: 1px solid var(--c-line); padding-block: 2.5rem; font-size: .9rem; }
  .footer p { margin: .35rem 0; }
</style>
```

- [ ] **Step 5: pagine**

`src/pages/index.astro` (provvisoria finché Task 4 non introduce `OnePager`):

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { getContent } from '../content';
const c = getContent('it');
---
<Base lang="it" title={c.meta.title} description={c.meta.description} path="/">
  <Nav lang="it" c={c} />
  <main id="main"><h1 class="container">{c.hero.title}</h1></main>
  <Footer lang="it" c={c} />
</Base>
```

`src/pages/en/index.astro`: identica con `'en'` e import `../../`.

`src/pages/privacy.astro` (le altre tre pagine legali sono uguali cambiando lingua e `privacy`↔`cookie`):

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import { getContent } from '../content';
const c = getContent('it');
---
<Base lang="it" title={`${c.legal.privacyTitle} — AdventureLab`} description={c.meta.description} path="/privacy/">
  <Nav lang="it" c={c} path="/privacy/" />
  <main id="main" class="container section">
    <h1>{c.legal.privacyTitle}</h1>
    {c.legal.privacyBody.map((p) => <p>{p}</p>)}
  </main>
  <Footer lang="it" c={c} />
</Base>
```

- `src/pages/cookie.astro`: come sopra con `cookieTitle`, `cookieBody`, `path="/cookie/"`.
- `src/pages/en/privacy.astro`, `src/pages/en/cookie.astro`: come sopra con `'en'` e import `../../`.

`src/pages/404.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import { getContent } from '../content';
const c = getContent('it');
---
<Base lang="it" title="404 — AdventureLab" description={c.meta.description} path="/404/">
  <main class="container section">
    <h1>Pagina non trovata · Page not found</h1>
    <p><a href="/">Torna alla home</a> · <a href="/en/">Back to home</a></p>
  </main>
</Base>
```

`public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://adventurelab.cc/sitemap-index.xml
```

- [ ] **Step 6: build e test**

Run: `pnpm build && pnpm test:build` → Expected: PASS (tutti). Poi `PUBLIC_SITE_ENV=production pnpm astro build && PUBLIC_SITE_ENV=production pnpm test:build` → Expected: PASS (ramo produzione del test noindex).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: layout, nav, footer, SEO hreflang/noindex e pagine legali"
```

---

### Task 4: Sezioni 1–3 (Hero con video, Numeri, Loghi clienti) + media

**Files:**
- Create: `src/components/OnePager.astro`, `src/components/sections/Hero.astro`, `src/components/sections/Numbers.astro`, `src/components/sections/Clients.astro`, `public/video/hero.mp4`, `public/video/hero-poster.jpg`, `src/assets/clients/*`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`, `tests/build-output.test.mjs`

**Interfaces:**
- Consumes: `getContent`, `Nav`, `Footer`, `Base`.
- Produces: `<OnePager lang>` — pagina completa per lingua; le sezioni successive si aggiungono qui. Ancore: `#territori` (sezione Servizi), `#casi`, `#brand`, `#eventi`, `#chi-siamo`, `#contatti`.

- [ ] **Step 1: test (falliscono)**

```js
test('hero con video muto, in loop, con poster', () => {
  const html = read('index.html');
  assert.match(html, /<video[^>]*\bmuted\b[^>]*>/);
  assert.match(html, /<video[^>]*\bloop\b/);
  assert.match(html, /poster="\/video\/hero-poster\.jpg"/);
});

test('14 loghi clienti con alt non vuoto', () => {
  const html = read('index.html');
  const block = html.split('id="clienti"')[1].split('</section>')[0];
  const alts = [...block.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
  assert.equal(alts.length, 14);
  assert.ok(alts.every((a) => a.trim().length > 0));
});

test('il video pesa meno di 3 MB', async () => {
  const { statSync } = await import('node:fs');
  assert.ok(statSync(new URL('../dist/video/hero.mp4', import.meta.url)).size < 3 * 1024 * 1024);
});
```

Run: `pnpm build && pnpm test:build` → Expected: FAIL.

- [ ] **Step 2: media**

```bash
mkdir -p public/video src/assets/clients
M=docs/contenuti-attuali/media
ffmpeg -y -i $M/Sequenza-01-1.mp4 -an -vf "scale=-2:720" -c:v libx264 -preset slow -crf 30 -movflags +faststart public/video/hero.mp4
ls -l public/video/hero.mp4   # deve essere < 3 MB; altrimenti rifare con -crf 33
ffmpeg -y -ss 1 -i public/video/hero.mp4 -frames:v 1 -q:v 3 public/video/hero-poster.jpg
for f in norway parague-city-tourism lausanne visit-gallivare-2 muenchen-tourismus-brand-design visit-berlin Visit-Rovaniemi Marchio-Regione-Toscana helsinki bastogne visit-tallinn LiveRiga visit-oslo bormio; do cp $M/$f.jpg src/assets/clients/; done
```

- [ ] **Step 3: Hero**

`src/components/sections/Hero.astro`:

```astro
---
import type { SiteContent } from '../../content';
interface Props { c: SiteContent }
const { c } = Astro.props;
---
<section class="hero">
  <video class="hero__video" autoplay muted loop playsinline preload="metadata" poster="/video/hero-poster.jpg" aria-hidden="true">
    <source src="/video/hero.mp4" type="video/mp4" />
  </video>
  <div class="hero__shade"></div>
  <div class="container hero__in">
    <h1>{c.hero.title}</h1>
    <p>{c.hero.subtitle}</p>
    <p class="hero__cta">
      <a href="#contatti" class="btn btn--primary">{c.hero.ctaPrimary}</a>
      <a href="#casi" class="btn">{c.hero.ctaSecondary}</a>
    </p>
  </div>
</section>
<style>
  .hero { position: relative; min-height: min(88vh, 760px); display: grid; align-items: end; color: #fff; overflow: hidden; }
  .hero__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .hero__shade { position: absolute; inset: 0; background: linear-gradient(to top, rgb(0 0 0 / .65), rgb(0 0 0 / .1) 60%); }
  .hero__in { position: relative; padding-block: 4rem; }
  .hero h1 { font-size: var(--fs-1); line-height: 1.05; margin: 0 0 1rem; max-width: 18ch; }
  .hero p { max-width: 52ch; font-size: 1.15rem; }
  .hero__cta { display: flex; gap: .75rem; flex-wrap: wrap; }
</style>
<script>
  // Chi chiede meno movimento vede solo il poster.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll<HTMLVideoElement>('.hero__video').forEach((v) => { v.pause(); v.removeAttribute('autoplay'); });
  }
</script>
```

- [ ] **Step 4: Numeri e Loghi**

`src/components/sections/Numbers.astro`:

```astro
---
import type { SiteContent } from '../../content';
interface Props { c: SiteContent }
const { c } = Astro.props;
---
<section class="numbers" aria-label={c.numbers.label}>
  <ul class="container grid numbers__grid">
    {c.numbers.items.map((n) => <li><strong>{n.value}</strong><span>{n.label}</span></li>)}
  </ul>
</section>
<style>
  .numbers { border-bottom: 1px solid var(--c-line); padding-block: 2.5rem; }
  .numbers__grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); list-style: none; margin: 0 auto; padding: 0; text-align: center; }
  .numbers strong { display: block; font-size: var(--fs-2); }
  .numbers span { color: var(--c-muted); font-size: .95rem; }
</style>
```

`src/components/sections/Clients.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { SiteContent } from '../../content';
interface Props { c: SiteContent }
const { c } = Astro.props;
const files = import.meta.glob<{ default: ImageMetadata }>('../../assets/clients/*.jpg', { eager: true });
const names: Record<string, string> = {
  norway: 'Visit Norway', 'parague-city-tourism': 'Prague City Tourism', lausanne: 'Lausanne Tourisme',
  'visit-gallivare-2': 'Visit Gällivare', 'muenchen-tourismus-brand-design': 'München Tourismus', 'visit-berlin': 'visitBerlin',
  'Visit-Rovaniemi': 'Visit Rovaniemi', 'Marchio-Regione-Toscana': 'Regione Toscana', helsinki: 'Helsinki',
  bastogne: 'Bastogne', 'visit-tallinn': 'Visit Tallinn', LiveRiga: 'Live Riga', 'visit-oslo': 'Visit Oslo', bormio: 'Bormio',
};
const logos = Object.entries(files).map(([path, mod]) => {
  const key = path.split('/').pop()!.replace('.jpg', '');
  return { src: mod.default, alt: names[key] ?? key };
});
---
<section id="clienti" class="section clients">
  <div class="container">
    <h2 class="clients__title">{c.clients.title}</h2>
    <ul class="grid clients__grid">
      {logos.map((l) => <li><Image src={l.src} alt={l.alt} width={160} /></li>)}
    </ul>
  </div>
</section>
<style>
  .clients { padding-block: 3rem; }
  .clients__title { font-size: 1rem !important; text-align: center; color: var(--c-muted); font-weight: 500; }
  .clients__grid { grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); list-style: none; padding: 0; align-items: center; }
  .clients img { margin-inline: auto; max-height: 56px; width: auto; filter: grayscale(1); opacity: .8; }
</style>
```

- [ ] **Step 5: OnePager e pagine**

`src/components/OnePager.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from './Nav.astro';
import Footer from './Footer.astro';
import Hero from './sections/Hero.astro';
import Numbers from './sections/Numbers.astro';
import Clients from './sections/Clients.astro';
import { getContent, type Lang } from '../content';
interface Props { lang: Lang }
const { lang } = Astro.props;
const c = getContent(lang);
---
<Base lang={lang} title={c.meta.title} description={c.meta.description} path="/">
  <Nav lang={lang} c={c} />
  <main id="main">
    <Hero c={c} />
    <Numbers c={c} />
    <Clients c={c} />
  </main>
  <Footer lang={lang} c={c} />
</Base>
```

`src/pages/index.astro`:

```astro
---
import OnePager from '../components/OnePager.astro';
---
<OnePager lang="it" />
```

`src/pages/en/index.astro`: stesso con `../../components/OnePager.astro` e `lang="en"`.

- [ ] **Step 6: build, test, controllo visivo**

Run: `pnpm build && pnpm test:build` → Expected: PASS.
Run: `pnpm dev` e aprire `http://localhost:4321/` e `/en/`: hero con video, numeri, 14 loghi.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: hero con video, numeri e loghi clienti"
```

---

### Task 5: Sezioni 4–9 (Servizi, Metodo, Casi, Brand, Eventi, Chi siamo)

**Files:**
- Create: `src/components/sections/{Services,Process,Cases,Brands,Events,About}.astro`, `src/assets/photos/*`, `src/assets/events/*`
- Modify: `src/components/OnePager.astro`, `tests/build-output.test.mjs`

**Interfaces:**
- Consumes: `SiteContent` (campi `services`, `process`, `cases`, `brands`, `events`, `about`).
- Produces: ancore `#territori`, `#casi`, `#brand`, `#eventi`, `#chi-siamo`.

- [ ] **Step 1: test (falliscono)**

```js
test('tutte le ancore della nav esistono', () => {
  const html = read('index.html');
  for (const id of ['territori', 'casi', 'brand', 'eventi', 'chi-siamo', 'contatti']) {
    if (id === 'contatti') continue; // arriva nel Task 7
    assert.match(html, new RegExp(`id="${id}"`), id);
  }
});

test('ogni caso ha un dialog con titolo e bottone di chiusura', () => {
  const html = read('index.html');
  const dialogs = html.match(/<dialog[^>]*class="case__dialog"/g) ?? [];
  assert.equal(dialogs.length, 3);
});

test('i link agli eventi sono esterni e sicuri', () => {
  const block = read('index.html').split('id="eventi"')[1].split('</section>')[0];
  const links = [...block.matchAll(/<a[^>]*href="(https:[^"]+)"[^>]*>/g)];
  assert.equal(links.length, 6);
  for (const l of links) assert.match(l[0], /rel="noopener"/);
});

test('bottone media kit assente finché il PDF non esiste', () => {
  assert.doesNotMatch(read('index.html'), /media-kit/);
});
```

Run: `pnpm build && pnpm test:build` → Expected: FAIL.

- [ ] **Step 2: media**

```bash
M=docs/contenuti-attuali/media
mkdir -p src/assets/photos src/assets/events
cp $M/escape-slovenia-event-1.jpg src/assets/photos/case-slovenia.jpg
cp $M/tuscany-trail.jpg src/assets/photos/case-toscana.jpg
cp $M/gravel.jpg src/assets/photos/case-trentino.jpg
cp $M/adventure-lab-2-1.jpg src/assets/photos/about.jpg
cp $M/LOGOregistrato-2.png src/assets/events/tuscany-trail.png
cp $M/TheGrandEscape_logo_White.png src/assets/events/the-grand-escape.png
cp $M/Unpaved-Roads_Logo-r.png src/assets/events/unpaved-roads.png
cp $M/large-Modificata.png src/assets/events/northcape4000.png
```

Trentino Gravel e Cycling in Tuscany non hanno un logo nei media: la card mostra il nome in testo (nessun file da cercare ora).

- [ ] **Step 3: Servizi e Metodo**

`src/components/sections/Services.astro`:

```astro
---
import type { SiteContent } from '../../content';
interface Props { c: SiteContent }
const { c } = Astro.props;
---
<section id="territori" class="section">
  <div class="container">
    <h2>{c.services.title}</h2>
    <p class="muted intro">{c.services.intro}</p>
    <ul class="grid services">
      {c.services.items.map((s, i) => (
        <li class="services__card">
          <span class="services__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ul>
  </div>
</section>
<style>
  .intro { max-width: 60ch; margin: -0.75rem 0 2rem; }
  /* auto-fit: la griglia regge da 3 a 6 servizi senza toccare il CSS */
  .services { grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); list-style: none; padding: 0; }
  .services__card { border: 1px solid var(--c-line); border-radius: var(--radius); padding: 1.5rem; }
  .services__n { color: var(--c-accent); font-weight: 700; }
  .services h3 { font-size: var(--fs-3); margin: .5rem 0; }
  .services p { margin: 0; color: var(--c-muted); }
</style>
```

`src/components/sections/Process.astro`:

```astro
---
import type { SiteContent } from '../../content';
interface Props { c: SiteContent }
const { c } = Astro.props;
---
<section class="section section--alt">
  <div class="container">
    <h2>{c.process.title}</h2>
    <ol class="grid process">
      {c.process.steps.map((s) => <li><h3>{s.title}</h3><p class="muted">{s.text}</p></li>)}
    </ol>
  </div>
</section>
<style>
  .process { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); padding: 0; list-style: none; counter-reset: step; }
  .process li { counter-increment: step; border-top: 3px solid var(--c-accent); padding-top: 1rem; }
  .process h3::before { content: counter(step) ' · '; color: var(--c-accent); }
  .process h3 { font-size: var(--fs-3); margin: 0 0 .4rem; }
</style>
```

- [ ] **Step 4: Casi (dialog nativo)**

`src/components/sections/Cases.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { SiteContent } from '../../content';
import slovenia from '../../assets/photos/case-slovenia.jpg';
import toscana from '../../assets/photos/case-toscana.jpg';
import trentino from '../../assets/photos/case-trentino.jpg';
interface Props { c: SiteContent }
const { c } = Astro.props;
// Le foto seguono l'ordine dei casi nei testi; un caso in più senza foto usa la prima.
const photos = [slovenia, toscana, trentino];
---
<section id="casi" class="section">
  <div class="container">
    <h2>{c.cases.title}</h2>
    <ul class="grid cases">
      {c.cases.items.map((k, i) => (
        <li class="case">
          <Image src={photos[i] ?? photos[0]} alt="" widths={[400, 800]} sizes="(max-width: 700px) 100vw, 33vw" />
          <h3>{k.place} · {k.event}</h3>
          <p class="muted">{k.summary}</p>
          <button class="btn" type="button" data-open={`case-${i}`}>{c.cases.open}</button>
          <dialog id={`case-${i}`} class="case__dialog" aria-labelledby={`case-${i}-t`}>
            <h3 id={`case-${i}-t`}>{k.place} · {k.event}</h3>
            <p>{k.body}</p>
            <ul class="case__stats">{k.stats.map((s) => <li><strong>{s.value}</strong> {s.label}</li>)}</ul>
            <form method="dialog"><button class="btn">{c.cases.close}</button></form>
          </dialog>
        </li>
      ))}
    </ul>
  </div>
</section>
<style>
  .cases { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); list-style: none; padding: 0; }
  .case img { border-radius: var(--radius); aspect-ratio: 4/3; object-fit: cover; }
  .case h3 { font-size: var(--fs-3); margin: 1rem 0 .3rem; }
  .case__dialog { max-width: 640px; border: 0; border-radius: var(--radius); padding: 2rem; }
  .case__dialog::backdrop { background: rgb(0 0 0 / .5); }
  .case__stats { list-style: none; padding: 0; display: grid; gap: .4rem; }
</style>
<script>
  document.querySelectorAll<HTMLButtonElement>('[data-open]').forEach((b) =>
    b.addEventListener('click', () => (document.getElementById(b.dataset.open!) as HTMLDialogElement).showModal()),
  );
</script>
```

- [ ] **Step 5: Brand, Eventi, Chi siamo**

`src/components/sections/Brands.astro` (il bottone media kit si rende solo se esiste `public/media-kit.pdf`):

```astro
---
import { existsSync } from 'node:fs';
import type { Lang, SiteContent } from '../../content';
interface Props { lang: Lang; c: SiteContent }
const { lang, c } = Astro.props;
const kit = lang === 'it' ? 'media-kit.pdf' : 'media-kit-en.pdf';
const hasKit = existsSync(new URL(`../../../public/${kit}`, import.meta.url));
---
<section id="brand" class="section section--alt">
  <div class="container">
    <h2>{c.brands.title}</h2>
    <div class="grid brands">
      <div><h3>{c.brands.audienceTitle}</h3><p>{c.brands.audience}</p></div>
      <div>
        <h3>{c.brands.formatsTitle}</h3><p>{c.brands.formats}</p>
        {hasKit && <a class="btn" href={`/${kit}`} download>{c.brands.mediaKit}</a>}
      </div>
    </div>
  </div>
</section>
<style>
  .brands { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
  .brands h3 { font-size: var(--fs-3); }
</style>
```

`src/components/sections/Events.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { SiteContent } from '../../content';
import tt from '../../assets/events/tuscany-trail.png';
import tge from '../../assets/events/the-grand-escape.png';
import ur from '../../assets/events/unpaved-roads.png';
import nc from '../../assets/events/northcape4000.png';
interface Props { c: SiteContent }
const { c } = Astro.props;
const logos: Record<string, ImageMetadata> = { 'Tuscany Trail': tt, 'The Grand Escape': tge, 'Unpaved Roads': ur, NorthCape4000: nc };
---
<section id="eventi" class="section">
  <div class="container">
    <h2>{c.events.title}</h2>
    <ul class="grid events">
      {c.events.items.map((e) => (
        <li class="event">
          <div class="event__logo">
            {logos[e.name] ? <Image src={logos[e.name]} alt={e.name} height={56} /> : <strong>{e.name}</strong>}
          </div>
          <p>{e.line}</p>
          <p class="muted">{e.stat}</p>
          <a href={e.url} rel="noopener" target="_blank">{e.url.replace(/^https:\/\/|\/.*$/g, '')} ↗</a>
        </li>
      ))}
    </ul>
  </div>
</section>
<style>
  .events { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); list-style: none; padding: 0; }
  .event { border: 1px solid var(--c-line); border-radius: var(--radius); padding: 1.25rem; }
  /* alcuni loghi sono bianchi: sfondo scuro fisso dietro tutti */
  .event__logo { background: #16181a; color: #fff; border-radius: 6px; height: 88px; display: grid; place-items: center; padding: .75rem; }
  .event__logo img { max-height: 56px; width: auto; }
</style>
```

`src/components/sections/About.astro`:

```astro
---
import { Image } from 'astro:assets';
import type { SiteContent } from '../../content';
import photo from '../../assets/photos/about.jpg';
interface Props { c: SiteContent }
const { c } = Astro.props;
---
<section id="chi-siamo" class="section section--alt">
  <div class="container grid about">
    <div><h2>{c.about.title}</h2>{c.about.body.map((p) => <p>{p}</p>)}</div>
    <Image src={photo} alt="" widths={[500, 900]} sizes="(max-width: 800px) 100vw, 50vw" />
  </div>
</section>
<style>
  .about { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); align-items: center; }
  .about img { border-radius: var(--radius); }
</style>
```

- [ ] **Step 6: aggiungere le sezioni a OnePager**

In `src/components/OnePager.astro`, dopo `<Clients c={c} />`:

```astro
    <Services c={c} />
    <Process c={c} />
    <Cases c={c} />
    <Brands lang={lang} c={c} />
    <Events c={c} />
    <About c={c} />
```

con gli import corrispondenti in testa al frontmatter.

- [ ] **Step 7: build, test, controllo visivo**

Run: `pnpm build && pnpm test:build` → Expected: PASS.
In `pnpm dev`: aprire e chiudere un caso con mouse e con `Esc`; il focus torna al bottone.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: sezioni servizi, metodo, casi, brand, eventi e chi siamo"
```

---

### Task 6: Worker `adventurelab-lead`

**Files:**
- Create: `workers/lead/wrangler.toml`, `workers/lead/tsconfig.json`, `workers/lead/src/index.js`, `workers/lead/test/index.test.mjs`

**Interfaces:**
- Produces (HTTP): `POST /lead` con corpo JSON `{ name: string, email: string, org: string, type: 'territorio'|'brand'|'altro', consent: boolean, optin: boolean, lang: 'it'|'en', website: string, turnstileToken: string }` → `200 {ok:true}` oppure `{ok:false, error}` con codici `origin_not_allowed` (403), `method_not_allowed` (405), `rate_limited` (429), `invalid_json` (400), `invalid_email` (400), `consent_required` (400), `turnstile_misconfigured` (500), `turnstile_failed` (403), `brevo_list_not_configured` (500), `brevo_key_missing` (500), `brevo_error` (502), `unexpected` (500).
- Produces (JS, per i test): `export function normalize(body)` → `{ name, email, org, type, consent, optin, lang, honeypot }`; `export function brevoPayload(n, listId, now)` → oggetto per `POST /v3/contacts`; `export default { fetch(request, env) }`.

- [ ] **Step 1: test (falliscono)**

`workers/lead/test/index.test.mjs`:

```js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { normalize, brevoPayload } from '../src/index.js';

const ORIGIN = 'https://adventurelab.cc';
let calls;
const env = (over = {}) => ({
  ALLOWED_ORIGINS: `${ORIGIN},http://localhost:4321`,
  BREVO_LIST_ID: '77',
  BREVO_API_KEY: 'k',
  TURNSTILE_REQUIRED: 'true',
  TURNSTILE_SECRET: 's',
  RATE_LIMITER: { limit: async () => ({ success: true }) },
  ...over,
});
const req = (body, origin = ORIGIN, method = 'POST') =>
  new Request('https://w.example/lead', {
    method,
    headers: { origin, 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4' },
    body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });
const good = { name: 'Àlice D’Amico', email: ' A+b@Visit.IT ', org: 'Visit Prato', type: 'territorio', consent: true, optin: false, lang: 'it', website: '', turnstileToken: 't' };

beforeEach(() => {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('turnstile')) return Response.json({ success: true });
    return new Response(null, { status: 201 });
  };
});

test('normalize: email minuscola e senza spazi, tipo fuori lista → altro, lingua ignota → it', () => {
  const n = normalize({ ...good, type: 'pippo', lang: 'de' });
  assert.equal(n.email, 'a+b@visit.it');
  assert.equal(n.type, 'altro');
  assert.equal(n.lang, 'it');
});

test('brevoPayload: lista, attributi e LINGUA numerica', () => {
  const p = brevoPayload(normalize({ ...good, lang: 'en', optin: true }), 77, new Date('2026-10-07T10:00:00Z'));
  assert.deepEqual(p, {
    email: 'a+b@visit.it',
    updateEnabled: true,
    listIds: [77],
    attributes: {
      FIRSTNAME: 'Àlice D’Amico',
      LINGUA: 2,
      SIGNUP_SOURCE: 'adventurelab:contatti',
      ADVLAB_TIPO: 'territorio',
      ADVLAB_ENTE: 'Visit Prato',
      ADVLAB_OPTIN: true,
      ADVLAB_LAST_SIGNUP_AT: '2026-10-07T10:00:00.000Z',
    },
  });
});

test('origine non ammessa → 403 senza toccare Brevo', async () => {
  const res = await worker.fetch(req(good, 'https://evil.example'), env());
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});

test('OPTIONS da origine ammessa → 204 con CORS', async () => {
  const res = await worker.fetch(req(null, ORIGIN, 'OPTIONS'), env());
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
});

test('rate limit superato → 429', async () => {
  const res = await worker.fetch(req(good), env({ RATE_LIMITER: { limit: async () => ({ success: false }) } }));
  assert.equal(res.status, 429);
});

test('JSON rotto → 400 invalid_json', async () => {
  const res = await worker.fetch(req('{nope'), env());
  assert.equal((await res.json()).error, 'invalid_json');
});

test('honeypot compilato → 200 finto, niente Brevo', async () => {
  const res = await worker.fetch(req({ ...good, website: 'x' }), env());
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('email non valida → 400 invalid_email', async () => {
  const res = await worker.fetch(req({ ...good, email: 'nope' }), env());
  assert.equal((await res.json()).error, 'invalid_email');
});

test('senza consenso privacy → 400 consent_required', async () => {
  const res = await worker.fetch(req({ ...good, consent: false }), env());
  assert.equal((await res.json()).error, 'consent_required');
});

test('Turnstile obbligatorio senza secret → 500 fail-closed', async () => {
  const res = await worker.fetch(req(good), env({ TURNSTILE_SECRET: '' }));
  assert.equal((await res.json()).error, 'turnstile_misconfigured');
});

test('Turnstile negativo → 403 e niente Brevo', async () => {
  globalThis.fetch = async (url) => (calls.push({ url: String(url) }), Response.json({ success: false }));
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 403);
  assert.ok(calls.every((c) => !c.url.includes('brevo')));
});

test('lista "0" → 500 brevo_list_not_configured', async () => {
  const res = await worker.fetch(req(good), env({ BREVO_LIST_ID: '0' }));
  assert.equal((await res.json()).error, 'brevo_list_not_configured');
});

test('invio valido → 200 e una chiamata Brevo con api-key', async () => {
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 200);
  const b = calls.find((c) => c.url === 'https://api.brevo.com/v3/contacts');
  assert.equal(b.init.headers['api-key'], 'k');
  assert.equal(JSON.parse(b.init.body).attributes.ADVLAB_TIPO, 'territorio');
});

test('contatto già esistente (duplicate_parameter) → 200', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile')
      ? Response.json({ success: true })
      : new Response('{"code":"duplicate_parameter"}', { status: 400 });
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 200);
});

test('Brevo 401 (es. IP non autorizzato) → 502 brevo_error', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile') ? Response.json({ success: true }) : new Response('unauthorized', { status: 401 });
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'brevo_error');
});
```

Run: `node --test workers/lead/test/` → Expected: FAIL (modulo inesistente).

- [ ] **Step 2: implementazione**

`workers/lead/src/index.js` — ricalca `~/Repo/ttrefactor/workers/subscribe/src/index.js`, con normalizzazione e payload estratti per i test:

```js
/**
 * adventurelab-lead — gira il form contatti di adventurelab.cc a Brevo.
 *
 * Il sito è statico; questa è l'unica logica lato server e vive qui, con i suoi
 * segreti e il suo deploy. Ricalca tt-subscribe (~/Repo/ttrefactor/workers/subscribe).
 *
 * Deploy:  cd workers/lead && npx wrangler deploy --config wrangler.toml
 * Segreti: npx wrangler secret put BREVO_API_KEY --config wrangler.toml
 *          npx wrangler secret put TURNSTILE_SECRET --config wrangler.toml
 */

const BREVO_CONTACTS = 'https://api.brevo.com/v3/contacts';
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TYPES = ['territorio', 'brand', 'altro'];

const allowedOrigins = (env) => (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

function corsHeaders(origin) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

/** Taglia i campi a una lunghezza ragionevole: Brevo rifiuta testi enormi, un bot li manda. */
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export function normalize(body) {
  return {
    name: clip(body.name, 120),
    email: clip(body.email, 254).toLowerCase(),
    org: clip(body.org, 160),
    // Un valore fuori lista diventa "altro": in Brevo ADVLAB_TIPO è una categoria
    // e un valore sconosciuto verrebbe rifiutato o finirebbe in un segmento fantasma.
    type: TYPES.includes(body.type) ? body.type : 'altro',
    consent: body.consent === true,
    optin: body.optin === true,
    lang: body.lang === 'en' ? 'en' : 'it',
    honeypot: clip(body.website, 200),
  };
}

export function brevoPayload(n, listId, now = new Date()) {
  return {
    email: n.email,
    // Chi compila due volte va aggiornato, non rifiutato.
    updateEnabled: true,
    listIds: [listId],
    attributes: {
      FIRSTNAME: n.name,
      // Attributo di categoria già esistente nell'account: 1 = Ita, 2 = Eng
      // (stessa convenzione di tt-subscribe e dei sync verso il database).
      LINGUA: n.lang === 'en' ? 2 : 1,
      SIGNUP_SOURCE: 'adventurelab:contatti',
      ADVLAB_TIPO: n.type,
      ADVLAB_ENTE: n.org,
      ADVLAB_OPTIN: n.optin,
      // Testo riscritto a ogni invio: è l'aggancio delle automazioni, come TT_LAST_SIGNUP_AT.
      ADVLAB_LAST_SIGNUP_AT: now.toISOString(),
    },
  };
}

async function verifyTurnstile(env, token, ip) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form });
  const data = await res.json();
  return data.success === true;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') ?? '';
    const originOk = allowedOrigins(env).includes(origin);
    const echo = originOk ? origin : '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: originOk ? 204 : 403, headers: corsHeaders(echo) });
    }
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, echo);
    if (!originOk) return json({ ok: false, error: 'origin_not_allowed' }, 403, echo);

    try {
      const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
      const { success: withinLimit } = await env.RATE_LIMITER.limit({ key: ip });
      if (!withinLimit) return json({ ok: false, error: 'rate_limited' }, 429, echo);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: 'invalid_json' }, 400, echo);
      }

      const n = normalize(body ?? {});
      // Solo un bot compila il campo invisibile: 200 finto, senza dirgli che è stato scoperto.
      if (n.honeypot) return json({ ok: true }, 200, echo);
      if (!EMAIL_RE.test(n.email)) return json({ ok: false, error: 'invalid_email' }, 400, echo);
      if (!n.consent) return json({ ok: false, error: 'consent_required' }, 400, echo);

      if (env.TURNSTILE_REQUIRED === 'true') {
        if (!env.TURNSTILE_SECRET) return json({ ok: false, error: 'turnstile_misconfigured' }, 500, echo);
        const token = String(body.turnstileToken ?? '');
        if (!token || !(await verifyTurnstile(env, token, ip))) {
          return json({ ok: false, error: 'turnstile_failed' }, 403, echo);
        }
      }

      const listId = Number(env.BREVO_LIST_ID);
      if (!Number.isInteger(listId) || listId <= 0) {
        return json({ ok: false, error: 'brevo_list_not_configured' }, 500, echo);
      }
      if (!env.BREVO_API_KEY) return json({ ok: false, error: 'brevo_key_missing' }, 500, echo);

      const res = await fetch(BREVO_CONTACTS, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify(brevoPayload(n, listId)),
      });

      if (!res.ok && res.status !== 204) {
        const detail = await res.text();
        if (!(res.status === 400 && detail.includes('duplicate_parameter'))) {
          console.error(`[lead] Brevo ${res.status}: ${detail}`);
          return json({ ok: false, error: 'brevo_error', status: res.status }, 502, echo);
        }
      }
      return json({ ok: true }, 200, echo);
    } catch (err) {
      console.error('[lead]', err);
      return json({ ok: false, error: 'unexpected' }, 500, echo);
    }
  },
};
```

Run: `node --test workers/lead/test/` → Expected: PASS (15 test).

- [ ] **Step 3: configurazione**

`workers/lead/wrangler.toml`:

```toml
name = "adventurelab-lead"
main = "src/index.js"
compatibility_date = "2026-10-01"

# Account aziendale Adventure Lab: senza questa riga wrangler chiede quale account
# usare e in modo non interattivo si ferma.
account_id = "fe10f419d554dfcaca3986a6e7056944"

[vars]
# Host da cui il form gira davvero. L'URL workers.dev del sito si aggiunge al primo deploy del sito.
ALLOWED_ORIGINS = "https://adventurelab.cc,https://www.adventurelab.cc,http://localhost:4321"

# Lista Brevo di destinazione. "0" = segnaposto voluto: il worker rifiuta ogni invio
# con brevo_list_not_configured finché la lista non esiste (spec §5).
BREVO_LIST_ID = "0"

# Fail-closed. Sull'URL workers.dev il widget Turnstile non si rende (dominio non
# registrato): in collaudo lì si usa la coppia di chiavi di test di Turnstile.
TURNSTILE_REQUIRED = "true"

# Segreti (mai qui): BREVO_API_KEY, TURNSTILE_SECRET — con `wrangler secret put`.

[[ratelimits]]
name = "RATE_LIMITER"
namespace_id = "1101"

  [ratelimits.simple]
  limit = 5
  period = 60
```

`workers/lead/tsconfig.json`: copia di `~/Repo/ttrefactor/workers/subscribe/tsconfig.json` (stesse opzioni, `include: ["src/**/*.js"]`).

Run: `pnpm check:worker` → Expected: nessun errore.

- [ ] **Step 4: prova locale end-to-end del worker**

```bash
cd workers/lead
printf 'BREVO_API_KEY=dummy\nTURNSTILE_SECRET=1x0000000000000000000000000000000AA\n' > .dev.vars
npx wrangler dev --config wrangler.toml --port 8787 &
curl -s -X POST http://localhost:8787/lead -H 'origin: http://localhost:4321' -H 'content-type: application/json' \
  -d '{"name":"Test","email":"test@example.com","org":"X","type":"territorio","consent":true,"lang":"it","turnstileToken":"XXXX.DUMMY.TOKEN.XXXX"}'
```

Expected: `{"ok":false,"error":"brevo_list_not_configured"}` (il secret di test `1x00…AA` fa sempre passare Turnstile; la lista è ancora "0"). Fermare `wrangler dev`. `.dev.vars` è già in `.gitignore`.

- [ ] **Step 5: Commit**

```bash
git add workers/lead && git commit -m "feat: worker adventurelab-lead (form → Brevo) con test"
```

---

### Task 7: Sezione Contatti — form → worker → Calendly

**Files:**
- Create: `src/lib/calendly.ts`, `src/lib/submit-lead.ts`, `src/components/sections/Contact.astro`, `tests/calendly.test.mjs`, `tests/submit-lead.test.mjs`
- Modify: `src/components/OnePager.astro`, `tests/build-output.test.mjs`

**Interfaces:**
- Consumes: `site.leadEndpoint`, `site.calendlyUrl`, `site.turnstileSiteKey`, `site.contactEmail`; contratto HTTP del Task 6.
- Produces: `calendlyUrl(base: string, d: { name: string; email: string; org: string }): string` (stringa vuota se `base` è vuota); `submitLead(endpoint: string, payload: object, timeoutMs = 8000): Promise<{ ok: true } | { ok: false; error: string }>` — non lancia mai.

- [ ] **Step 1: test di calendlyUrl (falliscono)**

`tests/calendly.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendlyUrl } from '../src/lib/calendly.ts';

test('precompila nome, email e ente codificati', () => {
  const u = new URL(calendlyUrl('https://calendly.com/adventurelab/call-30', { name: 'Àlice D’Amico', email: 'a+b@visit.it', org: 'Visit & Co' }));
  assert.equal(u.searchParams.get('name'), 'Àlice D’Amico');
  assert.equal(u.searchParams.get('email'), 'a+b@visit.it');
  assert.equal(u.searchParams.get('a1'), 'Visit & Co');
  assert.equal(u.searchParams.get('hide_gdpr_banner'), '1');
});

test('conserva i parametri già presenti nell’URL base', () => {
  const u = new URL(calendlyUrl('https://calendly.com/x/y?month=2026-11', { name: 'A', email: 'a@b.it', org: '' }));
  assert.equal(u.searchParams.get('month'), '2026-11');
  assert.equal(u.searchParams.has('a1'), false);
});

test('base vuota → stringa vuota', () => {
  assert.equal(calendlyUrl('', { name: 'A', email: 'a@b.it', org: 'X' }), '');
});
```

Run: `node --test tests/calendly.test.mjs` → Expected: FAIL.

- [ ] **Step 2: implementazione**

`src/lib/calendly.ts`:

```ts
/**
 * URL dell'embed Calendly con i dati del form già dentro, così chi ha appena
 * compilato non li riscrive. `a1` è la prima domanda personalizzata dell'evento
 * Calendly: va configurata come "Ente o azienda".
 */
export function calendlyUrl(base: string, d: { name: string; email: string; org: string }): string {
  if (!base) return '';
  const u = new URL(base);
  if (d.name) u.searchParams.set('name', d.name);
  if (d.email) u.searchParams.set('email', d.email);
  if (d.org) u.searchParams.set('a1', d.org);
  u.searchParams.set('hide_gdpr_banner', '1');
  return u.toString();
}
```

Run: `node --test tests/calendly.test.mjs` → Expected: PASS.

- [ ] **Step 3: test di submitLead (falliscono)**

`tests/submit-lead.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitLead } from '../src/lib/submit-lead.ts';

test('risposta ok → {ok:true}', async () => {
  globalThis.fetch = async () => Response.json({ ok: true });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: true });
});

test('errore del worker → {ok:false, error} col codice', async () => {
  globalThis.fetch = async () => Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'invalid_email' });
});

test('rete giù → {ok:false, error:"network"} senza lanciare', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'network' });
});

test('worker che non risponde → timeout entro il limite', async () => {
  globalThis.fetch = (_u, init) =>
    new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
  const t0 = Date.now();
  assert.deepEqual(await submitLead('https://w/lead', {}, 50), { ok: false, error: 'timeout' });
  assert.ok(Date.now() - t0 < 1000);
});

test('endpoint vuoto → {ok:false, error:"not_configured"} senza chiamate', async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; return Response.json({ ok: true }); };
  assert.deepEqual(await submitLead('', {}), { ok: false, error: 'not_configured' });
  assert.equal(called, false);
});

test('risposta 502 non JSON → {ok:false, error:"http_502"}', async () => {
  globalThis.fetch = async () => new Response('Bad gateway', { status: 502 });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'http_502' });
});
```

Run: `node --test tests/submit-lead.test.mjs` → Expected: FAIL.

- [ ] **Step 4: implementazione**

`src/lib/submit-lead.ts`:

```ts
export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * Manda il form al worker. Non lancia mai: chi chiama decide cosa mostrare, e in
 * ogni caso apre Calendly (spec §5 — una call non si perde per un nostro guasto).
 */
export async function submitLead(endpoint: string, payload: object, timeoutMs = 8000): Promise<LeadResult> {
  if (!endpoint) return { ok: false, error: 'not_configured' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: typeof data?.error === 'string' ? data.error : `http_${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error)?.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
```

Run: `node --test tests/` → Expected: PASS.

- [ ] **Step 5: test sull'output (falliscono)**

In `tests/build-output.test.mjs`, togliere l'eccezione `if (id === 'contatti') continue;` dal test delle ancore e aggiungere:

```js
test('form contatti: campi obbligatori, honeypot nascosto, lingua giusta', () => {
  for (const [file, lang] of [['index.html', 'it'], ['en/index.html', 'en']]) {
    const block = read(file).split('id="contatti"')[1].split('</section>')[0];
    for (const n of ['name', 'email', 'org', 'type', 'consent', 'optin', 'website']) assert.match(block, new RegExp(`name="${n}"`), `${file}: ${n}`);
    assert.match(block, /type="email"[^>]*required|required[^>]*type="email"/);
    assert.match(block, new RegExp(`data-lang="${lang}"`));
    assert.match(block, /mailto:info@adventurelab\.cc/);
    assert.match(block, /<noscript>/);
  }
});
```

Run: `pnpm build && pnpm test:build` → Expected: FAIL.

- [ ] **Step 6: componente Contact**

`src/components/sections/Contact.astro`:

```astro
---
import type { Lang, SiteContent } from '../../content';
import { site } from '../../../site.config';
interface Props { lang: Lang; c: SiteContent }
const { lang, c } = Astro.props;
const f = c.contact.fields;
const p = lang === 'it' ? '' : '/en';
---
<section id="contatti" class="section section--alt">
  <div class="container contact">
    <h2>{c.contact.title}</h2>
    <p class="muted">{c.contact.intro}</p>

    <form class="contact__form" data-endpoint={site.leadEndpoint} data-calendly={site.calendlyUrl} data-lang={lang} novalidate>
      <label>{f.name}<input name="name" autocomplete="name" required maxlength="120" /></label>
      <label>{f.email}<input name="email" type="email" autocomplete="email" required maxlength="254" /></label>
      <label>{f.org}<input name="org" autocomplete="organization" maxlength="160" /></label>
      <fieldset>
        <legend>{f.type}</legend>
        <label><input type="radio" name="type" value="territorio" checked /> {f.typeTerritory}</label>
        <label><input type="radio" name="type" value="brand" /> {f.typeBrand}</label>
        <label><input type="radio" name="type" value="altro" /> {f.typeOther}</label>
      </fieldset>
      <label class="check"><input type="checkbox" name="consent" required /> <a href={`${p}/privacy/`}>{c.contact.privacy}</a></label>
      <label class="check"><input type="checkbox" name="optin" /> {c.contact.optin}</label>
      <!-- trappola per i bot: invisibile e fuori dal tab -->
      <label class="sr-only" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
      {site.turnstileSiteKey && <div class="cf-turnstile" data-sitekey={site.turnstileSiteKey} data-appearance="interaction-only"></div>}
      <p class="contact__error" role="alert" hidden></p>
      <button class="btn btn--primary" type="submit" data-label={c.contact.submit} data-sending={c.contact.sending}>{c.contact.submit}</button>
    </form>

    <div class="contact__calendly" hidden>
      <h3>{c.contact.calendlyTitle}</h3>
      <iframe title={c.contact.calendlyTitle} loading="lazy"></iframe>
    </div>

    <p class="contact__mail">{c.contact.fallback} <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
    <noscript><p>{c.contact.fallback} <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p></noscript>

    <script type="application/json" class="contact__errors" set:html={JSON.stringify(c.contact.errors)} />
  </div>
</section>
<style>
  .contact { max-width: 720px; }
  .contact__form { display: grid; gap: 1rem; }
  .contact__form label { display: grid; gap: .3rem; font-weight: 600; }
  .contact__form input:not([type=radio]):not([type=checkbox]) { font: inherit; padding: .7rem .8rem; border: 1px solid var(--c-line); border-radius: 8px; }
  .contact__form fieldset { border: 0; padding: 0; display: flex; gap: 1.25rem; flex-wrap: wrap; }
  .contact__form legend { font-weight: 600; margin-bottom: .3rem; }
  .contact__form fieldset label, .check { display: flex !important; gap: .5rem; align-items: center; font-weight: 400 !important; }
  .contact__error { color: #b42318; margin: 0; }
  .contact__calendly iframe { width: 100%; height: 720px; border: 0; }
</style>
<script>
  import { submitLead } from '../../lib/submit-lead';
  import { calendlyUrl } from '../../lib/calendly';

  declare global { interface Window { turnstile?: { reset: (el?: Element) => void } } }

  const form = document.querySelector<HTMLFormElement>('.contact__form');
  if (form) {
    // Turnstile: lo script si carica una volta sola, solo se il widget c'è.
    if (form.querySelector('.cf-turnstile')) {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true; s.defer = true;
      document.head.append(s);
    }
    const root = form.closest('section')!;
    const errorsMap = JSON.parse(root.querySelector('.contact__errors')!.textContent!);
    const errorEl = form.querySelector<HTMLElement>('.contact__error')!;
    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const calendly = root.querySelector<HTMLElement>('.contact__calendly')!;

    const showError = (msg: string) => { errorEl.textContent = msg; errorEl.hidden = false; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btn.disabled) return; // doppio clic: un solo invio
      errorEl.hidden = true;
      const d = new FormData(form);
      const email = String(d.get('email') ?? '').trim();
      if (!form.querySelector<HTMLInputElement>('[name=email]')!.checkValidity()) return showError(errorsMap.invalid_email);
      if (!d.get('consent')) return showError(errorsMap.consent_required);

      btn.disabled = true; btn.textContent = btn.dataset.sending!;
      const data = { name: String(d.get('name') ?? '').trim(), email, org: String(d.get('org') ?? '').trim() };
      const res = await submitLead(form.dataset.endpoint!, {
        ...data,
        type: d.get('type'),
        consent: true,
        optin: d.get('optin') === 'on',
        lang: form.dataset.lang,
        website: d.get('website') ?? '',
        turnstileToken: d.get('cf-turnstile-response') ?? '',
      });

      // Errori correggibili dall'utente: resta sul form. Il token Turnstile è
      // già consumato, quindi va rigenerato prima del prossimo invio.
      if (!res.ok && (res.error === 'invalid_email' || res.error === 'consent_required')) {
        const w = form.querySelector('.cf-turnstile'); if (w) window.turnstile?.reset(w);
        btn.disabled = false; btn.textContent = btn.dataset.label!;
        return showError(errorsMap[res.error]);
      }

      // Tutto il resto (ok, worker giù, timeout, Brevo in errore): si va avanti a Calendly.
      const url = calendlyUrl(form.dataset.calendly!, data);
      if (!res.ok) { console.warn('[lead]', res.error); showError(errorsMap.generic); }
      form.hidden = res.ok; // in caso di errore il messaggio resta visibile sopra Calendly
      if (url) {
        calendly.querySelector('iframe')!.src = url;
        calendly.hidden = false;
        calendly.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
      if (!res.ok) { btn.hidden = true; }
    });
  }
</script>
```

Nota per l'implementatore: l'iframe punta direttamente all'URL Calendly con i parametri, senza lo script `widget.js` di Calendly (un iframe semplice evita script di terze parti e cookie prima della scelta). Se Calendly rifiuta l'iframe senza `embed_domain`, aggiungere in `calendlyUrl` `embed_domain=<host>` ed `embed_type=Inline` e aggiornare il test.

Aggiungere `<Contact lang={lang} c={c} />` in `OnePager.astro` dopo `<About c={c} />`, con import.

- [ ] **Step 7: build e test**

Run: `pnpm test && pnpm build && pnpm test:build` → Expected: PASS.

- [ ] **Step 8: verifica manuale in locale**

1. In `site.config.ts` impostare temporaneamente `leadEndpoint: 'http://localhost:8787/lead'` e `calendlyUrl` con l'URL di prova di Francesco (se non c'è ancora: lasciarlo vuoto e verificare che compaia solo l'email).
2. Avviare il worker come nel Task 6 step 4 (`.dev.vars` con secret Turnstile di test) e `pnpm dev`.
3. Verificare: (a) email sbagliata → messaggio, bottone di nuovo attivo; (b) secondo invio dopo l'errore funziona (token rigenerato); (c) doppio clic veloce → nel log di `wrangler dev` una sola richiesta; (d) worker spento → dopo ≤ 8 s compare il messaggio generico e Calendly si apre comunque; (e) da `/en/` il corpo della richiesta ha `"lang":"en"`; (f) nome con accenti arriva intatto nei campi di Calendly.
4. Rimettere `leadEndpoint: ''` prima del commit (si riempie al deploy, Task 8).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: sezione contatti con form, worker e Calendly precompilato"
```

---

### Task 8: Collaudo, anteprima `workers.dev` e runbook DNS

**Files:**
- Create: `docs/dns-cutover.md`, `README.md`
- Modify: `site.config.ts` (endpoint worker reale), `workers/lead/wrangler.toml` (`ALLOWED_ORIGINS` con l'URL di anteprima)

**Interfaces:**
- Consumes: tutto il sito e il worker.
- Produces: URL di anteprima funzionante; runbook per il passaggio DNS.

- [ ] **Step 1: controlli automatici**

Run: `pnpm test && pnpm check && pnpm check:worker && pnpm build && pnpm test:build` → Expected: tutto verde.
Run: `STRICT_CONTENT=1 pnpm check:content` → Expected: FAIL con l'elenco dei TODO (è il comportamento voluto finché i testi non arrivano; riportare l'elenco a Francesco).

- [ ] **Step 2: accessibilità e linee guida**

Avviare `pnpm preview`, poi invocare la skill `web-design-guidelines` su `src/components/**` e correggere i problemi trovati (contrasto, focus, label, `prefers-reduced-motion`). Lighthouse mobile su `http://localhost:4321/` e `/en/` (Chrome DevTools MCP `lighthouse_audit`): obiettivo ≥ 90 nelle quattro categorie. Commit delle correzioni: `git commit -m "fix: accessibilità e performance dopo audit"`.

- [ ] **Step 3: chiedere conferma a Francesco per le azioni esterne**

Prima di proseguire, chiedere esplicitamente conferma per: creare il repo `advlabbik/adventurelab-site` e fare push; `wrangler deploy` del sito e del worker sull'account Adventure Lab; `wrangler secret put` (BREVO_API_KEY dal Keychain `brevo-api-key`, TURNSTILE_SECRET letto via API dal widget). Non procedere senza un sì.

- [ ] **Step 4: deploy di anteprima (dopo il sì)**

```bash
gh repo create advlabbik/adventurelab-site --private --source . --push
pnpm build && npx wrangler deploy                                  # sito → adventurelab-site.<sub>.workers.dev
cd workers/lead
npx wrangler deploy --config wrangler.toml                         # worker → adventurelab-lead.<sub>.workers.dev
security find-generic-password -s brevo-api-key -w | npx wrangler secret put BREVO_API_KEY --config wrangler.toml
```

Il secret Turnstile reale non serve ancora (il widget non si rende su `workers.dev`): per il collaudo sull'anteprima impostare `TURNSTILE_REQUIRED = "false"` solo in questo deploy, e annotarlo nel README come da riportare a `"true"` al passaggio DNS. Aggiungere l'URL del sito di anteprima ad `ALLOWED_ORIGINS`, mettere l'URL del worker + `/lead` in `site.config.ts` (`leadEndpoint`), rideployare sito e worker. Commit: `git commit -m "chore: endpoint del worker e origini di anteprima"`.

- [ ] **Step 5: collaudo sull'anteprima**

Ripetere le verifiche (a)–(f) del Task 7 step 8 sull'URL `workers.dev`. Finché `BREVO_LIST_ID = "0"` l'invio dà `brevo_list_not_configured` e Calendly si apre comunque: è il comportamento atteso. Quando Francesco crea lista e attributi `ADVLAB_*` (parte "Brevo a parte"), impostare l'ID, rideployare il worker e rifare un invio con `test+advlab@adventurelab.cc`: verificare su Brevo lista e attributi, poi **mettere il contatto in blacklist (non cancellarlo)**.

- [ ] **Step 6: runbook DNS**

`docs/dns-cutover.md`:

```markdown
# Passaggio DNS adventurelab.cc → Cloudflare

Prerequisito: dominio rinnovato e lontano dalla scadenza (verificare con `whois adventurelab.cc | grep -i expir`).

1. Inventario completo dei record su Aruba (pannello DNS): A, AAAA, CNAME, MX, TXT (SPF, verifica Google, eventuali DKIM `google._domainkey`, record Brevo `brevo-code`, `_dmarc`). Salvare l'elenco qui sotto prima di toccare qualsiasi cosa.
2. Cloudflare (account Adventure Lab) → Add site `adventurelab.cc` → piano Free. Confrontare i record importati con l'inventario; aggiungere a mano quelli mancanti. MX: `1 smtp.google.com`.
3. Turnstile: aggiungere `adventurelab.cc` al widget "Brevo lead forms (tutti i siti)" (decimo e ultimo slot).
4. Cambiare i nameserver su Aruba con quelli dati da Cloudflare. Attendere lo stato "Active".
5. Posta: inviare e ricevere un'email su info@adventurelab.cc. Solo se entrambe funzionano, proseguire.
6. Worker del sito → Custom domain `adventurelab.cc`. Redirect Rule `www.adventurelab.cc/*` → `https://adventurelab.cc/$1` (301). Redirect `/it/*` → `/` (301).
7. Worker lead: `ALLOWED_ORIGINS` con `https://adventurelab.cc`; `TURNSTILE_REQUIRED="true"`; `wrangler secret put TURNSTILE_SECRET` (secret letto via `GET /accounts/fe10f419d554dfcaca3986a6e7056944/challenges/widgets/0x4AAAAAAEl8e7Ux8o0mh37i`). Redeploy.
8. Build di produzione: `pnpm build:prod` (fallisce se restano TODO) e `npx wrangler deploy`. Verificare l'assenza di `noindex` e un invio reale del form.
9. Dopo una settimana stabile: controllare che su Aruba non resti nulla (caselle, sottodomini) e dismettere l'hosting web.

## Inventario record (da compilare al passo 1)
| Tipo | Nome | Valore | TTL |
|---|---|---|---|
```

`README.md`: tre righe su comandi (`pnpm dev`, `pnpm test`, `pnpm build:prod`), dove stanno i testi (`src/content/`), il worker (`workers/lead/`) e il runbook (`docs/dns-cutover.md`); nota sullo stato di `TURNSTILE_REQUIRED` in anteprima.

- [ ] **Step 7: Commit e push**

```bash
git add -A && git commit -m "docs: README e runbook passaggio DNS" && git push
```
