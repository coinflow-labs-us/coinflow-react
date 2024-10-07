import {
  CoinflowPurchaseProps,
  EthWallet,
  NearWallet,
  OnSuccessMethod,
  SolanaWallet,
} from './CoinflowTypes';
import {CoinflowUtils} from './CoinflowUtils';
import type {Transaction, VersionedTransaction} from '@solana/web3.js';
import {web3, base58} from './SolanaPeerDeps';

export type WalletCall =
  | {method: IFrameMessageMethods; data: string}
  | SuccessWalletCall;

type SuccessWalletCall = {
  method: IFrameMessageMethods.Success;
  data: string;
  info: {paymentId: string; hash?: string};
};

export interface IFrameMessageHandlers {
  handleSendTransaction: (transaction: string) => Promise<string>;
  handleSignMessage?: (message: string) => Promise<string>;
  handleSignTransaction?: (transaction: string) => Promise<string>;
  handleHeightChange?: (height: string) => void;
  onSuccess: OnSuccessMethod | undefined;
}

enum IFrameMessageMethods {
  SignMessage = 'signMessage',
  SignTransaction = 'signTransaction',
  SendTransaction = 'sendTransaction',
  HeightChange = 'heightChange',
  Success = 'success',
  Load = 'load',
}

export function getWalletPubkey({
  wallet,
}: Pick<CoinflowPurchaseProps, 'wallet'>): string | null | undefined {
  if ('publicKey' in wallet) {
    return wallet.publicKey!.toString();
  }

  if ('address' in wallet) {
    return wallet.address;
  }

  if ('accountId' in wallet) {
    return wallet.accountId;
  }

  return null;
}

export function handleIFrameMessage(
  rawMessage: string,
  handlers: IFrameMessageHandlers
): Promise<string> | void {
  let walletCall: WalletCall;
  try {
    walletCall = JSON.parse(rawMessage);
    if (!('method' in walletCall) || !('data' in walletCall)) return;
  } catch (e) {
    console.error('handleIFrameMessage JSON parse', e);
    return;
  }

  const {data, method} = walletCall;
  switch (method) {
    case IFrameMessageMethods.SignMessage:
      if (!handlers.handleSignMessage) return;
      return handlers.handleSignMessage(data);
    case IFrameMessageMethods.SignTransaction:
      if (!handlers.handleSignTransaction) return;
      return handlers.handleSignTransaction(data);
    case IFrameMessageMethods.SendTransaction:
      return handlers.handleSendTransaction(data);
    case IFrameMessageMethods.HeightChange:
      if (!handlers.handleHeightChange) return;
      return handlers.handleHeightChange(data);
    case IFrameMessageMethods.Success:
      if (!handlers.onSuccess) return;
      handlers.onSuccess((walletCall as SuccessWalletCall).info);
      return;
  }

  console.warn(
    `Didn't expect to get here, handleIFrameMessage method:${method} is not one of ${Object.values(IFrameMessageMethods)}`
  );
}

export function getHandlers(
  props: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain' | 'onSuccess'>
): Omit<IFrameMessageHandlers, 'handleHeightChange'> {
  return CoinflowUtils.byBlockchain(props.blockchain, {
    solana: () => getSolanaWalletHandlers(props),
    near: () => getNearWalletHandlers(props),
    eth: () => getEvmWalletHandlers(props),
    polygon: () => getEvmWalletHandlers(props),
    base: () => getEvmWalletHandlers(props),
    arbitrum: () => getEvmWalletHandlers(props),
  })();
}

function getSolanaWalletHandlers({
  wallet,
  onSuccess,
}: Pick<CoinflowPurchaseProps, 'wallet' | 'onSuccess'>): Omit<
  IFrameMessageHandlers,
  'handleHeightChange'
> {
  return {
    handleSendTransaction: async (transaction: string) => {
      const tx = getSolanaTransaction(transaction);
      return await (wallet as SolanaWallet).sendTransaction(tx);
    },
    handleSignMessage: async (message: string) => {
      const signMessage = (wallet as SolanaWallet).signMessage;
      if (!signMessage) {
        throw new Error('signMessage is not supported by this wallet');
      }

      const signedMessage = await signMessage(
        new TextEncoder().encode(message)
      );
      if (!base58) throw new Error('bs58 dependency is required');
      return base58.encode(signedMessage);
    },
    handleSignTransaction: async (transaction: string) => {
      const signTransaction = (wallet as SolanaWallet).signTransaction;
      if (!signTransaction) {
        throw new Error('signTransaction is not supported by this wallet');
      }
      const tx = getSolanaTransaction(transaction);
      const signedTransaction = await signTransaction(tx);
      if (!base58) throw new Error('bs58 dependency is required');
      return base58.encode(
        signedTransaction.serialize({
          requireAllSignatures: false,
          verifySignatures: false,
        })
      );
    },
    onSuccess,
  };
}

function getSolanaTransaction(
  data: string
): Transaction | VersionedTransaction {
  if (!web3)
    throw new Error(
      '@solana/web3.js is not defined. Please install @solana/web3.js into your project'
    );

  if (!base58)
    throw new Error(
      'bs58 is not defined. Please install bs58 into your project'
    );

  const parsedUInt8Array = base58.decode(data);
  const vtx = web3.VersionedTransaction.deserialize(parsedUInt8Array);
  if (vtx.version === 'legacy') return web3.Transaction.from(parsedUInt8Array);
  return vtx;
}

function getNearWalletHandlers({
  wallet,
  onSuccess,
}: Pick<CoinflowPurchaseProps, 'wallet' | 'onSuccess'>): Omit<
  IFrameMessageHandlers,
  'handleHeightChange'
> {
  const nearWallet = wallet as NearWallet;
  return {
    handleSendTransaction: async (transaction: string) => {
      const action = JSON.parse(Buffer.from(transaction, 'base64').toString());
      const executionOutcome = await nearWallet.signAndSendTransaction(action);
      if (!executionOutcome) throw new Error('Transaction did not send');
      const {transaction: transactionResult} = executionOutcome;
      return transactionResult.hash;
    },
    onSuccess,
  };
}

function getEvmWalletHandlers({
  wallet,
  onSuccess,
}: Pick<CoinflowPurchaseProps, 'wallet' | 'onSuccess'>): Omit<
  IFrameMessageHandlers,
  'handleHeightChange'
> {
  const evmWallet = wallet as EthWallet;
  return {
    handleSendTransaction: async (transaction: string) => {
      const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
      const {hash} = await evmWallet.sendTransaction(tx);
      return hash;
    },
    handleSignMessage: async (message: string) => {
      return evmWallet.signMessage(message);
    },
    onSuccess,
  };
}
