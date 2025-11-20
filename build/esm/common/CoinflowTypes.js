var _a;
export var WithdrawCategory;
(function (WithdrawCategory) {
    WithdrawCategory["USER"] = "user";
    WithdrawCategory["BUSINESS"] = "business";
})(WithdrawCategory || (WithdrawCategory = {}));
export var WithdrawSpeed;
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
})(WithdrawSpeed || (WithdrawSpeed = {}));
export var SettlementType;
(function (SettlementType) {
    SettlementType["Credits"] = "Credits";
    SettlementType["USDC"] = "USDC";
    SettlementType["Bank"] = "Bank";
})(SettlementType || (SettlementType = {}));
export var MerchantStyle;
(function (MerchantStyle) {
    MerchantStyle["Rounded"] = "rounded";
    MerchantStyle["Sharp"] = "sharp";
    MerchantStyle["Pill"] = "pill";
})(MerchantStyle || (MerchantStyle = {}));
export var ThreeDsChallengePreference;
(function (ThreeDsChallengePreference) {
    ThreeDsChallengePreference["NoPreference"] = "NoPreference";
    ThreeDsChallengePreference["Frictionless"] = "Frictionless";
    ThreeDsChallengePreference["Challenge"] = "Challenge";
})(ThreeDsChallengePreference || (ThreeDsChallengePreference = {}));
export var PaymentMethods;
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
    PaymentMethods["instantBankTransfer"] = "instantBankTransfer";
    PaymentMethods["wire"] = "wire";
})(PaymentMethods || (PaymentMethods = {}));
export var paymentMethodLabels = (_a = {},
    _a[PaymentMethods.card] = 'Card',
    _a[PaymentMethods.ach] = 'ACH',
    _a[PaymentMethods.fasterPayments] = 'Faster Payments',
    _a[PaymentMethods.sepa] = 'SEPA',
    _a[PaymentMethods.pix] = 'PIX',
    _a[PaymentMethods.usdc] = 'USDC',
    _a[PaymentMethods.googlePay] = 'Google Pay',
    _a[PaymentMethods.applePay] = 'Apple Pay',
    _a[PaymentMethods.credits] = 'Credits',
    _a[PaymentMethods.crypto] = 'Crypto',
    _a[PaymentMethods.instantBankTransfer] = 'Instant Bank Transfer',
    _a[PaymentMethods.wire] = 'Wire Transfer',
    _a);
export var CardType;
(function (CardType) {
    CardType["VISA"] = "VISA";
    CardType["MASTERCARD"] = "MSTR";
    CardType["AMEX"] = "AMEX";
    CardType["DISCOVER"] = "DISC";
})(CardType || (CardType = {}));
//# sourceMappingURL=CoinflowTypes.js.map