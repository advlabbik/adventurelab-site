export type Lang = 'it' | 'en';

/** Una voce con titolo e testo: servizi, motivi, condizioni, passi. */
export interface Item { title: string; text: string }
/** Un numero con la sua etichetta. */
export interface Stat { value: string; label: string }
/** Testata di sezione: eyebrow "Foglio NN · label" + titolo + attacco (stringa vuota = niente attacco). */
export interface Head { label: string; title: string; intro: string }

export interface Hero {
  label: string;
  title: string;
  place: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  caption: string;
  alt: string;
}

export interface Meta { title: string; description: string }

/** Il modulo di candidatura: una parte comune e i campi propri di ogni strada. */
export interface FormCommon {
  name: string;
  email: string;
  role: string;
  success: string;
  successHint: string;
  privacy: string;
  optin: string;
  submit: string;
  sending: string;
  errors: { invalid_email: string; consent_required: string; generic: string };
  fallback: string;
  thanks: string;
  calendlyTitle: string;
}

export interface Door { kind: 'territori' | 'aziende'; who: string; title: string; text: string; cta: string; alt: string }

export interface Home {
  meta: Meta;
  hero: Hero;
  numbers: { label: string; items: Stat[] };
  doors: Head & { items: Door[] };
  moat: Head & { items: (Item & { proof: string })[]; band: string; caption: string; alt: string };
  /** In home la serie è una striscia: i nomi, e il link agli eventi nella pagina aziende. */
  events: Head & { cta: string };
  about: Head & { statement: string; body: string[]; stats: Stat[]; facts: { label: string; value: string }[]; alt: string };
  closing: { title: string; text: string };
}

export interface Territori {
  meta: Meta;
  hero: Hero;
  numbers: { label: string; items: Stat[] };
  services: Head & { items: Item[] };
  tt365: Head & { text: string; points: string[]; cta: string; url: string; alt: string; caption: string };
  cases: Head & {
    open: string;
    close: string;
    items: { place: string; event: string; summary: string; body: string; stats: Stat[]; alt: string }[];
  };
  band: { text: string; source: string; alt: string };
  clients: Head & { groups: { title: string; names: string[] }[] };
  howto: Head & { steps: Item[] };
  fit: Head & { items: string[] };
  /** La guida per i territori (url vuoto = la sezione non compare, per esempio finché manca la traduzione). */
  guide: Head & { text: string; points: string[]; cta: string; url: string; alt: string; caption: string };
  form: Head & {
    org: string;
    territory: string;
    goal: string;
    goals: string[];
    thanks: string;
  };
}

export interface Aziende {
  meta: Meta;
  hero: Hero;
  numbers: { label: string; items: Stat[] };
  /** Gli eventi della Bike Adventure Series: è quello che le aziende comprano. Unica fonte, la home ne mostra i nomi. */
  series: Head & { items: { name: string; line: string; stat: string; url: string }[] };
  why: Head & { items: Item[] };
  band: { text: string; alt: string };
  tiers: Head & { items: (Item & { scope: string })[]; note: string };
  report: Head & { items: Item[] };
  partners: Head & { names: string[] };
  form: Head & {
    org: string;
    category: string;
    categoryChoose: string;
    categories: string[];
    categoryOther: string;
    markets: string;
    budget: string;
    budgets: string[];
    thanks: string;
  };
}

export interface SiteContent {
  nav: { territori: string; aziende: string; about: string; cta: string; main: string };
  form: FormCommon;
  home: Home;
  territori: Territori;
  aziende: Aziende;
  footer: { tagline: string; privacy: string; cookie: string; rights: string; vat: string; capital: string };
  legal: { privacyTitle: string; privacyBody: string[]; cookieTitle: string; cookieBody: string[] };
  langSwitch: { label: string };
  a11y: { skip: string; pause: string; play: string };
  notFound: { title: string; home: string };
}
