"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchaseHistory = CoinflowPurchaseHistory;
const tslib_1 = require("tslib");
const CoinflowIFrame_1 = require("./CoinflowIFrame");
const react_1 = tslib_1.__importStar(require("react"));
const common_1 = require("./common");
function CoinflowPurchaseHistory(props) {
    const handleHeightChangeId = (0, CoinflowIFrame_1.useRandomHandleHeightChangeId)();
    const iframeProps = (0, react_1.useMemo)(() => {
        const walletPubkey = (0, common_1.getWalletPubkey)(props);
        return {
            ...props,
            walletPubkey,
            route: `/history/purchase/${props.merchantId}`,
            transaction: undefined,
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, props]);
    const messageHandlers = (0, react_1.useMemo)(() => {
        return {
            ...(0, common_1.getHandlers)(props),
            handleHeightChange: props.handleHeightChange,
        };
    }, [props]);
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, { ...iframeProps, ...messageHandlers });
}
//# sourceMappingURL=CoinflowPurchaseHistory.js.map