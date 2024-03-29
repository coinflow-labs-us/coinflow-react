import {CoinflowUtils} from './CoinflowUtils';
import {useIframeWallet} from './wallet/useIframeWallet';
import {CoinflowIFrame} from './CoinflowIFrame';
import React from 'react';
import {useSolanaIFrameMessageHandlers} from './wallet/SolanaIFrameMessageHandlers';
import {useNearIFrameMessageHandlers} from './wallet/NearIFrameMessageHandlers';
import {
  CoinflowNearHistoryProps,
  CoinflowSolanaHistoryProps,
  CoinflowEthHistoryProps,
  CoinflowPolygonHistoryProps, CoinflowIFrameProps, CoinflowBaseHistoryProps
} from "./CoinflowTypes";
import {useEthIFrameMessageHandlers} from './wallet/EthIFrameMessageHandlers';

export function CoinflowWithdrawHistory(
  props:
    | CoinflowSolanaHistoryProps
    | CoinflowNearHistoryProps
    | CoinflowEthHistoryProps
    | CoinflowPolygonHistoryProps
    | CoinflowBaseHistoryProps
) {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: (
      <SolanaWithdrawHistory {...(props as CoinflowSolanaHistoryProps)} />
    ),
    near: <NearWithdrawHistory {...(props as CoinflowNearHistoryProps)} />,
    eth: <EthWithdrawHistory {...(props as CoinflowEthHistoryProps)} />,
    polygon: <EthWithdrawHistory {...(props as CoinflowPolygonHistoryProps)} />,
    base: <EthWithdrawHistory {...(props as CoinflowBaseHistoryProps)} />,
  });
}

function SolanaWithdrawHistory(props: CoinflowSolanaHistoryProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.publicKey?.toString());

  if (!wallet.publicKey) return null;
  const walletPubkey = wallet.publicKey.toString();

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/history/withdraw/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps} />
  );
}

function NearWithdrawHistory(props: CoinflowNearHistoryProps) {
  const handlers = useNearIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.accountId);

  if (!wallet) return null;
  const walletPubkey = wallet.accountId;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/history/withdraw/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps} />
  );
}

function EthWithdrawHistory(props: CoinflowEthHistoryProps | CoinflowPolygonHistoryProps | CoinflowBaseHistoryProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.address);

  if (!wallet?.address) return null;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey: wallet.address,
    IFrameRef,
    route: `/history/withdraw/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps} />
  );
}
