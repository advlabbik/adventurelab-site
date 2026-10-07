import type { SiteContent } from './types';

export const en: SiteContent = {
  meta: {
    title: 'AdventureLab — cycling events and bike tourism for destinations',
    description: 'We bring cyclists to destinations through events, routes and promotion to a European community. Since 2012.',
  },
  nav: { territories: 'Destinations', cases: 'Cases', brands: 'Brands', events: 'Events', about: 'About', cta: 'Book a call' },
  hero: {
    title: 'TODO: We bring cyclists to your destination.',
    subtitle: 'TODO: Events, routes and promotion for destinations that want to grow with bike tourism.',
    ctaPrimary: 'Book a call',
    ctaSecondary: 'See the cases',
  },
  numbers: {
    label: 'TODO: 2025 data',
    items: [
      { value: '14', label: 'years of experience' },
      { value: '19', label: 'countries' },
      { value: 'TODO: n', label: 'riders per year' },
      { value: 'TODO: n', label: 'overnight stays generated' },
      { value: 'TODO: n', label: 'estimated local spend' },
    ],
  },
  clients: { title: 'They worked with us' },
  services: {
    title: 'What we do for a destination',
    intro: 'TODO: intro sentence about services',
    items: [
      { title: 'TODO: Service 1', text: 'TODO: two-line description' },
      { title: 'TODO: Service 2', text: 'TODO: two-line description' },
      { title: 'TODO: Service 3', text: 'TODO: two-line description' },
      { title: 'TODO: Service 4', text: 'TODO: two-line description' },
    ],
  },
  process: {
    title: 'How we work',
    steps: [
      { title: 'Site visit and analysis', text: 'TODO: two lines' },
      { title: 'Route and format', text: 'TODO: two lines' },
      { title: 'Event and promotion', text: 'TODO: two lines' },
      { title: 'Report', text: 'TODO: measured numbers and local impact' },
    ],
  },
  cases: {
    title: 'Cases',
    open: 'Read the case',
    close: 'Close',
    items: [
      { place: 'Slovenia', event: 'The Grand Escape', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
      { place: 'Tuscany', event: 'Tuscany Trail', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
      { place: 'Trentino', event: 'Trentino Gravel', summary: 'TODO: what we did', body: 'TODO: case story', stats: [{ value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }, { value: 'TODO: n', label: 'TODO: metric' }] },
    ],
  },
  brands: {
    title: 'For brands and sponsors',
    audienceTitle: 'Who you reach',
    audience: 'TODO: community profile — age, countries, bikes, spending',
    formatsTitle: 'Formats',
    formats: 'TODO: event presence, content, product in the rider pack',
    mediaKit: 'Download the media kit',
  },
  events: {
    title: 'Our events',
    items: [
      { name: 'Tuscany Trail', line: 'The world’s most popular unsupported bike adventure.', stat: 'TODO: n riders', url: 'https://tuscanytrail.it/en/' },
      { name: 'The Grand Escape', line: 'Road bikepacking on Europe’s most beautiful roads.', stat: 'TODO: n editions', url: 'https://thegrandescape.cc' },
      { name: 'NorthCape4000', line: 'Europe’s longest and most popular ultracycling adventure, to the North Cape.', stat: 'TODO: ~4,000 km', url: 'https://northcape4000.com' },
      { name: 'Unpaved Roads', line: 'A gravel circuit across Italy, weekend format.', stat: 'TODO: n stages', url: 'https://unpavedroads.cc' },
      { name: 'Trentino Gravel', line: 'TODO: one line', stat: 'TODO: n', url: 'https://trentinogravel.com' },
      { name: 'Cycling in Tuscany', line: 'TODO: one line', stat: 'TODO: n', url: 'https://cyclingintuscany.com' },
    ],
  },
  about: {
    title: 'About us',
    body: [
      'Since 2012, when we brought bikepacking to Italy, we have been organising adventure cycling events across Europe.',
      'Our events are “no race”: no rankings, the road and the places come first. We are based in Prato, Italy.',
    ],
  },
  contact: {
    title: 'Book a 30-minute call',
    intro: 'Leave us a few details and pick a day: we will call you to understand your project.',
    fields: { name: 'Name', email: 'Email', org: 'Organisation or company', type: 'I am', typeTerritory: 'a destination', typeBrand: 'a brand or sponsor', typeOther: 'other' },
    privacy: 'I have read the privacy notice',
    optin: 'I want to receive updates from AdventureLab',
    submit: 'Pick a day →',
    sending: 'One moment…',
    errors: {
      invalid_email: 'Please check the email address.',
      consent_required: 'Please accept the privacy notice.',
      generic: 'Something went wrong: you can still pick a day below.',
    },
    fallback: 'If you prefer, write to us at',
    thanks: 'Thank you, we will get back to you shortly.',
    calendlyTitle: 'Pick a day and time',
  },
  footer: { tagline: 'Bike tourism across Europe.', privacy: 'Privacy', cookie: 'Cookies', rights: 'All rights reserved' },
  legal: {
    privacyTitle: 'Privacy notice',
    privacyBody: ['TODO: privacy notice text provided by the company (must mention Brevo and Calendly)'],
    cookieTitle: 'Cookies',
    cookieBody: ['TODO: cookie policy text provided by the company'],
  },
  langSwitch: { label: 'Italiano' },
  a11y: { skip: 'Skip to content', pause: 'Pause the video', play: 'Play the video' },
};
