/**
 * Configurazione di sito: dati che non sono testo da tradurre ma nemmeno logica.
 * Terze parti, endpoint, dati societari.
 */
export const site = {
  /** Worker che gira il form contatti a Brevo. Vedi workers/lead/. Riempito al primo deploy del worker. */
  leadEndpoint: '',

  /** Site key pubblica Turnstile, widget "Brevo lead forms (tutti i siti)". Vuota = widget spento. */
  turnstileSiteKey: '0x4AAAAAAEl8e7Ux8o0mh37i',

  /** URL dell'evento Calendly (es. https://calendly.com/adventurelab/call-30). Vuoto = niente Calendly, resta l'email. */
  calendlyUrl: '',

  /** Token Cloudflare Web Analytics. Vuoto = nessuno snippet. */
  cfAnalyticsToken: '',

  contactEmail: 'info@adventurelab.cc',

  company: {
    name: 'AdventureLab srl',
    address: 'Via Giulio Braga, 98 · 59100 Prato (PO), Italia',
    vat: '02410590976',
    rea: '532864',
    capital: '10.000 € i.v.',
    linkedin: 'https://www.linkedin.com/company/adventurelabco/',
    /** Sede di Prato, per l'eyebrow dell'hero (design system: coordinate sempre vere). */
    coords: '43°53′N 11°06′E',
  },
} as const;
