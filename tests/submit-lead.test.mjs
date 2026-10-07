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
