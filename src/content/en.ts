import type { SiteContent } from './types';

/* English texts. Same keys as it.ts (checked at build time). Same writing rules:
   no colons in visible copy, only numbers that hold, never the count of riders at
   the start, speak as number one, never the length of the call, no rate-card
   deadline, no list of taken categories. */
export const en: SiteContent = {
  nav: {
    territori: 'Destinations',
    aziende: 'Brands',
    about: 'About',
    cta: 'Apply',
    main: 'Main',
  },

  form: {
    name: 'Full name',
    email: 'Work email',
    role: 'Role',
    success: 'What needs to happen for this to be a success for you?',
    successHint: 'Optional. Two lines are enough.',
    privacy: 'I have read the privacy notice',
    optin: 'I want to receive AdventureLab updates',
    submit: 'Send the application →',
    sending: 'One moment…',
    errors: {
      invalid_email: 'Please check the email address.',
      consent_required: 'Please accept the privacy notice.',
      generic: 'Something went wrong. Your application still reaches us if you write to the address below.',
    },
    fallback: 'Rather write? The address is',
    thanks: 'Thank you. We will reply within two working days.',
    calendlyTitle: 'Pick a day for the call',
  },

  home: {
    meta: {
      title: 'AdventureLab · Cycling tourism for destinations and brands',
      description:
        'Ten thousand participants a year from all over the world. AdventureLab designs cycling tourism for destinations and runs the partnerships of the Bike Adventure Series, from Tuscany to the North Cape and Patagonia.',
    },
    hero: {
      label: 'AdventureLab',
      title: 'Ten thousand riders a year',
      place: 'and we know every single one',
      subtitle:
        'For more than ten years we have put people from 88 countries on bikes, from Tuscany to the North Cape and all the way to Patagonia. We know where they come from, where they sleep and what they carry. That is what we offer destinations and brands.',
      ctaPrimary: 'I am a destination',
      ctaSecondary: 'I am a brand',
      caption: 'Tuscany Trail · Tuscany, May',
      alt: '',
    },
    numbers: {
      label: 'In numbers',
      items: [
        { value: '10,000', label: 'participants a year at the series events' },
        { value: '2 in 3', label: 'from abroad at the Tuscany Trail' },
        { value: '88', label: 'countries our riders come from' },
        { value: '62%', label: 'of the Tuscany Trail sold in two days' },
        { value: '82%', label: 'open rate on emails to participants' },
      ],
    },
    doors: {
      label: 'Two roads',
      title: 'Destinations and brands',
      intro: 'To destinations we bring people who sleep, eat and come back. To brands we bring the attention of people choosing the gear they will ride with. Choose your road.',
      items: [
        {
          kind: 'territori',
          who: 'Municipalities · Tourist boards · Regions · Parks',
          title: 'More visitors, out of season',
          text: 'Events, cycling tourism products and Tuscany Trail 365. Riders from all over the world who sleep in your area, counted and reported place by place.',
          cta: 'I am a destination →',
          alt: 'The Tuscany Trail riders entering Campiglia Marittima through the town gate, seen from a drone',
        },
        {
          kind: 'aziende',
          who: 'Brands · Sponsors · Partners',
          title: 'Your brand inside the adventure',
          text: 'In front of ten thousand riders while they choose what to bring, on the road with them and in the story they tell afterwards.',
          cta: 'I am a brand →',
          alt: 'A rider with a gravel bike loaded with bikepacking bags in a Tuscan square',
        },
      ],
    },
    moat: {
      label: 'What cannot be copied',
      title: 'Five things money cannot buy',
      intro: 'An event can be imitated in one season. These five things cannot, because they take years and people to build.',
      items: [
        {
          title: 'An audience that is waiting',
          text: 'Registrations open and within days the events are full. The demand is there before the event even begins.',
          proof: 'Tuscany Trail 2026, 62% sold in two days · NorthCape4000 sold out in 48 hours · Trentino Gravel sold out in 22 minutes',
        },
        {
          title: 'A series, not an event',
          text: 'People who ride with us come back, and move from one event to the next. The audience follows the series from one destination to another.',
          proof: 'At Trentino Gravel 2026, its first edition, almost one rider in two came from another event of the series',
        },
        {
          title: 'They actually read us',
          text: 'We speak to our riders directly, with no algorithm in between. When we write, they open.',
          proof: 'Emails to participants are opened by 65 to 82%',
        },
        {
          title: 'We count everything',
          text: 'Every year we collect thousands of surveys and work out nights from real bookings, place by place. At the end of the event the numbers are there, not guessed.',
          proof: 'Tuscany Trail 2026, thousands of surveys completed after the event',
        },
        {
          title: 'Roads ridden, not drawn on a desk',
          text: 'We ride every route in full before we publish it. We know what works for a wide audience and what does not.',
          proof: 'Since 2013, from Tuscany to the North Cape and Patagonia',
        },
      ],
      band: 'Over six thousand riders, one week, one destination.',
      caption: 'The Tuscany Trail 2026 village in Venturina Terme, on start day',
      alt: 'The Tuscany Trail village in Venturina Terme seen from a drone, with the stands and riders queuing for the start',
    },
    events: {
      label: 'The series',
      title: 'The Bike Adventure Series',
      intro: 'Six bike adventures on two continents, and one audience that rides through all of them.',
      items: [
        { name: 'Tuscany Trail', line: 'Tuscany, May. A week of white roads from the sea to the hills.', stat: '6,156 riders in 2026', url: 'https://www.tuscanytrail.it' },
        { name: 'NorthCape4000', line: 'From Italy to the North Cape, three weeks on the bike.', stat: 'Sold out in 48 hours', url: 'https://www.northcape4000.com' },
        { name: 'Trentino Gravel', line: 'The Dolomites and lakes of Trentino, in late September.', stat: 'Sold out in 22 minutes', url: 'https://www.trentinogravel.com' },
        { name: 'The Grand Escape', line: 'The most beautiful roads in Europe, three dates in three countries.', stat: 'Over 1,400 riders', url: 'https://www.thegrandescape.cc' },
        { name: 'Unpaved Roads', line: 'Weekend gravel, in stages across Italy.', stat: 'Over a thousand riders', url: 'https://www.unpavedroads.cc' },
        { name: 'Final Frontier Patagonia', line: 'From Chilean to Argentine Patagonia, at the end of the world.', stat: 'Chile and Argentina', url: 'https://www.finalfrontierpatagonia.com' },
      ],
    },
    about: {
      label: 'About',
      title: 'About us',
      intro: '',
      statement: 'Since 2013 we have put tens of thousands of people from 88 countries on bikes.',
      body: [
        'AdventureLab designs cycling tourism for public bodies and destinations and runs the partnerships of the Bike Adventure Series, the series of the Tuscany Trail, the NorthCape4000 and the Trentino Gravel.',
        'The Tuscany Trail is the bikepacking event with the most riders in the world, over six thousand in 2026. Every year the series puts ten thousand participants from all over the world on bikes, from the Mediterranean to the North Cape and Patagonia. That is why we choose who we work with.',
      ],
      stats: [
        { value: '25,000+', label: 'participants in the last three seasons alone' },
        { value: '10,000', label: 'participants every year' },
        { value: '88', label: 'countries of origin' },
        { value: '6', label: 'events on two continents' },
      ],
      facts: [
        { label: 'Company', value: 'AdventureLab S.r.l.' },
        { label: 'Registered office', value: 'Via Giulio Braga 98, 59100 Prato, Italy' },
        { label: 'VAT', value: 'IT02410590976' },
        { label: 'REA', value: 'PO 532864' },
        { label: 'PEC', value: 'adventurelab@pec.it' },
        { label: 'Partnerships', value: 'collab@bikeadventureseries.com' },
      ],
      alt: 'Thousands of riders with loaded bikes at the start of the Tuscany Trail, seen from above',
    },
    closing: {
      title: 'Destination or brand?',
      text: 'Each road ends with a two minute application. If there is room, we talk right away.',
    },
  },

  territori: {
    meta: {
      title: 'For destinations · AdventureLab',
      description:
        'Events, cycling tourism products and Tuscany Trail 365 for municipalities, tourist boards, regions and parks. Low season overnight stays, two in three from abroad, counted and reported after the event.',
    },
    hero: {
      label: 'Destinations',
      title: 'Riders who sleep in your area',
      place: 'in the low season, and two in three from abroad',
      subtitle:
        'We bring bike events and routes to destinations, filling beds, restaurants and shops in the months when they need it. We count every visitor and after the event we report them to you, place by place.',
      ctaPrimary: 'Apply for your destination',
      ctaSecondary: 'See the cases',
      caption: 'Campiglia Marittima · Tuscany Trail 2026',
      alt: 'A group of riders with loaded bikes rides through an alley in the old town of Campiglia Marittima',
    },
    numbers: {
      label: 'What an event brings',
      items: [
        { value: '55,000+', label: 'overnight stays a year from the Tuscany Trail, Tuscany Region estimate' },
        { value: '€20M', label: 'of economic impact in Tuscany, Tuscany Region and TPT estimate' },
        { value: '67%', label: 'of participants come from abroad' },
        { value: '2,000', label: 'nights in Trentino at the first Trentino Gravel' },
        { value: '9 in 10', label: 'the riders’ score for Trentino Gravel 2026' },
      ],
    },
    services: {
      label: 'What we do',
      title: 'Three ways to work with us',
      intro: 'We start from what the destination needs, not from what we have to sell.',
      items: [
        {
          title: 'An event in your area',
          text: 'A start, a finish or a passage of a Bike Adventure Series event. Thousands of riders on a date chosen together, with the village, the nights before and after and the people travelling with them. For each date and route there is room for one destination only.',
        },
        {
          title: 'A cycling tourism product',
          text: 'Gravel routes designed around the real audience, ridden in full and delivered ready for promotion and for local operators. It starts with a feasibility study, so you only invest in what works.',
        },
        {
          title: 'Promotion to people who ride',
          text: 'The story of your destination told to our community, with photography, articles and the series channels. It reaches people who choose where to ride, and then go.',
        },
      ],
    },
    tt365: {
      label: 'In Tuscany',
      title: 'Tuscany Trail 365',
      intro: 'The Tuscany Trail all year round. It is our flagship product for Tuscan destinations.',
      text: 'Thousands of riders know Tuscany through the Tuscany Trail, and many come back on their own, in every season. Tuscany Trail 365 is the site where they plan that trip. A destination that joins the project is found by exactly those people.',
      points: [
        'The destination page, with points of interest on the map',
        'An article and a newsletter sent to riders interested in the area',
        'A place in the Tuscany Trail participants’ guide',
        'One destination per area, and a report at the end of the year',
      ],
      cta: 'See Tuscany Trail 365',
      url: 'https://365.tuscanytrail.it',
      alt: 'The hills of the Val d’Orcia at sunset, with rows of cypress trees',
      caption: 'Tuscany · Val d’Orcia',
    },
    cases: {
      label: 'Cases',
      title: 'Who has already chosen us',
      intro: '',
      open: 'Read the case',
      close: 'Close',
      items: [
        {
          place: 'Campiglia Marittima',
          event: 'Tuscany Trail',
          summary: 'The home of the Tuscany Trail. Tens of thousands of overnight stays from one week in May.',
          body: 'The Municipality of Campiglia Marittima hosts the start, the village and the finish of the Tuscany Trail under a three year contract covering the 2025 to 2027 editions. Over six thousand riders from all over the world sleep in the area at least one night, often two, and many come with people travelling with them. The event brings tens of thousands of overnight stays in a few days.',
          stats: [
            { value: '3 years', label: 'contract' },
            { value: '6,156', label: 'riders 2026' },
            { value: '67%', label: 'from abroad' },
          ],
          alt: 'The old town of Campiglia Marittima from above, with the Tuscany Trail riders passing under the gate',
        },
        {
          place: 'Trentino',
          event: 'Trentino Gravel',
          summary: 'From product to event, sold out in 22 minutes at its first edition.',
          body: 'With Trentino Marketing we built the destination’s gravel product, and in 2026 it became the Trentino Gravel, sold out 22 minutes after registrations opened. In late September it brought almost 2,000 overnight stays to 41 places in Trentino, and riders gave it 9 out of 10.',
          stats: [
            { value: '22 min', label: 'to sell out' },
            { value: '2,000', label: 'overnight stays' },
            { value: '9/10', label: 'riders’ score' },
          ],
          alt: 'Riders with gravel bikes in the cathedral square of Trento, against the light',
        },
        {
          place: 'Foreste Casentinesi',
          event: 'Unpaved Roads',
          summary: 'A gravel stage in the national park, every year since 2022.',
          body: 'Since 2022 Unpaved Roads has brought a gravel stage to the Foreste Casentinesi National Park, between Tuscany and Romagna, every year. It is a fixed date on the calendar, and in 2026 it drew riders from 21 countries.',
          stats: [
            { value: '5', label: 'editions since 2022' },
            { value: '21', label: 'countries in 2026' },
          ],
          alt: 'The start of an Unpaved Roads stage under the inflatable arch',
        },
      ],
    },
    band: {
      text: 'People who arrive by bike stop, eat and buy locally.',
      source: 'Isnart estimates around 110 euro of spending per person per night (Viaggiare con la bici, 2025).',
      alt: 'Three riders eating ice cream at a village café table',
    },
    clients: {
      label: 'Clients',
      title: 'Some of those who have worked with us',
      intro: 'Tourism offices of European capitals, regions, municipalities and parks. We work with the big ones and the small ones, with the same method.',
      groups: [
        {
          title: 'Capitals and cities of Europe',
          names: ['Berlin', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Warsaw', 'Prague', 'Tallinn', 'Riga', 'Munich', 'Lausanne', 'Rovaniemi'],
        },
        {
          title: 'Regions and tourist boards',
          names: ['Tuscany Region', 'Toscana Promozione Turistica', 'Trentino Marketing', 'Trentino Sviluppo', 'Visit Norway', 'Val di Sole tourist board'],
        },
        {
          title: 'Municipalities, parks and valleys',
          names: ['Campiglia Marittima', 'Monterotondo Marittimo', 'Tarquinia', 'Bormio', 'Foreste Casentinesi National Park', 'Patagonia National Park', 'Gällivare', 'Bastogne'],
        },
      ],
    },
    howto: {
      label: 'How to commission',
      title: 'From the call to the contract',
      intro: 'We know how public bodies work, and we prepare the paperwork they need.',
      steps: [
        { title: 'A first call', text: 'We understand what the destination wants to achieve, on which dates and on which roads. If we are not the right answer we tell you straight away.' },
        { title: 'A proposal ready for the act', text: 'Subject, activities, deliverables, timing and amount, written in the form the procurement officer needs.' },
        { title: 'The award', text: 'Below the threshold, Italian public bodies can award the service directly. Destinations that choose several editions plan better and see visitors grow year after year.' },
        { title: 'The final report', text: 'Visitors, overnight stays by place, origin, estimated spending with an external source and satisfaction. The document to bring to the council.' },
      ],
    },
    fit: {
      label: 'Not for everyone',
      title: 'We choose the destinations we work with',
      intro: 'Every event has one date and one route, and each has room for one destination only. It works where these four conditions are met.',
      items: [
        'White roads or a network of gravel tracks that can be ridden.',
        'Beds open on the event dates, even out of season.',
        'A body that wants to measure visitors, not count likes.',
        'The will to build over several editions.',
      ],
    },
    form: {
      label: 'Application',
      title: 'Apply for your destination',
      intro:
        'Would you be against a call to find out whether your destination has what it takes for an event? Applying takes two minutes. If there is a road forward, pick the day right away. If there is not, we will tell you.',
      org: 'Organisation',
      territory: 'Area and towns involved',
      goal: 'What do you need most?',
      goals: ['Low season visitors', 'Visitors from abroad', 'A cycling tourism product', 'An event in the area', 'Tuscany Trail 365'],
      thanks: 'Thank you. We will read your application and reply within two working days.',
    },
  },

  aziende: {
    meta: {
      title: 'For brands · AdventureLab',
      description:
        'Your brand in front of ten thousand riders while they choose what to bring, on the road with them and in the story they tell afterwards. The partnerships of the Bike Adventure Series.',
    },
    hero: {
      label: 'Brands',
      title: 'Ten thousand riders who prepare for months',
      place: 'and choose with us what to bring',
      subtitle:
        'People who ride a Bike Adventure Series event spend months choosing their gear and then use it for days. We put your brand in front of them while they choose, on the road with them and in the story they tell afterwards.',
      ctaPrimary: 'Apply for your company',
      ctaSecondary: 'How it works',
      caption: 'Rovereto · the start of the NorthCape4000',
      alt: 'Hundreds of riders with loaded bikes under a sponsor’s start arch',
    },
    numbers: {
      label: 'The audience',
      items: [
        { value: '10,000', label: 'participants a year at the series events' },
        { value: '6,156', label: 'riders at the Tuscany Trail 2026 alone' },
        { value: '67%', label: 'from abroad, Germany first' },
        { value: '49', label: 'median age, half over 50' },
        { value: '82%', label: 'open rate on emails to participants' },
      ],
    },
    why: {
      label: 'Why it works',
      title: 'Before, during and after',
      intro: 'People look at a billboard for three seconds. We are with riders for months.',
      items: [
        { title: 'Before, while they choose', text: 'For months participants study and buy their gear. We are with them through the guide, the emails and the app, and there your brand is the one we recommend, with the discount code.' },
        { title: 'During, on the road', text: 'Your brand is at the start, in the village, in the guide and in the app they use every day. Riders who own your product use it for days in front of everyone else.' },
        { title: 'After, in the story', text: 'Thousands of photos and videos from participants, our own content and the report with the numbers of the partnership.' },
      ],
    },
    band: {
      text: 'Gear is chosen months before the start, and used until the last kilometre.',
      alt: 'A rider with a bike loaded with bikepacking bags on a white road between cypress trees',
    },
    tiers: {
      label: 'How to join',
      title: 'Three ways in',
      intro: '',
      items: [
        { scope: 'One event', title: 'Technical sponsor', text: 'The simplest way into the series, with an essential presence at the event and with its participants.' },
        { scope: 'One event', title: 'Partner', text: 'The event becomes your stage, before, during and after.' },
        { scope: 'The whole series', title: 'BAS Partner', text: 'Presence at every event, from Tuscany to the North Cape and Patagonia. Few places.' },
      ],
      note: 'If you want to go deeper we talk on a call, then you receive a one page proposal, with no endless quotes. You can sign for one season or two.',
    },
    report: {
      label: 'The report',
      title: 'Everything we offer you is measured',
      intro: 'Thirty days after the event you receive a report with the real numbers of the partnership, taken from our own systems. It is the commitment we put in writing, because it depends only on us.',
      items: [
        { title: 'Email', text: 'Sends, opens and clicks on your banner, with a tracked link.' },
        { title: 'Social', text: 'Reach and engagement of the content dedicated to your brand.' },
        { title: 'The audience', text: 'How many people you reached, from which countries and of what age.' },
      ],
    },
    partners: {
      label: 'Already on board',
      title: 'Already on board',
      intro: 'Some of the brands that have chosen the Bike Adventure Series, almost all of them came to us on their own. In bikepacking, people who know the field find us.',
      names: ['Vittoria', 'Abus', 'Northwave', 'Selle San Marco', 'Enervit', 'Ride with GPS', 'RH+', 'Sportler'],
    },
    form: {
      label: 'Application',
      title: 'Apply for your company',
      intro:
        'Would you be against a call to find out which event suits you? Applying takes two minutes. If there is room, pick the day right away.',
      org: 'Company',
      category: 'Sector or product category',
      categoryChoose: 'Choose the sector',
      categories: [
        'Technical apparel', 'Accessories', 'Locks', 'Insurance and services', 'Cars and vans', 'Bikes',
        'Bikepacking bags', 'Helmets', 'Food and drink', 'Lights', 'Navigation and apps', 'Sports nutrition',
        'Eyewear', 'Hospitality', 'Tyres', 'Sports retail', 'Shoes', 'Saddles', 'Sleep systems and tents', 'Travel and airlines',
      ],
      categoryOther: 'Another sector',
      markets: 'Where you sell',
      budget: 'Yearly sponsorship budget',
      budgets: ['Up to €5,000', '€5,000 to €15,000', '€15,000 to €30,000', 'Over €30,000', 'Not decided yet'],
      thanks: 'Thank you. We will read your application and reply within two working days.',
    },
  },

  footer: {
    tagline: 'Cycling tourism for destinations and brands.',
    privacy: 'Privacy',
    cookie: 'Cookies',
    rights: 'All rights reserved',
    vat: 'VAT',
    capital: 'Share capital',
  },
  legal: {
    privacyTitle: 'Privacy notice',
    // Una riga che comincia con «## » diventa un titolo di sezione (LegalPage.astro).
    privacyBody: [
      'Last updated 16 October 2026.',
      '## Who is responsible',
      'The data controller is AdventureLab S.r.l., via Giulio Braga 98, 59100 Prato (PO), Italy, VAT no. 02410590976, certified email adventurelab@pec.it. For anything about your personal data write to collab@bikeadventureseries.com, the mailbox we read every day for all our work with destinations and brands.',
      '## What you give us with your application, and why',
      'There is no account to create and nothing to buy on this site. The only form is the application, on the destinations page and on the brands page. It asks for your name, work email, organisation and role, and then for what we need to prepare the first call, that is the territory, the goal, the sector, the markets, the indicative budget and what success would look like for you. We also record the language and the page you wrote from.',
      'We use this data to assess the partnership, reply to you and prepare the call. The legal basis is taking steps at your request prior to entering into a contract (Art. 6(1)(b) GDPR). To send the application we ask you to confirm that you have read this notice.',
      'Your application goes to two places. A copy reaches the collab@bikeadventureseries.com mailbox as an email, with your address set as the reply-to. Your contact is saved in Brevo, in a list kept only for AdventureLab applications, together with the type of application, your organisation, the language and the date.',
      '## Updates, only if you ask',
      'If you tick the updates box we write to you now and then about AdventureLab projects, events and results. The legal basis is your consent (Art. 6(1)(a) GDPR). Every email carries an unsubscribe link, and you can also write to us. Withdrawing your consent takes effect from that moment and does not affect what was lawful before. If you leave the box unticked you receive no such emails.',
      '## Booking the call',
      'After you send the application a calendar appears so you can pick a day for the call. It is a Google Calendar page (Google Ireland Limited) shown inside our site, and it loads only after you have sent the application. What you enter there to book reaches us as an appointment, and Google processes it under its own privacy policy (policies.google.com/privacy). When it loads, the Google page may set cookies on Google domains, as explained on the cookies page.',
      '## Who processes data on our behalf',
      'Brevo (Sendinblue SAS, France) stores contacts and sends emails, with data kept inside the European Union.',
      'Cloudflare, Inc. hosts the site, runs the service that receives applications and provides Turnstile, the check that protects the form from automated submissions. To do so it processes your IP address and some technical features of your browser, based on our legitimate interest in protecting the site (Art. 6(1)(f) GDPR).',
      'Google (Google Ireland Limited) provides the mailbox and the calendar for calls.',
      'All of them act as our data processors (Art. 28 GDPR). We do not sell or hand over your data to anyone, and we do not use it for automated decisions or profiling.',
      '## What is recorded automatically',
      'Like any web server, the Cloudflare infrastructure records your IP address, the requested page, the time and your browser type, to deliver the pages and protect the site from abuse (legitimate interest, Art. 6(1)(f) GDPR). The application service does not write your email into its own logs, and those logs delete themselves after a few days. The site uses no analytics, advertising pixels or profiling.',
      '## Transfers outside the European Union',
      'Cloudflare and Google may process data outside the European Union, in particular in the United States. Transfers rely on the safeguards of Articles 44 and following of the GDPR, namely the EU-US Data Privacy Framework and the European Commission’s standard contractual clauses.',
      '## How long we keep it',
      'Your application and your Brevo contact are kept as long as needed to assess and start the partnership. If the partnership does not go ahead, we delete them within 24 months of our last contact. Data for updates is kept until you unsubscribe. If a contract follows, the retention periods required by law for contractual and tax records apply.',
      '## Your rights',
      'At any time you may ask us for access to your data, its rectification or erasure, restriction of processing and portability, and you may object to processing based on legitimate interest (Articles 15 to 22 GDPR). Write to collab@bikeadventureseries.com and we will reply within one month. If you believe your data has been mishandled you may lodge a complaint with the Italian supervisory authority (Garante per la protezione dei dati personali, garanteprivacy.it) or with the authority of the country where you live.',
      '## Changes',
      'If this notice changes we update the date at the top of the page. If a change affects processing based on your consent, we will ask for that consent again.',
    ],
    cookieTitle: 'Cookies',
    cookieBody: [
      'Last updated 16 October 2026.',
      '## The site sets no cookies of its own',
      'These pages store nothing on your device to work. There is no login, no cart and no preference to remember, there are no analytics or advertising pixels, and we do not use your browser’s local storage either. That is why we do not ask for consent with a banner. Fonts and video also come from our own servers, without going through Google Fonts or video platforms.',
      '## Technical cookies from the infrastructure',
      'The site is served by Cloudflare. To protect it from attacks and automated traffic, Cloudflare may set strictly necessary security cookies, which are not used to recognise you or follow you across other sites. The application form uses Cloudflare Turnstile, which checks that a person is sending it without using advertising or profiling cookies.',
      '## The call calendar',
      'After you send the application, the Google calendar for booking the call appears. It loads only at that moment, because you asked for it, and from there Google may set cookies on its own domains under its cookie policy (policies.google.com/technologies/cookies). If you block third-party cookies the booking may not work. In that case write to collab@bikeadventureseries.com and we will set the call by email.',
      '## Sites we link to',
      'Links to the events of the series take you to other sites, with their own cookies and their own policies. This page covers adventurelab.cc only. For everything else about how we handle data, see the privacy notice.',
    ],
  },
  langSwitch: { label: 'Italiano' },
  a11y: { skip: 'Skip to content', pause: 'Pause the video', play: 'Play the video' },
  notFound: { title: 'Page not found', home: 'Back to home' },
};
