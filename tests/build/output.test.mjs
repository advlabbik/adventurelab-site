import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../../dist/${p}`, import.meta.url), 'utf8');

test('esistono home IT e EN', () => {
  assert.ok(existsSync(new URL('../../dist/index.html', import.meta.url)));
  assert.ok(existsSync(new URL('../../dist/en/index.html', import.meta.url)));
});

test('la home IT dichiara lang="it", la EN lang="en"', () => {
  assert.match(read('index.html'), /<html[^>]*lang="it"/);
  assert.match(read('en/index.html'), /<html[^>]*lang="en"/);
});

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
    assert.ok(existsSync(new URL(`../../dist/${p}`, import.meta.url)), p);
  }
});

test('footer con P.IVA su tutte e due le home', () => {
  assert.match(read('index.html'), /02410590976/);
  assert.match(read('en/index.html'), /02410590976/);
});

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
  assert.ok(statSync(new URL('../../dist/video/hero.mp4', import.meta.url)).size < 3 * 1024 * 1024);
});

test('tutte le ancore della nav esistono', () => {
  const html = read('index.html');
  for (const id of ['territori', 'casi', 'brand', 'eventi', 'chi-siamo', 'contatti']) {
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

test('sfondo scuro solo dietro i loghi bianchi (TGE), chiaro dietro gli altri', () => {
  const block = read('index.html').split('id="eventi"')[1].split('</section>')[0];
  const dark = [...block.matchAll(/class="event__logo event__logo--dark[^"]*"[^>]*>\s*<img[^>]*alt="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(dark, ['The Grand Escape']);
});

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

test('contatti: messaggio di ringraziamento pronto e nascosto (serve se Calendly non è configurato)', () => {
  const block = read('index.html').split('id="contatti"')[1].split('</section>')[0];
  assert.match(block, /class="contact__thanks"[^>]*hidden/);
});

test('link "salta al contenuto" verso #main in entrambe le lingue', () => {
  for (const f of ['index.html', 'en/index.html']) assert.match(read(f), /<a[^>]*href="#main"[^>]*class="skip"/, f);
});

test('il video dell’hero ha un bottone pausa con etichetta', () => {
  assert.match(read('index.html'), /<button[^>]*class="hero__pause"[^>]*aria-label="[^"]+"/);
});

test('email senza correttore ortografico', () => {
  assert.match(read('index.html'), /<input[^>]*name="email"[^>]*spellcheck="false"/);
});
