"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowWithdraw = CoinflowWithdraw;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const CoinflowIFrame_1 = require("./CoinflowIFrame");
const common_1 = require("./common");
function CoinflowWithdraw(withdrawProps) {
    const handleHeightChangeId = (0, CoinflowIFrame_1.useRandomHandleHeightChangeId)();
    const iframeProps = (0, react_1.useMemo)(() => {
        const walletPubkey = (0, common_1.getWalletPubkey)(withdrawProps);
        return {
            ...withdrawProps,
            walletPubkey,
            route: `/withdraw/${withdrawProps.merchantId}`,
            transaction: undefined,
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, withdrawProps]);
    const messageHandlers = (0, react_1.useMemo)(() => {
        return {
            ...(0, common_1.getHandlers)(withdrawProps),
            handleHeightChange: withdrawProps.handleHeightChange,
        };
    }, [withdrawProps]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, { ...iframeProps, ...messageHandlers });
}
//# sourceMappingURL=CoinflowWithdraw.js.map