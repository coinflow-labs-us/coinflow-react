"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowGooglePayButton = CoinflowGooglePayButton;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var CoinflowApplePayButton_1 = require("./CoinflowApplePayButton");
function CoinflowGooglePayButton(props) {
    return react_1.default.createElement(CoinflowApplePayButton_1.MobileWalletButton, { props: props, route: 'google-pay' });
}
//# sourceMappingURL=CoinflowGooglePayButton.js.map