import { __awaiter, __generator } from "tslib";
import { useCallback, useEffect, useState } from 'react';
import { doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag } from '../common';
export function useCardFormIframe(env) {
    var _this = this;
    var _a = useState(false), loaded = _a[0], setLoaded = _a[1];
    var _b = useState(false), tokenExScriptLoaded = _b[0], setTokenExScriptLoaded = _b[1];
    var _c = useState(undefined), tokenExIframe = _c[0], setTokenExIframe = _c[1];
    var _d = useState(undefined), cachedToken = _d[0], setCachedToken = _d[1];
    useEffect(function () {
        setTokenExScriptTag({ env: env, setTokenExScriptLoaded: setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    var initializeCvvOnlyTokenExIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var iframe;
        var token = _b.token, cardType = _b.cardType, css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily, origins = _b.origins;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, doInitializeCvvOnlyTokenExIframe({
                        token: token,
                        cardType: cardType,
                        css: css,
                        debug: debug,
                        fontFamily: fontFamily,
                        origins: origins,
                        tokenExScriptLoaded: tokenExScriptLoaded,
                        env: env,
                        setCachedToken: setCachedToken,
                        setLoaded: setLoaded,
                    })];
                case 1:
                    iframe = _c.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug, origins = _b.origins;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExIframe({
                        css: css,
                        debug: debug,
                        fontFamily: fontFamily,
                        origins: origins,
                        tokenExScriptLoaded: tokenExScriptLoaded,
                        env: env,
                        setCachedToken: setCachedToken,
                        setLoaded: setLoaded,
                    })];
                case 1:
                    iframe = _c.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExCardOnlyIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug, origins = _b.origins;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, doInitializeTokenExCardOnlyIframe({
                        css: css,
                        debug: debug,
                        fontFamily: fontFamily,
                        origins: origins,
                        tokenExScriptLoaded: tokenExScriptLoaded,
                        env: env,
                        setCachedToken: setCachedToken,
                        setLoaded: setLoaded,
                    })];
                case 1:
                    iframe = _c.sent();
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