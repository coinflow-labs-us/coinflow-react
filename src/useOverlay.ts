import {type RefObject, useEffect, useState} from 'react';
import {CoinflowIFrameExposedFunctions} from './CoinflowIFrame';

export function useOverlay(
  iframeRef: RefObject<CoinflowIFrameExposedFunctions | null> | null
) {
  const [messageReceived, setMessageReceived] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    iframeRef?.current
      ?.listenForMessage(message => {
        try {
          const res = JSON.parse(message);
          return 'method' in res && res.method === 'loaded';
        } catch (e) {
          return false;
        }
      })
      .then(() => {
        setMessageReceived(true);
        setShowOverlay(false);
      });
  }, [iframeRef]);

  const opacity = messageReceived ? 1 : 0.8;
  const display = showOverlay ? 'flex' : 'none';

  return {messageReceived, showOverlay, opacity, display};
}
