import {
  CoinflowBlockchain,
  CoinflowPurchaseProps,
  EthWallet,
  NearWallet,
  OnSuccessMethod,
  SolanaWallet,
  WalletTypes,
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
  Loaded = 'loaded',
}

export function getWalletPubkey(
  input: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain'>
): string | null | undefined {
  let wallet: WalletTypes | undefined;
  if (
    'signer' in input &&
    typeof input.signer === 'object' &&
    input.signer &&
    'wallet' in input.signer
  )
    wallet = input.signer.wallet as WalletTypes;
  else if ('wallet' in input && input.wallet) wallet = input.wallet;

  if (!wallet) return;

  if (typeof wallet === 'string') return wallet;

  if (typeof wallet === 'object') {
    if ('publicKey' in wallet)
      return wallet.publicKey ? wallet.publicKey.toString() : undefined;

    if ('address' in wallet)
      return wallet.address ? (wallet.address as string) : undefined;

    if ('accountId' in wallet)
      return wallet.accountId ? (wallet.accountId as string) : undefined;
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
    case IFrameMessageMethods.Loaded:
      return;
  }

  console.warn(
    `Didn't expect to get here, handleIFrameMessage method:${method} is not one of ${Object.values(IFrameMessageMethods)}`
  );
}

export function getHandlers(
  props: Pick<CoinflowPurchaseProps, 'wallet' | 'blockchain' | 'onSuccess'>
): Omit<IFrameMessageHandlers, 'handleHeightChange'> {
  let chain: CoinflowBlockchain | undefined;
  let wallet: WalletTypes | undefined;
  if (
    'signer' in props &&
    typeof props.signer === 'object' &&
    props.signer &&
    'blockchain' in props.signer &&
    'wallet' in props.signer
  ) {
    chain = props.signer.blockchain as CoinflowBlockchain;
    wallet = props.signer.wallet as WalletTypes;
  } else if ('blockchain' in props && props.blockchain) {
    chain = props.blockchain;
    wallet = props.wallet;
  }

  if (!chain) {
    return {
      handleSendTransaction: () => {
        throw new Error('handleSendTransaction Not Implemented');
      },
      handleSignMessage: () => {
        throw new Error('handleSendTransaction Not Implemented');
      },
      handleSignTransaction: () => {
        throw new Error('handleSendTransaction Not Implemented');
      },
      onSuccess: props.onSuccess,
    };
  }

  return CoinflowUtils.byBlockchain(chain, {
    solana: () =>
      getSolanaWalletHandlers({
        wallet: wallet as SolanaWallet,
        onSuccess: props.onSuccess,
      }),
    near: () =>
      getNearWalletHandlers({
        wallet: wallet as NearWallet,
        onSuccess: props.onSuccess,
      }),
    eth: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
      }),
    polygon: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
      }),
    base: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
      }),
    arbitrum: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
      }),
    user: () => getSessionKeyHandlers(props),
  })();
}

function getSolanaWalletHandlers({
  wallet,
  onSuccess,
}: {
  wallet: SolanaWallet;
  onSuccess?: OnSuccessMethod;
}): Omit<IFrameMessageHandlers, 'handleHeightChange'> {
  return {
    handleSendTransaction: async (transaction: string) => {
      const tx = getSolanaTransaction(transaction);
      return await wallet.sendTransaction(tx);
    },
    handleSignMessage: async (message: string) => {
      const signMessage = wallet.signMessage;
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
      const signTransaction = wallet.signTransaction;
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
}: {
  wallet: NearWallet;
  onSuccess?: OnSuccessMethod;
}): Omit<IFrameMessageHandlers, 'handleHeightChange'> {
  return {
    handleSendTransaction: async (transaction: string) => {
      const action = JSON.parse(Buffer.from(transaction, 'base64').toString());
      const executionOutcome = await wallet.signAndSendTransaction(action);
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
}: {
  wallet: EthWallet;
  onSuccess?: OnSuccessMethod;
}): Omit<IFrameMessageHandlers, 'handleHeightChange'> {
  return {
    handleSendTransaction: async (transaction: string) => {
      const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
      const {hash} = await wallet.sendTransaction(tx);
      return hash;
    },
    handleSignMessage: async (message: string) => {
      return wallet.signMessage(message);
    },
    onSuccess,
  };
}

function getSessionKeyHandlers({
  onSuccess,
}: Pick<CoinflowPurchaseProps, 'onSuccess'>): Omit<
  IFrameMessageHandlers,
  'handleHeightChange'
> {
  return {
    handleSendTransaction: async () => {
      return Promise.resolve('');
    },
    onSuccess,
  };
}
