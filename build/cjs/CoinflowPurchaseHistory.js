"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchaseHistory = CoinflowPurchaseHistory;
var tslib_1 = require("tslib");
var CoinflowIFrame_1 = require("./CoinflowIFrame");
var react_1 = tslib_1.__importStar(require("react"));
var common_1 = require("./common");
function CoinflowPurchaseHistory(props) {
    var iframeProps = (0, react_1.useMemo)(function () {
        var walletPubkey = (0, common_1.getWalletPubkey)(props);
        return tslib_1.__assign(tslib_1.__assign({}, props), { walletPubkey: walletPubkey, route: "/history/purchase/".concat(props.merchantId), transaction: undefined });
    }, [props]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, (0, common_1.getHandlers)(props)), { handleHeightChange: props.handleHeightChange });
    }, [props]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowPurchaseHistory.js.map