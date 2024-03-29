import {
  CoinflowEvmPurchaseProps,
  CoinflowIFrameProps,
  CoinflowNearPurchaseProps,
  CoinflowPurchaseProps,
  CoinflowSolanaPurchaseProps,
} from './CoinflowTypes';
import {CoinflowIFrame} from './CoinflowIFrame';
import React, {useEffect, useMemo, useRef} from 'react';
import {useHandleHeightChange} from './useHandleHeightChange';
import {getMessageHandler} from './wallet/useIframeWallet';
import {CoinflowUtils} from './CoinflowUtils';

export function CoinflowApplePayButton(props: CoinflowPurchaseProps & MobileWalletButtonProps) {
  return <MobileWalletButton props={props} route={'apple-pay'} />;
}

export function MobileWalletButton({props, route}: {props: CoinflowPurchaseProps, route: string}) {
  const IFrameRef = useRef<HTMLIFrameElement | null>(null);
  useHandleHeightChange(props.handleHeightChange);
  useGetTokenHandler(props);
  const walletPubkey = useStringWalletPubkey(props);

  if (!walletPubkey) return null;

  const iframeProps: CoinflowIFrameProps = {
    ...props,
    walletPubkey,
    IFrameRef,
    transaction: undefined,
    routePrefix: 'form',
    route: `/${route}/${props.merchantId}`,
  };
  return <CoinflowIFrame {...iframeProps} />;
}

export interface MobileWalletButtonProps {
  color: "white" | "black"
}

export function useStringWalletPubkey(props: CoinflowPurchaseProps) {
  return useMemo(() => {
    const getWalletPubkey = CoinflowUtils.byBlockchain<() => string | undefined | null>(props.blockchain, {
      solana: () => (props as CoinflowSolanaPurchaseProps)?.wallet?.publicKey?.toString(),
      near: () => (props as CoinflowNearPurchaseProps).wallet.accountId,
      eth: () => (props as CoinflowEvmPurchaseProps).wallet.address,
      polygon: () => (props as CoinflowEvmPurchaseProps).wallet.address,
      base: () => (props as CoinflowEvmPurchaseProps).wallet.address,
    });
    return getWalletPubkey();
  }, [props]);
}

export function useGetTokenHandler(props: CoinflowPurchaseProps) {
  const {onSuccess} = props;

  useEffect(() => {
    const handler = getMessageHandler('getToken', (data: string) => {
      if (data.startsWith('ERROR')) {
        console.error('Mobile Wallet Payment Error', data.replace('ERROR', ''));
        return;
      }

      onSuccess?.(data);
    });

    if (!window) throw new Error('Window not defined');
    window.addEventListener('message', handler);
  }, [onSuccess]);
}
