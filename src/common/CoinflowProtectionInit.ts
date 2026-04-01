import nsureSDK from '@nsure-ai/web-client-sdk';
import {CoinflowUtils, recordFrontendError} from './CoinflowUtils';
import {initProtectionSession} from './CoinflowProtectionSession';
import {CoinflowEnvs} from './CoinflowTypes';

const NSURE_APP_IDS: Record<string, string> = {
  prod: '9JBW2RHC7JNJN8ZQ',
  sandbox: 'SANDBOX_CTCE4XK53ZW0R7V1',
};

const PROTECTION_SESSION_PROJECT_IDS: Record<string, string> = {
  prod: '315da543-c486-435a-aa21-53844c469822',
  sandbox: 'e9f629c4-80ee-4c6d-967e-62af47d8679e',
};

export async function initCoinflowProtection({
  coinflowEnv,
  merchantId,
}: {
  coinflowEnv: CoinflowEnvs;
  merchantId: string;
}): Promise<void> {
  const env = coinflowEnv === 'prod' ? 'prod' : 'sandbox';

  const hasUrlDeviceId =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('deviceId');

  if (!hasUrlDeviceId) {
    const partnerId = await new CoinflowUtils(coinflowEnv).getNSurePartnerId(
      merchantId
    );
    if (partnerId) {
      const appId = NSURE_APP_IDS[env] ?? NSURE_APP_IDS['sandbox'];
      try {
        nsureSDK.init(appId, partnerId);
      } catch (e) {
        console.error('Failed to initialize nSure SDK:', e);
        recordFrontendError({
          event: 'NSureInit',
          error: e,
          env: coinflowEnv,
          merchantId,
        });
      }
    }
  }

  // Initialize protection session (Verisoul)
  if (typeof document !== 'undefined') {
    const existing = document.querySelector('script[verisoul-project-id]');
    if (!existing) {
      const projectId =
        PROTECTION_SESSION_PROJECT_IDS[env] ??
        PROTECTION_SESSION_PROJECT_IDS['sandbox'];
      if (projectId) {
        await new Promise<void>(resolve => {
          const script = document.createElement('script');
          script.src = `https://js.v.coinflow.sh/${env}/bundle.js`;
          script.async = true;
          script.setAttribute('verisoul-project-id', projectId);
          script.onload = () => {
            initProtectionSession({merchantId, env: coinflowEnv}).then(resolve);
          };
          script.onerror = e => {
            recordFrontendError({
              event: 'ProtectionError',
              error: e,
              env: coinflowEnv,
              merchantId,
            });
            resolve();
          };
          document.head.appendChild(script);
        });
      }
    }
  }
}
