import { CoinflowIFrame, useRandomHandleHeightChangeId } from './CoinflowIFrame';
import React, { useMemo } from 'react';
import { getHandlers, getWalletPubkey, } from './common';
export function CoinflowPurchaseHistory(props) {
    const handleHeightChangeId = useRandomHandleHeightChangeId();
    const iframeProps = useMemo(() => {
        const walletPubkey = getWalletPubkey(props);
        return {
            ...props,
            walletPubkey,
            route: `/history/purchase/${props.merchantId}`,
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
//# sourceMappingURL=CoinflowPurchaseHistory.js.map