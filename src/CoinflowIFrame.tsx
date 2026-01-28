import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CoinflowIFrameProps,
  CoinflowUtils,
  handleIFrameMessage,
  IFrameMessageHandlers,
} from './common';

export type SendAndReceiveMessage = (
  message: string,
  isResponseValid: (response: string) => boolean
) => Promise<string>;
export type CoinflowIFrameExposedFunctions = {
  sendAndReceiveMessage: SendAndReceiveMessage;
  listenForMessage: (
    isResponseValid: (response: string) => boolean
  ) => Promise<string>;
};

export function useRandomHandleHeightChangeId() {
  return useMemo(() => Math.random().toString(16).substring(2), []);
}

export const CoinflowIFrame = forwardRef(
  (props: CoinflowIFrameProps & IFrameMessageHandlers, ref) => {
    const IFrameRef = useRef<HTMLIFrameElement | null>(null);

    const url = useMemo(() => {
      return CoinflowUtils.getCoinflowUrl(props);
    }, [props]);

    const sendMessage = useCallback((message: string) => {
      if (!IFrameRef?.current?.contentWindow)
        throw new Error('Iframe not defined');
      IFrameRef.current.contentWindow.postMessage(message, '*');
    }, []);

    useImperativeHandle<unknown, CoinflowIFrameExposedFunctions>(ref, () => ({
      async listenForMessage(
        isResponseValid: (response: string) => boolean
      ): Promise<string> {
        let handler: ({data, origin}: {data: string; origin: string}) => void;
        return new Promise<string>((resolve, reject) => {
          handler = ({data, origin}: {data: string; origin: string}) => {
            if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(props.env)))
              return;

            if (data.startsWith('ERROR')) {
              reject(new Error(data.replace('ERROR', '')));
              return;
            }

            if (!isResponseValid(data)) return;
            resolve(data);
          };

          if (!window) throw new Error('Window not defined');
          window.addEventListener('message', handler);
        }).finally(() => {
          window.removeEventListener('message', handler);
        });
      },

      async sendAndReceiveMessage(
        message: string,
        isResponseValid: (response: string) => boolean
      ): Promise<string> {
        sendMessage(message);
        return this.listenForMessage(isResponseValid);
      },
    }));

    const handleIframeMessages = useCallback(
      ({data, origin}: {data: string; origin: string}) => {
        if (!origin.includes(CoinflowUtils.getCoinflowBaseUrl(props.env)))
          return;

        const promise = handleIFrameMessage(
          data,
          props,
          props.handleHeightChangeId
        );
        if (!promise) return;
        promise.then(sendMessage).catch(e => sendMessage('ERROR ' + e.message));
      },
      [props, sendMessage]
    );

    useEffect(() => {
      if (!window) throw new Error('Window not defined');
      window.addEventListener('message', handleIframeMessages);
      return () => {
        window.removeEventListener('message', handleIframeMessages);
      };
    }, [handleIframeMessages]);

    const [isCredentiallessSet, setIsCredentiallessSet] = useState(false);

    useLayoutEffect(() => {
      if (!IFrameRef.current) return;

      // @ts-expect-error TypeScript doesn't recognize credentialless as a valid attribute in its type definitions yet
      IFrameRef.current.credentialless = true;
      setIsCredentiallessSet(true);
    }, []);

    const {handleHeightChange} = props;
    return useMemo(
      () => (
        <iframe
          scrolling={handleHeightChange ? 'no' : 'yes'}
          onLoad={() => {
            if (IFrameRef.current) IFrameRef.current.style.opacity = '1';
          }}
          allow={'payment;camera;clipboard-write'}
          ref={IFrameRef}
          style={{
            width: '100%',
            height: '100%',
            opacity: 0,
            transition: 'opacity 300ms linear',
          }}
          title="withdraw"
          frameBorder="0"
          src={isCredentiallessSet ? url : undefined}
        />
      ),
      [IFrameRef, handleHeightChange, isCredentiallessSet, url]
    );
  }
);
