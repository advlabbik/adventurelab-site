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

## Inventario record (16/10/2026)
Letti con `dig` sia sui DNS di Aruba sia sulla zona Cloudflare già creata: coincidono.

| Tipo | Nome | Valore | Note |
|---|---|---|---|
| A | `@` | 89.46.105.43 | vecchio sito Aruba: va sostituito dal Worker al passo 6 |
| AAAA | `@` | 2a00:6d40:4:3::c219:43 | come sopra |
| A | `www` | 89.46.105.43 | redirect su `@` al passo 6 |
| MX | `@` | 1 smtp.google.com | posta Google Workspace |
| TXT | `@` | `v=spf1 include:_spf.aruba.it ~all` | non include Google: la posta Google passa DMARC grazie al DKIM |
| TXT | `@` | `google-site-verification=ST_6hFR8…` | |
| TXT | `google._domainkey` | `v=DKIM1; k=rsa; p=MIIB…` | DKIM di Google |
| TXT | `_dmarc` | `v=DMARC1; p= quarantine; adkim=r; aspf=r;` | |
| A | `mail` | 62.149.128.72 | Aruba, da dismettere al passo 9 |
| A | `ftp` | 89.46.104.211, 89.46.104.218 | Aruba, da dismettere al passo 9 |
