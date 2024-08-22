import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import { TokenExCvvContainerID, CARD_TYPE_MAPPING, TokenExCardNumberIframeId, } from './TokenEx';
import { CoinflowUtils } from '../CoinflowUtils';
export function getIframeConfig(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var token = _b.token, origins = _b.origins, env = _b.env;
        return __generator(this, function (_c) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fetch(new CoinflowUtils(env).url + '/api/checkout/authentication-key', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            origins: __spreadArray(__spreadArray([], (origins !== null && origins !== void 0 ? origins : []), true), [window.location.origin], false),
                            token: token,
                        }),
                    })
                        .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
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
export function setTokenExScriptTag(_a) {
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
    return __assign(__assign({}, iframe), { tokenize: tokenize });
}
export function doInitializeCvvOnlyTokenExIframe(args) {
    return __awaiter(this, void 0, void 0, function () {
        var token, cardType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = args.token, cardType = args.cardType;
                    return [4 /*yield*/, doInitialize(TokenExCvvContainerID, args, {
                            cvvOnly: true,
                            cvv: true,
                            cvvContainerID: TokenExCvvContainerID,
                            placeholder: 'CVV',
                            token: token,
                            cardType: CARD_TYPE_MAPPING[cardType],
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function doInitializeTokenExIframe(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitialize(TokenExCardNumberIframeId, args, {
                        cvv: true,
                        cvvContainerID: TokenExCvvContainerID,
                        cvvPlaceholder: 'CVV',
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function doInitializeTokenExCardOnlyIframe(args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, doInitialize(TokenExCardNumberIframeId, args, { cvv: false })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function doInitialize(id_1, _a, configOverrides_1) {
    return __awaiter(this, arguments, void 0, function (id, _b, configOverrides) {
        var iframeConfig, styles, config, iframe;
        var tokenExScriptLoaded = _b.tokenExScriptLoaded, origins = _b.origins, env = _b.env, css = _b.css, debug = _b.debug, font = _b.font, setCachedToken = _b.setCachedToken, setLoaded = _b.setLoaded;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig({
                            token: configOverrides.token,
                            origins: origins,
                            env: env,
                        })];
                case 1:
                    iframeConfig = _c.sent();
                    styles = getStyles(css).styles;
                    config = __assign(__assign(__assign({}, iframeConfig), { placeholder: '0000 0000 0000 0000', enablePrettyFormat: true, styles: styles, font: font, debug: debug !== null && debug !== void 0 ? debug : false }), configOverrides);
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