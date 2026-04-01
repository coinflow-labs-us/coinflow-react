import {CoinflowEnvs} from './CoinflowTypes';
import {recordFrontendError} from './CoinflowUtils';

declare global {
  interface Window {
    Verisoul?: {
      session: () => Promise<{session_id: string}>;
    };
  }
}

let cachedSessionId: string | null = null;

export async function initProtectionSession({
  merchantId,
  env,
}: {
  merchantId: string;
  env: CoinflowEnvs;
}): Promise<void> {
  if (cachedSessionId) return;

  if (typeof window !== 'undefined') {
    try {
      const result = await window.Verisoul?.session();
      if (result?.session_id) cachedSessionId = result.session_id;
    } catch (e) {
      console.error(e);
      recordFrontendError({event: 'ProtectionInit', env, merchantId, error: e});
    }
  }
}

export function getProtectionSessionId(): string | null {
  return cachedSessionId;
}

export default getProtectionSessionId;
