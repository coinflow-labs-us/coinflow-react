var _a;
import { __assign, __awaiter, __generator } from "tslib";
import { useCallback, useEffect, useState } from 'react';
import { CardType, CoinflowUtils } from '../common';
export var TokenExCardNumberIframeId = 'tokenExCardNumber';
export var TokenExCvvContainerID = 'tokenExCardCvv';
var CARD_TYPE_MAPPING = (_a = {},
    _a[CardType.VISA] = 'visa',
    _a[CardType.MASTERCARD] = 'masterCard',
    _a[CardType.AMEX] = 'americanExpress',
    _a[CardType.DISCOVER] = 'discover',
    _a);
export function useCardFormIframe(env) {
    var _this = this;
    var _a = useState(false), loaded = _a[0], setLoaded = _a[1];
    var _b = useState(undefined), tokenExIframe = _b[0], setTokenExIframe = _b[1];
    var _c = useState(undefined), cachedToken = _c[0], setCachedToken = _c[1];
    var getIframeConfig = useCallback(function (_a) {
        var token = _a.token;
        return fetch(new CoinflowUtils(env).url + '/api/checkout/authentication-key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                origins: [window.location.origin],
                token: token,
            }),
        }).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, res.json()];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); });
    }, [env]);
    var getStylesAndFont = useCallback(function (s) {
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
    var setTokenExScriptTag = useCallback(function () {
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
    }, [env]);
    useEffect(function () {
        setTokenExScriptTag();
    }, [setTokenExScriptTag]);
    var loadIframe = useCallback(function (iframe) {
        var tokenize = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
            if (el)
                el.scrolling = 'no';
        });
        setLoaded(false);
        iframe.load();
        var overriden = __assign(__assign({}, iframe), { tokenize: tokenize });
        setTokenExIframe(overriden);
        return overriden;
    }, []);
    var initializeCvvOnlyTokenExIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var type, iframeConfig, styles, config, iframe;
        var token = _b.token, cardType = _b.cardType, css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    type = CARD_TYPE_MAPPING[cardType];
                    return [4 /*yield*/, getIframeConfig({ token: token })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    config = __assign(__assign({}, iframeConfig), { placeholder: 'CVV', enablePrettyFormat: true, styles: styles, token: token, cvvOnly: true, cvv: true, cvvContainerID: TokenExCvvContainerID, cardType: type, debug: debug !== null && debug !== void 0 ? debug : false, font: fontFamily });
                    iframe = TokenEx.Iframe(TokenExCvvContainerID, config);
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe]);
    var initializeTokenExIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getIframeConfig({})];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(TokenExCardNumberIframeId, __assign(__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', cvvPlaceholder: 'CVV', enablePrettyFormat: true, cvv: true, cvvContainerID: TokenExCvvContainerID, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe]);
    var initializeTokenExCardOnlyIframe = useCallback(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, fontFamily = _b.fontFamily, debug = _b.debug;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getIframeConfig({})];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(TokenExCardNumberIframeId, __assign(__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', enablePrettyFormat: true, cvv: false, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe(iframe)];
            }
        });
    }); }, [getIframeConfig, getStylesAndFont, loadIframe]);
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
    };
}
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