import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import React, {useEffect, useMemo, useRef} from 'react';
import {
  CoinflowIFrame,
  CoinflowIFrameExposedFunctions,
  useRandomHandleHeightChangeId,
} from './CoinflowIFrame';
import {useOverlay} from './useOverlay';

export function MobileWalletButton({
  props,
  route,
  overlayDisplayOverride,
  children,
  alignItems,
}: {
  props: CoinflowPurchaseProps & MobileWalletButtonProps;
  route: string;
  overlayDisplayOverride?: string;
  children: React.ReactNode;
  alignItems?: string;
}) {
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const {opacity, display} = useOverlay(iframeRef);

  const {onSuccess, onError} = props;
  useEffect(() => {
    if (!onSuccess) return;
    if (!iframeRef?.current) return;
    iframeRef.current
      .listenForMessage((data: string) => {
        try {
          const res = JSON.parse(data);

          if ('method' in res && res.data.startsWith('ERROR')) {
            onError?.(res.info);
            return false;
          }

          return 'method' in res && res.method === 'getToken';
        } catch (e) {
          return false;
        }
      })
      .then(data => onSuccess?.(data));
  }, [onError, onSuccess]);

  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      walletPubkey,
      transaction: undefined,
      routePrefix: 'form',
      route: `/${route}/${props.merchantId}`,
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, props, route]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(props),
      handleHeightChange: props.handleHeightChange,
    };
  }, [props]);

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: props.color,
          width: '100%',
          height: '40px',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 20,
          display: overlayDisplayOverride ?? display,
          opacity,
          justifyContent: 'center',
          alignItems,
          pointerEvents: 'none',
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
        }}
      >
        <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
      </div>
    </div>
  );
}

export interface MobileWalletButtonProps {
  color: 'white' | 'black';
  onError?: (message: string) => void;
}
