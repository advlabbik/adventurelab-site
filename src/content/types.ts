export type Lang = 'it' | 'en';

export interface SiteContent {
  meta: { title: string; description: string };
  nav: { territories: string; cases: string; brands: string; events: string; about: string; cta: string };
  hero: { title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string };
  numbers: { label: string; items: { value: string; label: string }[] };
  clients: { title: string };
  services: { title: string; intro: string; items: { title: string; text: string }[] };
  process: { title: string; steps: { title: string; text: string }[] };
  cases: {
    title: string;
    open: string;
    close: string;
    items: { place: string; event: string; summary: string; body: string; stats: { value: string; label: string }[] }[];
  };
  brands: { title: string; audienceTitle: string; audience: string; formatsTitle: string; formats: string; mediaKit: string };
  events: { title: string; items: { name: string; line: string; stat: string; url: string }[] };
  about: { title: string; body: string[] };
  contact: {
    title: string;
    intro: string;
    fields: { name: string; email: string; org: string; type: string; typeTerritory: string; typeBrand: string; typeOther: string };
    privacy: string;
    optin: string;
    submit: string;
    sending: string;
    errors: { invalid_email: string; consent_required: string; generic: string };
    fallback: string;
    calendlyTitle: string;
  };
  footer: { tagline: string; privacy: string; cookie: string; rights: string };
  legal: { privacyTitle: string; privacyBody: string[]; cookieTitle: string; cookieBody: string[] };
  langSwitch: { label: string };
}
