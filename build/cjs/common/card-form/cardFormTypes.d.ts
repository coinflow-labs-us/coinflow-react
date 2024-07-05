import { CSSProperties } from 'react';
import { TokenizationResponse } from './TokenEx';
import { CardType, CoinflowEnvs } from '../CoinflowTypes';
export declare const TokenExCardNumberIframeId = "tokenExCardNumber";
export declare const TokenExCvvContainerID = "tokenExCardCvv";
export interface TokenExIframe extends ReturnType<typeof TokenEx.Iframe> {
    tokenize: () => Promise<TokenizationResponse>;
}
export declare const CARD_TYPE_MAPPING: Record<CardType, string>;
export interface TokenExIFrameConfiguration {
    origin: string;
    timestamp: string;
    tokenExID: string;
    tokenScheme: string;
    authenticationKey: string;
    pci: true;
    token?: string;
}
export interface CardFormInputStyles {
    base: CSSProperties | string;
    focus?: CSSProperties | string;
    error?: CSSProperties | string;
}
export type CoinflowCardTokenResponse = {
    token: string;
};
export interface CoinflowCardNumberInputProps {
    env: CoinflowEnvs;
    css: CardFormInputStyles & {
        cvv: CardFormInputStyles;
    };
    debug?: boolean;
    origins?: string[];
}
export interface CoinflowCvvOnlyInputProps {
    token: string;
    cardType: CardType;
    env: CoinflowEnvs;
    css: CardFormInputStyles & {
        cvv: CardFormInputStyles;
    };
    debug?: boolean;
    origins?: string[];
}
