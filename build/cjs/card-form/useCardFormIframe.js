"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardFormIframe = useCardFormIframe;
var tslib_1 = require("tslib");
var react_1 = require("react");
var common_1 = require("../common");
function useCardFormIframe(env) {
    var _this = this;
    var _a = (0, react_1.useState)(false), loaded = _a[0], setLoaded = _a[1];
    var _b = (0, react_1.useState)(false), tokenExScriptLoaded = _b[0], setTokenExScriptLoaded = _b[1];
    var _c = (0, react_1.useState)(undefined), tokenExIframe = _c[0], setTokenExIframe = _c[1];
    var _d = (0, react_1.useState)(undefined), cachedToken = _d[0], setCachedToken = _d[1];
    (0, react_1.useEffect)(function () {
        (0, common_1.setTokenExScriptTag)({ env: env, setTokenExScriptLoaded: setTokenExScriptLoaded });
    }, [env, setTokenExScriptLoaded]);
    var initializeCvvOnlyTokenExIframe = (0, react_1.useCallback)(function (args) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var iframe;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, common_1.doInitializeCvvOnlyTokenExIframe)(tslib_1.__assign(tslib_1.__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExIframe = (0, react_1.useCallback)(function (args) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var iframe;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, common_1.doInitializeTokenExIframe)(tslib_1.__assign(tslib_1.__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    var initializeTokenExCardOnlyIframe = (0, react_1.useCallback)(function (args) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var iframe;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, common_1.doInitializeTokenExCardOnlyIframe)(tslib_1.__assign(tslib_1.__assign({}, args), { tokenExScriptLoaded: tokenExScriptLoaded, env: env, setCachedToken: setCachedToken, setLoaded: setLoaded }))];
                case 1:
                    iframe = _a.sent();
                    setTokenExIframe(iframe);
                    return [2 /*return*/, iframe];
            }
        });
    }); }, [env, tokenExScriptLoaded]);
    (0, react_1.useEffect)(function () {
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
        setTokenExScriptTag: common_1.setTokenExScriptTag,
    };
}
//# sourceMappingURL=useCardFormIframe.js.map