import { CardType, CoinflowEnvs } from '../CoinflowTypes';
import type { Properties as CSSProperties } from 'csstype';
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
    use3DS?: boolean;
    threeDSMethodNotificationUrl?: string;
}
export interface CardFormInputStyles {
    base: CSSProperties | string;
    placeholder?: CSSProperties | string;
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
    origins: string[];
    font?: string;
}
export interface CoinflowCvvOnlyInputProps {
    token: string;
    cardType: CardType;
    env: CoinflowEnvs;
    css: CardFormInputStyles & {
        cvv: CardFormInputStyles;
    };
    debug?: boolean;
    origins: string[];
    font?: string;
}
export interface VersionDetail {
    threeDSMethodURL: string;
    acsStartProtocolVersion: string;
    acsEndProtocolVersion: string;
    threeDSServerStartVersion: string;
    threeDSServerEndVersion?: string;
    acsInfoInd: [string];
    directoryServerID: string;
    dsStartProtocolVersion: string;
    dsEndProtocolVersion: string;
    dsIdentifier: string;
    threeDSServerTransID: string;
}
export interface TokenizationResponse {
    cardType: string;
    cvvIncluded: true;
    firstSix: string;
    lastFour: string;
    referenceNumber: string;
    token: string;
    tokenHMAC: string;
    recommended3dsVersion?: Record<string, string>;
    threeDSecureResponse?: VersionDetail[];
}
