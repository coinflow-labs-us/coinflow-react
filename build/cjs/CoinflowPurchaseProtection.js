"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
exports.CoinflowPurchaseProtection = CoinflowPurchaseProtection;
const react_1 = require("react");
const common_1 = require("./common");
const web_client_sdk_1 = tslib_1.__importDefault(require("@nsure-ai/web-client-sdk"));
function CoinflowPurchaseProtection({ coinflowEnv, merchantId, }) {
    const appId = (0, react_1.useMemo)(() => {
        return coinflowEnv === 'prod'
            ? '9JBW2RHC7JNJN8ZQ'
            : 'SANDBOX_CTCE4XK53ZW0R7V1';
    }, [coinflowEnv]);
    const [partnerId, setPartnerId] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        new common_1.CoinflowUtils(coinflowEnv)
            .getNSurePartnerId(merchantId)
            .then(partnerId => setPartnerId(partnerId));
    }, [merchantId, coinflowEnv]);
    (0, react_1.useEffect)(() => {
        if (partnerId) {
            web_client_sdk_1.default.init(appId, partnerId);
        }
    }, [partnerId, appId]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map