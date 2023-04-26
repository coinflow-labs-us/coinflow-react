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
  CoinflowPolygonHistoryProps, CoinflowIFrameProps,
} from './CoinflowTypes';
import {useEthIFrameMessageHandlers} from './wallet/EthIFrameMessageHandlers';

export function CoinflowWithdrawHistory(
  props:
    | CoinflowSolanaHistoryProps
    | CoinflowNearHistoryProps
    | CoinflowEthHistoryProps
    | CoinflowPolygonHistoryProps
) {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: (
      <SolanaWithdrawHistory {...(props as CoinflowSolanaHistoryProps)} />
    ),
    near: <NearWithdrawHistory {...(props as CoinflowNearHistoryProps)} />,
    eth: <EthWithdrawHistory {...(props as CoinflowEthHistoryProps)} />,
    polygon: <EthWithdrawHistory {...(props as CoinflowPolygonHistoryProps)} />,
  });
}

function SolanaWithdrawHistory(props: CoinflowSolanaHistoryProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
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
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
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

function EthWithdrawHistory(props: CoinflowEthHistoryProps | CoinflowPolygonHistoryProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
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
