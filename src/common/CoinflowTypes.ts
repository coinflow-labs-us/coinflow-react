import type {
  Connection,
  VersionedTransaction,
  PublicKey,
  Signer,
  Transaction,
} from '@solana/web3.js';

export enum SettlementType {
  Credits = 'Credits',
  USDC = 'USDC',
  Bank = 'Bank',
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
  font?: string;
  style?: MerchantStyle;
};

export interface CustomerInfo {
  name?: string;
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
}

/** Coinflow Types **/
export type CoinflowBlockchain =
  | 'solana'
  | 'near'
  | 'eth'
  | 'polygon'
  | 'base'
  | 'arbitrum';
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
  blockchain: CoinflowBlockchain;
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

export interface NearWallet {
  accountId: string;
  signAndSendTransaction: (transaction: unknown) => Promise<{
    transaction: {hash: string};
  }>;
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

export interface CoinflowNearHistoryProps extends CoinflowTypes {
  wallet: NearWallet;
  blockchain: 'near';
}

export interface CoinflowEvmHistoryProps extends CoinflowTypes {
  wallet: EthWallet;
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
  | CoinflowNearHistoryProps
  | CoinflowPolygonHistoryProps
  | CoinflowEthHistoryProps
  | CoinflowBaseHistoryProps
  | CoinflowArbitrumHistoryProps;

/** Transactions **/

export type NearFtTransferCallAction = {
  methodName: 'ft_transfer_call';
  args: object;
  gas: string;
  deposit: string;
};

type Bytes = ArrayLike<number>;
type BytesLike = Bytes | string;

type RawProductData = Record<string, string | number | boolean | object>;

/** Purchase **/

export type ChargebackProtectionData = ChargebackProtectionItem[];

export interface ChargebackProtectionItem {
  /**
   * The name of the product
   */
  productName: string;
  /**
   * The product type. Possible values include: inGameProduct, gameOfSkill, dataStorage, computingResources, sportsTicket, eSportsTicket, musicTicket, conferenceTicket, virtualSportsTicket, virtualESportsTicket, virtualMusicTicket, virtualConferenceTicket, alcohol, DLC, subscription, fundACause, realEstate, computingContract, digitalArt, topUp
   */
  productType:
    | 'inGameProduct'
    | 'gameOfSkill'
    | 'dataStorage'
    | 'computingResources'
    | 'sportsTicket'
    | 'eSportsTicket'
    | 'musicTicket'
    | 'conferenceTicket'
    | 'virtualSportsTicket'
    | 'virtualESportsTicket'
    | 'virtualMusicTicket'
    | 'virtualConferenceTicket'
    | 'alcohol'
    | 'DLC'
    | 'subscription'
    | 'fundACause'
    | 'realEstate'
    | 'computingContract'
    | 'digitalArt'
    | 'topUp'
    | 'ownershipContract';
  /**
   * The item's list price
   */
  /**
   * The number of units sold
   */
  quantity: number;
  /**
   * Any additional data that the store can provide on the product, e.g. description, link to image, etc.
   */
  rawProductData?: RawProductData;
}

export enum ThreeDsChallengePreference {
  NoPreference = 'NoPreference',
  Frictionless = 'Frictionless',
  Challenge = 'Challenge',
}

export interface CoinflowCommonPurchaseProps extends CoinflowTypes {
  amount?: number | string;
  onSuccess?: OnSuccessMethod;
  webhookInfo?: object;
  email?: string;
  chargebackProtectionData?: ChargebackProtectionData;
  planCode?: string;
  disableApplePay?: boolean;
  disableGooglePay?: boolean;
  customerInfo?: CustomerInfo;
  settlementType?: SettlementType;
  authOnly?: boolean;
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
}

export interface CoinflowSolanaPurchaseProps
  extends CoinflowCommonPurchaseProps {
  wallet: SolanaWallet;
  transaction?: Transaction | VersionedTransaction;
  partialSigners?: Signer[];
  debugTx?: boolean;
  connection: Connection;
  blockchain: 'solana';
  token?: PublicKey | string;
  rent?: {lamports: string | number};
  nativeSolToConvert?: {lamports: string | number};
}

export interface CoinflowNearPurchaseProps extends CoinflowCommonPurchaseProps {
  wallet: NearWallet;
  blockchain: 'near';
  action?: NearFtTransferCallAction;
  nearDeposit?: string;
}

export interface CoinflowEvmPurchaseProps extends CoinflowCommonPurchaseProps {
  transaction?: EvmTransactionData;
  token?: string;
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
  | CoinflowNearPurchaseProps
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
    blockchain: 'solana' | 'eth' | 'near' | 'polygon' | 'base' | 'arbitrum';
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
}

export interface CoinflowSolanaWithdrawProps
  extends CoinflowCommonWithdrawProps {
  wallet: SolanaWallet;
  connection: Connection;
  blockchain: 'solana';
}

export interface CoinflowNearWithdrawProps extends CoinflowCommonWithdrawProps {
  wallet: NearWallet;
  blockchain: 'near';
}

export interface CoinflowEvmWithdrawProps extends CoinflowCommonWithdrawProps {
  wallet: EthWallet;
  usePermit?: boolean;
}

export interface CoinflowEthWithdrawProps extends CoinflowEvmWithdrawProps {
  blockchain: 'eth';
  usePermit?: boolean;
}

export interface CoinflowPolygonWithdrawProps extends CoinflowEvmWithdrawProps {
  blockchain: 'polygon';
}

export interface CoinflowBaseWithdrawProps extends CoinflowEvmWithdrawProps {
  blockchain: 'base';
}

export interface CoinflowArbitrumWithdrawProps
  extends CoinflowEvmWithdrawProps {
  blockchain: 'arbitrum';
}

export type CoinflowWithdrawProps =
  | CoinflowSolanaWithdrawProps
  | CoinflowNearWithdrawProps
  | CoinflowEthWithdrawProps
  | CoinflowPolygonWithdrawProps
  | CoinflowBaseWithdrawProps
  | CoinflowArbitrumWithdrawProps;

export interface CommonEvmRedeem {
  waitForHash?: boolean;
}

export interface NormalRedeem extends CommonEvmRedeem {
  transaction: {to: string; data: string};
}

export interface KnownTokenIdRedeem extends NormalRedeem {
  nftContract: string;
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

type ReservoirNftIdItem = Omit<KnownTokenIdRedeem, keyof NormalRedeem>;
interface ReservoirOrderIdItem {
  orderId: string;
}
type ReservoirItem = ReservoirNftIdItem | ReservoirOrderIdItem;
type ReservoirItems = ReservoirItem | ReservoirItem[];

export interface ReservoirRedeem extends CommonEvmRedeem {
  type: 'reservoir';
  items: ReservoirItems;
  taker?: string;
}

export interface TokenRedeem extends CommonEvmRedeem {
  type: 'token';
  destination: string;
}

export type EvmTransactionData =
  | SafeMintRedeem
  | ReturnedTokenIdRedeem
  | ReservoirRedeem
  | KnownTokenIdRedeem
  | NormalRedeem
  | TokenRedeem;

export interface CoinflowIFrameProps
  extends Omit<CoinflowTypes, 'merchantId'>,
    Pick<
      CoinflowCommonPurchaseProps,
      | 'chargebackProtectionData'
      | 'webhookInfo'
      | 'amount'
      | 'customerInfo'
      | 'settlementType'
      | 'email'
      | 'planCode'
      | 'deviceId'
      | 'jwtToken'
      | 'origins'
      | 'threeDsChallengePreference'
      | 'supportEmail'
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
    Pick<CoinflowSolanaPurchaseProps, 'rent' | 'nativeSolToConvert' | 'token'> {
  walletPubkey: string | null | undefined;
  route: string;
  routePrefix?: string;
  transaction?: string;
  tokens?: string[] | PublicKey[];
  nearDeposit?: string;
  merchantCss?: string;
  color?: 'white' | 'black';
  disableApplePay?: boolean;
  disableGooglePay?: boolean;
  theme?: MerchantTheme;
  usePermit?: boolean;
}

export enum CardType {
  VISA = 'VISA',
  MASTERCARD = 'MSTR',
  AMEX = 'AMEX',
  DISCOVER = 'DISC',
}
