import {CoinflowIFrame} from './CoinflowIFrame';
import React, { useMemo } from "react";
import {
  CoinflowNearHistoryProps,
  CoinflowSolanaHistoryProps,
  CoinflowEthHistoryProps,
  CoinflowPolygonHistoryProps,
  CoinflowIFrameProps,
  CoinflowBaseHistoryProps,
  getWalletPubkey,
  IFrameMessageHandlers,
  getHandlers,
  CoinflowArbitrumHistoryProps
} from "./common";

export function CoinflowWithdrawHistory(
  props:
    | CoinflowSolanaHistoryProps
    | CoinflowNearHistoryProps
    | CoinflowEthHistoryProps
    | CoinflowPolygonHistoryProps
    | CoinflowBaseHistoryProps
    | CoinflowArbitrumHistoryProps
) {
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
      handleHeightChange: props.handleHeightChange
    };
  } , [props]);

  return <CoinflowIFrame {...iframeProps } {...messageHandlers} />;
}
