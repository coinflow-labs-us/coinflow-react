import { __assign } from "tslib";
import React, { useMemo } from 'react';
import { CoinflowIFrame, useRandomHandleHeightChangeId } from './CoinflowIFrame';
import { getHandlers, getWalletPubkey, } from './common';
export function CoinflowWithdraw(withdrawProps) {
    var handleHeightChangeId = useRandomHandleHeightChangeId();
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(withdrawProps);
        return __assign(__assign({}, withdrawProps), { walletPubkey: walletPubkey, route: "/withdraw/".concat(withdrawProps.merchantId), transaction: undefined, handleHeightChangeId: handleHeightChangeId });
    }, [handleHeightChangeId, withdrawProps]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(withdrawProps)), { handleHeightChange: withdrawProps.handleHeightChange });
    }, [withdrawProps]);
    return React.createElement(CoinflowIFrame, __assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowWithdraw.js.map