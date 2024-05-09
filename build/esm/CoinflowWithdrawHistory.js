import { __assign } from "tslib";
import { CoinflowIFrame } from './CoinflowIFrame';
import React, { useMemo } from "react";
import { getWalletPubkey, getHandlers } from "./common";
export function CoinflowWithdrawHistory(props) {
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(props);
        return __assign(__assign({}, props), { walletPubkey: walletPubkey, route: "/history/withdraw/".concat(props.merchantId), transaction: undefined });
    }, [props]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(props)), { handleHeightChange: props.handleHeightChange });
    }, [props]);
    return React.createElement(CoinflowIFrame, __assign({}, iframeProps, messageHandlers));
}
//# sourceMappingURL=CoinflowWithdrawHistory.js.map