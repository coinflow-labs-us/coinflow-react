import {
  CoinflowBlockchain,
  CoinflowEnvs,
  CoinflowIFrameProps,
  CoinflowPurchaseProps,
  CustomerInfo,
} from './CoinflowTypes';
import {web3, base58} from './SolanaPeerDeps';
import LZString from 'lz-string';
import type {Transaction, VersionedTransaction} from '@solana/web3.js';
import {Currency} from './Subtotal';

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

  static getCoinflowBaseUrl(env?: CoinflowEnvs): string {
    if (!env || env === 'prod') return 'https://coinflow.cash';
    // @ts-expect-error This is for testing
    if (env === 'ngrok') return 'https://coinflow.ngrok.app';
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
    sessionKey,
    route,
    routePrefix,
    env,
    subtotal,
    transaction,
    blockchain = 'solana',
    webhookInfo,
    email,
    loaderBackground,
    handleHeightChangeId,
    bankAccountLinkRedirect,
    additionalWallets,
    nearDeposit,
    chargebackProtectionData,
    merchantCss,
    color,
    rent,
    lockDefaultToken,
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
    threeDsChallengePreference,
    supportEmail,
    destinationAuthKey,
    allowedPaymentMethods,
  }: CoinflowIFrameProps): string {
    const prefix = routePrefix
      ? `/${routePrefix}/${blockchain}`
      : `/${blockchain}`;
    const url = new URL(prefix + route, CoinflowUtils.getCoinflowBaseUrl(env));

    if (walletPubkey) url.searchParams.append('pubkey', walletPubkey);
    if (sessionKey) url.searchParams.append('sessionKey', sessionKey);

    if (transaction) {
      url.searchParams.append('transaction', transaction);
    }

    if (subtotal) {
      if ('cents' in subtotal) {
        url.searchParams.append('cents', subtotal.cents.toString());
        if ('currency' in subtotal) {
          url.searchParams.append('currency', subtotal.currency.toString());
        } else {
          url.searchParams.append('currency', Currency.USD);
        }
      } else {
        url.searchParams.append('token', subtotal.address.toString());
        url.searchParams.append('amount', subtotal.amount.toString());
      }
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
    if (supportEmail) url.searchParams.append('supportEmail', supportEmail);

    if (tokens) {
      url.searchParams.append('tokens', tokens.toString());
    }

    if (loaderBackground) {
      url.searchParams.append('loaderBackground', loaderBackground);
    }

    if (handleHeightChangeId) {
      url.searchParams.append(
        'useHeightChange',
        handleHeightChangeId.toString()
      );
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

    if (allowedPaymentMethods)
      url.searchParams.append(
        'allowedPaymentMethods',
        allowedPaymentMethods.join(',')
      );

    if (threeDsChallengePreference)
      url.searchParams.append(
        'threeDsChallengePreference',
        threeDsChallengePreference
      );

    if (destinationAuthKey)
      url.searchParams.append('destinationAuthKey', destinationAuthKey);

    return url.toString();
  }

  static getTransaction(props: CoinflowPurchaseProps): string | undefined {
    if (!props.blockchain) return undefined;

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
      arbitrum: () => {
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
      user: () => {
        return undefined;
      },
    })();
  }

  static byBlockchain<T>(
    blockchain: CoinflowBlockchain,
    args: {
      solana: T;
      near: T;
      eth: T;
      polygon: T;
      base: T;
      arbitrum: T;
      user: T;
    }
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
      case 'arbitrum':
        return args.arbitrum;
      case 'user':
        return args.user;
      default:
        throw new Error('blockchain not supported!');
    }
  }
}

export interface FullName {
  firstName: string;
  lastName: string;
}

export function getCustomerName(
  info: CustomerInfo | undefined
): FullName | undefined {
  if (!info) return undefined;

  let firstName: string | undefined, lastName: string | undefined;
  if ('name' in info && info.name) {
    firstName = info.name.split(' ')[0];
    lastName = info.name.split(' ').slice(1).join(' ');
  }

  if ('firstName' in info && info.firstName) firstName = info.firstName;

  if ('lastName' in info && info.lastName) lastName = info.lastName;

  if (firstName && lastName)
    return {
      firstName,
      lastName,
    };
  return undefined;
}
