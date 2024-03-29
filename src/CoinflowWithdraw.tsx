import React from 'react';
import {CoinflowIFrame} from './CoinflowIFrame';
import {
  CoinflowUtils,
} from './CoinflowUtils';
import {useIframeWallet} from './wallet/useIframeWallet';
import {useSolanaIFrameMessageHandlers} from './wallet/SolanaIFrameMessageHandlers';
import {useNearIFrameMessageHandlers} from './wallet/NearIFrameMessageHandlers';
import {
  CoinflowBaseWithdrawProps,
  CoinflowEthWithdrawProps,
  CoinflowIFrameProps, CoinflowNearWithdrawProps, CoinflowPolygonWithdrawProps, CoinflowSolanaWithdrawProps,
  CoinflowWithdrawProps
} from "./CoinflowTypes";
import {useEthIFrameMessageHandlers} from './wallet/EthIFrameMessageHandlers';

export function CoinflowWithdraw(
  props: CoinflowWithdrawProps
) {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: (
      <CoinflowSolanaWithdraw {...(props as CoinflowSolanaWithdrawProps)} />
    ),
    near: <CoinflowNearWithdraw {...(props as CoinflowNearWithdrawProps)} />,
    eth: <CoinflowEthWithdraw {...(props as CoinflowEthWithdrawProps)} />,
    polygon: (
      <CoinflowEthWithdraw {...(props as CoinflowPolygonWithdrawProps)} />
    ),
    base: (
      <CoinflowEthWithdraw {...(props as CoinflowBaseWithdrawProps)} />
    ),
  });
}

function CoinflowSolanaWithdraw(props: CoinflowSolanaWithdrawProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.publicKey?.toString());

  if (!wallet.publicKey) return null;
  const walletPubkey = wallet.publicKey.toString();

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/withdraw/${props.merchantId}`,
    supportsVersionedTransactions: props.supportsVersionedTransactions !== false,
  };
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}

function CoinflowNearWithdraw(props: CoinflowNearWithdrawProps) {
  const handlers = useNearIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.accountId);

  if (!wallet) return null;
  const walletPubkey = wallet.accountId;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/withdraw/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}

function CoinflowEthWithdraw(props: CoinflowEthWithdrawProps | CoinflowPolygonWithdrawProps | CoinflowBaseWithdrawProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {wallet} = props;
  const {IFrameRef} = useIframeWallet(handlers, props, wallet.address);

  if (!wallet?.address) return null;
  const walletPubkey = wallet.address;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    route: `/withdraw/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}
