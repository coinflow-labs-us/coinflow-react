import {useCallback} from 'react';
import {
  getCoinflowProtectionHeaders,
  CoinflowProtectionHeadersType,
} from './common';

export function useCoinflowProtectionHeaders(): () => CoinflowProtectionHeadersType {
  return useCallback(() => getCoinflowProtectionHeaders(), []);
}
