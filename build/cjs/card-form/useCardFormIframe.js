"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardFormIframe = exports.TokenExCvvContainerID = exports.TokenExCardNumberIframeId = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var common_1 = require("../common");
exports.TokenExCardNumberIframeId = 'tokenExCardNumber';
exports.TokenExCvvContainerID = 'tokenExCardCvv';
var CARD_TYPE_MAPPING = (_a = {},
    _a[common_1.CardType.VISA] = 'visa',
    _a[common_1.CardType.MASTERCARD] = 'masterCard',
    _a[common_1.CardType.AMEX] = 'americanExpress',
    _a[common_1.CardType.DISCOVER] = 'discover',
    _a);
function useCardFormIframe(env) {
    var _this = this;
    var _a = (0, react_1.useState)(false), loaded = _a[0], setLoaded = _a[1];
    var _b = (0, react_1.useState)(false), tokenExScriptLoaded = _b[0], setTokenExScriptLoaded = _b[1];
    var _c = (0, react_1.useState)(undefined), tokenExIframe = _c[0], setTokenExIframe = _c[1];
    var _d = (0, react_1.useState)(undefined), cachedToken = _d[0], setCachedToken = _d[1];
    var getIframeConfig = (0, react_1.useCallback)(function (_a) {
        var token = _a.token, origins = _a.origins;
        return fetch(new common_1.CoinflowUtils(env).url + '/api/checkout/authentication-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                origins: tslib_1.__spreadArray(tslib_1.__spreadArray([], (origins !== null && origins !== void 0 ? origins : []), true), [window.location.origin], false),
                token: token,
            }),
        }).then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); });
    }, [env]);
    var getStylesAndFont = (0, react_1.useCallback)(function (s) {
        var _a, _b, _c;
        var css = JSON.parse(s);
        var styles = {
            base: CSSPropertiesToComponent(css.base),
            focus: CSSPropertiesToComponent(css.focus),
            error: CSSPropertiesToComponent(css.error),
            cvv: {
                base: CSSPropertiesToComponent((_a = css.cvv) === null || _a === void 0 ? void 0 : _a.base),
                focus: CSSPropertiesToComponent((_b = css.cvv) === null || _b === void 0 ? void 0 : _b.focus),
                error: CSSPropertiesToComponent((_c = css.cvv) === null || _c === void 0 ? void 0 : _c.error),
            },
        };
        return { styles: styles };
    }, []);
    var setTokenExScriptTag = (0, react_1.useCallback)(function () {
        var scriptTagId = 'tokenex-script';
        if (document.head.querySelector("#".concat(scriptTagId)))
            return;
        var sdkScriptTag = document.createElement('script');
        sdkScriptTag.src =
            env === 'prod'
                ? 'https://htp.tokenex.com/iframe/iframe-v3.min.js'
                : 'https://test-htp.tokenex.com/iframe/iframe-v3.min.js';
        sdkScriptTag.id = scriptTagId;
        document.head.appendChild(sdkScriptTag);
        document.getElementById(scriptTagId).addEventListener('load', function () {
            console.log('Setting tokenExScriptLoaded to true!');
            setTokenExScriptLoaded(true);
        });
    }, [env]);
    (0, react_1.useEffect)(function () {
        setTokenExScriptTag();
    }, [setTokenExScriptTag]);
    var loadIframe = (0, react_1.useCallback)(function (iframe) {
        var tokenize = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iframe.tokenize();
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                iframe.on('tokenize', function (data) {
                                    setCachedToken(data.token);
                                    resolve(data);
                                });
                                iframe.on('validate', function (data) {
                                    // noinspection PointlessBooleanExpressionJS
                                    var isInvalid = !data.isValid || data.isCvvValid === false;
                                    if (isInvalid)
                                        reject(data);
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        iframe.on('change', function () { return setCachedToken(undefined); });
        iframe.on('cvvChange', function () { return setCachedToken(undefined); });
        iframe.on('load', function () {
            setTimeout(function () { return setLoaded(true); }, 350);
            var el = document.querySelector('#tx_iframe_tokenExCardNumber');
            if (el) {
                // noinspection JSDeprecatedSymbols
                el.scrolling = 'no';
            }
        });
        setLoaded(false);
        iframe.load();
        var overriden = tslib_1.__assign(tslib_1.__assign({}, iframe), { tokenize: tokenize });
        setTokenExIframe(overriden);
        return overriden;
    }, []);
    var initializeCvvOnlyTokenExIframe = (0, react_1.useCallback)(function (_a) { return tslib_1.__awaiter(_this, [_a], void 0, function (_b) {
        var type, iframeConfig, styles, config, iframe;
        var token = _b.token, cardType = _b.cardType, css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily, origins = _b.origins;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn("Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#".concat('tokenex-script'));
                        return [2 /*return*/];
                    }
                    type = CARD_TYPE_MAPPING[cardType];
                    return [4 /*yield*/, getIframeConfig({ token: token, origins: origins })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    config = tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: 'CVV', enablePrettyFormat: true, styles: styles, token: token, cvvOnly: true, cvv: true, cvvContainerID: exports.TokenExCvvContainerID, cardType: type, debug: debug !== null && debug !== void 0 ? debug : false, font: fontFamily });
                    iframe = TokenEx.Iframe(exports.TokenExCvvContainerID, config);
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]);
    var initializeTokenExIframe = (0, react_1.useCallback)(function (_a) { return tslib_1.__awaiter(_this, [_a], void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug, origins = _b.origins;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn("Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#".concat('tokenex-script'));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig({ origins: origins })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(exports.TokenExCardNumberIframeId, tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', cvvPlaceholder: 'CVV', enablePrettyFormat: true, cvv: true, cvvContainerID: exports.TokenExCvvContainerID, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]);
    var initializeTokenExCardOnlyIframe = (0, react_1.useCallback)(function (_a) { return tslib_1.__awaiter(_this, [_a], void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug, origins = _b.origins;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig({ origins: origins })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(exports.TokenExCardNumberIframeId, tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', enablePrettyFormat: true, cvv: false, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe, tokenExScriptLoaded]);
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
        setTokenExScriptTag: setTokenExScriptTag,
    };
}
exports.useCardFormIframe = useCardFormIframe;
function CSSPropertiesToComponent(dict) {
    if (!dict)
        return '';
    if (typeof dict === 'string')
        return dict;
    var str = '';
    var _loop_1 = function (key, value) {
        var clo = '';
        key.split('').forEach(function (lt) {
            if (lt.toUpperCase() === lt) {
                clo += '-' + lt.toLowerCase();
            }
            else {
                clo += lt;
            }
        });
        str += clo + ':' + value + ';';
    };
    for (var _i = 0, _a = Object.entries(dict); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        _loop_1(key, value);
    }
    return str;
}
//# sourceMappingURL=useCardFormIframe.js.map