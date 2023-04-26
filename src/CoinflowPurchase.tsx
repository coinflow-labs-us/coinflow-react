import React, {useMemo} from 'react';
import {CoinflowIFrame} from './CoinflowIFrame';
import {useSolanaIFrameMessageHandlers} from './wallet/SolanaIFrameMessageHandlers';
import {
  CoinflowUtils
} from './CoinflowUtils';
import {useIframeWallet} from './wallet/useIframeWallet';
import {useNearIFrameMessageHandlers} from './wallet/NearIFrameMessageHandlers';
import {
  CoinflowIFrameProps,
  CoinflowNearPurchaseProps,
  CoinflowPolygonPurchaseProps,
  CoinflowPurchaseProps,
  CoinflowSolanaPurchaseProps,
} from './CoinflowTypes';
import {useEthIFrameMessageHandlers} from './wallet/EthIFrameMessageHandlers';

export function CoinflowPurchase(
  props:CoinflowPurchaseProps
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
