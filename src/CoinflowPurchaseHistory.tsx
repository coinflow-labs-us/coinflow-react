import {useIframeWallet} from './wallet/useIframeWallet';
import {CoinflowIFrame} from './CoinflowIFrame';
import React from 'react';
import {useSolanaIFrameMessageHandlers} from './wallet/SolanaIFrameMessageHandlers';
import {useNearIFrameMessageHandlers} from './wallet/NearIFrameMessageHandlers';
import {CoinflowUtils} from './CoinflowUtils';
import {
  CoinflowHistoryProps,
  CoinflowIFrameProps,
  CoinflowNearHistoryProps,
  CoinflowPolygonHistoryProps,
  CoinflowSolanaHistoryProps,
} from './CoinflowTypes';
import {useEthIFrameMessageHandlers} from './wallet/EthIFrameMessageHandlers';

export function CoinflowPurchaseHistory(
  props: CoinflowHistoryProps
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
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.publicKey?.toString());

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
  const {IFrameRef} = useIframeWallet(handlers, props, props.wallet?.accountId);

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
  const {IFrameRef} = useIframeWallet(handlers, props, props.wallet?.address);

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
