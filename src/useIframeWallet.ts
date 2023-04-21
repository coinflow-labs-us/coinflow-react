import {useCallback, useEffect, useRef} from 'react';
import {IFrameMessageHandlers, WalletCall} from './SolanaIFrameMessageHandlers';

export type OnSuccessMethod = (params: string) => void | Promise<void>;

export function useIframeWallet(
  {
    handleSignTransaction,
    handleSendTransaction,
    handleSignMessage,
  }: IFrameMessageHandlers,
  {onSuccess, handleHeightChange}: {
    onSuccess?: OnSuccessMethod,
    handleHeightChange?: (height: string) => void,
  }
) {
  const IFrameRef = useRef<HTMLIFrameElement | null>(null);

  const sendIFrameMessage = useCallback(
    (message: string) => {
      if (!IFrameRef?.current?.contentWindow)
        throw new Error('Iframe not defined');

      IFrameRef.current?.contentWindow.postMessage(message, '*');
    },
    [IFrameRef]
  );

  const handleIframeMessages = useCallback(
    async ({data}: {data: string}) => {
      try {
        let parsedData = parseJSON(data);
        if (!parsedData) return;

        switch (parsedData.method) {
          case 'sendTransaction': {
            const signature = await handleSendTransaction(parsedData);
            sendIFrameMessage(signature);
            break;
          }
          case 'success': {
            if (onSuccess) onSuccess(data);
            break;
          }
          case 'signTransaction': {
            if (!handleSignTransaction)
              throw new Error(
                `This wallet does not support method ${parsedData.method}`
              );

            const signedTransaction = await handleSignTransaction(parsedData);
            sendIFrameMessage(signedTransaction);
            break;
          }
          case 'signMessage': {
            if (!handleSignMessage)
              throw new Error(
                `This wallet does not support method ${parsedData.method}`
              );

            const signedMessage = await handleSignMessage(parsedData);
            sendIFrameMessage(signedMessage);
            break;
          }
          case 'heightChange': {
            handleHeightChange?.(parsedData.data);
            break;
          }
          default: {
            console.error(`Unsupported Wallet Method ${parsedData.method}`);
            break;
          }
        }
      } catch (e) {
        console.error('handleIframeMessages', e);
        try {
          const message = e instanceof Error ? e.message : JSON.stringify(e);
          sendIFrameMessage('ERROR ' + message);
        } catch (e) {
          sendIFrameMessage('ERROR parsing error JSON');
        }
      }
    },
    [
      handleSendTransaction,
      sendIFrameMessage,
      onSuccess,
      handleSignTransaction,
      handleSignMessage,
    ]
  );

  useEffect(() => {
    if (!window) throw new Error('Window not defined');
    window.onmessage = handleIframeMessages;
  }, [handleIframeMessages]);

  return {IFrameRef};
}

function parseJSON(data: string): WalletCall | null {
  try {
    const res = JSON.parse(data);
    if (!res.method) return null;
    if (!res.data) return null;
    return res;
  } catch (e) {
    return null;
  }
}
