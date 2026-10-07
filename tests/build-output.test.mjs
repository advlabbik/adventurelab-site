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
