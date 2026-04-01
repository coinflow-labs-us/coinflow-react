import getNSureDeviceId from './NSure';
import {getProtectionSessionId} from './CoinflowProtectionSession';

export const DEVICE_ID_HEADER = 'x-device-id';
export const SESSION_ID_HEADER = 'x-session-id';

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
