import React, {CSSProperties, forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {getMessageHandler} from './wallet/useIframeWallet';
import {CoinflowIFrame} from './CoinflowIFrame';
import {CoinflowBlockchain, CoinflowEnvs, CoinflowIFrameProps} from './CoinflowTypes';
import {useHandleHeightChange} from './useHandleHeightChange';

export type CoinflowCardTokenResponse = {
  last4: string;
  type: 'VISA' | 'MSTR' | 'AMEX' | 'DISC';
  token: string;
};

export interface CoinflowCardFormProps {
  merchantId: string;
  walletPubkey?: string;
  handleHeightChange?: (height: string) => void;
  env: CoinflowEnvs;
  inputCss?: CSSProperties;
  customCss?: {[key: string]: CSSProperties};
  blockchain: CoinflowBlockchain;
}

/**
 * Allows merchants to collect card information from their customers in a PCI-compliant way and receive a token for use with the `/api/checkout/token` endpoint.
 *
 * Usage:
 * ```tsx
 *  const ref =  useRef<{getToken(): Promise<{token: string}>}>();
 *
 *  <CoinflowCardForm
 *    ref={coinflowCardFormRef}
 *    ...
 *  />
 *
 *  <button onClick={() => {
 *   ref.current?.getToken()
 *     .then(({token}) => console.log(token))
 *     .catch(e => console.error('GET TOKEN ERROR', e))
 *  }}>Get Token</button>
 *
 * ```
 */
export const CoinflowCardForm = forwardRef(({handleHeightChange, walletPubkey, env, customCss, merchantId, blockchain}: CoinflowCardFormProps, ref) => {
  const IFrameRef = useRef<HTMLIFrameElement | null>(null);

  useHandleHeightChange(handleHeightChange);

  useImperativeHandle(ref, () => ({
    async getToken(): Promise<CoinflowCardTokenResponse> {
      if (!IFrameRef.current?.contentWindow) throw new Error('content window not found');

      IFrameRef.current.contentWindow.postMessage('getToken', '*');
      return new Promise<CoinflowCardTokenResponse>((resolve, reject) => {
        const handler = getMessageHandler('getToken', (data: string) => {
          if (data.startsWith('ERROR')) {
            reject(new Error(data.replace('ERROR', '')));
            return;
          }

          resolve(JSON.parse(data));
        });

        if (!window) throw new Error('Window not defined');
        window.addEventListener('message', handler);
      });
    }
  }));

  const merchantCss = useMemo(() => {
    if (!customCss) return undefined;

    const cssStr = Object.entries(customCss).reduce((acc, [key, value]) => {
      return acc + `${key} {${CSSPropertiesToComponent(value)}}\n`;
    }, '');

    return Buffer.from(cssStr).toString('base64');
  }, [customCss]);

  if (!walletPubkey) return null;

  const iFrameProps: CoinflowIFrameProps = {
    walletPubkey: walletPubkey as string,
    blockchain,
    route: `/checkout-form/${merchantId}`,
    env,
    IFrameRef,
    routePrefix: 'form',
    merchantCss,
    handleHeightChange,
  };

  return <CoinflowIFrame {...iFrameProps} />;
});

function CSSPropertiesToComponent(dict: CSSProperties){
  let str = '';
  for(const [key, value] of Object.entries(dict)){
    let clo = '';
    key.split('').forEach(lt=>{
      if (lt.toUpperCase() === lt) {
        clo += '-' + lt.toLowerCase();
      } else{
        clo += lt;
      }
    });
    str += clo + ':' + value + ';';
  }
  return str;
}
