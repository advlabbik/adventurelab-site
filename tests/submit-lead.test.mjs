import { test } from 'node:test';
import assert from 'node:assert/strict';
import { submitLead } from '../src/lib/submit-lead.ts';

test('risposta ok → {ok:true}', async () => {
  globalThis.fetch = async () => Response.json({ ok: true });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: true });
});

test('errore del worker → {ok:false, error} col codice', async () => {
  globalThis.fetch = async () => Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'invalid_email' });
});

test('rete giù → {ok:false, error:"network"} senza lanciare', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'network' });
});

test('worker che non risponde → timeout entro il limite', async () => {
  globalThis.fetch = (_u, init) =>
    new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError'))));
  const t0 = Date.now();
  assert.deepEqual(await submitLead('https://w/lead', {}, 50), { ok: false, error: 'timeout' });
  assert.ok(Date.now() - t0 < 1000);
});

test('endpoint vuoto → {ok:false, error:"not_configured"} senza chiamate', async () => {
  let called = false;
  globalThis.fetch = async () => { called = true; return Response.json({ ok: true }); };
  assert.deepEqual(await submitLead('', {}), { ok: false, error: 'not_configured' });
  assert.equal(called, false);
});

test('risposta 502 non JSON → {ok:false, error:"http_502"}', async () => {
  globalThis.fetch = async () => new Response('Bad gateway', { status: 502 });
  assert.deepEqual(await submitLead('https://w/lead', {}), { ok: false, error: 'http_502' });
});

import { sendLeadWithToken } from '../src/lib/submit-lead.ts';

const bodies = [];
const fakeFetch = (replies) => {
  bodies.length = 0;
  globalThis.fetch = async (_u, init) => {
    bodies.push(JSON.parse(init.body));
    return Response.json(replies.shift(), { status: 200 });
  };
};

test('aspetta il token Turnstile se non è ancora pronto', async () => {
  fakeFetch([{ ok: true }]);
  let calls = 0;
  const res = await sendLeadWithToken({
    endpoint: 'https://w/lead', payload: { email: 'a@b.it' },
    getToken: () => (++calls < 3 ? '' : 'tok'), resetToken: () => {}, pollMs: 5,
  });
  assert.deepEqual(res, { ok: true });
  assert.equal(bodies[0].turnstileToken, 'tok');
});

test('turnstile_failed → reset e un solo nuovo tentativo con il token nuovo', async () => {
  fakeFetch([{ ok: false, error: 'turnstile_failed' }, { ok: true }]);
  let token = 'vecchio'; let resets = 0;
  const res = await sendLeadWithToken({
    endpoint: 'https://w/lead', payload: {},
    getToken: () => token, resetToken: () => { resets++; token = 'nuovo'; }, pollMs: 5,
  });
  assert.deepEqual(res, { ok: true });
  assert.equal(resets, 1);
  assert.deepEqual(bodies.map((b) => b.turnstileToken), ['vecchio', 'nuovo']);
});

test('turnstile_failed due volte → si arrende dopo due POST', async () => {
  fakeFetch([{ ok: false, error: 'turnstile_failed' }, { ok: false, error: 'turnstile_failed' }]);
  const res = await sendLeadWithToken({
    endpoint: 'https://w/lead', payload: {}, getToken: () => 't', resetToken: () => {}, pollMs: 5,
  });
  assert.deepEqual(res, { ok: false, error: 'turnstile_failed' });
  assert.equal(bodies.length, 2);
});

test('nessun token entro l’attesa → invia comunque (sarà il worker a rifiutare)', async () => {
  fakeFetch([{ ok: false, error: 'turnstile_failed' }, { ok: false, error: 'turnstile_failed' }]);
  const t0 = Date.now();
  await sendLeadWithToken({
    endpoint: 'https://w/lead', payload: {}, getToken: () => '', resetToken: () => {}, pollMs: 5, tokenWaitMs: 30,
  });
  assert.equal(bodies[0].turnstileToken, '');
  assert.ok(Date.now() - t0 < 1000);
});
