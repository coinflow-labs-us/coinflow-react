"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchase = CoinflowPurchase;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const common_1 = require("./common");
const CoinflowIFrame_1 = require("./CoinflowIFrame");
const useOverlay_1 = require("./useOverlay");
const Utils_1 = require("./Utils");
const Loader_1 = require("./Loader");
function useCoinflowPurchase(purchaseProps, version) {
    const handleHeightChangeId = (0, CoinflowIFrame_1.useRandomHandleHeightChangeId)();
    const iframeProps = (0, react_1.useMemo)(() => {
        const walletPubkey = (0, common_1.getWalletPubkey)(purchaseProps);
        return {
            ...purchaseProps,
            walletPubkey,
            route: `/purchase${version}/${purchaseProps.merchantId}`,
            transaction: common_1.CoinflowUtils.getTransaction(purchaseProps),
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, purchaseProps, version]);
    const messageHandlers = (0, react_1.useMemo)(() => {
        return {
            ...(0, common_1.getHandlers)(purchaseProps),
            handleHeightChange: purchaseProps.handleHeightChange,
        };
    }, [purchaseProps]);
    return { iframeProps, messageHandlers };
}
function CoinflowPurchase(purchaseProps) {
    const iframeRef = (0, react_1.useRef)(null);
    const { iframeProps, messageHandlers } = useCoinflowPurchase(purchaseProps, '-v2');
    const { showOverlay } = (0, useOverlay_1.useOverlay)(iframeRef);
    const loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
    const invertedColor = (0, Utils_1.invertHexColor)(loaderBackground);
    return (react_1.default.createElement("div", { style: Utils_1.styles.container(loaderBackground) },
        react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, { ref: iframeRef, ...iframeProps, ...messageHandlers }),
        showOverlay && (react_1.default.createElement(Loader_1.LoaderOverlay, { loaderBackground: loaderBackground, invertedColor: invertedColor }))));
}
//# sourceMappingURL=CoinflowPurchase.js.map