import { __assign, __awaiter, __generator } from "tslib";
import { TokenExCvvContainerID, CARD_TYPE_MAPPING, TokenExCardNumberIframeId, } from './TokenEx';
import { CoinflowUtils } from '../CoinflowUtils';
export function getIframeConfig(args) {
    return __awaiter(this, void 0, void 0, function () {
        var token, origins, env;
        var _this = this;
        return __generator(this, function (_a) {
            token = args.token, origins = args.origins, env = args.env;
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fetch(new CoinflowUtils(env).url + '/api/checkout/v2/authentication-key', {
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
function doInitialize(id, args, configOverrides) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenExScriptLoaded, css, debug, font, setCachedToken, setLoaded, iframeConfig, styles, config, iframe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tokenExScriptLoaded = args.tokenExScriptLoaded, css = args.css, debug = args.debug, font = args.font, setCachedToken = args.setCachedToken, setLoaded = args.setLoaded;
                    if (!tokenExScriptLoaded && typeof TokenEx === 'undefined') {
                        console.warn('Warning Unable to load TokenEx on first attempt waiting for load event from document.head.script#tokenex-script');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, getIframeConfig(__assign(__assign({}, args), { token: configOverrides.token }))];
                case 1:
                    iframeConfig = _a.sent();
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
var unitlessProperties = new Set([
    'animationIterationCount',
    'aspectRatio',
    'borderImageOutset',
    'borderImageSlice',
    'borderImageWidth',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'columns',
    'flex',
    'flexGrow',
    'flexPositive',
    'flexShrink',
    'flexNegative',
    'flexOrder',
    'gridArea',
    'gridRow',
    'gridRowEnd',
    'gridRowSpan',
    'gridRowStart',
    'gridColumn',
    'gridColumnEnd',
    'gridColumnSpan',
    'gridColumnStart',
    'fontWeight',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'scale',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skew',
    'skewX',
    'skewY',
    'tabSize',
    'widows',
    'zIndex',
    'zoom',
    // svg props here
    'fillOpacity',
    'floodOpacity',
    'stopOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth',
]);
var VENDOR_PREFIX_REGEX = /^(Webkit|Moz|ms|O)/; // ms is lowercase in some jsx keynames
var KEBAB_CASE_REGEX = /[A-Z]/g;
/**
 * Converts a CSSProperties object to a valid CSS string.
 *
 * @param styles - the CSSProperties object to convert (should work with either React.CSSProperties or CSS.Properties<string | number>>)
 * @returns a string representation of the CSS properties.
 *
 */
export function CSSPropertiesToComponent(styles) {
    if (!styles || Object.keys(styles).length === 0) {
        return '';
    }
    var cssParts = [];
    for (var key in styles) {
        if (Object.prototype.hasOwnProperty.call(styles, key)) {
            var value = styles[key];
            if (value === null || value === undefined || value === '') {
                continue;
            }
            var cssPropertyKey = key;
            if (cssPropertyKey.startsWith('--')) {
                // ignore custom props
            }
            else {
                cssPropertyKey = cssPropertyKey.replace(KEBAB_CASE_REGEX, function (match) { return "-".concat(match.toLowerCase()); });
                if (VENDOR_PREFIX_REGEX.test(key)) {
                    cssPropertyKey = "-".concat(cssPropertyKey);
                }
            }
            var cssValue = void 0;
            if (typeof value === 'number') {
                if (unitlessProperties.has(key)) {
                    cssValue = String(value);
                }
                else {
                    cssValue = value === 0 ? '0' : "".concat(value, "px");
                }
            }
            else {
                cssValue = String(value);
            }
            cssParts.push("".concat(cssPropertyKey, ": ").concat(cssValue));
        }
    }
    if (cssParts.length === 0) {
        return '';
    }
    return cssParts.join('; ') + ';';
}
//# sourceMappingURL=tokenexHelpers.js.map