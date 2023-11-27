import {useEffect, useMemo, useState} from 'react';
import {CoinflowEnvs} from './CoinflowTypes';
import {CoinflowUtils} from './CoinflowUtils';

export function CoinflowPurchaseProtection({
  coinflowEnv,
  merchantId,
}: {
  coinflowEnv: CoinflowEnvs;
  merchantId: string;
}) {
  const sdkUrl = useMemo(
    () =>
      coinflowEnv === 'prod'
        ? 'https://sdk.nsureapi.com/sdk.js'
        : 'https://sdk.nsureapi.com/sdk-sandbox.js',
    [coinflowEnv]
  );
  const applicationId = useMemo(
    () =>
      coinflowEnv === 'prod' ? '9JBW2RHC7JNJN8ZQ' : 'SANDBOX_CTCE4XK53ZW0R7V1',
    [coinflowEnv]
  );

  const [partnerId, setPartnerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    new CoinflowUtils(coinflowEnv)
      .getNSurePartnerId(merchantId)
      .then(partnerId => setPartnerId(partnerId));
  }, [coinflowEnv, merchantId]);

  const initializeScript = useMemo(() => {
    return `window.nSureAsyncInit = function(deviceId) {
              window.nSureSDK.init({
                appId: '${applicationId}',
                partnerId: '${partnerId}',
              });
            };`;
  }, [applicationId, partnerId]);

  useEffect(() => {
    if (!partnerId) return;

    const initializeScriptTag = document.createElement('script');
    initializeScriptTag.innerHTML = initializeScript;
    document.head.appendChild(initializeScriptTag);

    const sdkScriptTag = document.createElement('script');
    sdkScriptTag.src = sdkUrl;
    document.head.appendChild(sdkScriptTag);
    return () => {
      document.head.removeChild(sdkScriptTag);
      document.head.removeChild(initializeScriptTag);
    };
  }, [initializeScript, partnerId, sdkUrl]);

  return null;
}
