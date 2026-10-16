import type { SiteContent } from './types';

/*
 * Testi del sito in italiano. Regole di scrittura (direzione, ott 2026):
 *  - niente due punti nel testo visibile, nemmeno in titoli ed etichette;
 *  - solo numeri che rafforzano e che reggono (fonte: Marketing Hub, relazioni, questionari);
 *  - mai il numero dei partenti contati al via: accanto agli iscritti mostra chi non è venuto;
 *  - si parla da numero uno: mai «piccoli», «pochi», «le call le fa una persona sola»; il primato col numero accanto;
 *  - mai la durata della call, mai la scadenza del listino, mai le categorie occupate;
 *  - nessun filtro sul budget: ogni candidatura può prenotare la call (16/10);
 *  - la frase su che cosa fa AdventureLab (home.about.body[0]) è quella approvata dalla
 *    direzione il 16/10/2026: non si cambia senza la direzione.
 * Le chiavi devono restare identiche in en.ts (controllo in build).
 */
export const it: SiteContent = {
  nav: {
    territori: 'Territori',
    aziende: 'Aziende',
    about: 'Chi siamo',
    cta: 'Candidati',
    main: 'Principale',
  },

  form: {
    name: 'Nome e cognome',
    email: 'Email di lavoro',
    role: 'Ruolo',
    success: 'Cosa deve succedere perché per voi sia un successo?',
    successHint: 'Facoltativo. Due righe bastano.',
    privacy: 'Ho letto l’informativa privacy',
    optin: 'Voglio ricevere gli aggiornamenti di AdventureLab',
    submit: 'Invia la candidatura →',
    sending: 'Un attimo…',
    errors: {
      invalid_email: 'Controlla l’indirizzo email.',
      consent_required: 'Serve il consenso all’informativa privacy.',
      generic: 'Qualcosa non è andato. La candidatura ci arriva lo stesso se ci scrivi all’indirizzo qui sotto.',
    },
    fallback: 'Preferisci scrivere? L’indirizzo è',
    thanks: 'Grazie. Ti rispondiamo entro due giorni lavorativi.',
    calendlyTitle: 'Scegli il giorno della call',
  },

  home: {
    meta: {
      title: 'AdventureLab · Turismo in bicicletta per territori e aziende',
      description:
        'Diecimila partecipanti l’anno da tutto il mondo. AdventureLab progetta il turismo in bicicletta per i territori e cura le partnership della Bike Adventure Series, dalla Toscana a Capo Nord fino alla Patagonia.',
    },
    hero: {
      label: 'AdventureLab',
      title: 'Diecimila ciclisti l’anno',
      place: 'e sappiamo chi sono, uno per uno',
      subtitle:
        'Da più di dieci anni portiamo in bicicletta persone da 88 paesi, dalla Toscana a Capo Nord fino alla Patagonia. Sappiamo da dove arrivano, dove dormono e che cosa si portano dietro. È questo che mettiamo a disposizione di territori e aziende.',
      ctaPrimary: 'Sono un territorio',
      ctaSecondary: 'Sono un’azienda',
      caption: 'Tuscany Trail · Toscana, maggio',
      alt: '',
    },
    numbers: {
      label: 'In numeri',
      items: [
        { value: '10.000', label: 'partecipanti l’anno agli eventi della serie' },
        { value: '2 su 3', label: 'dall’estero al Tuscany Trail' },
        { value: '88', label: 'paesi da cui arrivano i nostri ciclisti' },
        { value: '62%', label: 'del Tuscany Trail venduto in due giorni' },
        { value: '82%', label: 'di aperture, le email agli iscritti' },
      ],
    },
    doors: {
      label: 'Due strade',
      title: 'Territori e aziende',
      intro: 'Ai territori portiamo persone che dormono, mangiano e tornano. Alle aziende portiamo l’attenzione di chi sceglie l’attrezzatura per partire. Scegli la tua strada.',
      items: [
        {
          kind: 'territori',
          who: 'Comuni · APT · Regioni · Parchi',
          title: 'Più presenze, fuori stagione',
          text: 'Eventi, prodotti cicloturistici e Tuscany Trail 365. Ciclisti da tutto il mondo che dormono sul territorio, contati e rendicontati località per località.',
          cta: 'Sono un territorio →',
          alt: 'Il gruppo del Tuscany Trail entra a Campiglia Marittima dalla porta del borgo, visto dal drone',
        },
        {
          kind: 'aziende',
          who: 'Marchi · Sponsor · Partner',
          title: 'Il tuo marchio dentro l’avventura',
          text: 'Davanti a diecimila ciclisti mentre scelgono che cosa portare, sulla strada con loro e nel racconto che ne fanno dopo.',
          cta: 'Sono un’azienda →',
          alt: 'Una partecipante con la bici gravel carica di borse da bikepacking in una piazza toscana',
        },
      ],
    },
    moat: {
      label: 'Quello che non si copia',
      title: 'Cinque cose che non si comprano',
      intro: 'Un evento si può imitare in una stagione. Queste cinque cose no, perché si costruiscono solo con gli anni e con le persone.',
      items: [
        {
          title: 'Un pubblico che ci aspetta',
          text: 'Le iscrizioni aprono e in pochi giorni gli eventi sono pieni. La domanda c’è prima ancora che l’evento cominci.',
          proof: 'Tuscany Trail 2026, il 62% venduto in due giorni · NorthCape4000 esaurito in 48 ore · Trentino Gravel esaurito in 22 minuti',
        },
        {
          title: 'Una serie, non un evento',
          text: 'Chi pedala con noi torna, e passa da un evento all’altro. Il pubblico si sposta con la serie da un territorio al successivo.',
          proof: 'Al Trentino Gravel 2026, la prima edizione, quasi un iscritto su due veniva da un altro evento della serie',
        },
        {
          title: 'Ci leggono davvero',
          text: 'Parliamo ai nostri iscritti direttamente, senza un algoritmo in mezzo. Quando scriviamo, aprono.',
          proof: 'Le email agli iscritti si aprono dal 65 all’82%',
        },
        {
          title: 'Contiamo tutto',
          text: 'Ogni anno raccogliamo migliaia di questionari e ricaviamo le notti dalle prenotazioni vere, località per località. A fine evento i numeri ci sono, non si stimano a occhio.',
          proof: 'Tuscany Trail 2026, migliaia di questionari compilati a evento finito',
        },
        {
          title: 'Strade pedalate, non disegnate a tavolino',
          text: 'Ogni traccia la percorriamo per intero in bicicletta prima di pubblicarla. Sappiamo che cosa regge il grande pubblico e che cosa no.',
          proof: 'Dal 2013, dalla Toscana a Capo Nord fino alla Patagonia',
        },
      ],
      band: 'Oltre seimila iscritti, una settimana, un territorio.',
      caption: 'Il village del Tuscany Trail 2026 a Venturina Terme, il giorno della partenza',
      alt: 'Il village del Tuscany Trail a Venturina Terme visto dal drone, con gli stand e i ciclisti in coda alla partenza',
    },
    events: {
      label: 'La serie',
      title: 'La Bike Adventure Series',
      intro: 'Sei avventure in bicicletta su due continenti, e un solo pubblico che le attraversa.',
      items: [
        { name: 'Tuscany Trail', line: 'Toscana, maggio. Una settimana di strade bianche dal mare alle colline.', stat: '6.156 iscritti nel 2026', url: 'https://www.tuscanytrail.it' },
        { name: 'NorthCape4000', line: 'Dall’Italia a Capo Nord, tre settimane in bicicletta.', stat: 'Esaurito in 48 ore', url: 'https://www.northcape4000.com' },
        { name: 'Trentino Gravel', line: 'Dolomiti e laghi del Trentino, a fine settembre.', stat: 'Esaurito in 22 minuti', url: 'https://www.trentinogravel.com' },
        { name: 'The Grand Escape', line: 'Le strade più belle d’Europa, in tre date e tre paesi.', stat: 'Oltre 1.400 iscritti', url: 'https://www.thegrandescape.cc' },
        { name: 'Unpaved Roads', line: 'Gravel nel weekend, a tappe in Italia.', stat: 'Oltre mille iscritti', url: 'https://www.unpavedroads.cc' },
        { name: 'Final Frontier Patagonia', line: 'Dalla Patagonia cilena a quella argentina, ai confini del mondo.', stat: 'Cile e Argentina', url: 'https://www.finalfrontierpatagonia.com' },
      ],
    },
    about: {
      label: 'Chi siamo',
      title: 'Chi siamo',
      intro: '',
      statement: 'Dal 2013 abbiamo portato in bicicletta decine di migliaia di persone da 88 paesi.',
      body: [
        'AdventureLab progetta il turismo in bicicletta per enti e territori e cura le partnership della Bike Adventure Series, la serie del Tuscany Trail, del NorthCape4000 e del Trentino Gravel.',
        'Il Tuscany Trail è l’evento bikepacking con più iscritti al mondo, oltre seimila nel 2026. La serie porta in bicicletta ogni anno diecimila partecipanti da tutto il mondo, dal Mediterraneo a Capo Nord fino alla Patagonia. Per questo scegliamo con chi lavorare.',
      ],
      stats: [
        { value: '25.000+', label: 'partecipanti solo nelle ultime tre stagioni' },
        { value: '10.000', label: 'partecipanti ogni anno' },
        { value: '88', label: 'paesi di provenienza' },
        { value: '6', label: 'eventi su due continenti' },
      ],
      facts: [
        { label: 'Ragione sociale', value: 'AdventureLab S.r.l.' },
        { label: 'Sede', value: 'Via Giulio Braga 98, 59100 Prato' },
        { label: 'P. IVA e C.F.', value: '02410590976' },
        { label: 'REA', value: 'PO 532864' },
        { label: 'PEC', value: 'adventurelab@pec.it' },
        { label: 'Partnership', value: 'collab@bikeadventureseries.com' },
      ],
      alt: 'Migliaia di ciclisti con le bici cariche alla partenza del Tuscany Trail, visti dall’alto',
    },
    closing: {
      title: 'Territorio o azienda?',
      text: 'Ogni strada finisce con una candidatura di due minuti. Se c’è spazio, ci sentiamo subito.',
    },
  },

  territori: {
    meta: {
      title: 'Per i territori · AdventureLab',
      description:
        'Eventi, prodotti cicloturistici e Tuscany Trail 365 per Comuni, APT, Regioni e parchi. Presenze in bassa stagione, due su tre dall’estero, contate e rendicontate a fine evento.',
    },
    hero: {
      label: 'Territori',
      title: 'Ciclisti che dormono da te',
      place: 'in bassa stagione, e due su tre dall’estero',
      subtitle:
        'Portiamo nei territori eventi e itinerari in bicicletta che riempiono letti, ristoranti e botteghe nei mesi in cui servono. Ogni presenza la contiamo e a fine evento te la rendicontiamo, località per località.',
      ctaPrimary: 'Candida il tuo territorio',
      ctaSecondary: 'Guarda i casi',
      caption: 'Campiglia Marittima · Tuscany Trail 2026',
      alt: 'Un gruppo di ciclisti con le bici cariche attraversa un vicolo del borgo di Campiglia Marittima',
    },
    numbers: {
      label: 'Cosa porta un evento',
      items: [
        { value: '55.000+', label: 'pernottamenti l’anno dal Tuscany Trail, stima Regione Toscana' },
        { value: '20 mln €', label: 'di ricadute in Toscana, stima Regione Toscana e TPT' },
        { value: '67%', label: 'dei partecipanti arriva dall’estero' },
        { value: '2.000', label: 'notti in Trentino alla prima edizione del Trentino Gravel' },
        { value: '9 su 10', label: 'il voto dei partecipanti al Trentino Gravel 2026' },
      ],
    },
    services: {
      label: 'Cosa facciamo',
      title: 'Tre modi di lavorare con noi',
      intro: 'Si parte da quello che serve al territorio, non da quello che abbiamo da vendere.',
      items: [
        {
          title: 'Un evento sul tuo territorio',
          text: 'Una partenza, un arrivo o un passaggio di un evento della Bike Adventure Series. Migliaia di ciclisti in una data scelta insieme, con il village, le notti prima e dopo e chi li accompagna. Per ogni data e ogni percorso c’è posto per un solo territorio.',
        },
        {
          title: 'Un prodotto cicloturistico',
          text: 'Itinerari gravel progettati sul pubblico vero, pedalati per intero e consegnati pronti per la promozione e per gli operatori. Si comincia con uno studio di fattibilità, così si investe solo su quello che regge.',
        },
        {
          title: 'Promozione verso chi pedala',
          text: 'Il racconto del territorio alla nostra community, con fotografie, articoli e i canali della serie. Arriva a chi sceglie dove andare in bicicletta, e poi ci va.',
        },
      ],
    },
    tt365: {
      label: 'In Toscana',
      title: 'Tuscany Trail 365',
      intro: 'Il Tuscany Trail tutto l’anno. È il nostro prodotto di punta per i territori toscani.',
      text: 'Migliaia di ciclisti conoscono la Toscana grazie al Tuscany Trail, e molti ci tornano per conto loro, in ogni stagione. Tuscany Trail 365 è il sito dove preparano quel viaggio. Un territorio che entra nel progetto si fa trovare proprio da loro.',
      points: [
        'La pagina del territorio, con i punti d’interesse sulla mappa',
        'Un articolo e una newsletter dedicata ai ciclisti interessati alla zona',
        'La presenza nella guida dei partecipanti al Tuscany Trail',
        'Un solo territorio per zona, e un report a fine anno',
      ],
      cta: 'Vedi Tuscany Trail 365',
      url: 'https://365.tuscanytrail.it',
      alt: 'Colline della Val d’Orcia al tramonto, con i filari di cipressi',
      caption: 'Toscana · Val d’Orcia',
    },
    cases: {
      label: 'Casi',
      title: 'Chi ci ha già scelto',
      intro: '',
      open: 'Leggi il caso',
      close: 'Chiudi',
      items: [
        {
          place: 'Campiglia Marittima',
          event: 'Tuscany Trail',
          summary: 'La casa del Tuscany Trail. Decine di migliaia di presenze generate da una settimana di maggio.',
          body: 'Il Comune di Campiglia Marittima ospita partenza, village e arrivo del Tuscany Trail con un affidamento triennale per le edizioni dal 2025 al 2027. Oltre seimila ciclisti da tutto il mondo dormono sul territorio almeno una notte, spesso due, e molti arrivano con chi li accompagna. L’evento genera decine di migliaia di presenze in pochi giorni.',
          stats: [
            { value: '3 anni', label: 'di affidamento' },
            { value: '6.156', label: 'iscritti 2026' },
            { value: '67%', label: 'dall’estero' },
          ],
          alt: 'Il borgo di Campiglia Marittima dall’alto, con il gruppo del Tuscany Trail che passa sotto la porta',
        },
        {
          place: 'Trentino',
          event: 'Trentino Gravel',
          summary: 'Dal prodotto all’evento, esaurito in 22 minuti alla prima edizione.',
          body: 'Con Trentino Marketing abbiamo costruito il prodotto gravel del territorio, e nel 2026 è diventato il Trentino Gravel, esaurito in 22 minuti dall’apertura delle iscrizioni. A fine settembre ha portato quasi 2.000 pernottamenti in 41 località trentine, e i partecipanti lo hanno votato 9 su 10.',
          stats: [
            { value: '22 min', label: 'per esaurire i posti' },
            { value: '2.000', label: 'pernottamenti' },
            { value: '9/10', label: 'il voto dei partecipanti' },
          ],
          alt: 'Ciclisti con le bici da gravel in piazza del Duomo a Trento, controluce',
        },
        {
          place: 'Foreste Casentinesi',
          event: 'Unpaved Roads',
          summary: 'Una tappa gravel nel parco nazionale, ogni anno dal 2022.',
          body: 'Dal 2022 Unpaved Roads porta ogni anno una tappa gravel nel Parco Nazionale delle Foreste Casentinesi, tra Toscana e Romagna. È un appuntamento fisso del calendario, che nel 2026 ha richiamato ciclisti da 21 paesi.',
          stats: [
            { value: '5', label: 'edizioni dal 2022' },
            { value: '21', label: 'paesi nel 2026' },
          ],
          alt: 'La partenza di una tappa Unpaved Roads sotto l’arco gonfiabile',
        },
      ],
    },
    band: {
      text: 'Chi arriva in bicicletta si ferma, mangia e compra sul posto.',
      source: 'Isnart stima circa 110 euro di spesa a persona per notte (Viaggiare con la bici, 2025).',
      alt: 'Tre ciclisti mangiano un gelato al tavolino di un bar di paese',
    },
    clients: {
      label: 'Committenti',
      title: 'Alcuni di quelli che hanno lavorato con noi',
      intro: 'Uffici del turismo di capitali europee, regioni, comuni e parchi. Lavoriamo con i grandi e con i piccoli, con lo stesso metodo.',
      groups: [
        {
          title: 'Capitali e città d’Europa',
          names: ['Berlino', 'Copenaghen', 'Stoccolma', 'Oslo', 'Helsinki', 'Varsavia', 'Praga', 'Tallinn', 'Riga', 'Monaco di Baviera', 'Losanna', 'Rovaniemi'],
        },
        {
          title: 'Regioni ed enti del turismo',
          names: ['Regione Toscana', 'Toscana Promozione Turistica', 'Trentino Marketing', 'Trentino Sviluppo', 'Visit Norway', 'APT Val di Sole'],
        },
        {
          title: 'Comuni, parchi e valli',
          names: ['Campiglia Marittima', 'Monterotondo Marittimo', 'Tarquinia', 'Bormio', 'Parco Nazionale delle Foreste Casentinesi', 'Parco Nazionale Patagonia', 'Gällivare', 'Bastogne'],
        },
      ],
    },
    howto: {
      label: 'Come si affida',
      title: 'Dalla call alla determina',
      intro: 'Sappiamo come lavora un ente pubblico, e le carte che servono le prepariamo noi.',
      steps: [
        { title: 'Una prima call', text: 'Capiamo che cosa vuole ottenere il territorio, in quali date e con quali strade. Se non siamo la risposta giusta te lo diciamo subito.' },
        { title: 'Una proposta pronta per l’atto', text: 'Oggetto, attività, consegne, tempi e importo, scritti nella forma che serve al responsabile del procedimento per la determina.' },
        { title: 'L’affidamento', text: 'Per gli importi sotto soglia l’ente può procedere con un affidamento diretto. Chi sceglie più edizioni programma meglio e vede crescere le presenze anno dopo anno.' },
        { title: 'La relazione finale', text: 'Presenze, pernottamenti per località, provenienze, spesa stimata con fonte esterna e gradimento. Il documento da portare in giunta.' },
      ],
    },
    fit: {
      label: 'Non è per tutti',
      title: 'Scegliamo i territori con cui lavorare',
      intro: 'Ogni evento ha una data e un percorso, e su ciascuno c’è posto per un solo territorio. Funziona dove ci sono queste quattro condizioni.',
      items: [
        'Strade bianche o una rete di sterrati percorribili in bicicletta.',
        'Letti aperti nelle date dell’evento, anche fuori stagione.',
        'Un ente che vuole misurare presenze, non contare i like.',
        'La voglia di costruire su più edizioni.',
      ],
    },
    form: {
      label: 'Candidatura',
      title: 'Candida il tuo territorio',
      intro:
        'Sareste contrari a una call per capire se il vostro territorio ha i numeri per un evento? Per candidarvi bastano due minuti. Se c’è una strada percorribile scegliete subito il giorno, se non c’è ve lo diciamo.',
      org: 'Ente',
      territory: 'Territorio e comuni interessati',
      goal: 'Che cosa vi serve di più?',
      goals: ['Presenze in bassa stagione', 'Turisti dall’estero', 'Un prodotto cicloturistico', 'Un evento sul territorio', 'Tuscany Trail 365'],
      thanks: 'Grazie. Leggiamo la candidatura e ti rispondiamo entro due giorni lavorativi.',
    },
  },

  aziende: {
    meta: {
      title: 'Per le aziende · AdventureLab',
      description:
        'Il tuo marchio davanti a diecimila ciclisti mentre scelgono che cosa portare, sulla strada con loro e nel racconto che ne fanno dopo. Le partnership della Bike Adventure Series.',
    },
    hero: {
      label: 'Aziende',
      title: 'Diecimila ciclisti che si preparano per mesi',
      place: 'e scelgono con noi che cosa portare',
      subtitle:
        'Chi parte per un evento della Bike Adventure Series passa mesi a scegliere l’attrezzatura e poi la usa per giorni. Mettiamo il tuo marchio davanti a loro mentre scelgono, sulla strada con loro e nel racconto che ne fanno dopo.',
      ctaPrimary: 'Candida la tua azienda',
      ctaSecondary: 'Come funziona',
      caption: 'Rovereto · la partenza del NorthCape4000',
      alt: 'Centinaia di ciclisti con le bici cariche sotto l’arco di partenza di uno sponsor',
    },
    numbers: {
      label: 'Il pubblico',
      items: [
        { value: '10.000', label: 'partecipanti l’anno agli eventi della serie' },
        { value: '6.156', label: 'iscritti al solo Tuscany Trail 2026' },
        { value: '67%', label: 'dall’estero, prima la Germania' },
        { value: '49', label: 'anni l’età mediana, metà sopra i 50' },
        { value: '82%', label: 'di aperture, le email agli iscritti' },
      ],
    },
    why: {
      label: 'Perché funziona',
      title: 'Prima, durante e dopo',
      intro: 'Un cartellone si guarda per tre secondi. Noi stiamo con i ciclisti per mesi.',
      items: [
        { title: 'Prima, quando scelgono', text: 'Per mesi i partecipanti studiano e comprano l’attrezzatura. Li accompagniamo con la guida, le email e l’app, e lì il tuo marchio è quello che consigliamo, con il codice sconto.' },
        { title: 'Durante, sulla strada', text: 'Il tuo marchio è alla partenza, al village, nella guida e nell’app che usano ogni giorno. Chi ha il tuo prodotto lo usa per giorni sotto gli occhi degli altri.' },
        { title: 'Dopo, nel racconto', text: 'Migliaia di foto e video dei partecipanti, i nostri contenuti e il report con i numeri della partnership.' },
      ],
    },
    band: {
      text: 'L’attrezzatura si sceglie mesi prima del via, e si usa fino all’ultimo chilometro.',
      alt: 'Un ciclista con la bici carica di borse da bikepacking su una strada bianca tra i cipressi',
    },
    tiers: {
      label: 'Come si entra',
      title: 'Tre modi di entrare',
      intro: '',
      items: [
        { scope: 'Un evento', title: 'Sponsor tecnico', text: 'Il modo più semplice di entrare nella serie, con una presenza essenziale all’evento e verso i suoi partecipanti.' },
        { scope: 'Un evento', title: 'Partner', text: 'L’evento diventa il tuo palcoscenico, prima, durante e dopo.' },
        { scope: 'Tutta la serie', title: 'BAS Partner', text: 'La presenza su tutti gli eventi, dalla Toscana a Capo Nord fino alla Patagonia. Pochi posti.' },
      ],
      note: 'Se vuoi approfondire ci sentiamo in una call, poi ricevi una proposta di una pagina, senza preventivi infiniti. Si firma per una stagione o per due.',
    },
    report: {
      label: 'Il report',
      title: 'Tutto quello che ti offriamo si misura',
      intro: 'A 30 giorni dall’evento ricevi un report con i numeri veri della partnership, presi dai nostri sistemi. È l’impegno che mettiamo per iscritto, perché dipende solo da noi.',
      items: [
        { title: 'Email', text: 'Invii, aperture e clic sul tuo banner, con il link tracciato.' },
        { title: 'Social', text: 'Copertura e interazioni dei contenuti dedicati al tuo marchio.' },
        { title: 'Il pubblico', text: 'Quante persone hai raggiunto, da quali paesi e di che età.' },
      ],
    },
    partners: {
      label: 'Chi c’è già',
      title: 'Chi c’è già',
      intro: 'Alcuni dei marchi che hanno scelto la Bike Adventure Series, quasi tutti arrivati da soli. Nel bikepacking chi conosce il settore ci cerca.',
      names: ['Vittoria', 'Abus', 'Northwave', 'Selle San Marco', 'Enervit', 'Ride with GPS', 'RH+', 'Sportler'],
    },
    form: {
      label: 'Candidatura',
      title: 'Candida la tua azienda',
      intro:
        'Sareste contrari a una call per capire quale evento fa per voi? Per candidarvi bastano due minuti. Se c’è spazio scegliete subito il giorno.',
      org: 'Azienda',
      category: 'Settore o categoria di prodotto',
      categoryChoose: 'Scegli il settore',
      categories: [
        'Abbigliamento tecnico', 'Accessori', 'Antifurto', 'Assicurazioni e servizi', 'Auto e furgoni', 'Biciclette',
        'Borse da bikepacking', 'Caschi', 'Cibo e bevande', 'Luci', 'Navigazione e app', 'Nutrizione sportiva',
        'Occhiali', 'Ospitalità', 'Pneumatici', 'Retail sportivo', 'Scarpe', 'Selle', 'Sleep system e tende', 'Viaggi e voli',
      ],
      categoryOther: 'Un altro settore',
      markets: 'Dove vendete',
      budget: 'Budget annuale per le sponsorizzazioni',
      budgets: ['Fino a 5.000 €', 'Da 5.000 a 15.000 €', 'Da 15.000 a 30.000 €', 'Oltre 30.000 €', 'Ancora da definire'],
      thanks: 'Grazie. Leggiamo la candidatura e ti rispondiamo entro due giorni lavorativi.',
    },
  },

  footer: {
    tagline: 'Turismo in bicicletta per territori e aziende.',
    privacy: 'Privacy',
    cookie: 'Cookie',
    rights: 'Tutti i diritti riservati',
    vat: 'P. IVA',
    capital: 'Capitale sociale',
  },
  legal: {
    privacyTitle: 'Informativa privacy',
    privacyBody: ['TODO: testo informativa privacy fornito dall’azienda (deve citare Brevo, Google Calendar e la casella collab@bikeadventureseries.com)'],
    cookieTitle: 'Cookie',
    cookieBody: ['TODO: testo cookie policy fornito dall’azienda'],
  },
  langSwitch: { label: 'English' },
  a11y: { skip: 'Vai al contenuto', pause: 'Metti in pausa il video', play: 'Riproduci il video' },
  notFound: { title: 'Pagina non trovata', home: 'Torna alla home' },
};
