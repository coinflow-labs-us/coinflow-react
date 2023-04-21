import {useCallback} from 'react';
import {IFrameMessageHandlers, WalletCall} from './SolanaIFrameMessageHandlers';
import {EthWallet} from './CoinflowUtils';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function useEthIFrameMessageHandlers({
  wallet,
}: {
  wallet: PartialBy<EthWallet, 'signMessage'>;
}): IFrameMessageHandlers {
  const handleSendTransaction = useCallback(
    async ({data}: WalletCall) => {
      const transaction = JSON.parse(Buffer.from(data, 'base64').toString());
      const {hash} = await wallet.sendTransaction(transaction);
      return hash;
    },
    [wallet]
  );

  const handleSignMessage = useCallback(
    async ({data}: WalletCall) => {
      console.log('handleSignMessage');
      if (!wallet.signMessage)
        throw new Error('Wallet does not support message signing!');

      return await wallet.signMessage(data);
    },
    [wallet]
  );

  return {
    handleSendTransaction,
    handleSignMessage,
  };
}
