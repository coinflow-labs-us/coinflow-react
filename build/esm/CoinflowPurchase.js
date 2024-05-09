import { __assign } from "tslib";
import React, { useMemo } from 'react';
import { CoinflowUtils, getHandlers, getWalletPubkey, } from './common';
import { CoinflowIFrame } from './CoinflowIFrame';
export function CoinflowPurchase(purchaseProps) {
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(purchaseProps);
        return __assign(__assign({}, purchaseProps), { walletPubkey: walletPubkey, route: "/purchase/".concat(purchaseProps.merchantId), transaction: CoinflowUtils.getTransaction(purchaseProps) });
    }, [purchaseProps]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(purchaseProps)), { handleHeightChange: purchaseProps.handleHeightChange });
    }, [purchaseProps]);
    return React.createElement(CoinflowIFrame, __assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowPurchase.js.map