/**
 * Controllo dei testi prima del build.
 *  - Sempre: IT ed EN devono avere le stesse chiavi (una sezione tradotta a metà
 *    rende pagine diverse nelle due lingue senza che nessuno se ne accorga).
 *  - Con STRICT_CONTENT=1 (build di produzione): nessun "TODO:" ammesso.
 */
import { it } from '../src/content/it.ts';
import { en } from '../src/content/en.ts';
import { site } from '../site.config.ts';
import { diffKeys, findTodos, missingSiteConfig } from './lib/content-check.mjs';

let failed = false;

const diff = diffKeys(it, en);
if (diff.length) {
  console.error(`[content] IT ed EN non coincidono (- solo IT, + solo EN):\n  ${diff.join('\n  ')}`);
  failed = true;
}

const todos = [...findTodos(it).map((p) => `it.${p}`), ...findTodos(en).map((p) => `en.${p}`)];
if (process.env.STRICT_CONTENT === '1' && todos.length) {
  console.error(`[content] ${todos.length} segnaposto TODO ancora presenti:\n  ${todos.join('\n  ')}`);
  failed = true;
} else if (todos.length) {
  console.warn(`[content] ${todos.length} segnaposto TODO (ammessi fuori produzione).`);
}

const missing = missingSiteConfig(site);
if (process.env.STRICT_CONTENT === '1' && missing.length) {
  console.error(`[content] site.config.ts: valori vuoti in produzione: ${missing.join(', ')}`);
  failed = true;
}

process.exit(failed ? 1 : 0);
