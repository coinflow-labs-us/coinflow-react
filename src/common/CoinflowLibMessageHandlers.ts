import {
  AuthDeclinedWalletCallInfo,
  CoinflowBlockchain,
  CoinflowPurchaseProps,
  EthWallet,
  NearWallet,
  OnAuthDeclinedMethod,
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

type AuthDeclinedWalletCall = {
  method: IFrameMessageMethods.AuthDeclined;
  data: string;
  info: AuthDeclinedWalletCallInfo;
};

export interface IFrameMessageHandlers {
  handleSendTransaction: (transaction: string) => Promise<string>;
  handleSignMessage?: (message: string) => Promise<string>;
  handleSignTransaction?: (transaction: string) => Promise<string>;
  handleHeightChange?: (height: string) => void;
  onSuccess: OnSuccessMethod | undefined;
  onAuthDeclined: OnAuthDeclinedMethod | undefined;
}

export enum IFrameMessageMethods {
  SignMessage = 'signMessage',
  SignTransaction = 'signTransaction',
  SendTransaction = 'sendTransaction',
  HeightChange = 'heightChange',
  Success = 'success',
  AuthDeclined = 'authDeclined',
  Loaded = 'loaded',
  AccountLinked = 'accountLinked',
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
  handlers: IFrameMessageHandlers,
  handleHeightChangeId: string | number
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
    case IFrameMessageMethods.HeightChange + ':' + handleHeightChangeId:
      if (!handlers.handleHeightChange) return;
      return handlers.handleHeightChange(data);
    case IFrameMessageMethods.Success:
      if (!handlers.onSuccess) return;
      handlers.onSuccess((walletCall as SuccessWalletCall).info);
      return;
    case IFrameMessageMethods.AuthDeclined:
      if (!handlers.onAuthDeclined) return;
      handlers.onAuthDeclined((walletCall as AuthDeclinedWalletCall).info);
      return;
    case IFrameMessageMethods.Loaded:
      return;
    case IFrameMessageMethods.AccountLinked:
      return;
  }

  console.warn(
    `Didn't expect to get here, handleIFrameMessage method:${method} is not one of ${Object.values(IFrameMessageMethods)}`
  );
}

export function getHandlers(
  props: Pick<
    CoinflowPurchaseProps,
    'wallet' | 'blockchain' | 'onSuccess' | 'onAuthDeclined'
  >
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
      onAuthDeclined: props.onAuthDeclined,
    };
  }

  return CoinflowUtils.byBlockchain(chain, {
    solana: () =>
      getSolanaWalletHandlers({
        wallet: wallet as SolanaWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    near: () =>
      getNearWalletHandlers({
        wallet: wallet as NearWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    eth: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    polygon: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    base: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    arbitrum: () =>
      getEvmWalletHandlers({
        wallet: wallet as EthWallet,
        onSuccess: props.onSuccess,
        onAuthDeclined: props.onAuthDeclined,
      }),
    user: () => getSessionKeyHandlers(props),
  })();
}

function getSolanaWalletHandlers({
  wallet,
  onSuccess,
  onAuthDeclined,
}: {
  wallet: SolanaWallet;
  onSuccess: OnSuccessMethod | undefined;
  onAuthDeclined: OnAuthDeclinedMethod | undefined;
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
    onAuthDeclined,
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
  onAuthDeclined,
}: {
  wallet: NearWallet;
  onSuccess?: OnSuccessMethod;
  onAuthDeclined: OnAuthDeclinedMethod | undefined;
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
    onAuthDeclined,
  };
}

function getEvmWalletHandlers({
  wallet,
  onSuccess,
  onAuthDeclined,
}: {
  wallet: EthWallet;
  onSuccess?: OnSuccessMethod;
  onAuthDeclined: OnAuthDeclinedMethod | undefined;
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
    onAuthDeclined,
  };
}

function getSessionKeyHandlers({
  onSuccess,
  onAuthDeclined,
}: Pick<CoinflowPurchaseProps, 'onSuccess' | 'onAuthDeclined'>): Omit<
  IFrameMessageHandlers,
  'handleHeightChange'
> {
  return {
    handleSendTransaction: async () => {
      return Promise.resolve('');
    },
    onSuccess,
    onAuthDeclined,
  };
}
