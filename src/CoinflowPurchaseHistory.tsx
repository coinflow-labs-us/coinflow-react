import {useIframeWallet} from './useIframeWallet';
import {CoinflowIFrame} from './CoinflowIFrame';
import React from 'react';
import {useSolanaIFrameMessageHandlers} from './SolanaIFrameMessageHandlers';
import {useNearIFrameMessageHandlers} from './NearIFrameMessageHandlers';
import {CoinflowUtils} from './CoinflowUtils';
import {
  CoinflowIFrameProps,
  CoinflowNearHistoryProps,
  CoinflowPolygonHistoryProps,
  CoinflowSolanaHistoryProps,
} from './CommonCoinflowProps';
import {useEthIFrameMessageHandlers} from './EthIFrameMessageHandlers';

export function CoinflowPurchaseHistory(
  props: CoinflowSolanaHistoryProps | CoinflowNearHistoryProps | CoinflowPolygonHistoryProps
) {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: (
      <SolanaPurchaseHistory {...(props as CoinflowSolanaHistoryProps)} />
    ),
    near: <NearPurchaseHistory {...(props as CoinflowNearHistoryProps)} />,
    polygon: <PolygonPurchaseHistory {...(props as CoinflowPolygonHistoryProps)} />,
  });
}

function SolanaPurchaseHistory(props: CoinflowSolanaHistoryProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
  if (!wallet.publicKey) return null;
  const walletPubkey = wallet.publicKey.toString();

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/history/purchase/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps} />
  );
}

function NearPurchaseHistory(props: CoinflowNearHistoryProps) {
  const handlers = useNearIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  if (!props.wallet?.accountId) return null;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey: props.wallet.accountId,
    IFrameRef,
    route: `/history/purchase/${props.merchantId}`
  };
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}

function PolygonPurchaseHistory(props: CoinflowPolygonHistoryProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  if (!props.wallet?.address) return null;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey: props.wallet?.address,
    IFrameRef,
    route: `/history/purchase/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps} />
  );
}
