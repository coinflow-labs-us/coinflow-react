import getNSureDeviceId from './NSure';
import {getProtectionSessionId} from './CoinflowProtectionSession';

export const DEVICE_ID_HEADER = 'x-device-id';
export const SESSION_ID_HEADER = 'x-session-id';
export const REFERRER_HEADER = 'x-coinflow-referrer';

export type CoinflowProtectionHeadersType = {
  [DEVICE_ID_HEADER]: string | null;
  [SESSION_ID_HEADER]: string | null;
};

export function getCoinflowProtectionHeaders(): CoinflowProtectionHeadersType {
  return {
    [DEVICE_ID_HEADER]: getNSureDeviceId(),
    [SESSION_ID_HEADER]: getProtectionSessionId(),
  };
}

function getReferrer(): string | null {
  try {
    return document.referrer || null;
  } catch {
    return null;
  }
}

export type CoinflowPurchaseHeadersType = CoinflowProtectionHeadersType & {
  [REFERRER_HEADER]: string | null;
};

export function getCoinflowPurchaseHeaders(): CoinflowPurchaseHeadersType {
  return {
    ...getCoinflowProtectionHeaders(),
    [REFERRER_HEADER]: getReferrer(),
  };
}
