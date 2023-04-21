import React from 'react';
import type {Connection} from '@solana/web3.js';
import {CoinflowIFrame} from './CoinflowIFrame';
import {
  CoinflowUtils,
  EthWallet,
  NearWallet,
  SolanaWallet,
} from './CoinflowUtils';
import {OnSuccessMethod, useIframeWallet} from './useIframeWallet';
import {useSolanaIFrameMessageHandlers} from './SolanaIFrameMessageHandlers';
import {useNearIFrameMessageHandlers} from './NearIFrameMessageHandlers';
import {CoinflowIFrameProps, CommonCoinflowProps} from './CommonCoinflowProps';
import {useEthIFrameMessageHandlers} from './EthIFrameMessageHandlers';

export interface CoinflowCommonWithdrawProps extends CommonCoinflowProps {
  onSuccess?: OnSuccessMethod;
  token?: string;
  amount?: number;
  email?: string;
}

export interface CoinflowSolanaWithdrawProps
  extends CoinflowCommonWithdrawProps {
  wallet: SolanaWallet;
  connection: Connection;
  blockchain: 'solana';
}

export interface CoinflowNearWithdrawProps extends CoinflowCommonWithdrawProps {
  wallet: NearWallet;
  blockchain: 'near';
}

export interface CoinflowEthWithdrawProps extends CoinflowCommonWithdrawProps {
  wallet: Omit<EthWallet, 'signMessage'>;
  blockchain: 'eth';
}

export interface CoinflowPolygonWithdrawProps
  extends CoinflowCommonWithdrawProps {
  wallet: Omit<EthWallet, 'signMessage'>;
  blockchain: 'polygon';
}

export function CoinflowWithdraw(
  props:
    | CoinflowSolanaWithdrawProps
    | CoinflowNearWithdrawProps
    | CoinflowEthWithdrawProps
    | CoinflowPolygonWithdrawProps
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
  });
}

function CoinflowSolanaWithdraw(props: CoinflowSolanaWithdrawProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
  if (!wallet.publicKey) return null;
  const walletPubkey = wallet.publicKey.toString();

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

function CoinflowNearWithdraw(props: CoinflowNearWithdrawProps) {
  const handlers = useNearIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
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

function CoinflowEthWithdraw(props: CoinflowEthWithdrawProps | CoinflowPolygonWithdrawProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet} = props;
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
