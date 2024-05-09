"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowCardForm = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var CoinflowIFrame_1 = require("./CoinflowIFrame");
/**
 * Allows merchants to collect card information from their customers in a PCI-compliant way and receive a token for use with the `/api/checkout/token` endpoint.
 *
 * Usage:
 * ```tsx
 *  const ref =  useRef<{getToken(): Promise<{token: string}>}>();
 *
 *  <CoinflowCardForm
 *    ref={coinflowCardFormRef}
 *    ...
 *  />
 *
 *  <button onClick={() => {
 *   ref.current?.getToken()
 *     .then(({token}) => console.log(token))
 *     .catch(e => console.error('GET TOKEN ERROR', e))
 *  }}>Get Token</button>
 *
 * ```
 */
exports.CoinflowCardForm = (0, react_1.forwardRef)(function (props, ref) {
    var iframeRef = (0, react_1.useRef)();
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        getToken: function () {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var methodName, isValid, response;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            methodName = 'getToken';
                            if (!iframeRef.current)
                                throw new Error('Unable to get token');
                            isValid = function (data) {
                                try {
                                    var res = JSON.parse(data);
                                    return 'method' in res && res.method === methodName;
                                }
                                catch (e) {
                                    return false;
                                }
                            };
                            return [4 /*yield*/, iframeRef.current.sendAndReceiveMessage(methodName, isValid)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, JSON.parse(response).data];
                    }
                });
            });
        }
    }); });
    var merchantCss = (0, react_1.useMemo)(function () {
        if (!props.customCss)
            return undefined;
        var cssStr = Object.entries(props.customCss).reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            return acc + "".concat(key, " {").concat(CSSPropertiesToComponent(value), "}\n");
        }, '');
        return Buffer.from(cssStr).toString('base64');
    }, [props.customCss]);
    var iframeProps = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, props), { walletPubkey: props.walletPubkey, route: "/checkout-form/".concat(props.merchantId), routePrefix: 'form', merchantCss: merchantCss, transaction: undefined });
    }, [merchantCss, props]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return {
            handleSendTransaction: function () { throw new Error('Not Supported'); },
            handleHeightChange: props.handleHeightChange
        };
    }, [props]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({ ref: iframeRef }, iframeProps, messageHandlers));
});
function CSSPropertiesToComponent(dict) {
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
//# sourceMappingURL=CoinflowCardForm.js.map