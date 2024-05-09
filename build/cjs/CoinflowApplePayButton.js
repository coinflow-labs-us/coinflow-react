"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileWalletButton = exports.CoinflowApplePayButton = void 0;
var tslib_1 = require("tslib");
var common_1 = require("./common");
var CoinflowIFrame_1 = require("./CoinflowIFrame");
var react_1 = tslib_1.__importStar(require("react"));
function CoinflowApplePayButton(props) {
    return react_1.default.createElement(MobileWalletButton, { props: props, route: 'apple-pay' });
}
exports.CoinflowApplePayButton = CoinflowApplePayButton;
function MobileWalletButton(_a) {
    var props = _a.props, route = _a.route;
    var iframeRef = (0, react_1.useRef)(null);
    var onSuccess = props.onSuccess;
    (0, react_1.useEffect)(function () {
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
    var iframeProps = (0, react_1.useMemo)(function () {
        var walletPubkey = (0, common_1.getWalletPubkey)(props);
        return tslib_1.__assign(tslib_1.__assign({}, props), { walletPubkey: walletPubkey, transaction: undefined, routePrefix: 'form', route: "/".concat(route, "/").concat(props.merchantId) });
    }, [props, route]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, (0, common_1.getHandlers)(props)), { handleHeightChange: props.handleHeightChange });
    }, [props]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({ ref: iframeRef }, iframeProps, messageHandlers));
}
exports.MobileWalletButton = MobileWalletButton;
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