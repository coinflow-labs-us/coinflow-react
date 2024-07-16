"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIframeConfig = getIframeConfig;
exports.setTokenExScriptTag = setTokenExScriptTag;
exports.doInitializeCvvOnlyTokenExIframe = doInitializeCvvOnlyTokenExIframe;
exports.doInitializeTokenExIframe = doInitializeTokenExIframe;
exports.doInitializeTokenExCardOnlyIframe = doInitializeTokenExCardOnlyIframe;
var tslib_1 = require("tslib");
var CoinflowUtils_1 = require("../CoinflowUtils");
var cardFormTypes_1 = require("./cardFormTypes");
function getIframeConfig(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var token = _b.token, origins = _b.origins, env = _b.env;
        return tslib_1.__generator(this, function (_c) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fetch(new CoinflowUtils_1.CoinflowUtils(env).url + '/api/checkout/authentication-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            origins: tslib_1.__spreadArray(tslib_1.__spreadArray([], (origins !== null && origins !== void 0 ? origins : []), true), [window.location.origin], false),
                            token: token,
                        }),
                    })
                        .then(function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return tslib_1.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = resolve;
                                    return [4 /*yield*/, res.json()];
                                case 1:
                                    _a.apply(void 0, [(_b.sent())]);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (e) { return reject(e); });
                })];
        });
    });
}
function setTokenExScriptTag(_a) {
    var env = _a.env, setTokenExScriptLoaded = _a.setTokenExScriptLoaded;
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
}
function loadIframe(_a) {
    var _this = this;
    var iframe = _a.iframe, setCachedToken = _a.setCachedToken, setLoaded = _a.setLoaded;
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
    return tslib_1.__assign(tslib_1.__assign({}, iframe), { tokenize: tokenize });
}
function doInitializeCvvOnlyTokenExIframe(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
        var type, iframeConfig, styles, config, iframe;
        var token = _b.token, cardType = _b.cardType, css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily, origins = _b.origins, tokenExScriptLoaded = _b.tokenExScriptLoaded, env = _b.env, setCachedToken = _b.setCachedToken, setLoaded = _b.setLoaded;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn("Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#".concat('tokenex-script'));
                        return [2 /*return*/];
                    }
                    type = cardFormTypes_1.CARD_TYPE_MAPPING[cardType];
                    return [4 /*yield*/, getIframeConfig({ token: token, origins: origins, env: env })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    config = tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: 'CVV', enablePrettyFormat: true, styles: styles, token: token, cvvOnly: true, cvv: true, cvvContainerID: cardFormTypes_1.TokenExCvvContainerID, cardType: type, debug: debug !== null && debug !== void 0 ? debug : false, font: fontFamily });
                    iframe = TokenEx.Iframe(cardFormTypes_1.TokenExCvvContainerID, config);
                    return [2 /*return*/, loadIframe({ iframe: iframe, setCachedToken: setCachedToken, setLoaded: setLoaded })];
            }
        });
    });
}
function doInitializeTokenExIframe(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily, origins = _b.origins, tokenExScriptLoaded = _b.tokenExScriptLoaded, env = _b.env, setCachedToken = _b.setCachedToken, setLoaded = _b.setLoaded;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn("Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#".concat('tokenex-script'));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig({ origins: origins, env: env })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(cardFormTypes_1.TokenExCardNumberIframeId, tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', cvvPlaceholder: 'CVV', enablePrettyFormat: true, cvv: true, cvvContainerID: cardFormTypes_1.TokenExCvvContainerID, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe({ iframe: iframe, setCachedToken: setCachedToken, setLoaded: setLoaded })];
            }
        });
    });
}
function doInitializeTokenExCardOnlyIframe(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function (_b) {
        var iframeConfig, styles, iframe;
        var css = _b.css, debug = _b.debug, fontFamily = _b.fontFamily, origins = _b.origins, tokenExScriptLoaded = _b.tokenExScriptLoaded, env = _b.env, setCachedToken = _b.setCachedToken, setLoaded = _b.setLoaded;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig({ origins: origins, env: env })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStylesAndFont(css).styles;
                    iframe = TokenEx.Iframe(cardFormTypes_1.TokenExCardNumberIframeId, tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', enablePrettyFormat: true, cvv: false, styles: styles, font: fontFamily, debug: debug !== null && debug !== void 0 ? debug : false }));
                    return [2 /*return*/, loadIframe({ iframe: iframe, setCachedToken: setCachedToken, setLoaded: setLoaded })];
            }
        });
    });
}
function getStylesAndFont(s) {
    var _a, _b, _c;
    var css = JSON.parse(s);
    var styles = {
        base: CSSPropertiesToComponent(css.base),
        focus: CSSPropertiesToComponent(css.focus),
        error: CSSPropertiesToComponent(css.error),
        placeholder: CSSPropertiesToComponent(css.placeholder),
        cvv: {
            base: CSSPropertiesToComponent((_a = css.cvv) === null || _a === void 0 ? void 0 : _a.base),
            focus: CSSPropertiesToComponent((_b = css.cvv) === null || _b === void 0 ? void 0 : _b.focus),
            error: CSSPropertiesToComponent((_c = css.cvv) === null || _c === void 0 ? void 0 : _c.error),
            placeholder: CSSPropertiesToComponent(css === null || css === void 0 ? void 0 : css.placeholder),
        },
    };
    return { styles: styles };
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
//# sourceMappingURL=tokenexHelpers.js.map