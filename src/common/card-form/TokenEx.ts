// Type definitions for TokenEx iframe integration

export interface TokenizationResponse {
  cardType: string;
  cvvIncluded: true;
  firstSix: string;
  lastFour: string;
  referenceNumber: string;
  token: string;
  tokenHMAC: string;
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
      validateOnKeyUp?: boolean;
      validateOnCvvKeyUp?: boolean;
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
        cvv: {base: string; focus: string; error: string};
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
