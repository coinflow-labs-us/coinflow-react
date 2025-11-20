import {useEffect, useMemo, useState} from 'react';
import {CoinflowEnvs, CoinflowUtils} from './common';
import nsureSDK from '@nsure-ai/web-client-sdk';

export function CoinflowPurchaseProtection({
  coinflowEnv,
  merchantId,
}: {
  coinflowEnv: CoinflowEnvs;
  merchantId: string;
}) {
  const appId = useMemo(() => {
    return coinflowEnv === 'prod'
      ? '9JBW2RHC7JNJN8ZQ'
      : 'SANDBOX_CTCE4XK53ZW0R7V1';
  }, [coinflowEnv]);
  const [partnerId, setPartnerId] = useState<string | undefined>(undefined);
  useEffect(() => {
    new CoinflowUtils(coinflowEnv)
      .getNSurePartnerId(merchantId)
      .then(partnerId => setPartnerId(partnerId));
  }, [merchantId, coinflowEnv]);
  useEffect(() => {
    if (partnerId) {
      nsureSDK.init(appId, partnerId);
    }
  }, [partnerId, appId]);
  return null;
}
