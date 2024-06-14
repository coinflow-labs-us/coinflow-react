import { CSSProperties } from 'react';
import { CardType, CoinflowEnvs } from '../common';
import { TokenizationResponse } from './TokenEx';
export declare const TokenExCardNumberIframeId = "tokenExCardNumber";
export declare const TokenExCvvContainerID = "tokenExCardCvv";
export interface TokenExIframe extends ReturnType<typeof TokenEx.Iframe> {
    tokenize: () => Promise<TokenizationResponse>;
}
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
export declare function useCardFormIframe(env: CoinflowEnvs): {
    tokenExIframe: TokenExIframe | undefined;
    initializeTokenExIframe: ({ css, fontFamily, debug, }: {
        css: string;
        fontFamily?: string;
        debug?: boolean;
    }) => Promise<{
        tokenize: () => Promise<TokenizationResponse>;
        load(): void;
        on: (event: string, callback: (data?: any) => void) => void;
        validate(): void;
        reset(): void;
        blur(): void;
        cvvBlur(): void;
        focus(): void;
        cvvFocus(): void;
        remove(): void;
        toggleMask(): void;
        toggleCvvMask(): void;
        setPAN(pan: string): void;
        binLookup(): void;
        validateConfig(): void;
        setFraudServicesRequestDetails(data: string): void;
    } | undefined>;
    initializeCvvOnlyTokenExIframe: ({ token, cardType, css, debug, fontFamily, }: {
        token: string;
        cardType: CardType;
        css: string;
        debug?: boolean;
        fontFamily?: string;
    }) => Promise<{
        tokenize: () => Promise<TokenizationResponse>;
        load(): void;
        on: (event: string, callback: (data?: any) => void) => void;
        validate(): void;
        reset(): void;
        blur(): void;
        cvvBlur(): void;
        focus(): void;
        cvvFocus(): void;
        remove(): void;
        toggleMask(): void;
        toggleCvvMask(): void;
        setPAN(pan: string): void;
        binLookup(): void;
        validateConfig(): void;
        setFraudServicesRequestDetails(data: string): void;
    } | undefined>;
    initializeTokenExCardOnlyIframe: ({ css, fontFamily, debug, }: {
        css: string;
        fontFamily?: string;
        debug?: boolean;
    }) => Promise<{
        tokenize: () => Promise<TokenizationResponse>;
        load(): void;
        on: (event: string, callback: (data?: any) => void) => void;
        validate(): void;
        reset(): void;
        blur(): void;
        cvvBlur(): void;
        focus(): void;
        cvvFocus(): void;
        remove(): void;
        toggleMask(): void;
        toggleCvvMask(): void;
        setPAN(pan: string): void;
        binLookup(): void;
        validateConfig(): void;
        setFraudServicesRequestDetails(data: string): void;
    } | undefined>;
    loaded: boolean;
    cachedToken: string | undefined;
    setTokenExScriptTag: () => void;
};
