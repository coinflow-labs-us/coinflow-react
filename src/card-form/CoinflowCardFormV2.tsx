import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import LZString from 'lz-string';
import {
  CoinflowEnvs,
  CoinflowUtils,
  IFrameMessageMethods,
  MerchantTheme,
} from '../common';

type CardFormVariant = 'card-form' | 'card-number-form' | 'cvv-form';

interface CardFormBaseProps {
  merchantId: string;
  env?: CoinflowEnvs;
  theme?: MerchantTheme;
  onLoad?: () => void;
}

export interface CoinflowCardFormProps extends CardFormBaseProps {}

export interface CoinflowCardNumberFormProps extends CardFormBaseProps {}

export interface CoinflowCvvFormProps extends CardFormBaseProps {
  token: string;
}

export interface CardFormTokenResponse {
  token: string;
  expMonth?: string;
  expYear?: string;
}

export interface CardFormRef {
  tokenize(): Promise<CardFormTokenResponse>;
}

function useCardFormIframe({
  variant,
  merchantId,
  env,
  theme,
  token,
  onLoad,
}: CardFormBaseProps & {variant: CardFormVariant; token?: string}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number | null>(null);

  const url = useMemo(() => {
    const baseUrl = CoinflowUtils.getCoinflowBaseUrl(env);
    const url = new URL(`/form/v2/${variant}`, baseUrl);
    url.searchParams.append('merchantId', merchantId);
    url.searchParams.append('useHeightChange', 'true');
    if (theme) {
      url.searchParams.append(
        'theme',
        LZString.compressToEncodedURIComponent(JSON.stringify(theme))
      );
    }
    if (token) {
      url.searchParams.append('token', token);
    }
    return url.toString();
  }, [variant, merchantId, env, theme, token]);

  const handleMessage = useCallback(
    ({data, origin}: {data: string; origin: string}) => {
      const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(env))
        .origin;
      if (origin !== expectedOrigin) return;

      try {
        const parsed = JSON.parse(data);
        if (parsed.method === IFrameMessageMethods.Loaded) {
          setLoaded(true);
          onLoad?.();
        } else if (parsed.method === IFrameMessageMethods.HeightChange) {
          const parsedHeight = Number(parsed.data);
          if (Number.isFinite(parsedHeight) && parsedHeight > 0) {
            setIframeHeight(parsedHeight);
          }
        }
      } catch {
        // not JSON, ignore
      }
    },
    [env, onLoad]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

  useLayoutEffect(() => {
    if (!iframeRef.current) return;
    // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute
    iframeRef.current.credentialless = true;
  }, []);

  const tokenize = useCallback((): Promise<CardFormTokenResponse> => {
    return new Promise((resolve, reject) => {
      if (!iframeRef.current?.contentWindow) {
        reject(new Error('Card form iframe not loaded'));
        return;
      }

      const handler = ({data, origin}: {data: string; origin: string}) => {
        const expectedOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(env))
          .origin;
        if (origin !== expectedOrigin) return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.method !== 'tokenize') return;

          window.removeEventListener('message', handler);

          if (
            typeof parsed.data === 'string' &&
            parsed.data.startsWith('ERROR')
          ) {
            reject(new Error(parsed.data.replace('ERROR ', '')));
            return;
          }

          const responseData =
            typeof parsed.data === 'string'
              ? JSON.parse(parsed.data)
              : parsed.data;
          resolve(responseData);
        } catch {
          // not relevant message
        }
      };

      window.addEventListener('message', handler);
      const targetOrigin = new URL(CoinflowUtils.getCoinflowBaseUrl(env))
        .origin;
      iframeRef.current.contentWindow.postMessage('tokenize', targetOrigin);
    });
  }, [env]);

  return {iframeRef, url, loaded, tokenize, iframeHeight};
}

const CoinflowCardFormComponent = forwardRef<
  CardFormRef,
  CoinflowCardFormProps
>((props, ref) => {
  const {iframeRef, url, loaded, tokenize, iframeHeight} = useCardFormIframe({
    ...props,
    variant: 'card-form',
  });

  useImperativeHandle(ref, () => ({tokenize}), [tokenize]);

  return (
    <CardFormIFrame
      iframeRef={iframeRef}
      url={url}
      loaded={loaded}
      iframeHeight={iframeHeight}
      title="Card Form"
    />
  );
});

const CoinflowCardNumberFormComponent = forwardRef<
  CardFormRef,
  CoinflowCardNumberFormProps
>((props, ref) => {
  const {iframeRef, url, loaded, tokenize, iframeHeight} = useCardFormIframe({
    ...props,
    variant: 'card-number-form',
  });

  useImperativeHandle(ref, () => ({tokenize}), [tokenize]);

  return (
    <CardFormIFrame
      iframeRef={iframeRef}
      url={url}
      loaded={loaded}
      iframeHeight={iframeHeight}
      title="Card Number Form"
    />
  );
});

const CoinflowCvvFormComponent = forwardRef<CardFormRef, CoinflowCvvFormProps>(
  (props, ref) => {
    const {iframeRef, url, loaded, tokenize, iframeHeight} = useCardFormIframe({
      ...props,
      variant: 'cvv-form',
    });

    useImperativeHandle(ref, () => ({tokenize}), [tokenize]);

    return (
      <CardFormIFrame
        iframeRef={iframeRef}
        url={url}
        loaded={loaded}
        iframeHeight={iframeHeight}
        title="CVV Form"
      />
    );
  }
);

function CardFormIFrame({
  iframeRef,
  url,
  loaded,
  iframeHeight,
  title,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  url: string;
  loaded: boolean;
  iframeHeight: number | null;
  title: string;
}) {
  return (
    <iframe
      ref={iframeRef as React.RefObject<HTMLIFrameElement>}
      src={url}
      title={title}
      frameBorder="0"
      allow="payment"
      style={{
        width: '100%',
        height: iframeHeight ? `${iframeHeight}px` : '56px',
        border: 'none',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 300ms linear, height 150ms ease-out',
      }}
    />
  );
}

export const CoinflowCardForm = memo(CoinflowCardFormComponent);
export const CoinflowCardNumberForm = memo(CoinflowCardNumberFormComponent);
export const CoinflowCvvForm = memo(CoinflowCvvFormComponent);

/** @deprecated Use CoinflowCardForm instead */
export const CoinflowCardFormV2 = CoinflowCardForm;
/** @deprecated Use CoinflowCardNumberForm instead */
export const CoinflowCardNumberFormV2 = CoinflowCardNumberForm;
/** @deprecated Use CoinflowCvvForm instead */
export const CoinflowCvvFormV2 = CoinflowCvvForm;
/** @deprecated Use CardFormRef instead */
export type CardFormV2Ref = CardFormRef;
/** @deprecated Use CardFormTokenResponse instead */
export type CardFormV2TokenResponse = CardFormTokenResponse;
/** @deprecated Use CoinflowCardFormProps instead */
export type CoinflowCardFormV2Props = CoinflowCardFormProps;
/** @deprecated Use CoinflowCardNumberFormProps instead */
export type CoinflowCardNumberFormV2Props = CoinflowCardNumberFormProps;
/** @deprecated Use CoinflowCvvFormProps instead */
export type CoinflowCvvFormV2Props = CoinflowCvvFormProps;
