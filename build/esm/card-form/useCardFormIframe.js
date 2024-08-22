import { __assign, __awaiter, __generator } from "tslib";
import { useCallback, useEffect, useState } from 'react';
import { doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag, } from '../common';
export function useCardFormIframe(env) {
    var _this = this;
    var _a = useState(false), loaded = _a[0], setLoaded = _a[1];
    var _b = useState(false), tokenExScriptLoaded = _b[0], setTokenExScriptLoaded = _b[1];
    var _c = useState(undefined), tokenExIframe = _c[0], setTokenExIframe = _c[1];
    var _d = useState(undefined), cachedToken = _d[0], setCachedToken = _d[1];
    useEffect(function () {
        setTokenExScriptTag({ env: env, setTokenExScriptLoaded: setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    var initializeCvvOnlyTokenExIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeCvvOnlyTokenExIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExCardOnlyIframe = useCallback(function (args) { return __awaiter(_this, void 0, void 0, function () {
        var iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExCardOnlyIframe(__assign(__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
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