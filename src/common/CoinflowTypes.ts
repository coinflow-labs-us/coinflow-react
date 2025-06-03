import type {
  Connection,
  VersionedTransaction,
  PublicKey,
  Signer,
  Transaction,
} from '@solana/web3.js';
import {Currency, Subtotal} from './types/Subtotal';
import {GiftCardCartItem} from './types/giftCardCartItem';
import {nftCartItem} from './types/nftCartItem';
import {CryptoCartItem} from './types/cryptoCartItem';
import {MoneyTopUpCartItem} from './types/moneyTopUpCartItem';

export enum SettlementType {
  Credits = 'Credits',
  USDC = 'USDC',
  Bank = 'Bank', // Deprecated, is the same as USDC
}

export enum MerchantStyle {
  Rounded = 'rounded',
  Sharp = 'sharp',
  Pill = 'pill',
}

export type MerchantTheme = {
  primary?: string;
  background?: string;
  backgroundAccent?: string;
  backgroundAccent2?: string;
  textColor?: string;
  textColorAccent?: string;
  textColorAction?: string;
  ctaColor?: string;
  font?: string;
  style?: MerchantStyle;
};

interface BaseCustomerInfo {
  verificationId?: string;
  displayName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  ip?: string;
  lat?: string;
  lng?: string;
  /**
   * Date of birth in YYYY-MM-DD format
   */
  dob?: string;
}

export interface NameCustomerInfo extends BaseCustomerInfo {
  /**
   * @hidden
   */
  name?: string;
}

export interface SplitNameCustomerInfo extends BaseCustomerInfo {
  /**
   * @minLength 1
   */
  firstName: string;
  /**
   * @minLength 1
   */
  lastName: string;
}

export type CustomerInfo = SplitNameCustomerInfo | NameCustomerInfo;

/** Coinflow Types **/
export type CoinflowBlockchain =
  | 'solana'
  | 'eth'
  | 'polygon'
  | 'base'
  | 'arbitrum'
  | 'user';
export type CoinflowEnvs =
  | 'prod'
  | 'staging'
  | 'staging-live'
  | 'sandbox'
  | 'local';

export interface CoinflowTypes {
  merchantId: string;
  env?: CoinflowEnvs;
  loaderBackground?: string;
  blockchain?: CoinflowBlockchain | undefined;
  handleHeightChange?: (height: string) => void;
  theme?: MerchantTheme;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type OnSuccessMethod = (
  args:
    | {
        paymentId: string;
        hash?: string | undefined;
      }
    | string
) => void | Promise<void>;

export type AuthDeclinedWalletCallInfo = {
  title: string;
  code: string;
  action: string;
  message: string;
  total: string;
};

export type OnAuthDeclinedMethod = (
  args: AuthDeclinedWalletCallInfo
) => void | Promise<void>;

/** Wallets **/
export interface SolanaWallet {
  publicKey: PublicKey | null;
  signTransaction?: <T extends Transaction | VersionedTransaction>(
    transaction: T
  ) => Promise<T>;
  sendTransaction: <T extends Transaction | VersionedTransaction>(
    transaction: T
  ) => Promise<string>;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
}

type AccessList = Array<{address: string; storageKeys: Array<string>}>;
type AccessListish =
  | AccessList
  | Array<[string, Array<string>]>
  | Record<string, Array<string>>;

export type EthWallet = {
  address: string | null | undefined;
  sendTransaction: (transaction: {
    to: string;
    from?: string;
    nonce?: Bytes | bigint | string | number;

    gasLimit?: Bytes | bigint | string | number;
    gasPrice?: Bytes | bigint | string | number;

    data?: BytesLike;
    value?: Bytes | bigint | string | number;
    chainId?: number;

    type?: number;
    accessList?: AccessListish;

    maxPriorityFeePerGas?: Bytes | bigint | string | number;
    maxFeePerGas?: Bytes | bigint | string | number;

    customData?: Record<string, any>;
    ccipReadEnabled?: boolean;
  }) => Promise<{hash: string}>;
  signMessage: (message: string) => Promise<string>;
};

/** History **/
export interface CoinflowSolanaHistoryProps extends CoinflowTypes {
  wallet: SolanaWallet;
  connection: Connection;
  blockchain: 'solana';
}

export interface CoinflowSessionKeyHistoryProps extends CoinflowTypes {
  sessionKey: string;
  blockchain?: undefined;
}

export interface CoinflowEvmHistoryProps extends CoinflowTypes {
  wallet: EthWallet;
  blockchain: 'eth' | 'polygon' | 'base' | 'arbitrum';
}

export interface CoinflowEthHistoryProps extends CoinflowEvmHistoryProps {
  blockchain: 'eth';
}

export interface CoinflowPolygonHistoryProps extends CoinflowEvmHistoryProps {
  blockchain: 'polygon';
}

export interface CoinflowBaseHistoryProps extends CoinflowEvmHistoryProps {
  blockchain: 'base';
}

export interface CoinflowArbitrumHistoryProps extends CoinflowEvmHistoryProps {
  blockchain: 'arbitrum';
}

export type CoinflowHistoryProps =
  | CoinflowSolanaHistoryProps
  | CoinflowPolygonHistoryProps
  | CoinflowEthHistoryProps
  | CoinflowBaseHistoryProps
  | CoinflowArbitrumHistoryProps
  | CoinflowSessionKeyHistoryProps;

type Bytes = ArrayLike<number>;
type BytesLike = Bytes | string;

/** Purchase **/

export type CartClassOmitted = CartItemClassOmitted[];
export type ChargebackProtectionData = CartClassOmitted;

export type CartItemClassOmitted =
  | NftCartItemClassOmitted
  | Omit<GiftCardCartItem, 'listPrice'>
  | CryptoCartItem
  | MoneyTopUpCartItem;
export type ChargebackProtectionItem = CartItemClassOmitted;

export type NftCartItemClassOmitted = Omit<
  nftCartItem,
  'listPrice' | 'sellingPrice' | 'itemClass'
>;

export type Cart = CartItem[];
export type CartItem =
  | Omit<nftCartItem, 'listPrice' | 'sellingPrice'>
  | Omit<GiftCardCartItem, 'listPrice'>
  | CryptoCartItem
  | MoneyTopUpCartItem;

export enum ThreeDsChallengePreference {
  NoPreference = 'NoPreference',
  Frictionless = 'Frictionless',
  Challenge = 'Challenge',
}

export enum PaymentMethods {
  card = 'card',
  ach = 'ach',
  fasterPayments = 'fasterPayments',
  sepa = 'sepa',
  pix = 'pix',
  usdc = 'usdc',
  googlePay = 'googlePay',
  applePay = 'applePay',
  credits = 'credits',
  crypto = 'crypto',
}

export interface CoinflowCommonPurchaseProps extends CoinflowTypes {
  subtotal?: Subtotal;
  presentment?: Currency;
  onSuccess?: OnSuccessMethod;
  onAuthDeclined?: OnAuthDeclinedMethod;
  webhookInfo?: {
    [key: string]: any;
  };
  email?: string;
  chargebackProtectionData?: ChargebackProtectionData;
  planCode?: string;
  /**
   * The payment methods displayed on the UI. If omitted, all available payment methods will be displayed.
   */
  allowedPaymentMethods?: PaymentMethods[];
  customerInfo?: CustomerInfo;
  settlementType?: SettlementType;
  authOnly?: boolean;
  /**
   * The DeviceID gotten from the Coinflow SDK:
   *  https://docs.coinflow.cash/docs/implement-chargeback-protection#how-to-add-chargeback-protection
   *
   * window?.nSureSDK?.getDeviceId()
   */
  deviceId?: string;
  jwtToken?: string;
  /**
   * Your company email address that the customer can contact.
   */
  supportEmail?: string;
  /**
   * If rendering the Coinflow component within multiple nested iframes, all ancestors in the chain must be provided as a comma-separated list.
   *
   * Example:
   * Primary origin that will be interacting with the Coinflow iFrame: foo.com
   * Subsequent origins that will render foo.com: bar.com
   * The origin array would then be: [https://foo.com,https://bar.com]
   */
  origins?: string[];
  threeDsChallengePreference?: ThreeDsChallengePreference;
  destinationAuthKey?: string;
}

export interface CoinflowSolanaPurchaseProps
  extends CoinflowCommonPurchaseProps {
  wallet: SolanaWallet;
  transaction?: Transaction | VersionedTransaction;
  partialSigners?: Signer[];
  debugTx?: boolean;
  connection: Connection;
  blockchain: 'solana';
  rent?: {lamports: string | number};
  nativeSolToConvert?: {lamports: string | number};
}

export interface CoinflowSessionKeyPurchaseProps
  extends CoinflowCommonPurchaseProps {
  sessionKey: string;
  wallet?: undefined;
  blockchain?: CoinflowBlockchain | undefined;
}

export interface CoinflowEvmPurchaseProps extends CoinflowCommonPurchaseProps {
  transaction?: EvmTransactionData;
  wallet: EthWallet;
}

export interface CoinflowPolygonPurchaseProps extends CoinflowEvmPurchaseProps {
  blockchain: 'polygon';
}

export interface CoinflowEthPurchaseProps extends CoinflowEvmPurchaseProps {
  blockchain: 'eth';
}

export interface CoinflowBasePurchaseProps extends CoinflowEvmPurchaseProps {
  blockchain: 'base';
}

export interface CoinflowArbitrumPurchaseProps
  extends CoinflowEvmPurchaseProps {
  blockchain: 'arbitrum';
}

export type CoinflowPurchaseProps =
  | CoinflowSolanaPurchaseProps
  | CoinflowSessionKeyPurchaseProps
  | CoinflowPolygonPurchaseProps
  | CoinflowEthPurchaseProps
  | CoinflowBasePurchaseProps
  | CoinflowArbitrumPurchaseProps;

/** Withdraw **/

export interface CoinflowCommonWithdrawProps extends CoinflowTypes {
  onSuccess?: OnSuccessMethod;
  tokens?: string[];
  lockDefaultToken?: boolean;
  amount?: number;
  email?: string;
  bankAccountLinkRedirect?: string;
  additionalWallets?: {
    wallet: string;
    blockchain: 'solana' | 'eth' | 'polygon' | 'base' | 'arbitrum';
  }[];
  lockAmount?: boolean;
  transactionSigner?: string;
  /**
   * If rendering the Coinflow component within multiple nested iframes, all ancestors in the chain must be provided as a comma-separated list.
   *
   * Example:
   * Primary origin that will be interacting with the Coinflow iFrame: foo.com
   * Subsequent origins that will render foo.com: bar.com
   * The origin array would then be: [https://foo.com,https://bar.com]
   */
  origins?: string[];
  /**
   * If the withdrawer is authenticated with a sessionKey pass it here.
   */
  sessionKey?: string;
}

export type WalletTypes = SolanaWallet | EthWallet;

export interface SolanaWalletProps {
  wallet: SolanaWallet;
  connection: Connection;
  blockchain: 'solana';
}

export type CoinflowSolanaWithdrawProps = CoinflowCommonWithdrawProps &
  SolanaWalletProps;

interface EvmWalletProps {
  wallet: EthWallet;
  usePermit?: boolean;
}

type CoinflowEvmWithdrawProps = CoinflowCommonWithdrawProps & EvmWalletProps;

export interface EthWalletProps {
  blockchain: 'eth';
}

export type CoinflowEthWithdrawProps = CoinflowEvmWithdrawProps &
  EthWalletProps;

export interface PolygonWalletProps {
  blockchain: 'polygon';
}

export type CoinflowPolygonWithdrawProps = CoinflowEvmWithdrawProps &
  PolygonWalletProps;

export interface BaseWalletProps {
  blockchain: 'base';
}

export type CoinflowBaseWithdrawProps = CoinflowEvmWithdrawProps &
  BaseWalletProps;

export interface ArbitrumWalletProps {
  blockchain: 'arbitrum';
}

export type CoinflowArbitrumWithdrawProps = CoinflowEvmWithdrawProps &
  ArbitrumWalletProps;

export type CoinflowWithdrawProps =
  | CoinflowSolanaWithdrawProps
  | CoinflowEthWithdrawProps
  | CoinflowPolygonWithdrawProps
  | CoinflowBaseWithdrawProps
  | CoinflowArbitrumWithdrawProps;

export interface CommonEvmRedeem {
  /**
   * Whether the UI should wait
   * for the transaction to be sent and
   * the hash to be returned.
   */
  waitForHash?: boolean;
}

export interface NormalRedeem extends CommonEvmRedeem {
  transaction: {to: string; data: string};
}

export interface KnownTokenIdRedeem extends NormalRedeem {
  /**
   * @minLength 42 Please provide a valid EVM Public Key (42 Characters Long)
   * @maxLength 42 Please provide a valid EVM Public Key (42 Characters Long)
   */
  nftContract: string;
  /**
   * @minLength 1 Please provide a valid Nft Id
   */
  nftId: string;
}

export interface SafeMintRedeem extends NormalRedeem {
  type: 'safeMint';
  nftContract?: string;
}

export interface ReturnedTokenIdRedeem extends NormalRedeem {
  type: 'returned';
  nftContract?: string;
}

/** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
export type ReservoirNftIdItem = Omit<KnownTokenIdRedeem, keyof NormalRedeem>;
/** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
export interface ReservoirOrderIdItem {
  /** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
  orderId: string;
}

/** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
export type ReservoirItem = ReservoirNftIdItem | ReservoirOrderIdItem;

/** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
export type ReservoirItems = ReservoirItem | ReservoirItem[];

/** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
export interface ReservoirRedeem extends CommonEvmRedeem {
  /** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
  type: 'reservoir';
  /** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
  items: ReservoirItems;
  /** @deprecated Reservoir decided to sunset Reservoir NFT, including their API and associated services, effective October 15, 2025. */
  taker?: string;
}

/** @deprecated */
export interface TokenRedeem extends CommonEvmRedeem {
  /** @deprecated */
  type: 'token';
  /** @deprecated */
  destination: string;
}

export interface DecentRedeem extends CommonEvmRedeem {
  type: 'decent';
  /**
   * ID of the destination chain you will be using
   * Find your chain ID here: https://chainlist.org/
   */
  dstChainId: number;
  /**
   * Address on that chain of the token you will be receiving
   */
  dstToken: string;
  /**
   * The contract address which will be called on the destination chain
   */
  contractAddress: string;
  contractData: string;
  /**
   * Amount of the token on the destination chain you will be receiving
   */
  cost: {
    /**
     * This is the raw amount of the token
     * ex: 50000000000000n
     */
    amount: string;
    /**
     * Whether or not the token is the native token for the chain (ex: Ethereum - ETH, Polygon - POL).
     * If native dstToken should be the 0 address (0x00...)
     */
    isNative: boolean;
  };
}

export type EvmTransactionData =
  | SafeMintRedeem
  | ReturnedTokenIdRedeem
  | KnownTokenIdRedeem
  | NormalRedeem
  | TokenRedeem
  | DecentRedeem
  | ReservoirRedeem;

export interface CoinflowIFrameProps
  extends Omit<CoinflowTypes, 'merchantId' | 'handleHeightChange'>,
    Pick<
      CoinflowCommonPurchaseProps,
      | 'chargebackProtectionData'
      | 'webhookInfo'
      | 'subtotal'
      | 'presentment'
      | 'customerInfo'
      | 'settlementType'
      | 'email'
      | 'planCode'
      | 'deviceId'
      | 'jwtToken'
      | 'origins'
      | 'threeDsChallengePreference'
      | 'supportEmail'
      | 'allowedPaymentMethods'
    >,
    Pick<
      CoinflowCommonWithdrawProps,
      | 'bankAccountLinkRedirect'
      | 'additionalWallets'
      | 'transactionSigner'
      | 'lockAmount'
      | 'lockDefaultToken'
      | 'origins'
    >,
    Pick<CoinflowEvmPurchaseProps, 'authOnly'>,
    Pick<
      CoinflowSolanaPurchaseProps,
      'rent' | 'nativeSolToConvert' | 'destinationAuthKey'
    > {
  walletPubkey: string | null | undefined;
  sessionKey?: string;
  route: string;
  routePrefix?: string;
  transaction?: string;
  tokens?: string[] | PublicKey[];
  merchantCss?: string;
  color?: 'white' | 'black';
  disableApplePay?: boolean;
  disableGooglePay?: boolean;
  theme?: MerchantTheme;
  usePermit?: boolean;
  handleHeightChangeId: string | number;
}

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MSTR',
  AMEX = 'AMEX',
  DISCOVER = 'DISC',
}
