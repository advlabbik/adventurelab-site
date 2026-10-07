/**
 * adventurelab-lead — gira il form contatti di adventurelab.cc a Brevo.
 *
 * Il sito è statico; questa è l'unica logica lato server e vive qui, con i suoi
 * segreti e il suo deploy. Ricalca tt-subscribe (~/Repo/ttrefactor/workers/subscribe).
 *
 * Deploy:  cd workers/lead && npx wrangler deploy --config wrangler.toml
 * Segreti: npx wrangler secret put BREVO_API_KEY --config wrangler.toml
 *          npx wrangler secret put TURNSTILE_SECRET --config wrangler.toml
 */

const BREVO_CONTACTS = 'https://api.brevo.com/v3/contacts';
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TYPES = ['territorio', 'brand', 'altro'];

const allowedOrigins = (env) => (env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

function corsHeaders(origin) {
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...corsHeaders(origin) },
  });
}

/** Taglia i campi a una lunghezza ragionevole: Brevo rifiuta testi enormi, un bot li manda. */
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export function normalize(body) {
  return {
    name: clip(body.name, 120),
    email: clip(body.email, 254).toLowerCase(),
    org: clip(body.org, 160),
    // Un valore fuori lista diventa "altro": in Brevo ADVLAB_TIPO è una categoria
    // e un valore sconosciuto verrebbe rifiutato o finirebbe in un segmento fantasma.
    type: TYPES.includes(body.type) ? body.type : 'altro',
    consent: body.consent === true,
    optin: body.optin === true,
    lang: body.lang === 'en' ? 'en' : 'it',
    honeypot: clip(body.website, 200),
  };
}

export function brevoPayload(n, listId, now = new Date()) {
  return {
    email: n.email,
    // Chi compila due volte va aggiornato, non rifiutato.
    updateEnabled: true,
    listIds: [listId],
    attributes: {
      FIRSTNAME: n.name,
      // Attributo di categoria già esistente nell'account: 1 = Ita, 2 = Eng
      // (stessa convenzione di tt-subscribe e dei sync verso il database).
      LINGUA: n.lang === 'en' ? 2 : 1,
      SIGNUP_SOURCE: 'adventurelab:contatti',
      ADVLAB_TIPO: n.type,
      ADVLAB_ENTE: n.org,
      ADVLAB_OPTIN: n.optin,
      // Testo riscritto a ogni invio: è l'aggancio delle automazioni, come TT_LAST_SIGNUP_AT.
      ADVLAB_LAST_SIGNUP_AT: now.toISOString(),
    },
  };
}

async function verifyTurnstile(env, token, ip) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: form });
  const data = await res.json();
  return data.success === true;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') ?? '';
    const originOk = allowedOrigins(env).includes(origin);
    const echo = originOk ? origin : '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: originOk ? 204 : 403, headers: corsHeaders(echo) });
    }
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, echo);
    if (!originOk) return json({ ok: false, error: 'origin_not_allowed' }, 403, echo);

    try {
      const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
      const { success: withinLimit } = await env.RATE_LIMITER.limit({ key: ip });
      if (!withinLimit) return json({ ok: false, error: 'rate_limited' }, 429, echo);

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: 'invalid_json' }, 400, echo);
      }

      const n = normalize(body ?? {});
      // Solo un bot compila il campo invisibile: 200 finto, senza dirgli che è stato scoperto.
      if (n.honeypot) return json({ ok: true }, 200, echo);
      if (!EMAIL_RE.test(n.email)) return json({ ok: false, error: 'invalid_email' }, 400, echo);
      if (!n.consent) return json({ ok: false, error: 'consent_required' }, 400, echo);

      if (env.TURNSTILE_REQUIRED === 'true') {
        if (!env.TURNSTILE_SECRET) return json({ ok: false, error: 'turnstile_misconfigured' }, 500, echo);
        const token = String(body.turnstileToken ?? '');
        if (!token || !(await verifyTurnstile(env, token, ip))) {
          return json({ ok: false, error: 'turnstile_failed' }, 403, echo);
        }
      }

      const listId = Number(env.BREVO_LIST_ID);
      if (!Number.isInteger(listId) || listId <= 0) {
        return json({ ok: false, error: 'brevo_list_not_configured' }, 500, echo);
      }
      if (!env.BREVO_API_KEY) return json({ ok: false, error: 'brevo_key_missing' }, 500, echo);

      const res = await fetch(BREVO_CONTACTS, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY },
        body: JSON.stringify(brevoPayload(n, listId)),
      });

      if (!res.ok && res.status !== 204) {
        const detail = await res.text();
        if (!(res.status === 400 && detail.includes('duplicate_parameter'))) {
          console.error(`[lead] Brevo ${res.status}: ${detail}`);
          return json({ ok: false, error: 'brevo_error', status: res.status }, 502, echo);
        }
      }
      return json({ ok: true }, 200, echo);
    } catch (err) {
      console.error('[lead]', err);
      return json({ ok: false, error: 'unexpected' }, 500, echo);
    }
  },
};
