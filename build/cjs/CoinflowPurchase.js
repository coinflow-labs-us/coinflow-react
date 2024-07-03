"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchase = CoinflowPurchase;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var common_1 = require("./common");
var CoinflowIFrame_1 = require("./CoinflowIFrame");
function CoinflowPurchase(purchaseProps) {
    var iframeProps = (0, react_1.useMemo)(function () {
        var walletPubkey = (0, common_1.getWalletPubkey)(purchaseProps);
        return tslib_1.__assign(tslib_1.__assign({}, purchaseProps), { walletPubkey: walletPubkey, route: "/purchase/".concat(purchaseProps.merchantId), transaction: common_1.CoinflowUtils.getTransaction(purchaseProps) });
    }, [purchaseProps]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, (0, common_1.getHandlers)(purchaseProps)), { handleHeightChange: purchaseProps.handleHeightChange });
    }, [purchaseProps]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowPurchase.js.map