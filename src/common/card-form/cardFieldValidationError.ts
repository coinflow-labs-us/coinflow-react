/**
 * Single source of truth for the validation errors the card entry shows below
 * the card box. The same value drives the on-screen message and the
 * `inputError` iframe message emitted to the parent, so the parent can never
 * be told about an error the user isn't seeing.
 */
import {CardEntryInputName} from './cardEntryLayout';

export type InputErrorWalletCallInfo = {
  field: CardEntryInputName;
  message: string;
};

/** Emitted when a field that was showing an error stops showing it. */
export type InputValidWalletCallInfo = {
  field: CardEntryInputName;
};

export const CARD_FIELD_ERROR_MESSAGES = {
  cardNumber: 'Card number is invalid. Please double check information.',
  expiration: 'Expiration is invalid. Please double check information.',
  cvv: 'CVV is invalid. Please double check information.',
  cvvEmpty: 'Please enter your CVV to proceed.',
} as const;

export function getCardFieldValidationError({
  cardError,
  expirationError,
  cvvError,
  cvvEmpty,
  isCvvOnly,
}: {
  cardError: boolean;
  expirationError: boolean;
  cvvError: boolean;
  cvvEmpty: boolean;
  isCvvOnly: boolean;
}): InputErrorWalletCallInfo | null {
  if (cardError)
    return {
      field: 'card-number',
      message: CARD_FIELD_ERROR_MESSAGES.cardNumber,
    };

  if (expirationError)
    return {
      field: 'expiration',
      message: CARD_FIELD_ERROR_MESSAGES.expiration,
    };

  if (!cvvError) return null;

  if (isCvvOnly && cvvEmpty)
    return {field: 'cvv', message: CARD_FIELD_ERROR_MESSAGES.cvvEmpty};

  return {field: 'cvv', message: CARD_FIELD_ERROR_MESSAGES.cvv};
}

/**
 * An iframe message the card entry should emit for a change in validation
 * state. `kind` rather than IFrameMessageMethods keeps this module free of a
 * circular import (CoinflowLibMessageHandlers imports the payload types here).
 */
export type CardFieldInputEvent =
  | {kind: 'error'; info: InputErrorWalletCallInfo}
  | {kind: 'valid'; info: InputValidWalletCallInfo};

/**
 * Derives which messages to emit for a transition between two validation
 * states, so the parent hears about each change exactly once.
 *
 * Nothing is emitted while the state is unchanged (including the pristine
 * state, where both sides are null), so a field that is never invalid stays
 * silent and a visible error is not re-sent on every render.
 *
 * Only one error is displayed at a time (see getCardFieldValidationError's
 * precedence), so when the displayed error moves to a different field the
 * previous field has necessarily become valid and gets its own clear event.
 */
export function getCardFieldInputEvents({
  previous,
  current,
}: {
  previous: InputErrorWalletCallInfo | null;
  current: InputErrorWalletCallInfo | null;
}): CardFieldInputEvent[] {
  if (!current)
    return previous ? [{kind: 'valid', info: {field: previous.field}}] : [];

  if (!previous) return [{kind: 'error', info: current}];

  if (previous.field === current.field)
    return previous.message === current.message
      ? []
      : [{kind: 'error', info: current}];

  return [
    {kind: 'valid', info: {field: previous.field}},
    {kind: 'error', info: current},
  ];
}
