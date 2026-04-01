"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinflowPurchaseProtection = CoinflowPurchaseProtection;
const react_1 = require("react");
const common_1 = require("./common");
function CoinflowPurchaseProtection({ coinflowEnv, merchantId, }) {
    (0, react_1.useEffect)(() => {
        (0, common_1.initCoinflowProtection)({ coinflowEnv, merchantId });
    }, [coinflowEnv, merchantId]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map