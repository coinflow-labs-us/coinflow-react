import { __assign, __awaiter, __generator } from "tslib";
import { useCallback, useEffect, useState } from 'react';
import { doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag, } from '../common';
export function useCardFormIframe(_a) {
    var _this = this;
    var env = _a.env, 
    // @ts-ignore
    merchantId = _a.merchantId, 
    // @ts-ignore
    checkoutJwt = _a.checkoutJwt;
    var _b = useState(false), loaded = _b[0], setLoaded = _b[1];
    var _c = useState(false), tokenExScriptLoaded = _c[0], setTokenExScriptLoaded = _c[1];
    var _d = useState(undefined), tokenExIframe = _d[0], setTokenExIframe = _d[1];
    var _e = useState(undefined), cachedToken = _e[0], setCachedToken = _e[1];
    useEffect(function () {
        setTokenExScriptTag({ env: env, setTokenExScriptLoaded: setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    var initializeCvvOnlyTokenExIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeCvvOnlyTokenExIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, setCachedToken: setCachedToken, setLoaded: setLoaded, env: env, merchantId: merchantId, checkoutJwt: checkoutJwt }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    var initializeTokenExIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, setCachedToken: setCachedToken, setLoaded: setLoaded, env: env, merchantId: merchantId, checkoutJwt: checkoutJwt }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    var initializeTokenExCardOnlyIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExCardOnlyIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, setCachedToken: setCachedToken, setLoaded: setLoaded, env: env, merchantId: merchantId, checkoutJwt: checkoutJwt }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [checkoutJwt, env, merchantId, tokenExScriptLoaded]);
    useEffect(function () {
        if (!tokenExIframe)
            return;
        tokenExIframe.load();
        return function () { return tokenExIframe.remove(); };
    }, [tokenExIframe]);
    return {
        tokenExIframe: tokenExIframe,
        initializeTokenExIframe: initializeTokenExIframe,
        initializeCvvOnlyTokenExIframe: initializeCvvOnlyTokenExIframe,
        initializeTokenExCardOnlyIframe: initializeTokenExCardOnlyIframe,
        loaded: loaded,
        cachedToken: cachedToken,
        setTokenExScriptTag: setTokenExScriptTag,
    };
}
//# sourceMappingURL=useCardFormIframe.js.map