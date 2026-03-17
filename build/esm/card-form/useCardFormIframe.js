import { useCallback, useEffect, useState } from 'react';
import { doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag, } from '../common';
export function useCardFormIframe({ env, 
// @ts-ignore
merchantId, 
// @ts-ignore
checkoutJwt, }) {
    const [loaded, setLoaded] = useState(false);
    const [tokenExScriptLoaded, setTokenExScriptLoaded] = useState(false);
    const [tokenExIframe, setTokenExIframe] = useState(undefined);
    const [cachedToken, setCachedToken] = useState(undefined);
    useEffect(() => {
        setTokenExScriptTag({ env, setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    const initializeCvvOnlyTokenExIframe = useCallback(async (args) => {
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
    }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    const initializeTokenExIframe = useCallback(async (args) => {
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
    }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    const initializeTokenExCardOnlyIframe = useCallback(async (args) => {
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
    }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    useEffect(() => {
        if (!tokenExIframe)
            return;
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
//# sourceMappingURL=useCardFormIframe.js.map