import {useCallback} from 'react';
import base58 from 'bs58';
import type {Connection, Signer, Transaction, VersionedTransaction} from '@solana/web3.js';
import {SolanaWallet} from '../CoinflowTypes';

export type WalletCall = {method: string; data: string};

export type SolanaIFrameWalletProps = {
  wallet: SolanaWallet;
  connection: Connection;
  partialSigners?: Signer[];
  debugTx?: boolean;
};

export type IFrameMessageHandlers = {
  handleSignMessage?: ({data}: WalletCall) => Promise<string>;
  handleSignTransaction?: ({data}: WalletCall) => Promise<string>;
  handleSendTransaction: ({data}: WalletCall) => Promise<string>;
  handleHeightChange?: (height: string) => void;
};

export function useSolanaIFrameMessageHandlers({
  wallet,
  connection,
  partialSigners,
  debugTx = false,
}: SolanaIFrameWalletProps): IFrameMessageHandlers {
  const sendTransactionDebug = useCallback(
    async (tx: Transaction | VersionedTransaction) => {
      if (!wallet.signTransaction)
        throw new Error('Wallet does not support sign transaction');

      const signedTx = await wallet.signTransaction(tx);
      const serializedTx = signedTx.serialize();
      const { value: simulation } = await connection.simulateTransaction(signedTx as Transaction);
      console.log('simulation logs:');
      for (const log of simulation.logs ?? []) {
        console.log(log);
      }
      const signature = await connection.sendRawTransaction(serializedTx, {
        skipPreflight: true,
      });
      console.log('signature', signature);
      return signature;
    },
    [connection, wallet]
  );

  function getTransaction(data: string): Transaction | VersionedTransaction {
    let web3;
    try {
      web3 = require('@solana/web3.js');
    } catch (e) {
      web3 = null;
    }

    if (!web3)
      throw new Error('web3 is not defined. Please install @solana/web3.js into your project');

    const parsedUInt8Array = base58.decode(data);
    const vtx = web3.VersionedTransaction.deserialize(parsedUInt8Array);
    if (vtx.version === 'legacy') return web3.Transaction.from(parsedUInt8Array);
    return vtx;
  }

  function partiallySign(signer: Signer, tx: Transaction | VersionedTransaction) {
    const isLegacyTx = 'instructions' in tx;
    if (isLegacyTx) {
      const requiredSignatures = tx.signatures.map(sig =>
        sig.publicKey.toString()
      );
      const shouldSign = requiredSignatures.includes(
        signer.publicKey.toString()
      );
      if (shouldSign) tx.partialSign(signer);
      return;
    }

    // Will this work??
    const signerPubkeys = tx.message.staticAccountKeys
      .slice(0, tx.message.header.numRequiredSignatures)
      .map(pk => pk.toString());
    const shouldSign = signerPubkeys.includes(signer.publicKey.toString());
    if (shouldSign) tx.sign([signer]);
  }

  const handleSendTransaction = useCallback(
    async ({data}: WalletCall) => {
      const tx = getTransaction(data);
      if (partialSigners)
        partialSigners.forEach(signer => partiallySign(signer, tx));

      if (debugTx) {
        return await sendTransactionDebug(tx);
      }

      return await wallet.sendTransaction(tx, connection);
    },
    [connection, debugTx, partialSigners, sendTransactionDebug, wallet]
  );

  const handleSignTransaction = useCallback(
    async ({data}: WalletCall) => {
      if (!wallet.signTransaction) {
        throw new Error('signTransaction is not supported by this wallet');
      }

      const tx = getTransaction(data);
      if (partialSigners) {
        partialSigners.forEach(signer => partiallySign(signer, tx));
      }

      const signedTransaction = await wallet.signTransaction(tx);
      return base58.encode(
        signedTransaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
      );
    },
    [partialSigners, wallet]
  );

  return {
    handleSignTransaction,
    handleSendTransaction,
  };
}
