import {useEffect} from 'react';
import {getMessageHandler} from './wallet/useIframeWallet';

export function useHandleHeightChange(handleHeightChange?: (height: string) => void) {
  useHandleMessages('heightChange', handleHeightChange);
}

export function useHandleMessages(method: string, handle?: (data: string) => void) {
  useEffect(() => {
    if (!handle) return;
    if (!window) throw new Error('Window not defined');
    const handler =  getMessageHandler(method, handle);
    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, [handle, method]);
}
