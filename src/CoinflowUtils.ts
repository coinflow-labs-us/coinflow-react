import type {Transaction, VersionedTransaction} from '@solana/web3.js';
import base58 from 'bs58';
import {
  CoinflowBlockchain,
  CoinflowEnvs,
  CoinflowIFrameProps,
  SolanaWallet,
} from './CoinflowTypes';

export class CoinflowUtils {
  env: CoinflowEnvs;
  url: string;

  constructor(env?: CoinflowEnvs) {
    this.env = env ?? 'prod';
    if (this.env === 'prod') this.url = 'https://api.coinflow.cash';
    else if (this.env === 'local') this.url = 'http://localhost:5000';
    else this.url = `https://api-${this.env}.coinflow.cash`;
  }

  async getNSurePartnerId(merchantId: string): Promise<string | undefined> {
    return fetch(this.url + `/merchant/view/${merchantId}`)
      .then(response => response.json())
      .then(
        (json: {
          nSurePartnerId: string | undefined;
          nSureSettings: {nSurePartnerId: string | undefined};
        }) => json.nSureSettings?.nSurePartnerId || json.nSurePartnerId
      )
      .catch(e => {
        console.error(e);
        return undefined;
      });
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
    routePrefix,
    env,
    amount,
    transaction,
    blockchain,
    supportsVersionedTransactions,
    webhookInfo,
    email,
    loaderBackground,
    handleHeightChange,
    useSocket,
    bankAccountLinkRedirect,
    additionalWallets,
    nearDeposit,
    chargebackProtectionData,
    merchantCss,
    color,
    rent,
    lockDefaultToken,
    tokens,
  }: CoinflowIFrameProps): string {
    const prefix = routePrefix
      ? `/${routePrefix}/${blockchain}`
      : `/${blockchain}`;
    const url = new URL(prefix + route, CoinflowUtils.getCoinflowBaseUrl(env));
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

    if (tokens) {
      url.searchParams.append('tokens', tokens.toString());
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

    if (bankAccountLinkRedirect) {
      url.searchParams.append(
        'bankAccountLinkRedirect',
        bankAccountLinkRedirect
      );
    }

    if (additionalWallets)
      url.searchParams.append(
        'additionalWallets',
        JSON.stringify(additionalWallets)
      );

    if (nearDeposit) url.searchParams.append('nearDeposit', nearDeposit);

    if (chargebackProtectionData)
      url.searchParams.append(
        'chargebackProtectionData',
        JSON.stringify(chargebackProtectionData)
      );
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const deviceId = window?.nSureSDK?.getDeviceId();
      if (deviceId) url.searchParams.append('deviceId', deviceId);
    }

    if (merchantCss) url.searchParams.append('merchantCss', merchantCss);
    if (color) url.searchParams.append('color', color);
    if (rent) url.searchParams.append('rent', rent.lamports.toString());
    if (lockDefaultToken) url.searchParams.append('lockDefaultToken', 'true');

    return url.toString();
  }

  static serializeSolanaTransaction(
    transaction: Transaction | VersionedTransaction | undefined
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
