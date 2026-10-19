# adventurelab.cc

Sito B2B di AdventureLab srl: tre pagine statiche in IT ed EN, Astro 7 servito da un Worker Cloudflare.
Le pagine sono la home, che smista, e due strade, una per i territori e una per le aziende (sponsor).
Spec e piano del one-pager iniziale in `docs/superpowers/`; il passaggio alle due strade è in `docs/2026-10-16-due-strade.md`.
Contenuti e media del vecchio sito in `docs/contenuti-attuali/`.

| Pagina | IT | EN |
|---|---|---|
| Home (chi siamo, cosa non si copia, la serie, due strade) | `/` | `/en/` |
| Territori (Comuni, APT, Regioni) | `/territori/` | `/en/destinations/` |
| Aziende (sponsor e marchi) | `/aziende/` | `/en/brands/` |

## Comandi
- `pnpm dev` — sviluppo su http://localhost:4321
- `pnpm test` — test unitari (testi, smistamento delle candidature, Calendly, invio del form, worker)
- `pnpm build` / `pnpm test:build` — build di anteprima (`noindex`, segnaposto ammessi) e test sull'output
- `pnpm build:prod` — build di produzione: fallisce finché nei testi resta un `TODO:`

Su un PC con Node 22 (non 24) gli script che importano i `.ts` vogliono `NODE_OPTIONS=--experimental-strip-types`.

## Dove sta cosa
- Testi: `src/content/it.ts` ed `src/content/en.ts` (stesse chiavi, controllate in build). Regole in testa a `it.ts`; `tests/copy.test.mjs` blocca i due punti e i superlativi.
- Indirizzi delle pagine nelle due lingue: `src/lib/routes.ts` (hreflang, canonical e selettore di lingua passano da qui)
- Pagine: `src/components/pages/*Page.astro`, sezioni in `src/components/sections/`
- Endpoint, Calendly, casella del B2B, dati societari: `site.config.ts`
- Candidatura → collab@ e Brevo: worker separato in `workers/lead/` (deploy: `cd workers/lead && npx wrangler deploy --config wrangler.toml`)
- Smistamento dopo l'invio (call, lista 2028, scheda Sponsor tecnico): `src/lib/route-lead.ts`
- Passaggio del dominio: `docs/dns-cutover.md`

## Stato
- **Una sola casella per tutto il B2B**: `collab@bikeadventureseries.com` (`site.config.ts → contactEmail`, `NOTIFY_TO` nel worker). Se nasce l'alias `collab@adventurelab.cc` verso la stessa casella, si cambia in quei due punti.
- Il worker manda ogni candidatura a `NOTIFY_TO` (reply-to = il candidato) e la scrive su Brevo. Basta una delle due uscite: con `BREVO_LIST_ID = "0"` e `SENDER_EMAIL` vuoto risponde `brevo_list_not_configured`. `SENDER_EMAIL` va riempito con un mittente validato su Brevo, diverso da collab@.
- Turnstile: il widget condiviso non copre `localhost` né `workers.dev` (errore 110200 in console, atteso). Per lo sviluppo e l'anteprima c'è un worker separato, `adventurelab-lead-preview` (`--env preview` in `workers/lead/wrangler.toml`): Turnstile spento, lista "0", nessuna notifica, mai da collegare a una lista vera. Il worker di produzione ha sempre Turnstile acceso.
- `pnpm build:prod` fallisce anche se in `site.config.ts` mancano `leadEndpoint` o `calendlyUrl`, e finché privacy e cookie restano `TODO:`.
