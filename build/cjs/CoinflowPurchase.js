"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchaseLegacy = CoinflowPurchaseLegacy;
exports.CoinflowPurchase = CoinflowPurchase;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var common_1 = require("./common");
var CoinflowIFrame_1 = require("./CoinflowIFrame");
var useOverlay_1 = require("./useOverlay");
function useCoinflowPurchase(purchaseProps, version) {
    var iframeProps = (0, react_1.useMemo)(function () {
        var walletPubkey = (0, common_1.getWalletPubkey)(purchaseProps);
        return tslib_1.__assign(tslib_1.__assign({}, purchaseProps), { walletPubkey: walletPubkey, route: "/purchase".concat(version, "/").concat(purchaseProps.merchantId), transaction: common_1.CoinflowUtils.getTransaction(purchaseProps) });
    }, [purchaseProps, version]);
    var messageHandlers = (0, react_1.useMemo)(function () {
        return tslib_1.__assign(tslib_1.__assign({}, (0, common_1.getHandlers)(purchaseProps)), { handleHeightChange: purchaseProps.handleHeightChange });
    }, [purchaseProps]);
    return { iframeProps: iframeProps, messageHandlers: messageHandlers };
}
function CoinflowPurchaseLegacy(purchaseProps) {
    var _a = useCoinflowPurchase(purchaseProps, ''), iframeProps = _a.iframeProps, messageHandlers = _a.messageHandlers;
    return react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({}, iframeProps, messageHandlers));
}
function CoinflowPurchase(purchaseProps) {
    var iframeRef = (0, react_1.useRef)(null);
    var _a = useCoinflowPurchase(purchaseProps, '-v2'), iframeProps = _a.iframeProps, messageHandlers = _a.messageHandlers;
    var showOverlay = (0, useOverlay_1.useOverlay)(iframeRef).showOverlay;
    var loaderBackground = iframeProps.loaderBackground || '#ffffff'; // white default bg
    var invertedColor = invertHexColor(loaderBackground);
    return (react_1.default.createElement("div", { style: styles.container(loaderBackground) },
        react_1.default.createElement(CoinflowIFrame_1.CoinflowIFrame, tslib_1.__assign({ ref: iframeRef }, iframeProps, messageHandlers)),
        showOverlay && (react_1.default.createElement(LoaderOverlay, { loaderBackground: loaderBackground, invertedColor: invertedColor }))));
}
function LoaderOverlay(_a) {
    var loaderBackground = _a.loaderBackground, invertedColor = _a.invertedColor;
    return (react_1.default.createElement("div", { style: styles.overlay(loaderBackground) },
        react_1.default.createElement(LoaderGrid, { columns: 2 },
            react_1.default.createElement(Loader, { loaderBackground: invertedColor }),
            react_1.default.createElement(Loader, { loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1 },
            react_1.default.createElement(Loader, { height: 80, loaderBackground: invertedColor })),
        tslib_1.__spreadArray([], Array(3), true).map(function (_, index) { return (react_1.default.createElement(LoaderRow, { key: index },
            react_1.default.createElement(Loader, { width: index < 2 ? 80 : 120, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }),
            react_1.default.createElement(Loader, { width: index < 2 ? 60 : 100, height: index < 2 ? 15 : 20, loaderBackground: invertedColor }))); }),
        react_1.default.createElement(LoaderGrid, { columns: 1 },
            react_1.default.createElement(Loader, { height: 60, loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1, width: "50%" },
            react_1.default.createElement(Loader, { height: 10, loaderBackground: invertedColor })),
        react_1.default.createElement(LoaderGrid, { columns: 1, width: "40%" },
            react_1.default.createElement(Loader, { height: 6, loaderBackground: invertedColor }))));
}
function LoaderGrid(_a) {
    var children = _a.children, columns = _a.columns, _b = _a.width, width = _b === void 0 ? '100%' : _b;
    return (react_1.default.createElement("div", { style: tslib_1.__assign(tslib_1.__assign({}, styles.grid), { gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"), width: width }) }, children));
}
function LoaderRow(_a) {
    var children = _a.children;
    return react_1.default.createElement("div", { style: styles.row }, children);
}
function Loader(_a) {
    var loaderBackground = _a.loaderBackground, _b = _a.height, height = _b === void 0 ? 40 : _b, width = _a.width;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: styles.loader(loaderBackground, height, width) }),
        react_1.default.createElement("style", null, styles.keyframes)));
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