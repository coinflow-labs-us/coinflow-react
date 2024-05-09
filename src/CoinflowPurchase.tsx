import React, {useMemo} from 'react';
import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CoinflowUtils,
  getHandlers,
  getWalletPubkey,
  IFrameMessageHandlers,
} from './common';
import {CoinflowIFrame} from './CoinflowIFrame';

export function CoinflowPurchase(purchaseProps: CoinflowPurchaseProps) {
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(purchaseProps);
    return {
      ...purchaseProps,
      walletPubkey,
      route: `/purchase/${purchaseProps.merchantId}`,
      transaction: CoinflowUtils.getTransaction(purchaseProps),
    };
  }, [purchaseProps]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(purchaseProps),
      handleHeightChange: purchaseProps.handleHeightChange,
    };
  }, [purchaseProps]);

  return <CoinflowIFrame {...iframeProps} {...messageHandlers} />;
}
