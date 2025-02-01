import {CoinflowIFrame, useRandomHandleHeightChangeId} from './CoinflowIFrame';
import React, {useMemo} from 'react';
import {
  CoinflowHistoryProps,
  CoinflowIFrameProps,
  getHandlers,
  IFrameMessageHandlers,
  getWalletPubkey,
} from './common';

export function CoinflowPurchaseHistory(props: CoinflowHistoryProps) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      walletPubkey,
      route: `/history/purchase/${props.merchantId}`,
      transaction: undefined,
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, props]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(props),
      handleHeightChange: props.handleHeightChange,
    };
  }, [props]);

  return <CoinflowIFrame {...iframeProps} {...messageHandlers} />;
}
