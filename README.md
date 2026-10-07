# adventurelab.cc

Sito B2B di AdventureLab srl: one-pager statico IT (`/`) ed EN (`/en/`), Astro 7 servito da un Worker Cloudflare.
Spec e piano in `docs/superpowers/`; contenuti e media del vecchio sito in `docs/contenuti-attuali/`.

## Comandi
- `pnpm dev` — sviluppo su http://localhost:4321
- `pnpm test` — test unitari (contenuti, Calendly, invio del form, worker)
- `pnpm build` / `pnpm test:build` — build di anteprima (`noindex`, segnaposto ammessi) e test sull'output
- `pnpm build:prod` — build di produzione: fallisce finché nei testi resta un `TODO:`

## Dove sta cosa
- Testi: `src/content/it.ts` ed `src/content/en.ts` (stesse chiavi, controllate in build)
- Endpoint, chiavi pubbliche, dati societari: `site.config.ts`
- Form → Brevo: worker separato in `workers/lead/` (deploy: `cd workers/lead && npx wrangler deploy --config wrangler.toml`)
- Passaggio del dominio: `docs/dns-cutover.md`

## Stato
- `BREVO_LIST_ID = "0"` nel worker finché lista e attributi `ADVLAB_*` non esistono su Brevo: il worker risponde `brevo_list_not_configured` e il sito apre comunque Calendly.
- Turnstile: il widget condiviso non copre `localhost` né `workers.dev` (errore 110200 in console, atteso). Sull'anteprima il worker va con `TURNSTILE_REQUIRED = "false"`; al passaggio DNS si riporta a `"true"`.
