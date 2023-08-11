import {useEffect, useMemo} from 'react';
import {CoinflowEnvs} from './CoinflowTypes';

export function CoinflowPurchaseProtection({coinflowEnv}: {coinflowEnv: CoinflowEnvs}) {
  const sdkUrl = useMemo(() => coinflowEnv === 'prod' ? 'https://sdk.nsureapi.com/sdk.js' : 'https://sdk.nsureapi.com/sdk-sandbox.js', [coinflowEnv]);
  const applicationId = useMemo(() => coinflowEnv === 'prod' ? 'coinflow' : 'SANDBOX_CTCE4XK53ZW0R7V1', [coinflowEnv]);

  const initializeScript = useMemo(() => {
    return `window.nSureAsyncInit = function(deviceId) {
              window.nSureSDK.init('${applicationId}');
            };`;
  }, [applicationId]);

  useEffect(() => {
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
  }, [initializeScript, sdkUrl]);

  return null;
}
