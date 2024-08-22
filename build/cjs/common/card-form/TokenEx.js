"use strict";
// Type definitions for TokenEx iframe integration
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_TYPE_MAPPING = exports.TokenExCvvContainerID = exports.TokenExCardNumberIframeId = void 0;
var CoinflowTypes_1 = require("../CoinflowTypes");
exports.TokenExCardNumberIframeId = 'tokenExCardNumber';
exports.TokenExCvvContainerID = 'tokenExCardCvv';
exports.CARD_TYPE_MAPPING = (_a = {},
    _a[CoinflowTypes_1.CardType.VISA] = 'visa',
    _a[CoinflowTypes_1.CardType.MASTERCARD] = 'masterCard',
    _a[CoinflowTypes_1.CardType.AMEX] = 'americanExpress',
    _a[CoinflowTypes_1.CardType.DISCOVER] = 'discover',
    _a);
//# sourceMappingURL=TokenEx.js.map