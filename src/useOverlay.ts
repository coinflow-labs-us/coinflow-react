import React, {useEffect} from 'react';
import {CoinflowIFrameExposedFunctions} from './CoinflowIFrame';

export function useOverlay(
  iframeRef: React.RefObject<CoinflowIFrameExposedFunctions> | null
) {
  const [messageReceived, setMessageReceived] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(true);

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
        setTimeout(() => {
          setShowOverlay(false);
        }, 2_000);
      });
  }, [iframeRef]);

  const opacity = messageReceived ? 1 : 0.8;
  const display = showOverlay ? 'flex' : 'none';

  return {messageReceived, showOverlay, opacity, display};
}
