/**
 * A Plaid link token is scoped to exactly one country at mint time, and the
 * OAuth leg of Plaid Link requires the *same* token the session started with.
 * So the token has to be cached, which makes it easy to hand a session a token
 * minted for the wrong rail — a US-scoped token opens the US institution list
 * no matter which country the caller asked for.
 *
 * Caching the country alongside the token lets a reader refuse a token that was
 * not minted for the rail it needs.
 */
export interface CachedLinkToken {
  token: string;
  /** Absent for flows that do not choose a rail, and for legacy cache entries. */
  country?: string;
}

export function serializeCachedLinkToken(cached: CachedLinkToken): string {
  return JSON.stringify(cached);
}

/**
 * Reads a cache entry, tolerating the bare-token strings written before the
 * country was recorded. Those have unknown provenance, so they come back with
 * no country and `canReuseLinkToken` will refuse them for a specific rail.
 */
export function parseCachedLinkToken(
  raw: string | null | undefined
): CachedLinkToken | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.token !== 'string' || !parsed.token) return null;
    return {
      token: parsed.token,
      country: typeof parsed.country === 'string' ? parsed.country : undefined,
    };
  } catch {
    // Legacy entry: the raw token with no recorded country.
    return {token: raw};
  }
}

/**
 * True when a cached token may be handed to a session for `country`.
 *
 * A caller that names a country needs a token minted for that same country;
 * anything else (a different rail, or an entry whose rail we never recorded)
 * has to be re-minted. A caller that names no country takes what is cached,
 * which is what the OAuth leg does when resuming a session already in flight.
 */
export function canReuseLinkToken({
  cached,
  country,
}: {
  cached: CachedLinkToken | null;
  country?: string;
}): boolean {
  if (!cached) return false;
  if (!country) return true;
  return cached.country === country;
}
