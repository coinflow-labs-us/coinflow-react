import React, {useMemo} from 'react';
import {CoinflowUtils} from './CoinflowUtils';
import {CoinflowIFrameProps} from './CoinflowTypes';

export function CoinflowIFrame(props: CoinflowIFrameProps) {
  const url = useMemo(() => {
    return CoinflowUtils.getCoinflowUrl(props);
  }, [props]);

  const {handleHeightChange, IFrameRef} = props;
  return useMemo(
    () => (
      <iframe
        scrolling={handleHeightChange ? 'no' : 'yes'}
        onLoad={() => {
          if (IFrameRef.current) IFrameRef.current.style.opacity = '1';
        }}
        allow={'payment;camera'}
        ref={IFrameRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0,
          transition: 'opacity 300ms linear',
        }}
        title="withdraw"
        frameBorder="0"
        src={url}
      />
    ),
    [IFrameRef, handleHeightChange, url]
  );
}
