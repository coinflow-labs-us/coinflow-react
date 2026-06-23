import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  CoinflowIFrame,
  CoinflowIFrameExposedFunctions,
  useRandomHandleHeightChangeId,
} from './CoinflowIFrame';
import {MobileWalletButtonProps} from './MobileWalletButton';

export type CoinflowVenmoButtonProps = CoinflowPurchaseProps &
  MobileWalletButtonProps & {
    /** Phone number tied to the Venmo account, used to create the order. */
    phoneNumber?: {countryCode: string; nationalNumber: string};
    /** Saved Venmo account token, used to create the order directly. */
    token?: string;
    /**
     * Fires once the Venmo purchase is approved/complete, with the resulting
     * payment. Use it to drive your own post-purchase UI (the hosted iframe
     * shows its own "purchase complete" screen; the standalone button doesn't).
     */
    onApprove: (info: {paymentId: string}) => void;
  };

/**
 * Standalone Venmo button merchants can embed in their own checkout UI. Unlike
 * PayPal, Venmo's approval flow runs in a popup window rather than an in-page
 * overlay, so the button iframe stays inline — there's no overlay element to
 * position over and no `overlayId` prop.
 */
export function CoinflowVenmoButton(props: CoinflowVenmoButtonProps) {
  const {onError, onApprove, env, email, phoneNumber, token} = props;
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const [loaded, setLoaded] = useState(false);
  const handleHeightChangeId = useRandomHandleHeightChangeId();

  const hasIdentifier = Boolean(email || phoneNumber || token);

  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      email: undefined,
      walletPubkey,
      transaction: undefined,
      routePrefix: 'form',
      route: `/venmo/${props.merchantId}`,
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, props]);

  const identifierMessage = useMemo(
    () =>
      JSON.stringify({
        method: 'venmoIdentifier',
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        token: token || undefined,
      }),
    [email, phoneNumber, token]
  );

  useEffect(() => {
    iframeRef.current
      ?.listenForMessage(data => {
        try {
          return JSON.parse(data).method === 'loaded';
        } catch {
          return false;
        }
      })
      .then(() => setLoaded(true))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    iframeRef.current?.postMessage(identifierMessage);
  }, [loaded, identifierMessage]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(
    () => ({
      ...getHandlers(props),
      handleHeightChange: props.handleHeightChange,
    }),
    [props]
  );

  useEffect(() => {
    if (!onError && !onApprove) return;
    const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(env))
      .origin;
    const handler = (e: MessageEvent) => {
      if (e.origin !== expectedOrigin) return;
      if (typeof e.data !== 'string') return;
      try {
        const res = JSON.parse(e.data);
        if (typeof res?.data === 'string' && res.data.startsWith('ERROR'))
          onError?.(res.info ?? res.data);
        else if (res?.method === 'success') onApprove(res.info ?? {});
      } catch {
        // Ignore non-JSON messages.
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onError, onApprove, env]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    ...(hasIdentifier
      ? {}
      : {opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed'}),
  };

  return (
    <div style={containerStyle}>
      <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
    </div>
  );
}
