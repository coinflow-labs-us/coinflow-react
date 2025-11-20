"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchaseProtection = CoinflowPurchaseProtection;
var tslib_1 = require("tslib");
var react_1 = require("react");
var common_1 = require("./common");
var web_client_sdk_1 = tslib_1.__importDefault(require("@nsure-ai/web-client-sdk"));
function CoinflowPurchaseProtection(_a) {
    var coinflowEnv = _a.coinflowEnv, merchantId = _a.merchantId;
    var appId = (0, react_1.useMemo)(function () {
        return coinflowEnv === 'prod'
            ? '9JBW2RHC7JNJN8ZQ'
            : 'SANDBOX_CTCE4XK53ZW0R7V1';
    }, [coinflowEnv]);
    var _b = (0, react_1.useState)(undefined), partnerId = _b[0], setPartnerId = _b[1];
    (0, react_1.useEffect)(function () {
        new common_1.CoinflowUtils(coinflowEnv)
            .getNSurePartnerId(merchantId)
            .then(function (partnerId) { return setPartnerId(partnerId); });
    }, [merchantId, coinflowEnv]);
    (0, react_1.useEffect)(function () {
        if (partnerId) {
            web_client_sdk_1.default.init(appId, partnerId);
        }
    }, [partnerId, appId]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map