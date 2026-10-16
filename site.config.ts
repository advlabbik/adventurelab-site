/**
 * Configurazione di sito: dati che non sono testo da tradurre ma nemmeno logica.
 * Terze parti, endpoint, dati societari.
 */
export const site = {
  /** Worker che gira le candidature a collab@ e a Brevo. Vedi workers/lead/. Riempito al primo deploy del worker. */
  leadEndpoint: '',

  /** Site key pubblica Turnstile, widget "Brevo lead forms (tutti i siti)". Vuota = widget spento. */
  turnstileSiteKey: '0x4AAAAAAEl8e7Ux8o0mh37i',

  /**
   * URL dell'evento Calendly per la call di 15 minuti (es. https://calendly.com/adventurelab/15min).
   * Vuoto = niente Calendly: dopo la candidatura compare il messaggio "ti rispondiamo entro due giorni".
   */
  calendlyUrl: '',

  /** Token Cloudflare Web Analytics. Vuoto = nessuno snippet. */
  cfAnalyticsToken: '',

  /**
   * Un solo indirizzo per tutto il B2B (sponsor e territori): la casella che il
   * team e Claude leggono già, la stessa del Partner Kit e dei preventivi.
   * Se un giorno nasce collab@adventurelab.cc come alias, si cambia solo qui.
   */
  contactEmail: 'collab@bikeadventureseries.com',

  company: {
    name: 'AdventureLab S.r.l.',
    address: 'Via Giulio Braga, 98 · 59100 Prato (PO), Italia',
    vat: '02410590976',
    rea: 'PO 532864',
    capital: '10.000 € i.v.',
    pec: 'adventurelab@pec.it',
  },

  /** Coordinate vere dei luoghi nelle foto d'apertura (design system: coordinate sempre vere). */
  coords: {
    home: '43°53′N 11°06′E',
    territori: '43°03′N 10°37′E',
    aziende: '45°53′N 11°02′E',
  },
} as const;
