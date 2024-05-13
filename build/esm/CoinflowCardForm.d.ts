import React, { CSSProperties } from 'react';
import { CoinflowBlockchain, CoinflowEnvs } from './common';
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
    customCss?: {
        [key: string]: CSSProperties;
    };
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
export declare const CoinflowCardForm: React.ForwardRefExoticComponent<CoinflowCardFormProps & React.RefAttributes<unknown>>;
