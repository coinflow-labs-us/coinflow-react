import React, {useMemo} from 'react';
import type { Connection, PublicKey, Signer, Transaction } from "@solana/web3.js";
import {CoinflowIFrame} from './CoinflowIFrame';
import {useSolanaIFrameMessageHandlers} from './SolanaIFrameMessageHandlers';
import {
  CoinflowUtils,
  EthWallet,
  NearWallet,
  SolanaWallet,
} from './CoinflowUtils';
import {OnSuccessMethod, useIframeWallet} from './useIframeWallet';
import {useNearIFrameMessageHandlers} from './NearIFrameMessageHandlers';
import {CoinflowIFrameProps, CommonCoinflowProps} from './CommonCoinflowProps';
import {useEthIFrameMessageHandlers} from './EthIFrameMessageHandlers';

export interface CoinflowCommonPurchaseProps extends CommonCoinflowProps {
  amount?: number;
  onSuccess?: OnSuccessMethod;
  webhookInfo?: object;
  email?: string;
}

export interface CoinflowSolanaPurchaseProps
  extends CoinflowCommonPurchaseProps {
  wallet: SolanaWallet;
  transaction?: Transaction;
  partialSigners?: Signer[];
  debugTx?: boolean;
  connection: Connection;
  blockchain: 'solana';
  token?: PublicKey | string;
  supportsVersionedTransactions?: boolean;
}

export type NearFtTransferCallAction = {
  methodName: 'ft_transfer_call';
  args: object;
  gas: string;
  deposit: string;
};

export interface CoinflowNearPurchaseProps extends CoinflowCommonPurchaseProps {
  wallet: NearWallet;
  blockchain: 'near';
  action?: NearFtTransferCallAction;
}

type BigNumberish = object | bigint | string | number;
type Bytes = ArrayLike<number>;
type BytesLike = Bytes | string;

type EvmTransaction = {
  to: string;
  from?: string;
  nonce?: BigNumberish;

  gasLimit?: BigNumberish;
  gasPrice?: BigNumberish;

  data?: BytesLike;
  value?: BigNumberish;
  chainId?: number;

  type?: number;

  maxPriorityFeePerGas?: BigNumberish;
  maxFeePerGas?: BigNumberish;

  customData?: Record<string, any>;
  ccipReadEnabled?: boolean;
};

export interface CoinflowPolygonPurchaseProps
  extends CoinflowCommonPurchaseProps {
  transaction?: EvmTransaction;
  wallet: EthWallet;
  blockchain: 'polygon';
}

export function CoinflowPurchase(
  props:
    | CoinflowSolanaPurchaseProps
    | CoinflowNearPurchaseProps
    | CoinflowPolygonPurchaseProps
) {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: (
      <SolanaCoinflowPurchase {...(props as CoinflowSolanaPurchaseProps)} />
    ),
    near: <NearCoinflowPurchase {...(props as CoinflowNearPurchaseProps)} />,
    polygon: (
      <PolygonCoinflowPurchase {...(props as CoinflowPolygonPurchaseProps)} />
    ),
  });
}

function SolanaCoinflowPurchase(props: CoinflowSolanaPurchaseProps) {
  const handlers = useSolanaIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet, transaction, supportsVersionedTransactions: supportsVersionedTransactionsParam} = props;
  const transactionStr = useMemo(
    () =>
      transaction
        ? CoinflowUtils.serializeSolanaTransaction(transaction)
        : undefined,
    [transaction]
  );

  const supportsVersionedTransactions = useMemo<boolean>(() => {
    if (supportsVersionedTransactionsParam !== undefined) return supportsVersionedTransactionsParam;

    if (!wallet?.wallet) return false;
    const {supportedTransactionVersions} = wallet.wallet.adapter;
    if (!supportedTransactionVersions) return false;
    return supportedTransactionVersions.has(0);

  }, [supportsVersionedTransactionsParam, wallet.wallet]);

  if (!wallet.publicKey) return null;
  const walletPubkey = wallet.publicKey.toString();

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    transaction: transactionStr,
    supportsVersionedTransactions,
    route: `/purchase/${props.merchantId}`,
  };
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}

function NearCoinflowPurchase(props: CoinflowNearPurchaseProps) {
  const handlers = useNearIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {wallet, action} = props;
  const transaction = useMemo(
    () =>
      action
        ? Buffer.from(JSON.stringify(action)).toString('base64')
        : undefined,
    [action]
  );

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey: wallet.accountId,
    IFrameRef,
    transaction,
    route: `/purchase/${props.merchantId}`,
  }
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}

export function PolygonCoinflowPurchase(props: CoinflowPolygonPurchaseProps) {
  const handlers = useEthIFrameMessageHandlers(props);
  const {IFrameRef} = useIframeWallet(handlers, props);

  const {transaction, wallet} = props;
  const transactionStr = useMemo(() => {
    if (!transaction) return undefined;
    return Buffer.from(JSON.stringify(transaction)).toString('base64');
  }, [transaction]);

  if (!wallet.address) return null;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey: wallet.address,
    IFrameRef,
    transaction: transactionStr,
    route: `/purchase/${props.merchantId}`,
  }
  return (
    <CoinflowIFrame {...iframeProps}/>
  );
}
