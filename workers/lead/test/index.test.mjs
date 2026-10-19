import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { normalize, brevoPayload } from '../src/index.js';

const ORIGIN = 'https://adventurelab.cc';
let calls;
const env = (over = {}) => ({
  ALLOWED_ORIGINS: `${ORIGIN},http://localhost:4321`,
  BREVO_LIST_ID: '77',
  BREVO_API_KEY: 'k',
  TURNSTILE_REQUIRED: 'true',
  TURNSTILE_SECRET: 's',
  RATE_LIMITER: { limit: async () => ({ success: true }) },
  ...over,
});
const req = (body, origin = ORIGIN, method = 'POST') =>
  new Request('https://w.example/lead', {
    method,
    headers: { origin, 'content-type': 'application/json', 'cf-connecting-ip': '1.2.3.4' },
    body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  });
// Risposta di siteverify per un token preso sul nostro dominio.
const TS_OK = { success: true, hostname: 'adventurelab.cc' };
const good = { name: 'Àlice D’Amico', email: ' A+b@Visit.IT ', org: 'Visit Prato', type: 'territorio', consent: true, optin: false, lang: 'it', website: '', turnstileToken: 't' };

beforeEach(() => {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('turnstile')) return Response.json(TS_OK);
    return new Response(null, { status: 201 });
  };
});

test('normalize: email minuscola e senza spazi, tipo fuori lista → altro, lingua ignota → it', () => {
  const n = normalize({ ...good, type: 'pippo', lang: 'de' });
  assert.equal(n.email, 'a+b@visit.it');
  assert.equal(n.type, 'altro');
  assert.equal(n.lang, 'it');
});

test('brevoPayload: lista, attributi e LINGUA numerica', () => {
  const p = brevoPayload(normalize({ ...good, lang: 'en', optin: true }), 77, new Date('2026-10-07T10:00:00Z'));
  assert.deepEqual(p, {
    email: 'a+b@visit.it',
    updateEnabled: true,
    listIds: [77],
    attributes: {
      NOME: 'Àlice D’Amico',
      LINGUA: 2,
      SIGNUP_SOURCE: 'adventurelab:contatti',
      ADVLAB_TIPO: 'territorio',
      ADVLAB_ENTE: 'Visit Prato',
      ADVLAB_OPTIN: true,
      ADVLAB_LAST_SIGNUP_AT: '2026-10-07T10:00:00.000Z',
    },
  });
});

test('origine non ammessa → 403 senza toccare Brevo', async () => {
  const res = await worker.fetch(req(good, 'https://evil.example'), env());
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});

test('OPTIONS da origine ammessa → 204 con CORS', async () => {
  const res = await worker.fetch(req(null, ORIGIN, 'OPTIONS'), env());
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
});

test('rate limit superato → 429', async () => {
  const res = await worker.fetch(req(good), env({ RATE_LIMITER: { limit: async () => ({ success: false }) } }));
  assert.equal(res.status, 429);
});

test('JSON rotto → 400 invalid_json', async () => {
  const res = await worker.fetch(req('{nope'), env());
  assert.equal((await res.json()).error, 'invalid_json');
});

test('honeypot compilato → 200 finto, niente Brevo', async () => {
  const res = await worker.fetch(req({ ...good, website: 'x' }), env());
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test('email non valida → 400 invalid_email', async () => {
  const res = await worker.fetch(req({ ...good, email: 'nope' }), env());
  assert.equal((await res.json()).error, 'invalid_email');
});

test('senza consenso privacy → 400 consent_required', async () => {
  const res = await worker.fetch(req({ ...good, consent: false }), env());
  assert.equal((await res.json()).error, 'consent_required');
});

test('Turnstile obbligatorio senza secret → 500 fail-closed', async () => {
  const res = await worker.fetch(req(good), env({ TURNSTILE_SECRET: '' }));
  assert.equal((await res.json()).error, 'turnstile_misconfigured');
});

test('Turnstile negativo → 403 e niente Brevo', async () => {
  globalThis.fetch = async (url) => (calls.push({ url: String(url) }), Response.json({ success: false }));
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 403);
  assert.ok(calls.every((c) => !c.url.includes('brevo')));
});

test('Turnstile risolto su un altro dominio del widget → 403 turnstile_hostname e niente Brevo', async () => {
  globalThis.fetch = async (url) => (calls.push({ url: String(url) }), Response.json({ success: true, hostname: 'tuscanytrail.it' }));
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 403);
  assert.equal((await res.json()).error, 'turnstile_hostname');
  assert.ok(calls.every((c) => !c.url.includes('brevo')));
});

test('Turnstile senza hostname nella risposta → 403 fail-closed', async () => {
  globalThis.fetch = async (url) => (calls.push({ url: String(url) }), Response.json({ success: true }));
  const res = await worker.fetch(req(good), env());
  assert.equal((await res.json()).error, 'turnstile_hostname');
});

test('Turnstile risolto su www.adventurelab.cc → ammesso', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile') ? Response.json({ success: true, hostname: 'www.adventurelab.cc' }) : new Response(null, { status: 201 });
  const res = await worker.fetch(req(good), env({ ALLOWED_ORIGINS: 'https://adventurelab.cc,https://www.adventurelab.cc' }));
  assert.equal(res.status, 200);
});

test('lista "0" → 500 brevo_list_not_configured', async () => {
  const res = await worker.fetch(req(good), env({ BREVO_LIST_ID: '0' }));
  assert.equal((await res.json()).error, 'brevo_list_not_configured');
});

test('invio valido → 200 e una chiamata Brevo con api-key', async () => {
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 200);
  const b = calls.find((c) => c.url === 'https://api.brevo.com/v3/contacts');
  assert.equal(b.init.headers['api-key'], 'k');
  assert.equal(JSON.parse(b.init.body).attributes.ADVLAB_TIPO, 'territorio');
});

test('contatto già esistente (duplicate_parameter) → 200', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile')
      ? Response.json(TS_OK)
      : new Response('{"code":"duplicate_parameter"}', { status: 400 });
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 200);
});

test('Brevo 401 (es. IP non autorizzato) → 502 brevo_error', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile') ? Response.json(TS_OK) : new Response('unauthorized', { status: 401 });
  const res = await worker.fetch(req(good), env());
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'brevo_error');
});

test('ogni rifiuto lascia una riga di log col codice e senza email', async () => {
  const lines = [];
  const orig = console.log;
  console.log = (l) => lines.push(String(l));
  try {
    globalThis.fetch = async () => Response.json({ success: false });
    await worker.fetch(req(good), env());
    await worker.fetch(req(good), env({ RATE_LIMITER: { limit: async () => ({ success: false }) } }));
  } finally {
    console.log = orig;
  }
  const events = lines.map((l) => JSON.parse(l));
  assert.deepEqual(events.map((e) => [e.ev, e.code]), [['lead_rejected', 'turnstile_failed'], ['lead_rejected', 'rate_limited']]);
  assert.ok(lines.every((l) => !l.includes('visit.it')));
});

// --- Notifica alla casella del B2B (collab@) ---
import { notifyPayload } from '../src/index.js';
const notifyEnv = (over = {}) => env({ NOTIFY_TO: 'collab@bikeadventureseries.com', SENDER_EMAIL: 'noreply@example.com', ...over });
const brand = { ...good, type: 'brand', org: 'Acme Bags', category: 'Luci', budget: 'Da 5.000 a 15.000 €', markets: 'DE, IT', page: '/aziende/' };

test('notifyPayload: reply-to al candidato, oggetto con tipo ed ente, campi nella tabella', () => {
  const p = notifyPayload(normalize(brand), { NOTIFY_TO: 'collab@x.it', SENDER_EMAIL: 'noreply@x.it' });
  assert.deepEqual(p.to, [{ email: 'collab@x.it' }]);
  assert.equal(p.replyTo.email, 'a+b@visit.it');
  assert.match(p.subject, /Azienda · Acme Bags$/);
  assert.match(p.htmlContent, /Luci/);
  assert.match(p.htmlContent, /Da 5\.000 a 15\.000 €/);
});

test('notifyPayload: i testi del candidato sono escapati', () => {
  const p = notifyPayload(normalize({ ...brand, org: '<script>x</script>' }), { NOTIFY_TO: 'c@x.it', SENDER_EMAIL: 's@x.it' });
  assert.doesNotMatch(p.htmlContent, /<script>/);
});

test('con notifica configurata: una email a collab@ e il contatto su Brevo', async () => {
  const res = await worker.fetch(req(brand), notifyEnv());
  assert.equal(res.status, 200);
  const mail = calls.find((c) => c.url === 'https://api.brevo.com/v3/smtp/email');
  assert.ok(mail);
  assert.equal(JSON.parse(mail.init.body).to[0].email, 'collab@bikeadventureseries.com');
  assert.ok(calls.find((c) => c.url === 'https://api.brevo.com/v3/contacts'));
});

test('lista "0" ma notifica configurata → 200, arriva solo la email', async () => {
  const res = await worker.fetch(req(brand), notifyEnv({ BREVO_LIST_ID: '0' }));
  assert.equal(res.status, 200);
  assert.ok(calls.find((c) => c.url.endsWith('/smtp/email')));
  assert.ok(!calls.find((c) => c.url.endsWith('/contacts')));
});

test('contatto Brevo in errore ma notifica partita → 200: la candidatura non si perde', async () => {
  globalThis.fetch = async (url) => {
    calls.push({ url: String(url) });
    if (String(url).includes('turnstile')) return Response.json(TS_OK);
    if (String(url).endsWith('/smtp/email')) return Response.json({ messageId: 'x' }, { status: 201 });
    return new Response('unauthorized', { status: 401 });
  };
  const res = await worker.fetch(req(brand), notifyEnv());
  assert.equal(res.status, 200);
});

test('notifica e contatto entrambi in errore → 502 brevo_error', async () => {
  globalThis.fetch = async (url) =>
    String(url).includes('turnstile') ? Response.json(TS_OK) : new Response('nope', { status: 500 });
  const res = await worker.fetch(req(brand), notifyEnv());
  assert.equal(res.status, 502);
});
