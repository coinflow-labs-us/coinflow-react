import React, {useMemo, useRef} from 'react';
import {
  CoinflowCommonPaymentIntentProps,
  CoinflowIntentsIFrameProps,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import {
  CoinflowIFrame,
  CoinflowIFrameExposedFunctions,
  useRandomHandleHeightChangeId,
} from './CoinflowIFrame';
import {useOverlay} from './useOverlay';
import {invertHexColor, styles} from './Utils';
import {LoaderOverlay} from './Loader';

export function CoinflowPaymentIntentCheckout(
  props: CoinflowCommonPaymentIntentProps
) {
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const {iframeProps, messageHandlers} =
    useCoinflowPaymentIntentCheckout(props);

  const {showOverlay} = useOverlay(iframeRef);

  const loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
  const invertedColor = invertHexColor(loaderBackground);

  return (
    <div style={styles.container(loaderBackground)}>
      <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
      {showOverlay && (
        <LoaderOverlay
          loaderBackground={loaderBackground}
          invertedColor={invertedColor}
        />
      )}
    </div>
  );
}

function useCoinflowPaymentIntentCheckout(
  props: CoinflowCommonPaymentIntentProps
) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIntentsIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      walletPubkey,
      route: `/intents/checkout/${props.paymentIntentId}`,
      intentId: props.paymentIntentId,
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, props]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      handleSendTransaction: () => {
        throw new Error('Not impl');
      },
      onSuccess: props.onSuccess,
      onAuthDeclined: props.onAuthDeclined,
      handleHeightChange: props.handleHeightChange,
    };
  }, [props]);

  return {iframeProps, messageHandlers};
}
