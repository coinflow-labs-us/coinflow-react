import { __assign } from "tslib";
import { CoinflowIFrame, useRandomHandleHeightChangeId } from './CoinflowIFrame';
import React, { useMemo } from 'react';
import { getHandlers, getWalletPubkey, } from './common';
export function CoinflowPurchaseHistory(props) {
    var handleHeightChangeId = useRandomHandleHeightChangeId();
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(props);
        return __assign(__assign({}, props), { walletPubkey: walletPubkey, route: "/history/purchase/".concat(props.merchantId), transaction: undefined, handleHeightChangeId: handleHeightChangeId });
    }, [handleHeightChangeId, props]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(props)), { handleHeightChange: props.handleHeightChange });
    }, [props]);
    return React.createElement(CoinflowIFrame, __assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowPurchaseHistory.js.map