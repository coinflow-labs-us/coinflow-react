import React, {useMemo} from 'react';
import {CoinflowIFrame, useRandomHandleHeightChangeId} from './CoinflowIFrame';
import {
  CoinflowIFrameProps,
  CoinflowWithdrawProps,
  getHandlers,
  IFrameMessageHandlers,
  getWalletPubkey,
} from './common';

export function CoinflowWithdraw(withdrawProps: CoinflowWithdrawProps) {
  const handleHeightChangeId = useRandomHandleHeightChangeId();
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(withdrawProps);
    return {
      ...withdrawProps,
      walletPubkey,
      route: `/withdraw/${withdrawProps.merchantId}`,
      transaction: undefined,
      handleHeightChangeId,
    };
  }, [handleHeightChangeId, withdrawProps]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(withdrawProps),
      handleHeightChange: withdrawProps.handleHeightChange,
    };
  }, [withdrawProps]);

  return <CoinflowIFrame {...iframeProps} {...messageHandlers} />;
}
