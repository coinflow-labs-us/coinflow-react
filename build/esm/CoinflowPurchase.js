import React, { useMemo, useRef } from 'react';
import { CoinflowUtils, getHandlers, getWalletPubkey, } from './common';
import { CoinflowIFrame, useRandomHandleHeightChangeId, } from './CoinflowIFrame';
import { useOverlay } from './useOverlay';
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
function LoaderOverlay({ loaderBackground, invertedColor, }) {
    return (React.createElement("div", { style: styles.overlay(loaderBackground) },
        React.createElement(LoaderGrid, { columns: 2 },
            React.createElement(Loader, { loaderBackground: invertedColor }),
            React.createElement(Loader, { loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1 },
            React.createElement(Loader, { height: 80, loaderBackground: invertedColor })),
        [...Array(3)].map((_, index) => (React.createElement(LoaderRow, { key: index },
            React.createElement(Loader, { width: index < 2 ? 80 : 120, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }),
            React.createElement(Loader, { width: index < 2 ? 60 : 100, height: index < 2 ? 15 : 20, loaderBackground: invertedColor })))),
        React.createElement(LoaderGrid, { columns: 1 },
            React.createElement(Loader, { height: 60, loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1, width: "50%" },
            React.createElement(Loader, { height: 10, loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1, width: "40%" },
            React.createElement(Loader, { height: 6, loaderBackground: invertedColor }))));
}
function LoaderGrid({ children, columns, width = '100%', }) {
    return (React.createElement("div", { style: {
            ...styles.grid,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            width,
        } }, children));
}
function LoaderRow({ children }) {
    return React.createElement("div", { style: styles.row }, children);
}
function Loader({ loaderBackground, height = 40, width, }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.loader(loaderBackground, height, width) }),
        React.createElement("style", null, styles.keyframes)));
}
function invertHexColor(hex) {
    hex = hex.replace(/^#/, '');
    const rgb = hex.match(/.{2}/g)?.map(val => 255 - parseInt(val, 16)) || [];
    return `#${rgb.map(val => val.toString(16).padStart(2, '0')).join('')}`;
}
const styles = {
    container: (bg) => ({
        position: 'relative',
        height: '100%',
        backgroundColor: bg,
    }),
    overlay: (bg) => ({
        backgroundColor: bg,
        display: 'flex',
        color: 'gray',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontSize: 24,
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 10,
        padding: '20px',
    }),
    grid: {
        display: 'grid',
        gap: '20px',
        width: '100%',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    loader: (bg, height, width) => ({
        width: width ? `${width}px` : '100%',
        height: `${height}px`,
        backgroundColor: bg,
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite',
    }),
    keyframes: `
    @keyframes pulse {
      0%, 100% { opacity: 0.07; }
      50% { opacity: 0.03; }
    }
  `,
};
//# sourceMappingURL=CoinflowPurchase.js.map