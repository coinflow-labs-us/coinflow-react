import React, { useMemo, useRef } from 'react';
import { CoinflowUtils, getHandlers, getWalletPubkey, } from './common';
import { CoinflowIFrame, useRandomHandleHeightChangeId, } from './CoinflowIFrame';
import { useOverlay } from './useOverlay';
import { invertHexColor, styles } from './Utils';
import { LoaderOverlay } from './Loader';
function useCoinflowPurchase(purchaseProps, version) {
    const handleHeightChangeId = useRandomHandleHeightChangeId();
    const iframeProps = useMemo(() => {
        const walletPubkey = getWalletPubkey(purchaseProps);
        return {
            ...purchaseProps,
            walletPubkey,
            route: `/purchase${version}/${purchaseProps.merchantId}`,
            transaction: CoinflowUtils.getTransaction(purchaseProps),
            handleHeightChangeId,
        };
    }, [handleHeightChangeId, purchaseProps, version]);
    const messageHandlers = useMemo(() => {
        return {
            ...getHandlers(purchaseProps),
            handleHeightChange: purchaseProps.handleHeightChange,
        };
    }, [purchaseProps]);
    return { iframeProps, messageHandlers };
}
export function CoinflowPurchase(purchaseProps) {
    const iframeRef = useRef(null);
    const { iframeProps, messageHandlers } = useCoinflowPurchase(purchaseProps, '-v2');
    const { showOverlay } = useOverlay(iframeRef);
    const loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
    const invertedColor = invertHexColor(loaderBackground);
    return (React.createElement("div", { style: styles.container(loaderBackground) },
        React.createElement(CoinflowIFrame, { ref: iframeRef, ...iframeProps, ...messageHandlers }),
        showOverlay && (React.createElement(LoaderOverlay, { loaderBackground: loaderBackground, invertedColor: invertedColor }))));
}
//# sourceMappingURL=CoinflowPurchase.js.map