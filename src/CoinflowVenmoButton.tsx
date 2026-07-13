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
    /**
     * Id of an element the Venmo approval overlay should fill while it's open
     * (e.g. a full-screen backdrop the merchant renders). When Venmo's modal
     * opens, the button iframe is positioned over this element's bounds; on
     * close it returns to the inline button.
     */
    overlayId: string;
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
 * Standalone Venmo button merchants can embed in their own checkout UI.
 * Venmo's approval flow renders as an in-page modal, so while it's open the
 * button iframe expands to the `overlayId` element's bounds, then returns to
 * the inline button on close.
 */
export function CoinflowVenmoButton(props: CoinflowVenmoButtonProps) {
  const {overlayId, onError, onApprove, env, email, phoneNumber, token} = props;
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayBounds, setOverlayBounds] = useState<DOMRect | null>(null);
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
      handleOverlay: (state: string) => setOverlayOpen(state === 'open'),
    }),
    [props]
  );

  useEffect(() => {
    if (!overlayId || !loaded || overlayBounds) return;
    const sendOffset = () => {
      const container = containerRef.current;
      const el = document.getElementById(overlayId);
      if (!container || !el) return;
      const b = container.getBoundingClientRect();
      const p = el.getBoundingClientRect();
      iframeRef.current?.postMessage(
        JSON.stringify({
          method: 'venmoOverlayOffset',
          top: b.top - p.top,
          left: b.left - p.left,
          width: b.width,
          height: b.height,
        })
      );
    };
    sendOffset();
    window.addEventListener('resize', sendOffset);
    return () => window.removeEventListener('resize', sendOffset);
  }, [overlayId, loaded, overlayBounds]);

  useEffect(() => {
    if (!overlayOpen || !overlayId) {
      setOverlayBounds(null);
      return;
    }
    const measure = () => {
      const el = document.getElementById(overlayId);
      setOverlayBounds(el ? el.getBoundingClientRect() : null);
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [overlayOpen, overlayId]);

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

  const containerStyle: React.CSSProperties = overlayBounds
    ? {
        position: 'fixed',
        top: overlayBounds.top,
        left: overlayBounds.left,
        width: overlayBounds.width,
        height: overlayBounds.height,
        zIndex: 2147483647,
      }
    : {
        position: 'relative',
        height: '100%',
        ...(hasIdentifier
          ? {}
          : {opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed'}),
      };

  return (
    <div ref={containerRef} style={containerStyle}>
      <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
    </div>
  );
}
