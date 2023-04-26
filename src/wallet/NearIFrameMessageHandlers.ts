import {useCallback} from 'react';
import {IFrameMessageHandlers, WalletCall} from './SolanaIFrameMessageHandlers';
import {NearWallet} from '../CoinflowTypes';

export function useNearIFrameMessageHandlers({
  wallet,
}: {
  wallet: NearWallet;
}): IFrameMessageHandlers {
  const handleSendTransaction = useCallback(
    async ({data}: WalletCall) => {
      const action = JSON.parse(Buffer.from(data, 'base64').toString());
      const executionOutcome = await wallet.signAndSendTransaction(action);
      if (!executionOutcome) throw new Error('Transaction did not send');
      const {transaction: transactionResult} = executionOutcome;
      return transactionResult.hash;
    },
    [wallet]
  );

  return {
    handleSendTransaction,
  };
}
