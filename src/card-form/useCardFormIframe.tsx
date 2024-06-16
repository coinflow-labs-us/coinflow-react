import {CSSProperties, useCallback, useEffect, useState} from 'react';
import {CardType, CoinflowEnvs, CoinflowUtils} from '../common';
import {TokenizationResponse} from './TokenEx';

export const TokenExCardNumberIframeId = 'tokenExCardNumber';
export const TokenExCvvContainerID = 'tokenExCardCvv';
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

const CARD_TYPE_MAPPING: Record<CardType, string> = {
  [CardType.VISA]: 'visa',
  [CardType.MASTERCARD]: 'masterCard',
  [CardType.AMEX]: 'americanExpress',
  [CardType.DISCOVER]: 'discover',
};

export function useCardFormIframe(env: CoinflowEnvs) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tokenExScriptLoaded, setTokenExScriptLoaded] =
    useState<boolean>(false);

  const [tokenExIframe, setTokenExIframe] = useState<TokenExIframe | undefined>(
    undefined
  );

  const [cachedToken, setCachedToken] = useState<string | undefined>(undefined);

  const getIframeConfig = useCallback(
    ({token, origins}: {token?: string; origins: string[] | undefined}) =>
      fetch(new CoinflowUtils(env).url + '/api/checkout/authentication-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origins: [...(origins ?? []), window.location.origin],
          token,
        }),
      }).then(async res => {
        return (await res.json()) as TokenExIFrameConfiguration;
      }),
    [env]
  );

  const getStylesAndFont = useCallback((s: string) => {
    const css = JSON.parse(s);
    const styles = {
      base: CSSPropertiesToComponent(css.base),
      focus: CSSPropertiesToComponent(css.focus),
      error: CSSPropertiesToComponent(css.error),
      cvv: {
        base: CSSPropertiesToComponent(css.cvv?.base),
        focus: CSSPropertiesToComponent(css.cvv?.focus),
        error: CSSPropertiesToComponent(css.cvv?.error),
      },
    };

    return {styles};
  }, []);

  const setTokenExScriptTag = useCallback(() => {
    const scriptTagId = 'tokenex-script';
    if (document.head.querySelector(`#${scriptTagId}`)) return;

    const sdkScriptTag = document.createElement('script');
    sdkScriptTag.src =
      env === 'prod'
        ? 'https://htp.tokenex.com/iframe/iframe-v3.min.js'
        : 'https://test-htp.tokenex.com/iframe/iframe-v3.min.js';
    sdkScriptTag.id = scriptTagId;

    document.head.appendChild(sdkScriptTag);

    document.getElementById(scriptTagId)!.addEventListener('load', () => {
      console.log('Setting tokenExScriptLoaded to true!');
      setTokenExScriptLoaded(true);
    });
  }, [env]);

  useEffect(() => {
    setTokenExScriptTag();
  }, [setTokenExScriptTag]);

  const loadIframe = useCallback(
    (iframe: ReturnType<typeof TokenEx.Iframe>) => {
      const tokenize = async (): Promise<TokenizationResponse> => {
        iframe.tokenize();
        return await new Promise<TokenizationResponse>((resolve, reject) => {
          iframe.on('tokenize', (data: TokenizationResponse) => {
            setCachedToken(data.token);
            resolve(data);
          });
          iframe.on(
            'validate',
            (data: {isValid: boolean; isCvvValid: boolean}) => {
              // noinspection PointlessBooleanExpressionJS
              const isInvalid = !data.isValid || data.isCvvValid === false;
              if (isInvalid) reject(data);
            }
          );
        });
      };

      iframe.on('change', () => setCachedToken(undefined));
      iframe.on('cvvChange', () => setCachedToken(undefined));

      iframe.on('load', () => {
        setTimeout(() => setLoaded(true), 350);
        const el: HTMLIFrameElement | null = document.querySelector(
          '#tx_iframe_tokenExCardNumber'
        );
        if (el) {
          // noinspection JSDeprecatedSymbols
          el.scrolling = 'no';
        }
      });

      setLoaded(false);
      iframe.load();

      const overriden = {...iframe, tokenize};
      setTokenExIframe(overriden);
      return overriden;
    },
    []
  );

  const initializeCvvOnlyTokenExIframe = useCallback(
    async ({
      token,
      cardType,
      css,
      debug,
      fontFamily,
      origins,
    }: {
      token: string;
      cardType: CardType;
      css: string;
      debug?: boolean;
      fontFamily?: string;
      origins: string[] | undefined;
    }) => {
      if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
        console.warn(
          `Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#${'tokenex-script'}`
        );
        return;
      }
      const type = CARD_TYPE_MAPPING[cardType];
      const iframeConfig = await getIframeConfig({token, origins});
      const {styles} = getStylesAndFont(css);
      const config: TokenEx.Config = {
        ...iframeConfig,
        placeholder: 'CVV',
        enablePrettyFormat: true,
        styles,
        token,
        cvvOnly: true,
        cvv: true,
        cvvContainerID: TokenExCvvContainerID,
        cardType: type,
        debug: debug ?? false,
        font: fontFamily,
      };

      const iframe: ReturnType<typeof TokenEx.Iframe> = TokenEx.Iframe(
        TokenExCvvContainerID,
        config
      );

      return loadIframe(iframe);
    },
    [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]
  );

  const initializeTokenExIframe = useCallback(
    async ({
      css,
      fontFamily,
      debug,
      origins,
    }: {
      css: string;
      fontFamily?: string;
      debug?: boolean;
      origins: string[] | undefined;
    }) => {
      if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
        console.warn(
          `Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#${'tokenex-script'}`
        );
        return;
      }
      const iframeConfig = await getIframeConfig({origins});
      const {styles} = getStylesAndFont(css);
      const iframe: ReturnType<typeof TokenEx.Iframe> = TokenEx.Iframe(
        TokenExCardNumberIframeId,
        {
          ...iframeConfig,
          placeholder: '0000 0000 0000 0000',
          cvvPlaceholder: 'CVV',
          enablePrettyFormat: true,
          cvv: true,
          cvvContainerID: TokenExCvvContainerID,
          styles,
          font: fontFamily,
          debug: debug ?? false,
        }
      );

      return loadIframe(iframe);
    },
    [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]
  );

  const initializeTokenExCardOnlyIframe = useCallback(
    async ({
      css,
      fontFamily,
      debug,
      origins,
    }: {
      css: string;
      fontFamily?: string;
      debug?: boolean;
      origins: string[] | undefined;
    }) => {
      if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
        console.warn(
          'Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script'
        );
        return;
      }
      const iframeConfig = await getIframeConfig({origins});
      const {styles} = getStylesAndFont(css);
      const iframe: ReturnType<typeof TokenEx.Iframe> = TokenEx.Iframe(
        TokenExCardNumberIframeId,
        {
          ...iframeConfig,
          placeholder: '0000 0000 0000 0000',
          enablePrettyFormat: true,
          cvv: false,
          styles,
          font: fontFamily,
          debug: debug ?? false,
        }
      );

      return loadIframe(iframe);
    },
    [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]
  );

  useEffect(() => {
    if (!tokenExIframe) return;
    tokenExIframe.load();
    return () => tokenExIframe.remove();
  }, [tokenExIframe]);

  return {
    tokenExIframe,
    initializeTokenExIframe,
    initializeCvvOnlyTokenExIframe,
    initializeTokenExCardOnlyIframe,
    loaded,
    cachedToken,
    setTokenExScriptTag,
  };
}

function CSSPropertiesToComponent(
  dict: CSSProperties | string | undefined
): string {
  if (!dict) return '';
  if (typeof dict === 'string') return dict;

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
