"use strict";
// Type definitions for TokenEx iframe integration
/// <reference path="./TokenEx.global.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_TYPE_MAPPING = exports.TokenExCvvContainerID = exports.TokenExCardNumberIframeId = void 0;
const CoinflowTypes_1 = require("../CoinflowTypes");
exports.TokenExCardNumberIframeId = 'tokenExCardNumber';
exports.TokenExCvvContainerID = 'tokenExCardCvv';
exports.CARD_TYPE_MAPPING = {
    [CoinflowTypes_1.CardType.VISA]: 'visa',
    [CoinflowTypes_1.CardType.MASTERCARD]: 'masterCard',
    [CoinflowTypes_1.CardType.AMEX]: 'americanExpress',
    [CoinflowTypes_1.CardType.DISCOVER]: 'discover',
};
//# sourceMappingURL=TokenEx.js.map