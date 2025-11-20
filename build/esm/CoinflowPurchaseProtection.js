import { useEffect, useMemo, useState } from 'react';
import { CoinflowUtils } from './common';
import nsureSDK from '@nsure-ai/web-client-sdk';
export function CoinflowPurchaseProtection(_a) {
    var coinflowEnv = _a.coinflowEnv, merchantId = _a.merchantId;
    var appId = useMemo(function () {
        return coinflowEnv === 'prod'
            ? '9JBW2RHC7JNJN8ZQ'
            : 'SANDBOX_CTCE4XK53ZW0R7V1';
    }, [coinflowEnv]);
    var _b = useState(undefined), partnerId = _b[0], setPartnerId = _b[1];
    useEffect(function () {
        new CoinflowUtils(coinflowEnv)
            .getNSurePartnerId(merchantId)
            .then(function (partnerId) { return setPartnerId(partnerId); });
    }, [merchantId, coinflowEnv]);
    useEffect(function () {
        if (partnerId) {
            nsureSDK.init(appId, partnerId);
        }
    }, [partnerId, appId]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map