import { useEffect, useMemo, useState } from 'react';
import { CoinflowUtils } from './common';
export function CoinflowPurchaseProtection(_a) {
    var coinflowEnv = _a.coinflowEnv, merchantId = _a.merchantId;
    var sdkUrl = useMemo(function () {
        return coinflowEnv === 'prod'
            ? 'https://sdk.nsureapi.com/sdk.js'
            : 'https://sdk.nsureapi.com/sdk-sandbox.js';
    }, [coinflowEnv]);
    var applicationId = useMemo(function () {
        return coinflowEnv === 'prod' ? '9JBW2RHC7JNJN8ZQ' : 'SANDBOX_CTCE4XK53ZW0R7V1';
    }, [coinflowEnv]);
    var _b = useState(undefined), partnerId = _b[0], setPartnerId = _b[1];
    useEffect(function () {
        new CoinflowUtils(coinflowEnv)
            .getNSurePartnerId(merchantId)
            .then(function (partnerId) { return setPartnerId(partnerId); });
    }, [coinflowEnv, merchantId]);
    var initializeScript = useMemo(function () {
        return "window.nSureAsyncInit = function(deviceId) {\n              window.nSureSDK.init({\n                appId: '".concat(applicationId, "',\n                partnerId: '").concat(partnerId, "',\n              });\n            };");
    }, [applicationId, partnerId]);
    useEffect(function () {
        if (!partnerId)
            return;
        var initializeScriptTag = document.createElement('script');
        initializeScriptTag.innerHTML = initializeScript;
        document.head.appendChild(initializeScriptTag);
        var sdkScriptTag = document.createElement('script');
        sdkScriptTag.src = sdkUrl;
        document.head.appendChild(sdkScriptTag);
        return function () {
            document.head.removeChild(sdkScriptTag);
            document.head.removeChild(initializeScriptTag);
        };
    }, [initializeScript, partnerId, sdkUrl]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map