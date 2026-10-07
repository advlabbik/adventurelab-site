export type LeadResult = { ok: true } | { ok: false; error: string };

/**
 * Manda il form al worker. Non lancia mai: chi chiama decide cosa mostrare, e in
 * ogni caso apre Calendly (spec §5 — una call non si perde per un nostro guasto).
 */
export async function submitLead(endpoint: string, payload: object, timeoutMs = 8000): Promise<LeadResult> {
  if (!endpoint) return { ok: false, error: 'not_configured' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.ok) return { ok: true };
    return { ok: false, error: typeof data?.error === 'string' ? data.error : `http_${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error)?.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Aspetta che Turnstile abbia prodotto un token; '' se non arriva entro waitMs. */
async function waitForToken(getToken: () => string, waitMs: number, pollMs: number): Promise<string> {
  const end = Date.now() + waitMs;
  let token = getToken();
  while (!token && Date.now() < end) {
    await sleep(pollMs);
    token = getToken();
  }
  return token;
}

/**
 * Invio con il token Turnstile. Se il token non c'è ancora (widget lento, appena
 * resettato dopo un errore) lo aspetta; se il worker lo rifiuta (scaduto, già
 * consumato) rigenera il widget e ritenta una volta sola. Senza questo un
 * contatto valido si perderebbe in silenzio nel ramo "apri comunque Calendly".
 */
export async function sendLeadWithToken(o: {
  endpoint: string;
  payload: Record<string, unknown>;
  getToken: () => string;
  resetToken: () => void;
  tokenWaitMs?: number;
  pollMs?: number;
  timeoutMs?: number;
}): Promise<LeadResult> {
  const wait = o.tokenWaitMs ?? 5000;
  const poll = o.pollMs ?? 150;
  const send = async () =>
    submitLead(o.endpoint, { ...o.payload, turnstileToken: await waitForToken(o.getToken, wait, poll) }, o.timeoutMs);
  const first = await send();
  if (first.ok || first.error !== 'turnstile_failed') return first;
  o.resetToken();
  return send();
}
