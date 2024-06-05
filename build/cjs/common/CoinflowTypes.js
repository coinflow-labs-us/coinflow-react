"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardType = exports.MerchantStyle = exports.SettlementType = void 0;
var SettlementType;
(function (SettlementType) {
    SettlementType["Credits"] = "Credits";
    SettlementType["USDC"] = "USDC";
    SettlementType["Bank"] = "Bank";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
var MerchantStyle;
(function (MerchantStyle) {
    MerchantStyle["Rounded"] = "rounded";
    MerchantStyle["Sharp"] = "sharp";
    MerchantStyle["Pill"] = "pill";
})(MerchantStyle || (exports.MerchantStyle = MerchantStyle = {}));
var CardType;
(function (CardType) {
    CardType["VISA"] = "VISA";
    CardType["MASTERCARD"] = "MSTR";
    CardType["AMEX"] = "AMEX";
    CardType["DISCOVER"] = "DISC";
})(CardType || (exports.CardType = CardType = {}));
//# sourceMappingURL=CoinflowTypes.js.map