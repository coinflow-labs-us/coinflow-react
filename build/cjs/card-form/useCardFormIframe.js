"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardFormIframe = useCardFormIframe;
const react_1 = require("react");
const common_1 = require("../common");
function useCardFormIframe({ env, 
// @ts-ignore
merchantId, 
// @ts-ignore
checkoutJwt, }) {
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    const [tokenExScriptLoaded, setTokenExScriptLoaded] = (0, react_1.useState)(false);
    const [tokenExIframe, setTokenExIframe] = (0, react_1.useState)(undefined);
    const [cachedToken, setCachedToken] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        (0, common_1.setTokenExScriptTag)({ env, setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    const initializeCvvOnlyTokenExIframe = (0, react_1.useCallback)(async (args) => {
        const iframe = await (0, common_1.doInitializeCvvOnlyTokenExIframe)({
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
    const initializeTokenExIframe = (0, react_1.useCallback)(async (args) => {
        const iframe = await (0, common_1.doInitializeTokenExIframe)({
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
    const initializeTokenExCardOnlyIframe = (0, react_1.useCallback)(async (args) => {
        const iframe = await (0, common_1.doInitializeTokenExCardOnlyIframe)({
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
    (0, react_1.useEffect)(() => {
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
        setTokenExScriptTag: common_1.setTokenExScriptTag,
    };
}
//# sourceMappingURL=useCardFormIframe.js.map