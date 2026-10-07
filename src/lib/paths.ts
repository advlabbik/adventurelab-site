/**
 * Percorso interno con davanti la base del sito. Sul dominio vero la base è "/",
 * sull'anteprima di GitHub Pages è "/adventurelab-site/": ogni link interno,
 * immagine in public/ o video passa da qui, altrimenti lì si romperebbe.
 */
export function withBase(path: string, base: string = import.meta.env?.BASE_URL ?? '/'): string {
  const b = base.replace(/\/+$/, '');
  return `${b}${path.startsWith('/') ? path : `/${path}`}`;
}
