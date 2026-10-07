/**
 * URL dell'embed Calendly con i dati del form già dentro, così chi ha appena
 * compilato non li riscrive. `a1` è la prima domanda personalizzata dell'evento
 * Calendly: va configurata come "Ente o azienda".
 */
export function calendlyUrl(base: string, d: { name: string; email: string; org: string }, host = ''): string {
  if (!base) return '';
  const u = new URL(base);
  if (d.name) u.searchParams.set('name', d.name);
  if (d.email) u.searchParams.set('email', d.email);
  if (d.org) u.searchParams.set('a1', d.org);
  // Gli stessi parametri che mette il widget ufficiale: senza, Calendly rende la
  // pagina intera con header e banner dei cookie invece dell'embed.
  if (host) {
    u.searchParams.set('embed_domain', host);
    u.searchParams.set('embed_type', 'Inline');
  }
  return u.toString();
}
