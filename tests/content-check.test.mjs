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
