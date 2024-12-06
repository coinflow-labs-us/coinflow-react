import {CoinflowIFrame} from './CoinflowIFrame';
import React, {useMemo} from 'react';
import {
  CoinflowIFrameProps,
  getWalletPubkey,
  IFrameMessageHandlers,
  getHandlers,
  CoinflowHistoryProps,
} from './common';

export function CoinflowWithdrawHistory(props: CoinflowHistoryProps) {
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      walletPubkey,
      route: `/history/withdraw/${props.merchantId}`,
      transaction: undefined,
    };
  }, [props]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(props),
      handleHeightChange: props.handleHeightChange,
    };
  }, [props]);

  return <CoinflowIFrame {...iframeProps} {...messageHandlers} />;
}
