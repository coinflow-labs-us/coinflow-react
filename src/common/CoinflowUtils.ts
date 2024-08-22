import {
  CoinflowBlockchain,
  CoinflowEnvs,
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  SolanaWallet,
} from './CoinflowTypes';
import {web3, base58} from './SolanaPeerDeps';
import LZString from 'lz-string';
import {Keypair, Transaction, VersionedTransaction} from '@solana/web3.js';
import {sign} from 'tweetnacl';

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
    merchantId: string,
    blockchain: 'solana' | 'near'
  ): Promise<{cents: number}> {
    const response = await fetch(
      this.url + `/api/customer/balances/${merchantId}`,
      {
        method: 'GET',
        headers: {
          'x-coinflow-auth-wallet': publicKey,
          'x-coinflow-auth-blockchain': blockchain,
        },
      }
    );
    const {credits} = await response.json();
    return credits;
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
    webhookInfo,
    email,
    loaderBackground,
    handleHeightChange,
    bankAccountLinkRedirect,
    additionalWallets,
    nearDeposit,
    chargebackProtectionData,
    merchantCss,
    color,
    rent,
    lockDefaultToken,
    token,
    tokens,
    planCode,
    disableApplePay,
    disableGooglePay,
    customerInfo,
    settlementType,
    lockAmount,
    nativeSolToConvert,
    theme,
    usePermit,
    transactionSigner,
    authOnly,
    deviceId,
    jwtToken,
    origins,
  }: CoinflowIFrameProps): string {
    const prefix = routePrefix
      ? `/${routePrefix}/${blockchain}`
      : `/${blockchain}`;
    const url = new URL(prefix + route, CoinflowUtils.getCoinflowBaseUrl(env));
    url.searchParams.append('pubkey', walletPubkey!);

    if (transaction) {
      url.searchParams.append('transaction', transaction);
    }
    if (amount) {
      url.searchParams.append('amount', amount.toString());
    }

    if (webhookInfo) {
      url.searchParams.append(
        'webhookInfo',
        LZString.compressToEncodedURIComponent(JSON.stringify(webhookInfo))
      );
    }

    if (theme) {
      url.searchParams.append(
        'theme',
        LZString.compressToEncodedURIComponent(JSON.stringify(theme))
      );
    }

    if (customerInfo) {
      url.searchParams.append(
        'customerInfo',
        LZString.compressToEncodedURIComponent(JSON.stringify(customerInfo))
      );
    }

    if (email) {
      url.searchParams.append('email', email);
    }

    if (token) {
      url.searchParams.append('token', token.toString());
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

    if (bankAccountLinkRedirect) {
      url.searchParams.append(
        'bankAccountLinkRedirect',
        bankAccountLinkRedirect
      );
    }

    if (additionalWallets)
      url.searchParams.append(
        'additionalWallets',
        LZString.compressToEncodedURIComponent(
          JSON.stringify(additionalWallets)
        )
      );

    if (nearDeposit) url.searchParams.append('nearDeposit', nearDeposit);

    if (chargebackProtectionData)
      url.searchParams.append(
        'chargebackProtectionData',
        LZString.compressToEncodedURIComponent(
          JSON.stringify(chargebackProtectionData)
        )
      );
    if (deviceId) {
      url.searchParams.append('deviceId', deviceId);
    } else {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const deviceId = window?.nSureSDK?.getDeviceId();
        if (deviceId) url.searchParams.append('deviceId', deviceId);
      }
    }

    if (merchantCss) url.searchParams.append('merchantCss', merchantCss);
    if (color) url.searchParams.append('color', color);
    if (rent) url.searchParams.append('rent', rent.lamports.toString());
    if (nativeSolToConvert)
      url.searchParams.append(
        'nativeSolToConvert',
        nativeSolToConvert.lamports.toString()
      );
    if (lockDefaultToken) url.searchParams.append('lockDefaultToken', 'true');
    if (planCode) url.searchParams.append('planCode', planCode);

    if (disableApplePay) url.searchParams.append('disableApplePay', 'true');
    if (disableGooglePay) url.searchParams.append('disableGooglePay', 'true');
    if (settlementType)
      url.searchParams.append('settlementType', settlementType);

    if (lockAmount) url.searchParams.append('lockAmount', 'true');

    if (usePermit === false) url.searchParams.append('usePermit', 'false');
    if (transactionSigner)
      url.searchParams.append('transactionSigner', transactionSigner);
    if (authOnly === true) url.searchParams.append('authOnly', 'true');
    if (jwtToken) url.searchParams.append('jwtToken', jwtToken);
    if (origins)
      url.searchParams.append(
        'origins',
        LZString.compressToEncodedURIComponent(JSON.stringify(origins))
      );

    return url.toString();
  }

  static getTransaction(props: CoinflowPurchaseProps): string | undefined {
    return this.byBlockchain<() => string | undefined>(props.blockchain, {
      solana: () => {
        if (!('transaction' in props)) return undefined;
        const {transaction} = props;
        if (!web3)
          throw new Error('@solana/web3.js dependency is required for Solana');
        if (!base58) throw new Error('bs58 dependency is required for Solana');
        if (!transaction) return undefined;
        return base58.encode(
          (transaction as VersionedTransaction | Transaction).serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
        );
      },
      polygon: () => {
        if (!('transaction' in props)) return undefined;
        const {transaction} = props;
        return LZString.compressToEncodedURIComponent(
          JSON.stringify(transaction)
        );
      },
      eth: () => {
        if (!('transaction' in props)) return undefined;
        const {transaction} = props;
        return LZString.compressToEncodedURIComponent(
          JSON.stringify(transaction)
        );
      },
      base: () => {
        if (!('transaction' in props)) return undefined;
        const {transaction} = props;
        return LZString.compressToEncodedURIComponent(
          JSON.stringify(transaction)
        );
      },
      near: () => {
        if (!('action' in props)) return undefined;
        const {action} = props;
        return LZString.compressToEncodedURIComponent(JSON.stringify(action));
      },
    })();
  }

  static byBlockchain<T>(
    blockchain: CoinflowBlockchain,
    args: {solana: T; near: T; eth: T; polygon: T; base: T}
  ): T {
    switch (blockchain) {
      case 'solana':
        return args.solana;
      case 'near':
        return args.near;
      case 'polygon':
        return args.polygon;
      case 'eth':
        return args.eth;
      case 'base':
        return args.base;
      default:
        throw new Error('blockchain not supported!');
    }
  }

  static async getWalletFromEmail({
    email,
    merchantId,
    env,
  }: {
    email: string;
    merchantId: string;
    env: CoinflowEnvs;
  }): Promise<SolanaWallet> {
    const buffer = new TextEncoder().encode(email);
    const crypto = window.crypto.subtle;
    const hash = await crypto.digest('SHA-256', buffer);
    const seed = new Uint8Array(hash);
    const keypair = Keypair.fromSeed(seed);
    return {
      publicKey: keypair.publicKey,
      signMessage: (message: Uint8Array) =>
        Promise.resolve(sign.detached(message, keypair.secretKey)),
      signTransaction: async <T extends Transaction | VersionedTransaction>(
        transaction: T
      ): Promise<T> => {
        if (transaction instanceof Transaction) {
          transaction.sign(keypair);
          return transaction;
        } else {
          transaction.sign([keypair]);
          return transaction;
        }
      },
      sendTransaction: async <T extends Transaction | VersionedTransaction>(
        transaction: T
      ): Promise<string> => {
        if (transaction instanceof Transaction) {
          transaction.sign(keypair);
        } else {
          transaction.sign([keypair]);
        }

        const coinflowBaseUrl = this.getCoinflowApiUrl(env);
        const options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-coinflow-auth-wallet': keypair.publicKey.toString(),
            'x-coinflow-auth-blockchain': 'solana',
          },
          body: JSON.stringify({
            merchantId,
            signedTransaction: base58?.encode(transaction.serialize()),
          }),
        };

        const {signature} = await fetch(
          coinflowBaseUrl + '/api/utils/send-coinflow-tx',
          options
        ).then(res => res.json());
        return signature;
      },
    };
  }
}
