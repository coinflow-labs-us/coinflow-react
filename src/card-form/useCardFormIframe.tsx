import {useCallback, useEffect, useState} from 'react';
import {
  CoinflowEnvs,
  doInitializeCvvOnlyTokenExIframe,
  doInitializeTokenExCardOnlyIframe,
  doInitializeTokenExIframe,
  setTokenExScriptTag,
  TokenExIframe,
  MerchantIdOrCheckoutJwt,
} from '../common';

export function useCardFormIframe({
  env,
  // @ts-ignore
  merchantId,
  // @ts-ignore
  checkoutJwt,
}: {env: CoinflowEnvs} & MerchantIdOrCheckoutJwt) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tokenExScriptLoaded, setTokenExScriptLoaded] =
    useState<boolean>(false);

  const [tokenExIframe, setTokenExIframe] = useState<TokenExIframe | undefined>(
    undefined
  );

  const [cachedToken, setCachedToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setTokenExScriptTag({env, setTokenExScriptLoaded});
  }, [env, setTokenExScriptLoaded]);

  const initializeCvvOnlyTokenExIframe = useCallback(
    async (
      args: Omit<
        Parameters<typeof doInitializeCvvOnlyTokenExIframe>[0],
        'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
      >
    ) => {
      const iframe = await doInitializeCvvOnlyTokenExIframe({
        ...args,
        tokenExScriptLoaded,
        setCachedToken,
        setLoaded,
        env,
        merchantId,
        checkoutJwt,
      });

      setTokenExIframe(iframe);
      return iframe;
    },
    [checkoutJwt, env, merchantId, tokenExScriptLoaded]
  );

  const initializeTokenExIframe = useCallback(
    async (
      args: Omit<
        Parameters<typeof doInitializeTokenExIframe>[0],
        'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
      >
    ) => {
      const iframe = await doInitializeTokenExIframe({
        ...args,
        tokenExScriptLoaded,
        setCachedToken,
        setLoaded,
        env,
        merchantId,
        checkoutJwt,
      });

      setTokenExIframe(iframe);
      return iframe;
    },
    [checkoutJwt, env, merchantId, tokenExScriptLoaded]
  );

  const initializeTokenExCardOnlyIframe = useCallback(
    async (
      args: Omit<
        Parameters<typeof doInitializeTokenExCardOnlyIframe>[0],
        'env' | 'tokenExScriptLoaded' | 'setCachedToken' | 'setLoaded'
      >
    ) => {
      const iframe = await doInitializeTokenExCardOnlyIframe({
        ...args,
        tokenExScriptLoaded,
        setCachedToken,
        setLoaded,
        env,
        merchantId,
        checkoutJwt,
      });

      setTokenExIframe(iframe);
      return iframe;
    },
    [checkoutJwt, env, merchantId, tokenExScriptLoaded]
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
