import React, { useMemo } from 'react';
import { CoinflowIFrame, useRandomHandleHeightChangeId } from './CoinflowIFrame';
import { getHandlers, getWalletPubkey, } from './common';
export function CoinflowWithdraw(withdrawProps) {
    const handleHeightChangeId = useRandomHandleHeightChangeId();
    const iframeProps = useMemo(() => {
        const walletPubkey = getWalletPubkey(withdrawProps);
        return {
            ...withdrawProps,
            walletPubkey,
            route: `/withdraw/${withdrawProps.merchantId}`,
            transaction: undefined,
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, withdrawProps]);
    const messageHandlers = useMemo(() => {
        return {
            ...getHandlers(withdrawProps),
            handleHeightChange: withdrawProps.handleHeightChange,
        };
    }, [withdrawProps]);
    return React.createElement(CoinflowIFrame, { ...iframeProps, ...messageHandlers });
}
//# sourceMappingURL=CoinflowWithdraw.js.map