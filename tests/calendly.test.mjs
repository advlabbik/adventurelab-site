import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calendlyUrl } from '../src/lib/calendly.ts';

test('precompila nome, email e ente codificati', () => {
  const u = new URL(calendlyUrl('https://calendly.com/adventurelab/call-30', { name: 'Àlice D’Amico', email: 'a+b@visit.it', org: 'Visit & Co' }));
  assert.equal(u.searchParams.get('name'), 'Àlice D’Amico');
  assert.equal(u.searchParams.get('email'), 'a+b@visit.it');
  assert.equal(u.searchParams.get('a1'), 'Visit & Co');
  // Il banner cookie di Calendly resta: il sito non ha un suo meccanismo di consenso.
  assert.equal(u.searchParams.has('hide_gdpr_banner'), false);
});

test('conserva i parametri già presenti nell’URL base', () => {
  const u = new URL(calendlyUrl('https://calendly.com/x/y?month=2026-11', { name: 'A', email: 'a@b.it', org: '' }));
  assert.equal(u.searchParams.get('month'), '2026-11');
  assert.equal(u.searchParams.has('a1'), false);
});

test('base vuota → stringa vuota', () => {
  assert.equal(calendlyUrl('', { name: 'A', email: 'a@b.it', org: 'X' }), '');
});

test('con l’host aggiunge i parametri dell’embed inline', () => {
  const u = new URL(calendlyUrl('https://calendly.com/x/y', { name: 'A', email: 'a@b.it', org: '' }, 'adventurelab.cc'));
  assert.equal(u.searchParams.get('embed_domain'), 'adventurelab.cc');
  assert.equal(u.searchParams.get('embed_type'), 'Inline');
});

test('prenotazione di Google Calendar: URL lasciato com’è, nessun dato personale aggiunto', () => {
  const base = 'https://calendar.google.com/calendar/appointments/schedules/AbC?gv=true';
  assert.equal(calendlyUrl(base, { name: 'A', email: 'a@b.it', org: 'X' }, 'adventurelab.cc'), base);
});
