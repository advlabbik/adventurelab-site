/**
 * adventurelab-lead — gira le candidature di adventurelab.cc alla casella del B2B e a Brevo.
 *
 * Il sito è statico; questa è l'unica logica lato server e vive qui, con i suoi
 * segreti e il suo deploy. Ricalca tt-subscribe (~/Repo/ttrefactor/workers/subscribe).
 *
 * Due uscite, indipendenti:
 *  1. la NOTIFICA a NOTIFY_TO (collab@bikeadventureseries.com, l'unica casella del
 *     B2B), con reply-to = chi si candida: si risponde dal client di posta, e la
 *     candidatura sta dove il team e Claude leggono già. È il canale principale.
 *  2. il CONTATTO su Brevo (lista BREVO_LIST_ID, attributi ADVLAB_*), per il
 *     nurturing che si fa a parte.
 * La risposta è ok se almeno una delle due è andata: una candidatura non si perde
 * perché l'altra è giù. Si rifiuta solo se nessuna delle due è configurata.
 *
 * Deploy:  cd workers/lead && npx wrangler deploy --config wrangler.toml
 * Segreti: npx wrangler secret put BREVO_API_KEY --config wrangler.toml
 *          npx wrangler secret put TURNSTILE_SECRET --config wrangler.toml
 */

const BREVO_CONTACTS = 'https://api.brevo.com/v3/contacts';
const BREVO_EMAIL = 'https://api.brevo.com/v3/smtp/email';
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

const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

export function normalize(body) {
  return {
    name: clip(body.name, 120),
    email: clip(body.email, 254).toLowerCase(),
    org: clip(body.org, 160),
    // Un valore fuori lista diventa "altro": in Brevo ADVLAB_TIPO è una categoria
    // e un valore sconosciuto verrebbe rifiutato o finirebbe in un segmento fantasma.
    type: TYPES.includes(body.type) ? body.type : 'altro',
    role: clip(body.role, 120),
    territory: clip(body.territory, 200),
    goal: clip(body.goal, 120),
    category: clip(body.category, 120),
    markets: clip(body.markets, 200),
    budget: clip(body.budget, 60),
    success: clip(body.success, 1500),
    page: clip(body.page, 120),
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

/** La email interna: chi è, cosa ha risposto, cosa gli abbiamo già detto. Si risponde direttamente al candidato. */
export function notifyPayload(n, env) {
  const kind = n.type === 'brand' ? 'Azienda' : n.type === 'territorio' ? 'Territorio' : 'Contatto';
  const rows = [
    ['Nome', n.name], ['Email', n.email], [n.type === 'brand' ? 'Azienda' : 'Ente', n.org], ['Ruolo', n.role],
    ['Territorio', n.territory], ['Obiettivo', n.goal], ['Categoria', n.category], ['Mercati', n.markets],
    ['Budget', n.budget], ['Successo, per loro', n.success], ['Lingua', n.lang], ['Pagina', n.page],
    ['Aggiornamenti', n.optin ? 'sì' : 'no'],
  ].filter(([, v]) => v);
  const table = rows
    .map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#777;vertical-align:top">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`)
    .join('');
  return {
    sender: { name: env.SENDER_NAME || 'adventurelab.cc', email: env.SENDER_EMAIL },
    to: [{ email: env.NOTIFY_TO }],
    replyTo: { email: n.email, name: n.name || n.email },
    subject: `[adventurelab.cc] ${kind} · ${n.org || n.name || n.email}`,
    htmlContent:
      `<p>Nuova candidatura dal sito: dopo l'invio ha visto la pagina per prenotare la call, se è configurata. Rispondere entro due giorni lavorativi.</p>` +
      `<table style="font-size:14px;font-family:sans-serif">${table}</table>` +
      `<p style="color:#888;font-size:12px">Rispondi a questa email per scrivere direttamente a chi si è candidato.</p>`,
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
    // Una riga per ogni rifiuto, col solo codice: serve a capire dai log di
    // Cloudflare (observability) perché un contatto non è arrivato, senza
    // scriverci dentro l'email di nessuno.
    const reject = (code, status) => {
      console.log(JSON.stringify({ ev: 'lead_rejected', code, status }));
      return json({ ok: false, error: code }, status, echo);
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: originOk ? 204 : 403, headers: corsHeaders(echo) });
    }
    if (request.method !== 'POST') return reject('method_not_allowed', 405);
    if (!originOk) return reject('origin_not_allowed', 403);

    try {
      const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
      const { success: withinLimit } = await env.RATE_LIMITER.limit({ key: ip });
      if (!withinLimit) return reject('rate_limited', 429);

      let body;
      try {
        body = await request.json();
      } catch {
        return reject('invalid_json', 400);
      }

      const n = normalize(body ?? {});
      // Solo un bot compila il campo invisibile: 200 finto, senza dirgli che è stato scoperto.
      if (n.honeypot) return json({ ok: true }, 200, echo);
      if (!EMAIL_RE.test(n.email)) return reject('invalid_email', 400);
      if (!n.consent) return reject('consent_required', 400);

      if (env.TURNSTILE_REQUIRED === 'true') {
        if (!env.TURNSTILE_SECRET) return reject('turnstile_misconfigured', 500);
        const token = String(body.turnstileToken ?? '');
        if (!token || !(await verifyTurnstile(env, token, ip))) {
          return reject('turnstile_failed', 403);
        }
      }

      const listId = Number(env.BREVO_LIST_ID);
      const listOk = Number.isInteger(listId) && listId > 0;
      const notifyOk = Boolean(env.NOTIFY_TO && env.SENDER_EMAIL);
      if (!listOk && !notifyOk) return reject('brevo_list_not_configured', 500);
      if (!env.BREVO_API_KEY) return reject('brevo_key_missing', 500);
      const headers = { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY };

      // 1) notifica alla casella del B2B
      let notified = false;
      if (notifyOk) {
        const res = await fetch(BREVO_EMAIL, { method: 'POST', headers, body: JSON.stringify(notifyPayload(n, env)) });
        notified = res.ok;
        if (!res.ok) console.error(`[lead] notifica ${res.status}: ${await res.text()}`);
      }

      // 2) contatto su Brevo
      let contact = false;
      let contactStatus = 0;
      if (listOk) {
        const res = await fetch(BREVO_CONTACTS, { method: 'POST', headers, body: JSON.stringify(brevoPayload(n, listId)) });
        contactStatus = res.status;
        if (res.ok || res.status === 204) contact = true;
        else {
          const detail = await res.text();
          if (res.status === 400 && detail.includes('duplicate_parameter')) contact = true;
          else console.error(`[lead] Brevo ${res.status}: ${detail}`);
        }
      }

      if (notified || contact) return json({ ok: true }, 200, echo);
      return json({ ok: false, error: 'brevo_error', status: contactStatus }, 502, echo);
    } catch (err) {
      console.error('[lead]', err);
      return reject('unexpected', 500);
    }
  },
};
