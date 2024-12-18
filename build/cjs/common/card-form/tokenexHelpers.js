"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIframeConfig = getIframeConfig;
exports.setTokenExScriptTag = setTokenExScriptTag;
exports.doInitializeCvvOnlyTokenExIframe = doInitializeCvvOnlyTokenExIframe;
exports.doInitializeTokenExIframe = doInitializeTokenExIframe;
exports.doInitializeTokenExCardOnlyIframe = doInitializeTokenExCardOnlyIframe;
var tslib_1 = require("tslib");
var TokenEx_1 = require("./TokenEx");
var CoinflowUtils_1 = require("../CoinflowUtils");
function getIframeConfig(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var token, origins, env;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            token = args.token, origins = args.origins, env = args.env;
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fetch(new CoinflowUtils_1.CoinflowUtils(env).url + '/api/checkout/v2/authentication-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            origins: origins,
                            token: token,
                            merchantId: 'merchantId' in args ? args.merchantId : undefined,
                            checkoutJwt: 'checkoutJwt' in args ? args.checkoutJwt : undefined,
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
    if (document.head.querySelector("#".concat(scriptTagId))) {
        setTokenExScriptLoaded(true);
    }
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
    iframe.on('focus', function () {
        iframe.focus();
    });
    iframe.on('cvvFocus', function () {
        iframe.cvvFocus();
    });
    setLoaded(false);
    iframe.load();
    return tslib_1.__assign(tslib_1.__assign({}, iframe), { tokenize: tokenize });
}
function doInitializeCvvOnlyTokenExIframe(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var token, cardType;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = args.token, cardType = args.cardType;
                    return [4 /*yield*/, doInitialize(TokenEx_1.TokenExCvvContainerID, args, {
                            cvvOnly: true,
                            cvv: true,
                            cvvContainerID: TokenEx_1.TokenExCvvContainerID,
                            placeholder: 'CVV',
                            token: token,
                            cardType: TokenEx_1.CARD_TYPE_MAPPING[cardType],
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function doInitializeTokenExIframe(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitialize(TokenEx_1.TokenExCardNumberIframeId, args, {
                        cvv: true,
                        cvvContainerID: TokenEx_1.TokenExCvvContainerID,
                        cvvPlaceholder: 'CVV',
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function doInitializeTokenExCardOnlyIframe(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitialize(TokenEx_1.TokenExCardNumberIframeId, args, { cvv: false })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function doInitialize(id, args, configOverrides) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tokenExScriptLoaded, css, debug, font, setCachedToken, setLoaded, iframeConfig, styles, config, iframe;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenExScriptLoaded = args.tokenExScriptLoaded, css = args.css, debug = args.debug, font = args.font, setCachedToken = args.setCachedToken, setLoaded = args.setLoaded;
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig(tslib_1.__assign(tslib_1.__assign({}, args), { token: configOverrides.token }))];
                case 1:
                    iframeConfig = _a.sent();
                    styles = getStyles(css).styles;
                    config = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', enablePrettyFormat: true, styles: styles, font: font, debug: debug !== null && debug !== void 0 ? debug : false }), configOverrides);
                    iframe = TokenEx.Iframe(id, config);
                    return [2 /*return*/, loadIframe({ iframe: iframe, setCachedToken: setCachedToken, setLoaded: setLoaded })];
            }
        });
    });
}
function getStyles(s) {
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