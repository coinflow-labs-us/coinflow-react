const FORTER_COOKIE_NAME = 'forterToken';

// Defense-in-depth: the attacker-influenceable cookie is later sent as the `x-forter-token` header / Forter `forterTokenCookie`; since tokens are opaque, long, uncontrolled-alphabet strings, don't use a narrow allowlist — just bound the length and reject control / CR / LF chars that could enable header injection.
const MAX_FORTER_TOKEN_LENGTH = 1024;
// eslint-disable-next-line no-control-regex
const FORTER_TOKEN_UNSAFE_PATTERN = /[\x00-\x1F\x7F]/;

// Forter sets the `forterToken` cookie asynchronously and some WebViews (notably React Native) only surface it transiently/late, so a just-in-time checkout read often comes back empty even when nSure and Verisoul succeed; cache and prefer the captured token (see captureForterToken) as Verisoul does, and keep it current latest-wins since Forter re-emits a more complete token after its handshake (later `ftr:tokenReady` events overwrite it and the cookie poll keeps refreshing) rather than freezing on the first partial token.
let cachedForterToken: string | null = null;
// Whether `cachedForterToken` came from the authoritative `ftr:tokenReady` event, the reliable source in cross-origin iframes / WebViews where the cookie is partitioned or stale, so a cookie read must never clobber an event-sourced value.
let cachedFromEvent = false;
// Ensures only one cookie-poll loop runs at a time (captureForterToken can be called from several mounted protection components).
let pollActive = false;

function sanitizeForterToken(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let token = raw;
  try {
    token = decodeURIComponent(raw);
  } catch {
    // keep raw if it isn't valid percent-encoding
  }
  if (!token) return null;
  if (token.length > MAX_FORTER_TOKEN_LENGTH) return null;
  if (FORTER_TOKEN_UNSAFE_PATTERN.test(token)) return null;
  return token;
}

// Reads the Forter cookie. Matches `forterToken` exactly, then falls back to any `*forter*token*` cookie name in case Forter changes/prefixes it.
function readForterCookie(): string | null {
  if (typeof document === 'undefined' || !document.cookie) return null;

  let fallback: string | null = null;
  for (const part of document.cookie.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1);
    if (name === FORTER_COOKIE_NAME) return value;
    const lower = name.toLowerCase();
    if (lower.includes('forter') && lower.includes('token')) fallback = value;
  }
  return fallback;
}

export function getForterToken(): string | null {
  return cachedForterToken ?? sanitizeForterToken(readForterCookie());
}

// Forter dispatches `ftr:tokenReady` on `document` with the token in `event.detail` once computed; this is cookie-INDEPENDENT and so the reliable source in cross-origin iframes / WebViews where the forterToken cookie is partitioned/blocked (the cookie still works as a fallback on web).
const FORTER_TOKEN_READY_EVENT = 'ftr:tokenReady';

function handleForterTokenReady(event: Event): void {
  const detail = (event as CustomEvent<unknown>).detail;
  const token = typeof detail === 'string' ? sanitizeForterToken(detail) : null;
  if (!token) return;
  // Latest-wins: stay subscribed so each re-emission overwrites the cache with the newer, more complete token (see note on cachedForterToken).
  cachedForterToken = token;
  cachedFromEvent = true;
}

// Capture and cache the Forter token shortly after the SDK script is injected so it is available to getForterToken() by checkout time: primary source is the `ftr:tokenReady` event and the cookie is polled as a fallback, and if neither surfaces log a diagnostic (cookie names + Forter globals only — never values) to reveal whether the SDK exposes the token at all in this context.
export function captureForterToken({
  timeoutMs = 15_000,
  intervalMs = 250,
}: {timeoutMs?: number; intervalMs?: number} = {}): void {
  if (typeof window === 'undefined') return;

  // Stay subscribed for the page lifetime so every `ftr:tokenReady` overwrites the cache (latest-wins); addEventListener dedupes the same handler, so calling this from multiple mounts registers it only once.
  if (typeof document !== 'undefined') {
    document.addEventListener(FORTER_TOKEN_READY_EVENT, handleForterTokenReady);
  }

  if (pollActive) return;
  pollActive = true;

  const start = Date.now();
  const tick = () => {
    // Keep refreshing from the cookie (latest-wins among cookie reads) until the window closes, but never clobber an event-sourced token — the event is authoritative where the cookie is partitioned / stale.
    if (!cachedFromEvent) {
      const token = sanitizeForterToken(readForterCookie());
      if (token) cachedForterToken = token;
    }
    if (Date.now() - start >= timeoutMs) {
      pollActive = false;
      if (!cachedForterToken) logForterTokenMissing();
      return;
    }
    window.setTimeout(tick, intervalMs);
  };
  tick();
}

function logForterTokenMissing(): void {
  if (typeof document === 'undefined') return;
  const cookieNames = (document.cookie || '')
    .split(';')
    .map(part => part.split('=')[0].trim())
    .filter(Boolean);
  const forterGlobals =
    typeof window !== 'undefined'
      ? Object.keys(window).filter(key => /ftr|forter/i.test(key))
      : [];
  console.warn(
    '[forter] token never surfaced after init.',
    'cookieNames:',
    cookieNames,
    'forterGlobals:',
    forterGlobals
  );
}

// Resolve once a Forter token is available, or after `timeoutMs` if it never surfaces: Forter issues its device token asynchronously (~1s after the SDK loads, via `ftr:tokenReady` / forterToken cookie), so a fast charge — notably saved-card / "1-click" purchases — can read getForterToken() before it exists and send an empty x-forter-token, so await this at charge time to populate the header; fail-open by resolving to whatever getForterToken() returns at the deadline (possibly null) rather than blocking the purchase, and return immediately when a token is already cached so it adds no latency in the common case.
export async function awaitForterToken({
  timeoutMs = 2_000,
  intervalMs = 100,
}: {timeoutMs?: number; intervalMs?: number} = {}): Promise<string | null> {
  const existing = getForterToken();
  if (existing) return existing;
  if (typeof window === 'undefined') return null;

  return new Promise<string | null>(resolve => {
    const start = Date.now();
    const poll = () => {
      const token = getForterToken();
      if (token) return resolve(token);
      if (Date.now() - start >= timeoutMs) return resolve(getForterToken());
      window.setTimeout(poll, intervalMs);
    };
    window.setTimeout(poll, intervalMs);
  });
}

export default getForterToken;
