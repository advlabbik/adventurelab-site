# adventurelab.cc — nuovo sito B2B (one-pager) — design

**Data:** 7 ottobre 2026 · **Stato:** in revisione · **Wireframe di riferimento:** `docs/wireframe/wireframe-onepager-v2.html`

## 1. Obiettivo

Rifare da zero adventurelab.cc, il sito aziendale di AdventureLab srl. Il sito di oggi è un WordPress su Aruba con il certificato HTTPS scaduto dal 7/7/2026 e i numeri fermi al 2023. Il nuovo sito parla a due pubblici B2B, in quest'ordine:

1. **Territori** (pubblico principale): DMO, enti del turismo, regioni, comuni, che possono comprare eventi, itinerari e promozione verso la nostra community.
2. **Sponsor e marchi del settore bici** (pubblico secondario): comprano visibilità su eventi e canali.

**Successo** vuol dire che un responsabile di un ente turistico capisce in pochi secondi cosa facciamo e per chi, trova prove credibili (numeri, loghi, casi) e **prenota una call** su Calendly. Chi non prenota lascia comunque il contatto, che finisce su Brevo per il nurturing via email.

### Decisioni prese (7/10/2026)

| Tema | Decisione |
|---|---|
| Struttura | One-pager (scartati: home + due percorsi; sito costruito attorno agli eventi) |
| Servizi ai territori | Non ancora definiti: **segnaposto**, griglia che regge da 3 a 6 card |
| Contatto | Mini-form → contatto su Brevo → **Calendly incorporato già compilato** |
| Lingue | **Italiano principale** (`/`), inglese secondario (`/en/`) |
| Infrastruttura | Uguale agli altri siti nuovi (riferimento: `~/Repo/ttrefactor`) |
| Brevo / email | Nurturing, automazioni e sistemazione della posta si fanno **a parte**. Il sito si limita a mettere il contatto nella lista giusta |

## 2. Fuori da questo progetto

- Testi definitivi: claim, servizi, casi, chi siamo. Il sito nasce con segnaposto dichiarati e i testi vecchi dove reggono.
- La definizione dell'offerta di servizi ai territori.
- Media kit in PDF per i brand (il bottone c'è, il file arriva dopo).
- Grafica e identità definitive: si parte da una base sobria, il design è un passo successivo.
- Nurturing su Brevo: sequenze, template, automazioni.
- Posta: configurazione DNS della posta e autenticazione del dominio.
- Rinnovo del dominio. È però un **prerequisito** del passaggio DNS (§7).

## 3. Infrastruttura

Ricalca `~/Repo/ttrefactor` (sito TT 2027).

- **Repo:** `advlabbik/adventurelab-site` (oggi `~/Repo/adventurelab-site`, ancora senza remote).
- **Sito:** Astro 7, completamente statico, nessun adapter. pnpm, Node ≥ 22.
- **Hosting:** Worker con asset statici sull'account Cloudflare Adventure Lab (`fe10f419d554dfcaca3986a6e7056944`). `wrangler.jsonc` alla radice con `assets.directory = ./dist`, `not_found_handling = 404-page`.
- **i18n:** `defaultLocale: 'it'`, `locales: ['it','en']`, `prefixDefaultLocale: false`. L'italiano sta su `/`, l'inglese su `/en/`. Ci sono `hreflang` reciproci e un selettore di lingua nella barra di navigazione.
- **Worker del form:** `workers/lead/`, nome `adventurelab-lead`. Ha un deploy separato (`npx wrangler deploy --config wrangler.toml`) ed è una copia adattata di `ttrefactor/workers/subscribe`. L'unico legame con il sito è l'URL dell'endpoint in `site.config.ts`.
- **Indirizzo di prova:** finché non c'è il passaggio DNS (§7), il sito vive su `adventurelab-site.<account>.workers.dev`.
- **SEO di base:** `@astrojs/sitemap`, `robots.txt`, `<title>` e meta description per lingua, Open Graph con un'immagine. Nessun `noindex`, tranne che sull'indirizzo di prova.

## 4. La pagina

Ci sono dieci sezioni più navigazione e footer, nell'ordine del wireframe v2. Ogni sezione è un componente Astro in `src/components/sections/`. Le voci della navigazione sono ancore verso le sezioni.

| # | Sezione | Contenuto all'avvio | Fonte |
|---|---|---|---|
| — | Navigazione | logo · Territori · Casi · Brand · Eventi · Chi siamo · IT/EN · bottone **Prenota una call** | — |
| 1 | Hero | video in loop + titolo + sottotitolo + bottone principale "Prenota una call" (porta alla #10) + bottone secondario "Guarda i casi" | video `Sequenza-01-1.mp4` + poster attuale; claim **segnaposto** |
| 2 | Numeri | 5 cifre: anni, paesi, partecipanti/anno, pernottamenti, indotto | **segnaposto** (i dati 2023 dell'infografica servono solo come riferimento) |
| 3 | Loghi clienti | 14 loghi | `docs/contenuti-attuali/media` |
| 4 | Servizi ai territori | griglia da 3 a 6 card (icona, titolo, 2 righe) | **segnaposto** `[Servizio N]` |
| 5 | Come lavoriamo | 4 passi: sopralluogo → percorso e format → evento e promozione → report | testo da scrivere, struttura fissa |
| 6 | Casi | da 3 a 4 card (foto, territorio, evento, 3 numeri). Al clic la scheda si apre sulla pagina (`<dialog>`) | **segnaposto** (ipotesi: Slovenia/TGE, Toscana/TT, Trentino/TG) |
| 7 | Per i brand | due colonne: pubblico raggiunto · formati; bottone "Scarica il media kit", nascosto finché il PDF non c'è | **segnaposto** |
| 8 | Eventi | da 6 a 8 loghi con una riga, un numero e un link al sito di ciascun evento | TT, TGE, NC4000, UR, Trentino Gravel, Cycling in Tuscany; righe dai testi vecchi, aggiornate |
| 9 | Chi siamo | testo breve (dal 2012, no race, Prato) + foto | testi vecchi riscritti in breve; foto team **segnaposto** |
| 10 | Contatti | mini-form → Calendly (§5) + email di riserva | — |
| — | Footer | AdventureLab srl · Via Giulio Braga 98, 59100 Prato · P.IVA 02410590976 · REA 532864 · Cap. soc. 10.000 € i.v. · LinkedIn · Privacy · Cookie | testo attuale |

**Contenuti separati dal layout.** I testi stanno in `src/content/it.ts` e `src/content/en.ts`, uno per lingua, con lo stesso tipo TypeScript per entrambi. Un controllo in build fallisce se una chiave c'è in una lingua e manca nell'altra. Ogni segnaposto ha il marcatore `TODO:` nel valore. Quando arrivano i testi definitivi si cambiano solo questi due file.

**Segnaposto visibili ma non imbarazzanti.** Sull'indirizzo di prova i segnaposto si vedono come tali. In produzione **il build fallisce se c'è ancora un `TODO:`** (variabile `STRICT_CONTENT=1` nel deploy di produzione). Così non può andare online un "[Servizio 1]".

**Pagine accessorie.** `/privacy` e `/cookie` (più `/en/privacy` e `/en/cookie`) con il testo fornito dall'azienda, e la pagina 404. Il testo della privacy deve citare il trattamento del form (Brevo) e di Calendly.

**Immagini.** Si parte dai 45 media salvati e si ottimizzano con `astro:assets` (AVIF/WebP, dimensioni responsive). Il video dell'hero va compresso: 720p, senza audio, sotto i 3 MB, con poster. Chi ha attivato `prefers-reduced-motion` vede solo il poster.

**Grafica di partenza.** Font di sistema o un font variabile solo, una palette neutra con un colore d'accento, e i token CSS in un file solo, in modo che il design successivo li sostituisca senza toccare i componenti.

## 5. Contatto: form → Brevo → Calendly

### Flusso

1. La persona compila **nome, email, ente/azienda, "sono un: territorio / brand-sponsor / altro"**, poi il consenso privacy (obbligatorio) e il consenso agli aggiornamenti (facoltativo). Il captcha Turnstile resta invisibile.
2. Il sito fa `POST` all'endpoint del worker `adventurelab-lead`.
3. Il worker controlla, in quest'ordine: origine (`ALLOWED_ORIGINS`), limite di richieste (5 al minuto per IP), honeypot, email valida, consenso privacy, token Turnstile (fail-closed, come il TT).
4. Il worker crea o aggiorna il contatto su Brevo (`POST /v3/contacts`, `updateEnabled: true`) nella lista `BREVO_LIST_ID` con gli attributi del paragrafo successivo.
5. Se va bene, al posto del form il sito mostra il **Calendly incorporato**, con nome ed email passati nell'URL (`?name=…&email=…`) e l'ente come risposta precompilata (`a1`).
6. Se il worker risponde con un errore, o non risponde entro 8 secondi, il Calendly si apre **comunque** con i dati già inseriti. Sotto compare "Se preferisci, scrivici a info@adventurelab.cc". L'errore finisce nei log del worker. Una call non si perde per un nostro guasto.

### Attributi Brevo

L'account Brevo è condiviso da tutti i brand, quindi gli attributi nuovi hanno il prefisso `ADVLAB_`:

| Attributo | Tipo | Valore |
|---|---|---|
| `LINGUA` | categoria (esiste già) | 1 = it, 2 = en: la stessa convenzione del TT, così il contatto entra nei segmenti IT/EN già esistenti |
| `SIGNUP_SOURCE` | testo (esiste già) | `adventurelab:contatti` |
| `NOME` | testo (esiste già, field_key firstname) | nome |
| `ADVLAB_TIPO` | categoria (**da creare**) | territorio / brand / altro |
| `ADVLAB_ENTE` | testo (**da creare**) | ente o azienda |
| `ADVLAB_OPTIN` | booleano (**da creare**) | consenso agli aggiornamenti |
| `ADVLAB_LAST_SIGNUP_AT` | testo (**da creare**) | timestamp ISO riscritto a ogni invio: è l'aggancio per le automazioni, come `TT_LAST_SIGNUP_AT` |

La **lista** e gli **attributi** `ADVLAB_*` vanno creati su Brevo prima di accendere il form. Il worker rifiuta gli invii con `brevo_list_not_configured` finché `BREVO_LIST_ID` vale `"0"`, come fa il TT. Sarà il nurturing, fatto a parte, a decidere chi riceve cosa in base a `ADVLAB_OPTIN`.

### Turnstile

Si usa il widget esistente "Brevo lead forms (tutti i siti)" (sitekey `0x4AAAAAAEl8e7Ux8o0mh37i`) e gli si aggiunge `adventurelab.cc`, che occupa il **decimo e ultimo posto** del widget. Il sottodominio `workers.dev` di prova non ci rientra. Durante il collaudo si usano quindi le chiavi di test di Turnstile, oppure `TURNSTILE_REQUIRED="false"` solo sul worker di prova.

## 6. Tracciamento

All'avvio solo Cloudflare Web Analytics, che non usa cookie e non richiede banner. Gli eventi di conversione (form inviato, call prenotata) e un eventuale Zaraz con banner di consenso, come sugli altri siti, sono un punto aperto (§9) e non bloccano il lancio.

## 7. Passaggio DNS e messa online

Oggi il DNS è su Aruba/Technorail, l'A record punta a `89.46.105.43`, l'MX è Google Workspace (`smtp.google.com`) e c'è un TXT di verifica Google.

1. **Prerequisito:** il dominio è rinnovato e lontano dalla scadenza.
2. Si aggiunge la zona `adventurelab.cc` all'account Cloudflare Adventure Lab e si copiano **tutti** i record esistenti: MX, SPF, verifica Google ed eventuali DKIM o record di Brevo. Prima si fa l'inventario completo dei record su Aruba.
3. Si cambiano i nameserver dal pannello Aruba.
4. Si verifica la posta: un'email in entrata e una in uscita su info@ **prima** di agganciare il sito.
5. Si aggancia il custom domain del Worker su `adventurelab.cc` e si mette il redirect 301 da `www` al dominio nudo. Il vecchio `/it/` va in 301 su `/`. Il vecchio `/` era inglese e ora diventa italiano: come gestirlo è il punto aperto §9.3.
6. Si dismette l'hosting Aruba solo dopo una settimana di sito nuovo stabile, e dopo aver controllato che su Aruba non resti altro (caselle, sottodomini).

## 8. Verifica

- `pnpm build` passa, `astro check` è pulito e il controllo di parità IT/EN è verde.
- Form: prova in locale con `wrangler dev` e sull'indirizzo di prova. Il contatto di prova arriva su Brevo con lista e attributi giusti e poi viene messo in blacklist, non cancellato (regola: niente cancellazioni di dati marketing).
- Il fallback del form funziona: con il worker spento, il Calendly si apre comunque.
- Lighthouse mobile ≥ 90 su performance, accessibilità, best practice e SEO.
- Passata con la skill `web-design-guidelines`: contrasto, focus, etichette del form, tastiera, `prefers-reduced-motion`.
- Entrambe le lingue rese correttamente, con `hreflang` e sitemap che coprono le due versioni.
- Al passaggio DNS (§7): posta verificata **prima** del sito.

## 9. Punti aperti (non bloccano l'avvio)

1. **Calendly:** su quale account, che tipo di evento (durata) e chi fa le call. Serve l'URL dell'evento prima del collaudo del form.
2. **Lista Brevo:** l'ID della nuova lista e la creazione degli attributi `ADVLAB_*`, da fare insieme alla parte Brevo "a parte".
3. **Redirect del vecchio inglese:** oggi `/` è inglese, domani sarà italiano. Chi arriva da vecchi link in inglese atterra sulla versione italiana. Si può accettare (il sito ha poco traffico e nessun articolo) oppure mandare in automatico su `/en/` in base alla lingua del browser, solo alla prima visita. Proposta: accettarlo.
4. **Tracciamento:** basta Cloudflare Web Analytics o serve Zaraz con pixel e consenso come sugli altri siti?
5. **Testi privacy e cookie:** chi li fornisce.
6. **Brevo dal Worker:** l'API Brevo accetta solo IP autorizzati. Il worker `tt-subscribe` scrive già su Brevo da Cloudflare, quindi la strada dovrebbe essere aperta, ma va confermato col primo invio di prova.
