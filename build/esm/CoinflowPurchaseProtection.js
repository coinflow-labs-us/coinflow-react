import { useEffect } from 'react';
import { initCoinflowProtection } from './common';
export function CoinflowPurchaseProtection({ coinflowEnv, merchantId, }) {
    useEffect(() => {
        initCoinflowProtection({ coinflowEnv, merchantId });
    }, [coinflowEnv, merchantId]);
    return null;
}
//# sourceMappingURL=CoinflowPurchaseProtection.js.map