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
  buildSkeletonCss,
  CardFormVariant,
  CoinflowEnvs,
  CoinflowUtils,
  getSkeletonColors,
  getSkeletonGridClass,
  guessSkeletonHeightPx,
  IFrameMessageMethods,
  INLINE_SKELETON_HEIGHT_PX,
  MerchantTheme,
  OnInputErrorMethod,
  OnInputValidMethod,
  SKELETON_BOX_STYLE,
  SKELETON_FADE_MS,
  SKELETON_LAYOUTS,
  SKELETON_ROOT_PADDING_PX,
} from '../common';

interface CardFormBaseProps {
  merchantId: string;
  env?: CoinflowEnvs;
  theme?: MerchantTheme;
  onLoad?: () => void;
  /**
   * Called whenever a card field in the form shows a validation error to the
   * user, with the field name and the displayed message.
   */
  onInputError?: OnInputErrorMethod;
  /**
   * Called when a card field that was showing a validation error stops showing
   * it, with the field name.
   */
  onInputValid?: OnInputValidMethod;
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
  onInputError,
  onInputValid,
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
    (event: MessageEvent) => {
      const {data, origin, source} = event;
      // Only honor messages from THIS instance's iframe. Multiple card forms on
      // one page each listen on `window`, so without this every instance would
      // apply every other iframe's height/loaded events to itself.
      if (source !== iframeRef.current?.contentWindow) return;
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
        } else if (parsed.method === IFrameMessageMethods.InputError) {
          void onInputError?.(parsed.info);
        } else if (parsed.method === IFrameMessageMethods.InputValid) {
          void onInputValid?.(parsed.info);
        }
      } catch {
        // not JSON, ignore
      }
    },
    [env, onLoad, onInputError, onInputValid]
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
      variant="card-form"
      theme={props.theme}
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
      variant="card-number-form"
      theme={props.theme}
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
        variant="cvv-form"
        theme={props.theme}
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
  variant,
  theme,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  url: string;
  loaded: boolean;
  iframeHeight: number | null;
  title: string;
  variant: CardFormVariant;
  theme?: MerchantTheme;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Guess the skeleton height from the container width until the iframe reports
  // its real height: compact (stacked) layouts are taller than the inline one.
  const [guessHeight, setGuessHeight] = useState(INLINE_SKELETON_HEIGHT_PX);

  useLayoutEffect(() => {
    // Measure the wrapper div, not the iframe: a freshly-mounted <iframe> is a
    // replaced element with an intrinsic 300px default width before its
    // width:100% resolves, which would briefly (and wrongly) trip the compact
    // breakpoint and jump the height. A block div reports the true container
    // width immediately.
    const el = wrapperRef.current;
    if (!el || !SKELETON_LAYOUTS[variant].compact) return;

    const measure = () =>
      setGuessHeight(guessSkeletonHeightPx({variant, width: el.clientWidth}));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  const height =
    loaded && iframeHeight ? `${iframeHeight}px` : `${guessHeight}px`;
  return (
    <div ref={wrapperRef} style={{position: 'relative', width: '100%', height}}>
      <CardFormSkeleton variant={variant} hidden={loaded} theme={theme} />
      <iframe
        ref={iframeRef as React.RefObject<HTMLIFrameElement>}
        src={url}
        title={title}
        frameBorder="0"
        allow="payment"
        style={{
          width: '100%',
          height,
          border: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms linear, height 150ms ease-out',
        }}
      />
    </div>
  );
}

function CardFormSkeleton({
  variant,
  hidden,
  theme,
}: {
  variant: CardFormVariant;
  hidden: boolean;
  theme?: MerchantTheme;
}) {
  // Stay mounted while fading out so the opacity transition can play, then
  // unmount on transition end. Remount instantly when shown again.
  const [rendered, setRendered] = useState(!hidden);
  if (!hidden && !rendered) setRendered(true);

  // Fallback unmount: `transitionend` may never fire (reduced-motion, an
  // ancestor display:none, or opacity already 0), so force cleanup after the
  // fade window regardless.
  useEffect(() => {
    if (!hidden) return;
    const timer = setTimeout(() => setRendered(false), SKELETON_FADE_MS);
    return () => clearTimeout(timer);
  }, [hidden]);

  if (!rendered) return null;

  const layout = SKELETON_LAYOUTS[variant];
  const gridClass = getSkeletonGridClass(variant);
  // Best-effort tint from the merchant theme's background (neutral when absent).
  const colors = getSkeletonColors(theme);

  return (
    <div
      role="status"
      aria-label="Loading card form"
      onTransitionEnd={e => {
        if (e.propertyName === 'opacity' && hidden) setRendered(false);
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        pointerEvents: 'none',
        flexDirection: 'column',
        gap: 8,
        padding: SKELETON_ROOT_PADDING_PX,
        boxSizing: 'border-box',
        borderRadius: 8,
        background: colors.backdrop,
        containerType: 'inline-size',
        opacity: hidden ? '0%' : '100%',
        transition: 'opacity 300ms linear, height 150ms ease-out',
      }}
    >
      <style>{buildSkeletonCss(variant)}</style>
      <div className={gridClass}>
        {layout.areas.map(area => (
          <div
            key={area}
            style={{
              ...SKELETON_BOX_STYLE,
              background: colors.box,
              gridArea: area,
            }}
          />
        ))}
      </div>
    </div>
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
