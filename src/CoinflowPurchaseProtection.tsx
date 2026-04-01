import {useEffect} from 'react';
import {CoinflowEnvs, initCoinflowProtection} from './common';

export function CoinflowPurchaseProtection({
  coinflowEnv,
  merchantId,
}: {
  coinflowEnv: CoinflowEnvs;
  merchantId: string;
}) {
  useEffect(() => {
    initCoinflowProtection({coinflowEnv, merchantId});
  }, [coinflowEnv, merchantId]);

  return null;
}
