// Type definitions for TokenEx iframe integration

import {CardType, CoinflowEnvs} from '../CoinflowTypes';
import {CSSProperties} from 'react';

export const TokenExCardNumberIframeId = 'tokenExCardNumber';
export const TokenExCvvContainerID = 'tokenExCardCvv';
export interface TokenExIframe extends ReturnType<typeof TokenEx.Iframe> {
  tokenize: () => Promise<TokenizationResponse>;
}

export const CARD_TYPE_MAPPING: Record<CardType, string> = {
  [CardType.VISA]: 'visa',
  [CardType.MASTERCARD]: 'masterCard',
  [CardType.AMEX]: 'americanExpress',
  [CardType.DISCOVER]: 'discover',
};

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
  css: CardFormInputStyles & {cvv: CardFormInputStyles};
  debug?: boolean;
  origins: string[];
  font?: string;
}

export interface CoinflowCvvOnlyInputProps {
  token: string;
  cardType: CardType;
  env: CoinflowEnvs;
  css: CardFormInputStyles & {cvv: CardFormInputStyles};
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace TokenEx {
    interface FraudServicesConfig {
      useKount?: boolean;
      kount?: {
        merchantId?: string;
        mode?: string;
        anId?: string;
      };
    }

    interface Config {
      debug?: boolean;
      enablePrettyFormat?: boolean;
      maskInput?: boolean;
      enableValidateOnBlur?: boolean;
      enableAriaRequired?: boolean;
      pci?: boolean;
      cvvOnly?: boolean;
      allowUnknownCardTypes?: boolean;
      enableAutoComplete?: boolean;
      returnAutoCompleteValues?: boolean;
      returnKhash?: boolean;
      returnWhash?: boolean;
      enforceLuhnCompliance?: boolean;
      use3DS?: boolean;
      enableValidateOnKeyUp?: boolean;
      enableValidateOnCvvKeyUp?: boolean;
      expiresInSeconds?: number;
      useExtendedBIN?: boolean;
      inlineIframeJavaScript?: boolean;
      iframeVersion?: number;
      authenticationKey?: string;
      origin?: string;
      tokenExID?: string;
      timestamp?: string;
      tokenScheme?: string;
      token?: string;
      customDataLabel?: string;
      customCvvDataLabel?: string;
      title?: string;
      cvvTitle?: string;
      inputTitle?: string;
      cvvInputTitle?: string;
      cardMaxLengths?: {
        visa?: number;
        mastercard?: number;
        americanExpress?: number;
        discover?: number;
        jcb?: number;
        diners?: number;
      };
      fraudServices?: FraudServicesConfig;
      threeDSMethodNotificationUrl?: string;
      customDataTypes?: string | object;
      cvvContainerID?: string;
      cvvPlaceholder?: string;
      cardType?: string;
      forterSiteId?: string;
      forterUsername?: string;
      customRegEx?: string;
      placeholder?: string;
      inputType?: string;
      inputMode?: string;
      font?: string;
      cvv?: boolean;
      styles: {
        base: string;
        focus: string;
        error: string;
        placeholder: string;
        cvv: {base: string; focus: string; placeholder: string; error: string};
      };
    }

    interface IframeAPI {
      load(): void;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      on: (event: string, callback: (data?: any) => void) => void;

      tokenize(): void;

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
    }

    function Iframe(containerID: string, configuration: Config): IframeAPI;
  }
}
