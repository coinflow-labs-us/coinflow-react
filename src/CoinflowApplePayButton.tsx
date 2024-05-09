import {
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  getWalletPubkey,
  getHandlers,
  IFrameMessageHandlers
} from './common';
import { CoinflowIFrame, CoinflowIFrameExposedFunctions } from "./CoinflowIFrame";
import React, { useEffect, useMemo, useRef } from "react";

export function CoinflowApplePayButton(props: CoinflowPurchaseProps & MobileWalletButtonProps) {
  return <MobileWalletButton props={props} route={'apple-pay'} />;
}

export function MobileWalletButton({props, route}: {props: CoinflowPurchaseProps, route: string}) {
  const iframeRef = useRef<CoinflowIFrameExposedFunctions>(null);
  const {onSuccess} = props;

  useEffect(() => {
    if (!onSuccess) return;
    if (!iframeRef?.current) return;
    iframeRef.current.listenForMessage((data: string) => {
      try {
        const res = JSON.parse(data);
        return 'method' in res && res.method === 'getToken'
      } catch (e) {
        return false;
      }
    }).then(data => onSuccess?.(data));
  }, [onSuccess]);

  const iframeProps = useMemo<CoinflowIFrameProps>(() => {
    const walletPubkey = getWalletPubkey(props);
    return {
      ...props,
      walletPubkey,
      transaction: undefined,
      routePrefix: 'form',
      route: `/${route}/${props.merchantId}`,
    }
  }, [props, route]);
  const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
    return {
      ...getHandlers(props),
      handleHeightChange: props.handleHeightChange
    };
  } , [props]);

  return <CoinflowIFrame ref={iframeRef} {...iframeProps } {...messageHandlers} />;
}

export interface MobileWalletButtonProps {
  color: "white" | "black"
}

// TODO
// export function useGetTokenHandler(props: CoinflowPurchaseProps) {
//   const {onSuccess} = props;
//
//   useEffect(() => {
//     const handler = getMessageHandler('getToken', (data: string) => {
//       if (data.startsWith('ERROR')) {
//         console.error('Mobile Wallet Payment Error', data.replace('ERROR', ''));
//         return;
//       }
//
//       onSuccess?.(data);
//     });
//
//     if (!window) throw new Error('Window not defined');
//     window.addEventListener('message', handler);
//   }, [onSuccess]);
// }
