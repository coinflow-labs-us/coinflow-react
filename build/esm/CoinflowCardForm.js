import { __assign, __awaiter, __generator } from "tslib";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { CoinflowIFrame } from "./CoinflowIFrame";
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
export var CoinflowCardForm = forwardRef(function (props, ref) {
    var iframeRef = useRef();
    useImperativeHandle(ref, function () { return ({
        getToken: function () {
            return __awaiter(this, void 0, void 0, function () {
                var methodName, isValid, response;
                return __generator(this, function (_a) {
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
    var merchantCss = useMemo(function () {
        if (!props.customCss)
            return undefined;
        var cssStr = Object.entries(props.customCss).reduce(function (acc, _a) {
            var key = _a[0], value = _a[1];
            return acc + "".concat(key, " {").concat(CSSPropertiesToComponent(value), "}\n");
        }, '');
        return Buffer.from(cssStr).toString('base64');
    }, [props.customCss]);
    var iframeProps = useMemo(function () {
        return __assign(__assign({}, props), { walletPubkey: props.walletPubkey, route: "/checkout-form/".concat(props.merchantId), routePrefix: 'form', merchantCss: merchantCss, transaction: undefined });
    }, [merchantCss, props]);
    var messageHandlers = useMemo(function () {
        return {
            handleSendTransaction: function () { throw new Error('Not Supported'); },
            handleHeightChange: props.handleHeightChange
        };
    }, [props]);
    return React.createElement(CoinflowIFrame, __assign({ ref: iframeRef }, iframeProps, messageHandlers));
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