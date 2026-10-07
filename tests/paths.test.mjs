import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from '../src/lib/paths.ts';

test('sul dominio vero (base "/") il percorso resta com’è', () => {
  assert.equal(withBase('/en/', '/'), '/en/');
  assert.equal(withBase('/video/hero.mp4', '/'), '/video/hero.mp4');
});

test('sotto GitHub Pages antepone la base, con o senza barra finale', () => {
  assert.equal(withBase('/en/', '/adventurelab-site/'), '/adventurelab-site/en/');
  assert.equal(withBase('/privacy/', '/adventurelab-site'), '/adventurelab-site/privacy/');
  assert.equal(withBase('/', '/adventurelab-site/'), '/adventurelab-site/');
});
