import React, {useMemo, useRef} from 'react';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
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

function useCoinflowPurchase(
  purchaseProps: CoinflowPurchaseProps,
  version: string
) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(purchaseProps);
    return {
      ...purchaseProps,
      walletPubkey,
      route: `/purchase${version}/${purchaseProps.merchantId}`,
      transaction: CoinflowUtils.getTransaction(purchaseProps),
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, purchaseProps, version]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(purchaseProps),
      handleHeightChange: purchaseProps.handleHeightChange,
    };
  }, [purchaseProps]);

  return {iframeProps, messageHandlers};
}

export function CoinflowPurchase(purchaseProps: CoinflowPurchaseProps) {
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const {iframeProps, messageHandlers} = useCoinflowPurchase(
    purchaseProps,
    '-v2'
  );

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
