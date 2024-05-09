import { __assign } from "tslib";
import { getWalletPubkey, getHandlers } from './common';
import { CoinflowIFrame } from "./CoinflowIFrame";
import React, { useEffect, useMemo, useRef } from "react";
export function CoinflowApplePayButton(props) {
    return React.createElement(MobileWalletButton, { props: props, route: 'apple-pay' });
}
export function MobileWalletButton(_a) {
    var props = _a.props, route = _a.route;
    var iframeRef = useRef(null);
    var onSuccess = props.onSuccess;
    useEffect(function () {
        if (!onSuccess)
            return;
        if (!(iframeRef === null || iframeRef === void 0 ? void 0 : iframeRef.current))
            return;
        iframeRef.current.listenForMessage(function (data) {
            try {
                var res = JSON.parse(data);
                return 'method' in res && res.method === 'getToken';
            }
            catch (e) {
                return false;
            }
        }).then(function (data) { return onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(data); });
    }, [onSuccess]);
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(props);
        return __assign(__assign({}, props), { walletPubkey: walletPubkey, transaction: undefined, routePrefix: 'form', route: "/".concat(route, "/").concat(props.merchantId) });
    }, [props, route]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(props)), { handleHeightChange: props.handleHeightChange });
    }, [props]);
    return React.createElement(CoinflowIFrame, __assign({ ref: iframeRef }, iframeProps, messageHandlers));
}
// TODO
// export function useGetTokenHandler(props: CoinflowPurchaseProps) {
//   const {onSuccess} = props;
//
//   useEffect(() => {
//     const handler = getMessageHandler('getToken', (data: string) => {
//       if (data.startsWith('ERROR')) {
//         console.error('Mobile Wallet Payment Error', data.replace('ERROR', ''));
//         return;
//       }
//
//       onSuccess?.(data);
//     });
//
//     if (!window) throw new Error('Window not defined');
//     window.addEventListener('message', handler);
//   }, [onSuccess]);
// }
//# sourceMappingURL=CoinflowApplePayButton.js.map