import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';

const url = (p) => new URL(`../../dist/${p}`, import.meta.url);
const read = (p) => readFileSync(url(p), 'utf8');
const block = (html, id) => html.split(`id="${id}"`)[1].split('</section>')[0];

// Le pagine con contenuto, nelle due lingue. Gli slug inglesi non ricalcano quelli italiani.
const PAGES = {
  home: { it: 'index.html', en: 'en/index.html' },
  territori: { it: 'territori/index.html', en: 'en/destinations/index.html' },
  aziende: { it: 'aziende/index.html', en: 'en/brands/index.html' },
};
const ALL = Object.values(PAGES).flatMap((p) => [p.it, p.en]);
const canonical = { 'index.html': '/', 'en/index.html': '/en/', 'territori/index.html': '/territori/', 'en/destinations/index.html': '/en/destinations/', 'aziende/index.html': '/aziende/', 'en/brands/index.html': '/en/brands/' };

test('esistono home, territori e aziende in IT e EN', () => {
  for (const f of ALL) assert.ok(existsSync(url(f)), f);
});

test('ogni pagina dichiara la sua lingua', () => {
  for (const p of Object.values(PAGES)) {
    assert.match(read(p.it), /<html[^>]*lang="it"/, p.it);
    assert.match(read(p.en), /<html[^>]*lang="en"/, p.en);
  }
});

test('hreflang reciproci e canonical su ogni pagina, con gli slug giusti', () => {
  for (const p of Object.values(PAGES)) {
    for (const f of [p.it, p.en]) {
      const html = read(f);
      assert.match(html, new RegExp(`<link rel="canonical" href="https://adventurelab\\.cc${canonical[f].replace(/\//g, '\\/')}"`), f);
      assert.match(html, new RegExp(`hreflang="it" href="https://adventurelab\\.cc${canonical[p.it].replace(/\//g, '\\/')}"`), f);
      assert.match(html, new RegExp(`hreflang="en" href="https://adventurelab\\.cc${canonical[p.en].replace(/\//g, '\\/')}"`), f);
    }
  }
});

test('noindex fuori produzione, assente in produzione', () => {
  const html = read('index.html');
  if (process.env.PUBLIC_SITE_ENV === 'production') assert.doesNotMatch(html, /noindex/);
  else assert.match(html, /<meta name="robots" content="noindex/);
});

test('pagine legali e 404 esistono in entrambe le lingue', () => {
  for (const p of ['privacy/index.html', 'cookie/index.html', 'en/privacy/index.html', 'en/cookie/index.html', '404.html']) {
    assert.ok(existsSync(url(p)), p);
  }
});

test('footer con P.IVA, PEC e casella del B2B su tutte le pagine, senza LinkedIn', () => {
  for (const f of ALL) {
    const html = read(f);
    assert.match(html, /02410590976/, f);
    assert.match(html, /adventurelab@pec\.it/, f);
    assert.match(html, /mailto:collab@bikeadventureseries\.com/, f);
    assert.doesNotMatch(html, /linkedin/i, f);
  }
});

test('la home ha il video muto in loop con poster e bottone pausa', () => {
  const html = read('index.html');
  assert.match(html, /<video[^>]*\bmuted\b[^>]*>/);
  assert.match(html, /<video[^>]*\bloop\b/);
  assert.match(html, /poster="\/video\/hero-poster\.jpg"/);
  assert.match(html, /<button[^>]*class="hero__pause"[^>]*aria-label="[^"]+"/);
});

test('territori e aziende aprono con una foto vera, con alt', () => {
  for (const f of [PAGES.territori.it, PAGES.aziende.it, PAGES.territori.en, PAGES.aziende.en]) {
    const hero = read(f).split('class="hero"')[1].split('</section>')[0];
    assert.match(hero, /<img[^>]*class="hero__img"/, f);
    assert.match(hero, /<img[^>]*alt="[^"]{10,}"/, f);
  }
});

test('il video pesa meno di 3 MB', () => {
  assert.ok(statSync(url('video/hero.mp4')).size < 3 * 1024 * 1024);
});

test('home: le due strade portano alle due pagine, e la nav ha territori, aziende e chi siamo', () => {
  const html = read('index.html');
  const doors = block(html, 'strade');
  assert.match(doors, /href="\/territori\/"/);
  assert.match(doors, /href="\/aziende\/"/);
  assert.match(html, /id="chi-siamo"/);
  const nav = html.split('class="nav"')[1].split('</header>')[0];
  for (const h of ['/territori/', '/aziende/', '/#chi-siamo']) assert.match(nav, new RegExp(`href="${h}"`), h);
  const navEn = read('en/index.html').split('class="nav"')[1].split('</header>')[0];
  for (const h of ['/en/destinations/', '/en/brands/', '/en/#chi-siamo']) assert.match(navEn, new RegExp(`href="${h}"`), h);
});

test('il selettore di lingua porta alla stessa pagina nell’altra lingua', () => {
  assert.match(read(PAGES.territori.it), /<a href="\/en\/destinations\/" hreflang="en"/);
  assert.match(read(PAGES.aziende.en), /<a href="\/aziende\/" hreflang="it"/);
});

test('il bottone rosso in barra porta alla candidatura della pagina', () => {
  for (const f of [PAGES.territori.it, PAGES.aziende.it]) assert.match(read(f), /href="#candidatura" class="btn btn--primary nav__cta"/, f);
  assert.match(read('index.html'), /href="\/#strade" class="btn btn--primary nav__cta"/);
});

test('territori: tre casi, ognuno con il suo dialog', () => {
  const dialogs = read(PAGES.territori.it).match(/<dialog[^>]*class="case__dialog"/g) ?? [];
  assert.equal(dialogs.length, 3);
});

test('territori: committenti in tre gruppi, dalle capitali ai piccoli comuni', () => {
  const b = block(read(PAGES.territori.it), 'clienti');
  assert.equal((b.match(/class="clients__head"/g) ?? []).length, 3);
  for (const name of ['Berlino', 'Copenaghen', 'Tarquinia', 'Parco Nazionale delle Foreste Casentinesi']) assert.match(b, new RegExp(name), name);
});

test('territori: Tuscany Trail 365 in evidenza, con il link al sito', () => {
  const b = block(read(PAGES.territori.it), 'tuscany-trail-365');
  assert.match(b, /href="https:\/\/365\.tuscanytrail\.it"[^>]*rel="noopener"/);
  assert.match(b, /<img[^>]*alt="[^"]{10,}"/);
});

test('aziende: i loghi dei partner, con il nome come alt', () => {
  const html = read(PAGES.aziende.it);
  const b = html.split('class="partners"')[1].split('</ul>')[0];
  const alts = [...b.matchAll(/<img[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(alts.length >= 6, String(alts.length));
  for (const n of ['Vittoria', 'Abus', 'Selle San Marco']) assert.ok(alts.includes(n), n);
});

test('home: sei eventi, link esterni e sicuri', () => {
  const b = block(read('index.html'), 'eventi');
  const links = [...b.matchAll(/<a[^>]*href="(https:[^"]+)"[^>]*>/g)];
  assert.equal(links.length, 6);
  for (const l of links) assert.match(l[0], /rel="noopener"/);
});

test('aziende: nel modulo tutti i settori, nessuno marcato come occupato', () => {
  const form = block(read(PAGES.aziende.it), 'candidatura');
  assert.doesNotMatch(form, /data-taken/);
  for (const s of ['Pneumatici', 'Luci', 'Viaggi e voli']) assert.match(form, new RegExp(`<option value="${s}"`), s);
});

test('candidatura: campi obbligatori, honeypot nascosto, lingua e tipo giusti, email di riserva', () => {
  const cases = [
    [PAGES.territori.it, 'it', 'territorio', ['territory', 'goal']],
    [PAGES.territori.en, 'en', 'territorio', ['territory', 'goal']],
    [PAGES.aziende.it, 'it', 'brand', ['category', 'markets', 'budget']],
    [PAGES.aziende.en, 'en', 'brand', ['category', 'markets', 'budget']],
  ];
  for (const [file, lang, kind, own] of cases) {
    const b = block(read(file), 'candidatura');
    for (const n of ['name', 'email', 'org', 'role', 'success', 'consent', 'optin', 'website', ...own]) assert.match(b, new RegExp(`name="${n}"`), `${file}: ${n}`);
    assert.match(b, /type="email"[^>]*required|required[^>]*type="email"/);
    assert.match(b, /<input[^>]*name="email"[^>]*spellcheck="false"/);
    assert.match(b, new RegExp(`data-lang="${lang}"`));
    assert.match(b, new RegExp(`data-kind="${kind}"`));
    assert.match(b, /mailto:collab@bikeadventureseries\.com/);
    assert.match(b, /<noscript>/);
    assert.match(b, /class="apply__thanks"[^>]*hidden/);
  }
});

test('aziende: nessun filtro sul budget, un solo grazie per tutti', () => {
  const b = block(read(PAGES.aziende.it), 'candidatura');
  assert.doesNotMatch(b, /data-small|data-route|waitlist/);
  assert.equal((b.match(/class="apply__thanks"/g) ?? []).length, 1);
});

test('link "salta al contenuto" verso #main su ogni pagina', () => {
  for (const f of ALL) assert.match(read(f), /<a[^>]*href="#main"[^>]*class="skip"/, f);
});

test('[hidden] vince sul display dei componenti (form e bottone devono sparire davvero)', () => {
  const html = read('index.html');
  const cssFiles = readdirSync(url('_astro/')).filter((f) => f.endsWith('.css'));
  const css = html + cssFiles.map((f) => read(`_astro/${f}`)).join('\n');
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

// --- Design system "Foglio IGM" ---
const allCss = () => readdirSync(url('_astro/')).filter((f) => f.endsWith('.css')).map((f) => read(`_astro/${f}`)).join('\n');

test('font ospitati in proprio: niente Google Fonts, @font-face dei tre font', () => {
  const css = allCss();
  assert.doesNotMatch(read('index.html'), /fonts\.googleapis\.com/);
  for (const f of ['Archivo Variable', 'Spectral', 'Martian Mono Variable']) assert.match(css, new RegExp(`font-family:\\s*['"]?${f}`), f);
});

test('in barra il logo vero, non testo', () => {
  for (const f of ALL) assert.match(read(f), /<a[^>]*class="nav__logo"[^>]*>\s*<img[^>]*alt="AdventureLab"/, f);
});

test('titolo dell’hero con la riga del luogo in corsivo', () => {
  for (const f of ALL) assert.match(read(f), /<h1[^>]*>[\s\S]*?<span class="place[^"]*"[^>]*>[\s\S]*?<\/h1>/, f);
});

test('esattamente due barre del segnavia per pagina', () => {
  for (const f of ALL) assert.equal((read(f).match(/class="segnavia"/g) ?? []).length, 2, f);
});

test('ogni titolo di sezione ha sopra l’eyebrow "Foglio"', () => {
  for (const f of ALL) {
    const html = read(f);
    const h2s = (html.match(/<h2[\s>]/g) ?? []).length;
    const eyebrows = (html.match(/class="eyebrow"[^>]*>\s*Foglio (?!00)\d{2}/g) ?? []).length;
    assert.ok(h2s >= 4, f);
    assert.equal(eyebrows, h2s, f);
  }
});
