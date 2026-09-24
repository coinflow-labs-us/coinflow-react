import React, {useMemo} from 'react';
import {CoinflowIFrame, useRandomHandleHeightChangeId} from './CoinflowIFrame';
import {
  CoinflowBankLinkProps,
  CoinflowIFrameProps,
  IFrameMessageHandlers,
} from './common';

/**
 * Embeds Coinflow's Plaid bank linking flow so a customer can connect a bank
 * account without leaving the merchant's site.
 *
 * **Web only.** React Native and other mobile integrations must send the
 * customer to the standalone bank link URL instead.
 *
 * `onAccountLinked` fires when linking completes, carrying the linked bank
 * account tokens. Each token can be passed as the `token` field of an ACH
 * checkout request. `onAccountNotLinked` fires instead when the customer
 * cancels or the account cannot be linked — the component stays put rather
 * than navigating, so the merchant closes or resets its own UI.
 * `onAccountLinkError` fires when a link attempt fails, carrying the error.
 */
export function CoinflowBankLink(props: CoinflowBankLinkProps) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();

  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    return {
      ...props,
      walletPubkey: undefined,
      route: `/checkout-link/${props.merchantId}`,
      transaction: undefined,
      handleHeightChangeId,
      bankLinkOnly: true,
    };
  }, [handleHeightChangeId, props]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      // Bank linking never signs a transaction.
      handleSendTransaction: () =>
        Promise.reject(
          new Error(
            'handleSendTransaction is not supported by CoinflowBankLink'
          )
        ),
      onSuccess: undefined,
      onAuthDeclined: undefined,
      onAccountLinked: props.onAccountLinked,
      onAccountNotLinked: props.onAccountNotLinked,
      onAccountLinkError: props.onAccountLinkError,
      handleHeightChange: props.handleHeightChange,
    };
  }, [
    props.handleHeightChange,
    props.onAccountLinked,
    props.onAccountNotLinked,
    props.onAccountLinkError,
  ]);

  return <CoinflowIFrame {...iframeProps} {...messageHandlers} />;
}
