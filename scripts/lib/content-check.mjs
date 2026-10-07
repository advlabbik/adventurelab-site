/**
 * Controlli sui testi del sito, puri e senza dipendenze: li usa check-content.mjs
 * in build e li provano i test.
 */

const isObj = (v) => v !== null && typeof v === 'object';

/** Chiavi presenti in `a` e non in `b` (prefisso "-") e viceversa ("+"). */
export function diffKeys(a, b, path = '') {
  const out = [];
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]);
  for (const k of keys) {
    const p = path ? `${path}.${k}` : k;
    const inA = a != null && k in a;
    const inB = b != null && k in b;
    if (inA && !inB) out.push(`-${p}`);
    else if (!inA && inB) out.push(`+${p}`);
    else if (isObj(a[k]) && isObj(b[k])) out.push(...diffKeys(a[k], b[k], p));
  }
  return out;
}

/** Percorsi delle stringhe che iniziano con "TODO:". */
export function findTodos(obj, path = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = path ? `${path}.${k}` : k;
    if (typeof v === 'string' && v.trimStart().startsWith('TODO:')) out.push(p);
    else if (isObj(v)) out.push(...findTodos(v, p));
  }
  return out;
}
