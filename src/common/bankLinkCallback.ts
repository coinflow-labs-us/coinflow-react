/**
 * Outcome of a standalone bank-link session, reported to the merchant's
 * `callbackUrl` as the `bankLinkStatus` query parameter.
 *
 * The customer returns to the same `callbackUrl` whether they linked an
 * account, backed out, or could not be verified, so arriving there is not by
 * itself evidence of a link.
 */
export type BankLinkStatus = 'linked' | 'canceled' | 'failed';

export const BANK_LINK_STATUS_PARAM = 'bankLinkStatus';

/**
 * Query parameters a standalone bank-link session appends to the merchant's
 * `callbackUrl`.
 *
 * The return leg carries no secret — only the outcome. The linked accounts and
 * their tokens are read from Get Customer, which is authenticated, so a
 * payment-instrument token never rides a merchant-supplied redirect. The same
 * invariant lets the shared redirect validator allow native-app deep links
 * without a whitelist, so nothing may be added here.
 */
export function bankLinkCallbackParams({
  status,
}: {
  status: BankLinkStatus;
}): Record<string, string> {
  return {[BANK_LINK_STATUS_PARAM]: status};
}

/**
 * What the hosted bank-linking page does once an account is linked.
 *
 * `emit` is the embedded SDK case: `<CoinflowBankLink>` lives inside the
 * merchant's own checkout, so the page reports the tokens through the
 * accountLinked message and stops. Navigating onward would drop the customer
 * into Coinflow's checkout, which the merchant owns.
 */
export type BankLinkCompletion =
  | 'emit'
  | 'redirect'
  | 'returnToApp'
  | 'returnToCheckout';

/**
 * Picks the completion behaviour for a finished bank link.
 *
 * `bankLinkOnly` wins over everything: the page was opened purely to link an
 * account, so there is nowhere to send the customer afterwards.
 */
export function resolveBankLinkCompletion({
  bankLinkOnly,
  hasCallbackRedirect,
  isReactNativeLink,
}: {
  bankLinkOnly: boolean;
  hasCallbackRedirect: boolean;
  isReactNativeLink: boolean;
}): BankLinkCompletion {
  if (bankLinkOnly) return 'emit';
  if (hasCallbackRedirect) return 'redirect';
  if (isReactNativeLink) return 'returnToApp';
  return 'returnToCheckout';
}

/**
 * How long the embedded flow holds the page blank before revealing the linked
 * state.
 *
 * A merchant who unmounts <CoinflowBankLink> on the accountLinked event should
 * never flash Coinflow's confirmation at their user, and a merchant who leaves
 * it mounted should not be left looking at nothing. Long enough to cover the
 * message hop and unmount, short enough not to read as a hang.
 */
export const BANK_LINK_REVEAL_DELAY_MS = 500;
