import React, {
  CSSProperties,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {CoinflowIFrame, CoinflowIFrameExposedFunctions} from './CoinflowIFrame';
import {
  CoinflowBlockchain,
  CoinflowEnvs,
  CoinflowIFrameProps,
  IFrameMessageHandlers,
} from './common';

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
export const CoinflowCardForm = forwardRef(
  (props: CoinflowCardFormProps, ref) => {
    const iframeRef = useRef<CoinflowIFrameExposedFunctions>();
    useImperativeHandle(ref, () => ({
      async getToken(): Promise<CoinflowCardTokenResponse> {
        const methodName = 'getToken';
        if (!iframeRef.current) throw new Error('Unable to get token');
        const isValid = (data: string) => {
          try {
            const res = JSON.parse(data);
            return 'method' in res && res.method === methodName;
          } catch (e) {
            return false;
          }
        };
        const response = await iframeRef.current.sendAndReceiveMessage(
          methodName,
          isValid
        );
        return JSON.parse(response).data;
      },
    }));

    const merchantCss = useMemo(() => {
      if (!props.customCss) return undefined;

      const cssStr = Object.entries(props.customCss).reduce(
        (acc, [key, value]) => {
          return acc + `${key} {${CSSPropertiesToComponent(value)}}\n`;
        },
        ''
      );

      return Buffer.from(cssStr).toString('base64');
    }, [props.customCss]);

    const iframeProps = useMemo<CoinflowIFrameProps>(() => {
      return {
        ...props,
        walletPubkey: props.walletPubkey,
        route: `/checkout-form/${props.merchantId}`,
        routePrefix: 'form',
        merchantCss,
        transaction: undefined,
      };
    }, [merchantCss, props]);

    const messageHandlers = useMemo<IFrameMessageHandlers>(() => {
      return {
        handleSendTransaction: () => {
          throw new Error('Not Supported');
        },
        handleHeightChange: props.handleHeightChange,
        onSuccess: undefined,
      };
    }, [props]);

    return (
      <CoinflowIFrame ref={iframeRef} {...iframeProps} {...messageHandlers} />
    );
  }
);

function CSSPropertiesToComponent(dict: CSSProperties) {
  let str = '';
  for (const [key, value] of Object.entries(dict)) {
    let clo = '';
    key.split('').forEach(lt => {
      if (lt.toUpperCase() === lt) {
        clo += '-' + lt.toLowerCase();
      } else {
        clo += lt;
      }
    });
    str += clo + ':' + value + ';';
  }
  return str;
}
