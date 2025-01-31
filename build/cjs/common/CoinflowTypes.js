"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardType = exports.PaymentMethods = exports.ThreeDsChallengePreference = exports.MerchantStyle = exports.SettlementType = void 0;
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
var ThreeDsChallengePreference;
(function (ThreeDsChallengePreference) {
    ThreeDsChallengePreference["NoPreference"] = "NoPreference";
    ThreeDsChallengePreference["Frictionless"] = "Frictionless";
    ThreeDsChallengePreference["Challenge"] = "Challenge";
})(ThreeDsChallengePreference || (exports.ThreeDsChallengePreference = ThreeDsChallengePreference = {}));
var PaymentMethods;
(function (PaymentMethods) {
    PaymentMethods["card"] = "card";
    PaymentMethods["ach"] = "ach";
    PaymentMethods["fasterPayments"] = "fasterPayments";
    PaymentMethods["sepa"] = "sepa";
    PaymentMethods["pix"] = "pix";
    PaymentMethods["usdc"] = "usdc";
    PaymentMethods["googlePay"] = "googlePay";
    PaymentMethods["applePay"] = "applePay";
    PaymentMethods["credits"] = "credits";
})(PaymentMethods || (exports.PaymentMethods = PaymentMethods = {}));
var CardType;
(function (CardType) {
    CardType["VISA"] = "VISA";
    CardType["MASTERCARD"] = "MSTR";
    CardType["AMEX"] = "AMEX";
    CardType["DISCOVER"] = "DISC";
})(CardType || (exports.CardType = CardType = {}));
//# sourceMappingURL=CoinflowTypes.js.map