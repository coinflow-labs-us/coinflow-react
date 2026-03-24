"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RN_REDIRECT_MESSAGE_NAME = exports.CardType = exports.paymentMethodLabels = exports.PaymentMethods = exports.ThreeDsChallengePreference = exports.ChargebackProtectionAccountType = exports.MerchantStyle = exports.SettlementType = exports.WithdrawSpeed = exports.WithdrawCategory = void 0;
exports.isZeroAuthVerifyCard = isZeroAuthVerifyCard;
exports.isZeroAuthSavedPaymentMethods = isZeroAuthSavedPaymentMethods;
var WithdrawCategory;
(function (WithdrawCategory) {
    WithdrawCategory["USER"] = "user";
    WithdrawCategory["BUSINESS"] = "business";
})(WithdrawCategory || (exports.WithdrawCategory = WithdrawCategory = {}));
var WithdrawSpeed;
(function (WithdrawSpeed) {
    WithdrawSpeed["ASAP"] = "asap";
    WithdrawSpeed["SAME_DAY"] = "same_day";
    WithdrawSpeed["STANDARD"] = "standard";
    WithdrawSpeed["CARD"] = "card";
    WithdrawSpeed["IBAN"] = "iban";
    WithdrawSpeed["PIX"] = "pix";
    WithdrawSpeed["EFT"] = "eft";
    WithdrawSpeed["VENMO"] = "venmo";
    WithdrawSpeed["PAYPAL"] = "paypal";
    WithdrawSpeed["WIRE"] = "wire";
    WithdrawSpeed["INTERAC"] = "interac";
})(WithdrawSpeed || (exports.WithdrawSpeed = WithdrawSpeed = {}));
var SettlementType;
(function (SettlementType) {
    SettlementType["Credits"] = "Credits";
    SettlementType["USDC"] = "USDC";
    SettlementType["Bank"] = "Bank";
})(SettlementType || (exports.SettlementType = SettlementType = {}));
function isZeroAuthVerifyCard(config) {
    return 'cardToken' in config;
}
function isZeroAuthSavedPaymentMethods(config) {
    return 'disableSavedPaymentMethods' in config;
}
var MerchantStyle;
(function (MerchantStyle) {
    MerchantStyle["Rounded"] = "rounded";
    MerchantStyle["Sharp"] = "sharp";
    MerchantStyle["Pill"] = "pill";
})(MerchantStyle || (exports.MerchantStyle = MerchantStyle = {}));
var ChargebackProtectionAccountType;
(function (ChargebackProtectionAccountType) {
    ChargebackProtectionAccountType["GUEST"] = "guest";
    ChargebackProtectionAccountType["PRIVATE"] = "private";
    ChargebackProtectionAccountType["BUSINESS"] = "business";
})(ChargebackProtectionAccountType || (exports.ChargebackProtectionAccountType = ChargebackProtectionAccountType = {}));
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
    PaymentMethods["crypto"] = "crypto";
    PaymentMethods["wire"] = "wire";
})(PaymentMethods || (exports.PaymentMethods = PaymentMethods = {}));
exports.paymentMethodLabels = {
    [PaymentMethods.card]: 'Card',
    [PaymentMethods.ach]: 'ACH',
    [PaymentMethods.fasterPayments]: 'Faster Payments',
    [PaymentMethods.sepa]: 'SEPA',
    [PaymentMethods.pix]: 'PIX',
    [PaymentMethods.usdc]: 'USDC',
    [PaymentMethods.googlePay]: 'Google Pay',
    [PaymentMethods.applePay]: 'Apple Pay',
    [PaymentMethods.credits]: 'Credits',
    [PaymentMethods.crypto]: 'Crypto',
    [PaymentMethods.wire]: 'Wire Transfer',
};
var CardType;
(function (CardType) {
    CardType["VISA"] = "VISA";
    CardType["MASTERCARD"] = "MSTR";
    CardType["AMEX"] = "AMEX";
    CardType["DISCOVER"] = "DISC";
})(CardType || (exports.CardType = CardType = {}));
exports.RN_REDIRECT_MESSAGE_NAME = 'rnredirect'; // DO NOT CHANGE
//# sourceMappingURL=CoinflowTypes.js.map