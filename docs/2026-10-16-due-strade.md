# Dal one-pager alle due strade (16 ottobre 2026)

Branch `feat/due-strade`, partito da `feat/design-foglio` (design system Foglio IGM, infrastruttura, worker e test restano quelli del 7/10).

## Cosa è cambiato e perché

**Struttura.** Il 16/10 la direzione ha chiesto il sito con due strade, una per i territori e una per gli sponsor, ognuna con una call to action diretta. Il one-pager del 7/10 è diventato tre pagine:

- **Home** che smista. Chi siamo in una frase, cinque numeri, le due porte, «cinque cose che non si comprano» (i punti di forza non copiabili, ognuno con la sua prova), la serie, chi siamo coi dati societari.
- **/territori/** per Comuni, APT, Regioni e parchi. Presenze e pernottamenti, tre servizi, Tuscany Trail 365 in evidenza per la Toscana, tre casi (Campiglia, Trentino, Foreste Casentinesi), committenti dalle capitali ai piccoli comuni, come si affida, le condizioni, candidatura.
- **/aziende/** per sponsor e marchi. Perché funziona, i loghi di chi c'è già, tre livelli senza prezzo, il report a 30 giorni, candidatura.

Pagine separate e non sezioni, perché i due compratori vogliono cose diverse (presenze contro uso del prodotto) e perché email, LinkedIn e Partner Kit devono poter linkare direttamente la pagina giusta, con l'UTM.

**Testi.** Scritti con la Biblioteca Marketing (Kennedy, Suby, BigLuca, Voss e prove dal campo) e i numeri verificati sul Marketing Hub. Regole: niente due punti, niente «il più grande», solo numeri che rafforzano. La frase su che cosa fa AdventureLab si cambia solo con la direzione.

**Candidatura al posto del contatto.** Un modulo per strada, con le domande che servono a preparare la call (per le aziende anche settore, mercati e budget). Dopo l'invio tutti vedono Calendly: nessun filtro sul budget, per scelta della direzione del 16/10.

**Una sola casella.** Ogni candidatura arriva a `collab@bikeadventureseries.com` con reply-to il candidato (nuovo nel worker), oltre al contatto su Brevo che c'era già. È la stessa casella del Partner Kit e dei preventivi, e il team e Claude la leggono già.

**Foto.** Dagli shooting dei nostri eventi, preparate a 1.500-2.000 px in `src/assets/photos/` e servite da Astro in WebP con srcset.

## Cosa resta prima della produzione

- [x] Frase su chi fa cosa (`home.about.body[0]`) e numeri della Regione Toscana confermati dalla direzione il 16/10.
- [x] Prenotazione della call: Google Calendar «Call Bike Adventure Series 2027» in `site.config.ts` (forma `?gv=true`, incorporabile). Da confermare che sia quella giusta per adventurelab.cc.
- [ ] Worker: `SENDER_EMAIL` = info@bikeadventureseries.com (già validato) e `leadEndpoint` già impostati; lista Brevo «Lead AdventureLab» (id 40) e attributi `ADVLAB_*` creati il 16/10; restano segreti e deploy.
- [ ] Testi di privacy e cookie: **bozza scritta il 16/10** sul modello dell'informativa di Cycling in Tuscany (stesso titolare), da far approvare prima della produzione. Da confermare in particolare la conservazione (24 mesi dall'ultimo contatto se la collaborazione non parte) e la casella per i diritti (collab@). Con questa bozza `pnpm build:prod` non si ferma più.
- [ ] Certificato e DNS (`docs/dns-cutover.md`): il certificato di adventurelab.cc su Aruba è scaduto dal 7/7/2026.
- [x] Loghi dei partner (dal sito del Tuscany Trail). Mancano Mondraker e We Make Things.
- [ ] Dopo il lancio: BAS /join-us, Contatti del Tuscany Trail, firme email, Partner Kit e LinkedIn puntano qui.

## Correzioni della direzione, 16/10 pomeriggio

10.000 partecipanti e 88 paesi ovunque · niente numero dei partenti al via · tono da numero uno («Chi siamo» riscritto) · niente durata della call · niente scadenza del listino · niente categorie occupate (sezione e lista d'attesa tolte, anche dal worker) · report solo con dati che verifichiamo da soli (email, social, pubblico) · loghi dei partner dal sito TT · committenti in tre gruppi · Tuscany Trail 365 nei territori · Foreste Casentinesi al posto di Val di Sole · niente LinkedIn nel footer · foto di Final Frontier Patagonia presa da finalfrontierpatagonia.com, **da far approvare al licenziatario**. In sospeso la sezione «Perché funziona» delle aziende, da riscrivere con la direzione.
