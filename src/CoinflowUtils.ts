import type {Transaction} from '@solana/web3.js';
import base58 from 'bs58';
import {CoinflowBlockchain, CoinflowEnvs, CoinflowIFrameProps, SolanaWallet} from './CoinflowTypes';

export class CoinflowUtils {
  env: CoinflowEnvs;
  url: string;

  constructor(env?: CoinflowEnvs) {
    this.env = env ?? 'prod';
    if (this.env === 'prod') this.url = 'https://api.coinflow.cash';
    else if (this.env === 'local') this.url = 'http://localhost:5000';
    else this.url = `https://api-${this.env}.coinflow.cash`;
  }

  async getFeePayer(merchantId: string): Promise<string> {
    const response = await fetch(this.url + `/merchant/view/${merchantId}`);
    const json = await response.json();
    return json.feePayerPublicKey;
  }

  async getCreditBalance(
    publicKey: string,
    blockchain: 'solana' | 'near'
  ): Promise<number> {
    const response = await fetch(
      this.url + `/mint/balance/${publicKey}/${blockchain}`
    );
    const {balance} = await response.json();
    return balance;
  }

  static getCoinflowBaseUrl(env?: CoinflowEnvs): string {
    if (!env || env === 'prod') return 'https://coinflow.cash';
    if (env === 'local') return 'http://localhost:3000';

    return `https://${env}.coinflow.cash`;
  }

  static getCoinflowApiUrl(env?: CoinflowEnvs): string {
    if (!env || env === 'prod') return 'https://api.coinflow.cash';
    if (env === 'local') return 'http://localhost:5000';

    return `https://api-${env}.coinflow.cash`;
  }

  static getCoinflowUrl({
    walletPubkey,
    route,
    env,
    amount,
    transaction,
    blockchain,
    supportsVersionedTransactions,
    webhookInfo,
    token,
    email,
    loaderBackground,
    handleHeightChange,
    useSocket,
  }: CoinflowIFrameProps): string {
    const url = new URL(
      `/${blockchain}` + route,
      CoinflowUtils.getCoinflowBaseUrl(env)
    );
    url.searchParams.append('pubkey', walletPubkey);

    if (transaction) {
      url.searchParams.append('transaction', transaction);
    }
    if (amount) {
      url.searchParams.append('amount', amount.toString());
    }

    if (supportsVersionedTransactions) {
      url.searchParams.append('supportsVersionedTransactions', 'true');
    }

    if (webhookInfo) {
      url.searchParams.append(
        'webhookInfo',
        Buffer.from(JSON.stringify(webhookInfo)).toString('base64')
      );
    }

    if (email) {
      url.searchParams.append('email', email);
    }

    if (token) {
      url.searchParams.append('token', token.toString());
    }

    if (loaderBackground) {
      url.searchParams.append('loaderBackground', loaderBackground);
    }

    if (handleHeightChange) {
      url.searchParams.append('useHeightChange', 'true');
    }

    if (useSocket) {
      url.searchParams.append('useSocket', 'true');
    }

    return url.toString();
  }

  static serializeSolanaTransaction(
    transaction: Transaction | undefined
  ): string | undefined {
    if (!transaction) return undefined;

    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    return base58.encode(serializedTx as Uint8Array);
  }

  static solanaWalletSupportsVersionedTransactions(
    wallet: SolanaWallet
  ): boolean {
    return !!wallet.wallet?.adapter?.supportedTransactionVersions?.has(0);
  }

  static byBlockchain<T>(
    blockchain: CoinflowBlockchain,
    args: {solana: T; near: T; eth?: T; polygon: T}
  ): T {
    switch (blockchain) {
      case 'solana':
        return args.solana;
      case 'near':
        return args.near;
      case 'polygon':
        return args.polygon;
      case 'eth':
        if (args.eth === undefined)
          throw new Error('blockchain not supported for this operation!');
        return args.eth;
      default:
        throw new Error('blockchain not supported!');
    }
  }
}
