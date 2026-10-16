import { test } from 'node:test';
import assert from 'node:assert/strict';
import { it } from '../src/content/it.ts';
import { en } from '../src/content/en.ts';

/** Tutte le stringhe dei testi con il loro percorso. */
function strings(obj, path = '') {
  return Object.entries(obj).flatMap(([k, v]) => {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string') return [[p, v]];
    if (v && typeof v === 'object') return strings(v, p);
    return [];
  });
}

// Regola di Andrea (ago-ott 2026): mai i due punti nei testi rivolti a partecipanti,
// enti e clienti, nemmeno in titoli ed etichette. Restano leciti negli URL e nei TODO.
test('nessun due punti nei testi visibili, in italiano e in inglese', () => {
  for (const [lang, c] of [['it', it], ['en', en]]) {
    const bad = strings(c)
      .filter(([, v]) => !v.trimStart().startsWith('TODO:'))
      .map(([p, v]) => [p, v.replace(/https?:\/\/\S+/g, '')])
      .filter(([, v]) => v.includes(':'));
    assert.deepEqual(bad, [], `${lang}: ${bad.map(([p]) => p).join(', ')}`);
  }
});

test('mai «il più grande» o «the biggest»: primati verificabili, non superlativi', () => {
  for (const [, v] of [...strings(it), ...strings(en)]) {
    assert.doesNotMatch(v, /più grande|the biggest|the largest|world'?s largest/i, v);
  }
});

test('stesso numero di settori, fasce di budget e obiettivi nelle due lingue', () => {
  assert.equal(it.aziende.form.categories.length, en.aziende.form.categories.length);
  assert.equal(it.aziende.form.budgets.length, en.aziende.form.budgets.length);
  assert.equal(it.territori.form.goals.length, en.territori.form.goals.length);
});

// Correzioni di Andrea del 16/10/2026 sulla prima bozza: che non tornino.
const all = () => [...strings(it), ...strings(en)].map(([, v]) => v);

test('mai la durata della call: quindici minuti sminuiscono loro e noi', () => {
  for (const v of all()) assert.doesNotMatch(v, /15 minut|quindici minuti|fifteen minute/i, v);
});

test('mai la scadenza del listino: le aziende devono poter bussare sempre', () => {
  for (const v of all()) assert.doesNotMatch(v, /15 novembre|15 November|listino 2027|2027 rate card/i, v);
});

test('si parla da numero uno: niente squadra piccola, niente «le call le fa Andrea»', () => {
  for (const v of all()) assert.doesNotMatch(v, /squadra piccola|small team|Andrea Borchi|pochi partner|few partners/i, v);
});

test('niente categorie occupate in vista', () => {
  for (const v of all()) assert.doesNotMatch(v, /occupat|already taken|lista 2028|2028 list/i, v);
});

test('mai «ventimila dal 2013»: erano le persone uniche a DB, non le partecipazioni', () => {
  for (const v of all()) assert.doesNotMatch(v, /ventimila|twenty thousand|20[.,]000/i, v);
});

test('i partecipanti sono diecimila, i paesi 88', () => {
  for (const v of all()) assert.doesNotMatch(v, /9\.000|9,000|novemila|nine thousand|71 paesi|71 countries/i, v);
});

// Andrea, 16/10/2026: il numero dei partenti contati al via (5.195 al TT 2026)
// non va mai in pubblico, perché accanto agli iscritti mostra quanti non sono venuti.
test('mai il conteggio dei partenti al via', () => {
  for (const [, v] of [...strings(it), ...strings(en)]) {
    assert.doesNotMatch(v, /5[.,]195|contat[ei] al via|counted at the start|al via, contat/i, v);
  }
});
