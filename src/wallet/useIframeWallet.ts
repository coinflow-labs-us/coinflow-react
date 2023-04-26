import {useCallback, useEffect, useRef} from 'react';
import {IFrameMessageHandlers, WalletCall} from './SolanaIFrameMessageHandlers';
import {CoinflowEnvs, OnSuccessMethod} from '../CoinflowTypes';
import {disconnectSocket, initiateSocket, sendWebsocketMessage, subscribeToChat} from './SocketService';

export function useIframeWallet(
  {
    handleSignTransaction,
    handleSendTransaction,
    handleSignMessage,
  }: IFrameMessageHandlers,
  {onSuccess, handleHeightChange, useSocket, env}: {
    onSuccess?: OnSuccessMethod,
    handleHeightChange?: (height: string) => void,
    useSocket?: boolean,
    env?: CoinflowEnvs,
  },
  walletPubkey: string | null | undefined
) {
  const IFrameRef = useRef<HTMLIFrameElement | null>(null);

  const sendIFrameMessage = useCallback(
    (message: string) => {
      if (useSocket) {
        if (!walletPubkey) return;
        sendWebsocketMessage(message);
        return;
      }

      if (!IFrameRef?.current?.contentWindow)
        throw new Error('Iframe not defined');

      IFrameRef.current?.contentWindow.postMessage(message, '*');
    },
    [useSocket, walletPubkey]
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
    [handleSendTransaction, sendIFrameMessage, onSuccess, handleSignTransaction, handleSignMessage, handleHeightChange]
  );

  useEffect(() => {
    if (useSocket) {
      if (!walletPubkey) return;
      initiateSocket(walletPubkey, env);
      subscribeToChat(data => handleIframeMessages({data}));
      return () => disconnectSocket();
    }

    if (!window) throw new Error('Window not defined');
    window.onmessage = handleIframeMessages;
    return () => {};
  }, [env, handleIframeMessages, useSocket, walletPubkey]);

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
