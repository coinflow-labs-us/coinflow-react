import { CoinflowIFrame, useRandomHandleHeightChangeId } from './CoinflowIFrame';
import React, { useMemo } from 'react';
import { getWalletPubkey, getHandlers, } from './common';
export function CoinflowWithdrawHistory(props) {
    const handleHeightChangeId = useRandomHandleHeightChangeId();
    const iframeProps = useMemo(() => {
        const walletPubkey = getWalletPubkey(props);
        return {
            ...props,
            walletPubkey,
            route: `/history/withdraw/${props.merchantId}`,
            transaction: undefined,
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, props]);
    const messageHandlers = useMemo(() => {
        return {
            ...getHandlers(props),
            handleHeightChange: props.handleHeightChange,
        };
    }, [props]);
    return React.createElement(CoinflowIFrame, { ...iframeProps, ...messageHandlers });
}
//# sourceMappingURL=CoinflowWithdrawHistory.js.map