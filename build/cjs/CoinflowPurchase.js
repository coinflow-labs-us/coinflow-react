"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.CoinflowPurchase = CoinflowPurchase;
const react_1 = tslib_1.__importStar(require("react"));
const common_1 = require("./common");
const CoinflowIFrame_1 = require("./CoinflowIFrame");
const useOverlay_1 = require("./useOverlay");
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
    const invertedColor = invertHexColor(loaderBackground);
    return (react_1.default.createElement("div", { style: styles.container(loaderBackground) },
        react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, { ref: iframeRef, ...iframeProps, ...messageHandlers }),
        showOverlay && (react_1.default.createElement(LoaderOverlay, { loaderBackground: loaderBackground, invertedColor: invertedColor }))));
}
function LoaderOverlay({ loaderBackground, invertedColor, }) {
    return (react_1.default.createElement("div", { style: styles.overlay(loaderBackground) },
        react_1.default.createElement(LoaderGrid, { columns: 2 },
            react_1.default.createElement(Loader, { loaderBackground: invertedColor }),
            react_1.default.createElement(Loader, { loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1 },
            react_1.default.createElement(Loader, { height: 80, loaderBackground: invertedColor })),
        [...Array(3)].map((_, index) => (react_1.default.createElement(LoaderRow, { key: index },
            react_1.default.createElement(Loader, { width: index < 2 ? 80 : 120, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }),
            react_1.default.createElement(Loader, { width: index < 2 ? 60 : 100, height: index < 2 ? 15 : 20, loaderBackground: invertedColor })))),
        react_1.default.createElement(LoaderGrid, { columns: 1 },
            react_1.default.createElement(Loader, { height: 60, loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1, width: "50%" },
            react_1.default.createElement(Loader, { height: 10, loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1, width: "40%" },
            react_1.default.createElement(Loader, { height: 6, loaderBackground: invertedColor }))));
}
function LoaderGrid({ children, columns, width = '100%', }) {
    return (react_1.default.createElement("div", { style: {
            ...styles.grid,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            width,
        } }, children));
}
function LoaderRow({ children }) {
    return react_1.default.createElement("div", { style: styles.row }, children);
}
function Loader({ loaderBackground, height = 40, width, }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: styles.loader(loaderBackground, height, width) }),
        react_1.default.createElement("style", null, styles.keyframes)));
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