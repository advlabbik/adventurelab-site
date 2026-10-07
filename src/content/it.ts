import type { SiteContent } from './types';

export const it: SiteContent = {
  meta: {
    title: 'AdventureLab — eventi e turismo in bicicletta per i territori',
    description:
      'Portiamo ciclisti nei territori con eventi, itinerari e promozione verso una community europea. Dal 2012.',
  },
  nav: { territories: 'Territori', cases: 'Casi', brands: 'Brand', events: 'Eventi', about: 'Chi siamo', cta: 'Prenota una call' },
  hero: {
    title: 'TODO: Portiamo ciclisti nel tuo territorio.',
    subtitle: 'TODO: Eventi, itinerari e promozione per destinazioni che vogliono crescere con il turismo in bicicletta.',
    ctaPrimary: 'Prenota una call',
    ctaSecondary: 'Guarda i casi',
  },
  numbers: {
    label: 'TODO: dati 2025',
    items: [
      { value: '14', label: 'anni di esperienza' },
      { value: '19', label: 'paesi' },
      { value: 'TODO: n', label: 'partecipanti all’anno' },
      { value: 'TODO: n', label: 'pernottamenti generati' },
      { value: 'TODO: n', label: 'indotto stimato' },
    ],
  },
  clients: { title: 'Hanno lavorato con noi' },
  services: {
    title: 'Cosa facciamo per un territorio',
    intro: 'TODO: frase introduttiva sui servizi',
    items: [
      { title: 'TODO: Servizio 1', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 2', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 3', text: 'TODO: descrizione in due righe' },
      { title: 'TODO: Servizio 4', text: 'TODO: descrizione in due righe' },
    ],
  },
  process: {
    title: 'Come lavoriamo',
    steps: [
      { title: 'Sopralluogo e analisi', text: 'TODO: due righe' },
      { title: 'Percorso e format', text: 'TODO: due righe' },
      { title: 'Evento e promozione', text: 'TODO: due righe' },
      { title: 'Report', text: 'TODO: numeri e ricadute misurate sul territorio' },
    ],
  },
  cases: {
    title: 'Casi',
    open: 'Leggi il caso',
    close: 'Chiudi',
    items: [
      { place: 'Slovenia', event: 'The Grand Escape', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
      { place: 'Toscana', event: 'Tuscany Trail', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
      { place: 'Trentino', event: 'Trentino Gravel', summary: 'TODO: cosa abbiamo fatto', body: 'TODO: racconto del caso', stats: [{ value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }, { value: 'TODO: n', label: 'TODO: metrica' }] },
    ],
  },
  brands: {
    title: 'Per brand e sponsor',
    audienceTitle: 'Chi raggiungi',
    audience: 'TODO: profilo della community — età, paesi, bici, spesa',
    formatsTitle: 'Formati',
    formats: 'TODO: presenza agli eventi, contenuti, prodotto nel pacco gara',
    mediaKit: 'Scarica il media kit',
  },
  events: {
    title: 'I nostri eventi',
    items: [
      { name: 'Tuscany Trail', line: 'L’avventura in bici unsupported più partecipata al mondo.', stat: 'TODO: n iscritti', url: 'https://tuscanytrail.it' },
      { name: 'The Grand Escape', line: 'Bikepacking su strada sulle strade più belle d’Europa.', stat: 'TODO: n edizioni', url: 'https://thegrandescape.cc' },
      { name: 'NorthCape4000', line: 'L’ultracycling più lungo e partecipato d’Europa, verso Capo Nord.', stat: 'TODO: ~4.000 km', url: 'https://northcape4000.com' },
      { name: 'Unpaved Roads', line: 'Circuito gravel in Italia, formula weekend.', stat: 'TODO: n tappe', url: 'https://unpavedroads.cc' },
      { name: 'Trentino Gravel', line: 'TODO: una riga', stat: 'TODO: n', url: 'https://trentinogravel.com' },
      { name: 'Cycling in Tuscany', line: 'TODO: una riga', stat: 'TODO: n', url: 'https://cyclingintuscany.com' },
    ],
  },
  about: {
    title: 'Chi siamo',
    body: [
      'Dal 2012, quando abbiamo portato il bikepacking in Italia, organizziamo eventi in bicicletta dedicati all’avventura in tutta Europa.',
      'I nostri eventi sono “no race”: niente classifiche, la strada e i luoghi al centro. Siamo a Prato.',
    ],
  },
  contact: {
    title: 'Prenota una call di 30 minuti',
    intro: 'Lasciaci due dati e scegli il giorno: ti richiamiamo per capire il tuo progetto.',
    fields: { name: 'Nome', email: 'Email', org: 'Ente o azienda', type: 'Sono', typeTerritory: 'un territorio', typeBrand: 'un brand o sponsor', typeOther: 'altro' },
    privacy: 'Ho letto l’informativa privacy',
    optin: 'Voglio ricevere aggiornamenti da AdventureLab',
    submit: 'Scegli il giorno →',
    sending: 'Un attimo…',
    errors: {
      invalid_email: 'Controlla l’indirizzo email.',
      consent_required: 'Serve il consenso all’informativa privacy.',
      generic: 'Qualcosa non è andato: puoi comunque scegliere il giorno qui sotto.',
    },
    fallback: 'Se preferisci, scrivici a',
    thanks: 'Grazie, ti ricontattiamo a breve.',
    calendlyTitle: 'Scegli giorno e ora',
  },
  footer: { tagline: 'Turismo in bicicletta in tutta Europa.', privacy: 'Privacy', cookie: 'Cookie', rights: 'Tutti i diritti riservati' },
  legal: {
    privacyTitle: 'Informativa privacy',
    privacyBody: ['TODO: testo informativa privacy fornito dall’azienda (deve citare Brevo e Calendly)'],
    cookieTitle: 'Cookie',
    cookieBody: ['TODO: testo cookie policy fornito dall’azienda'],
  },
  langSwitch: { label: 'English' },
  a11y: { skip: 'Vai al contenuto', pause: 'Metti in pausa il video', play: 'Riproduci il video' },
};
