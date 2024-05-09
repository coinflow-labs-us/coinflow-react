"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowWithdraw = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var CoinflowIFrame_1 = require("./CoinflowIFrame");
var common_1 = require("./common");
function CoinflowWithdraw(withdrawProps) {
    var iframeProps = (0, react_1.useMemo)(function () {
        var walletPubkey = (0, common_1.getWalletPubkey)(withdrawProps);
        return tslib_1.__assign(tslib_1.__assign({}, withdrawProps), { walletPubkey: walletPubkey, route: "/withdraw/".concat(withdrawProps.merchantId), transaction: undefined });
    }, [withdrawProps]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, (0, common_1.getHandlers)(withdrawProps)), { handleHeightChange: withdrawProps.handleHeightChange });
    }, [withdrawProps]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({}, iframeProps, messageHandlers));
}
exports.CoinflowWithdraw = CoinflowWithdraw;
//# sourceMappingURL=CoinflowWithdraw.js.map