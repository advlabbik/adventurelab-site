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
