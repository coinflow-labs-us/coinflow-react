import { __assign, __spreadArray } from "tslib";
import React, { useMemo, useRef } from 'react';
import { CoinflowUtils, getHandlers, getWalletPubkey, } from './common';
import { CoinflowIFrame, useRandomHandleHeightChangeId, } from './CoinflowIFrame';
import { useOverlay } from './useOverlay';
function useCoinflowPurchase(purchaseProps, version) {
    var handleHeightChangeId = useRandomHandleHeightChangeId();
    var iframeProps = useMemo(function () {
        var walletPubkey = getWalletPubkey(purchaseProps);
        return __assign(__assign({}, purchaseProps), { walletPubkey: walletPubkey, route: "/purchase".concat(version, "/").concat(purchaseProps.merchantId), transaction: CoinflowUtils.getTransaction(purchaseProps), handleHeightChangeId: handleHeightChangeId });
    }, [handleHeightChangeId, purchaseProps, version]);
    var messageHandlers = useMemo(function () {
        return __assign(__assign({}, getHandlers(purchaseProps)), { handleHeightChange: purchaseProps.handleHeightChange });
    }, [purchaseProps]);
    return { iframeProps: iframeProps, messageHandlers: messageHandlers };
}
export function CoinflowPurchase(purchaseProps) {
    var iframeRef = useRef(null);
    var _a = useCoinflowPurchase(purchaseProps, '-v2'), iframeProps = _a.iframeProps, messageHandlers = _a.messageHandlers;
    var showOverlay = useOverlay(iframeRef).showOverlay;
    var loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
    var invertedColor = invertHexColor(loaderBackground);
    return (React.createElement("div", { style: styles.container(loaderBackground) },
        React.createElement(CoinflowIFrame, __assign({ ref: iframeRef }, iframeProps, messageHandlers)),
        showOverlay && (React.createElement(LoaderOverlay, { loaderBackground: loaderBackground, invertedColor: invertedColor }))));
}
function LoaderOverlay(_a) {
    var loaderBackground = _a.loaderBackground, invertedColor = _a.invertedColor;
    return (React.createElement("div", { style: styles.overlay(loaderBackground) },
        React.createElement(LoaderGrid, { columns: 2 },
            React.createElement(Loader, { loaderBackground: invertedColor }),
            React.createElement(Loader, { loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1 },
            React.createElement(Loader, { height: 80, loaderBackground: invertedColor })),
        __spreadArray([], Array(3), true).map(function (_, index) { return (React.createElement(LoaderRow, { key: index },
            React.createElement(Loader, { width: index < 2 ? 80 : 120, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }),
            React.createElement(Loader, { width: index < 2 ? 60 : 100, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }))); }),
        React.createElement(LoaderGrid, { columns: 1 },
            React.createElement(Loader, { height: 60, loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1, width: "50%" },
            React.createElement(Loader, { height: 10, loaderBackground: invertedColor })),
        React.createElement(LoaderGrid, { columns: 1, width: "40%" },
            React.createElement(Loader, { height: 6, loaderBackground: invertedColor }))));
}
function LoaderGrid(_a) {
    var children = _a.children, columns = _a.columns, _b = _a.width, width = _b === void 0 ? '100%' : _b;
    return (React.createElement("div", { style: __assign(__assign({}, styles.grid), { gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"), width: width }) }, children));
}
function LoaderRow(_a) {
    var children = _a.children;
    return React.createElement("div", { style: styles.row }, children);
}
function Loader(_a) {
    var loaderBackground = _a.loaderBackground, _b = _a.height, height = _b === void 0 ? 40 : _b, width = _a.width;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: styles.loader(loaderBackground, height, width) }),
        React.createElement("style", null, styles.keyframes)));
}
function invertHexColor(hex) {
    var _a;
    hex = hex.replace(/^#/, '');
    var rgb = ((_a = hex.match(/.{2}/g)) === null || _a === void 0 ? void 0 : _a.map(function (val) { return 255 - parseInt(val, 16); })) || [];
    return "#".concat(rgb.map(function (val) { return val.toString(16).padStart(2, '0'); }).join(''));
}
var styles = {
    container: function (bg) { return ({
        position: 'relative',
        height: '100%',
        backgroundColor: bg,
    }); },
    overlay: function (bg) { return ({
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
    }); },
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
    loader: function (bg, height, width) { return ({
        width: width ? "".concat(width, "px") : '100%',
        height: "".concat(height, "px"),
        backgroundColor: bg,
        borderRadius: '4px',
        animation: 'pulse 1.5s infinite',
    }); },
    keyframes: "\n    @keyframes pulse {\n      0%, 100% { opacity: 0.07; }\n      50% { opacity: 0.03; }\n    }\n  ",
};
//# sourceMappingURL=CoinflowPurchase.js.map