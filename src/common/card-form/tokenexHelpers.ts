import {CSSProperties} from 'react';
import {
  TokenizationResponse,
  TokenExCvvContainerID,
  TokenExIframe,
  TokenExIFrameConfiguration,
  CARD_TYPE_MAPPING,
  TokenExCardNumberIframeId,
} from './TokenEx';
import {CoinflowUtils} from '../CoinflowUtils';
import {CardType, CoinflowEnvs} from '../CoinflowTypes';

export interface DoInitializeTokenExIframeArgs {
  css: string;
  debug?: boolean;
  font?: string;
  origins: string[] | undefined;
  tokenExScriptLoaded: boolean;
  env: CoinflowEnvs;
  setCachedToken: (s: string | undefined) => void;
  setLoaded: (b: boolean) => void;
}

export interface DoInitializeCvvOnlyTokenExIframeArgs
  extends DoInitializeTokenExIframeArgs {
  token: string;
  cardType: CardType;
}

export async function getIframeConfig({
  token,
  origins,
  env,
}: {
  token?: string;
  origins: string[] | undefined;
  env: CoinflowEnvs;
}): Promise<TokenExIFrameConfiguration> {
  return new Promise((resolve, reject) => {
    fetch(new CoinflowUtils(env).url + '/api/checkout/authentication-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origins: [...(origins ?? []), window.location.origin],
        token,
      }),
    })
      .then(async res => {
        resolve((await res.json()) as TokenExIFrameConfiguration);
      })
      .catch(e => reject(e));
  });
}

export function setTokenExScriptTag({
  env,
  setTokenExScriptLoaded,
}: {
  env: CoinflowEnvs;
  setTokenExScriptLoaded: (b: boolean) => void;
}) {
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
}

function loadIframe({
  iframe,
  setCachedToken,
  setLoaded,
}: {
  setCachedToken: (s: string | undefined) => void;
  setLoaded: (b: boolean) => void;
  iframe: ReturnType<typeof TokenEx.Iframe>;
}): TokenExIframe {
  const tokenize = async (): Promise<TokenizationResponse> => {
    iframe.tokenize();
    return await new Promise<TokenizationResponse>((resolve, reject) => {
      iframe.on('tokenize', (data: TokenizationResponse) => {
        setCachedToken(data.token);
        resolve(data);
      });
      iframe.on('validate', (data: {isValid: boolean; isCvvValid: boolean}) => {
        // noinspection PointlessBooleanExpressionJS
        const isInvalid = !data.isValid || data.isCvvValid === false;
        if (isInvalid) reject(data);
      });
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

  iframe.on('focus', () => {
    iframe.focus();
  });
  iframe.on('cvvFocus', () => {
    iframe.cvvFocus();
  });

  setLoaded(false);
  iframe.load();

  return {...iframe, tokenize};
}

export async function doInitializeCvvOnlyTokenExIframe(
  args: DoInitializeCvvOnlyTokenExIframeArgs
) {
  const {token, cardType} = args;
  return await doInitialize(TokenExCvvContainerID, args, {
    cvvOnly: true,
    cvv: true,
    cvvContainerID: TokenExCvvContainerID,
    placeholder: 'CVV',
    token,
    cardType: CARD_TYPE_MAPPING[cardType],
  });
}

export async function doInitializeTokenExIframe(
  args: DoInitializeTokenExIframeArgs
) {
  return await doInitialize(TokenExCardNumberIframeId, args, {
    cvv: true,
    cvvContainerID: TokenExCvvContainerID,
    cvvPlaceholder: 'CVV',
  });
}

export async function doInitializeTokenExCardOnlyIframe(
  args: DoInitializeTokenExIframeArgs
) {
  return await doInitialize(TokenExCardNumberIframeId, args, {cvv: false});
}

async function doInitialize(
  id: string,
  {
    tokenExScriptLoaded,
    origins,
    env,
    css,
    debug,
    font,
    setCachedToken,
    setLoaded,
  }: DoInitializeTokenExIframeArgs,
  configOverrides: Partial<TokenEx.Config>
) {
  if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
    console.warn(
      'Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script'
    );
    return;
  }
  const iframeConfig = await getIframeConfig({
    token: configOverrides.token,
    origins,
    env,
  });
  const {styles} = getStyles(css);
  const config = {
    ...iframeConfig,
    placeholder: '0000 0000 0000 0000',
    enablePrettyFormat: true,
    styles,
    font,
    debug: debug ?? false,
    ...configOverrides,
  };
  const iframe: ReturnType<typeof TokenEx.Iframe> = TokenEx.Iframe(id, config);

  return loadIframe({iframe, setCachedToken, setLoaded});
}

function getStyles(s: string) {
  const css = JSON.parse(s);
  const styles = {
    base: CSSPropertiesToComponent(css.base),
    focus: CSSPropertiesToComponent(css.focus),
    error: CSSPropertiesToComponent(css.error),
    placeholder: CSSPropertiesToComponent(css.placeholder),
    cvv: {
      base: CSSPropertiesToComponent(css.cvv?.base),
      focus: CSSPropertiesToComponent(css.cvv?.focus),
      error: CSSPropertiesToComponent(css.cvv?.error),
      placeholder: CSSPropertiesToComponent(css?.placeholder),
    },
  };

  return {styles};
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
