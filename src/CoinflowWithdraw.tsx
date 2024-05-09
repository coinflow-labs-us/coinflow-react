import React, { useMemo } from "react";
import {CoinflowIFrame} from './CoinflowIFrame';
import {
  CoinflowIFrameProps,
  CoinflowWithdrawProps,
  getHandlers,
  IFrameMessageHandlers,
  getWalletPubkey
} from "./common";

export function CoinflowWithdraw(
  withdrawProps: CoinflowWithdrawProps
) {
  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(withdrawProps);
    return {
      ...withdrawProps,
      walletPubkey,
      route: `/withdraw/${withdrawProps.merchantId}`,
      transaction: undefined,
    };
  }, [withdrawProps]);

  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(withdrawProps),
      handleHeightChange: withdrawProps.handleHeightChange
    };
  } , [withdrawProps]);

  return <CoinflowIFrame {...iframeProps } {...messageHandlers} />;
}
