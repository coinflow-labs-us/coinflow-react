import type { Connection, VersionedTransaction, PublicKey, Signer, Transaction } from '@solana/web3.js';
import { Currency, Subtotal } from './types/Subtotal';
import { GiftCardCartItem } from './types/giftCardCartItem';
import { nftCartItem } from './types/nftCartItem';
import { CryptoCartItem } from './types/cryptoCartItem';
import { MoneyTopUpCartItem } from './types/moneyTopUpCartItem';
export declare enum WithdrawCategory {
    USER = "user",
    BUSINESS = "business"
}
export declare enum WithdrawSpeed {
    ASAP = "asap",
    SAME_DAY = "same_day",
    STANDARD = "standard",
    CARD = "card",
    IBAN = "iban",
    PIX = "pix",
    EFT = "eft",
    VENMO = "venmo",
    PAYPAL = "paypal",
    WIRE = "wire",
    INTERAC = "interac"
}
export declare enum SettlementType {
    Credits = "Credits",
    USDC = "USDC",
    Bank = "Bank"
}
/**
 * Configuration for a single custom pay-in fee line item.
 * Use with customPayInFees prop on purchase flows.
 */
export interface PurchaseCustomPayInFee {
    lineItemLabel: string;
    fee: {
        isFixed: true;
        percent: null;
        currency: Currency;
        cents: number;
    } | {
        isFixed: false;
        percent: number;
        currency: null;
        cents: null;
    };
}
/**
 * Configuration for zero authorization flow - controls saved payment method visibility.
 */
export interface ZeroAuthSavedPaymentMethods {
    disableSavedPaymentMethods: boolean;
}
/**
 * Configuration for zero authorization flow - verify existing card mode.
 * Shows the "Verify Card" flow for a specific saved card.
 * The card token will be validated to ensure it belongs to the current user's wallet.
 * If the card doesn't belong to the user, falls back to "Add New Card" view.
 */
export interface ZeroAuthVerifyCard {
    cardToken: string;
}
/**
 * Configuration for zero authorization flow.
 * The presence of this object indicates the checkout is in zero auth mode.
 *
 * Two mutually exclusive modes:
 * - Saved payment methods: `{ disableSavedPaymentMethods: boolean }` - show or hide saved methods
 * - Verify card: `{ cardToken: "token" }` - verify a specific saved card
 */
export type ZeroAuthorizationConfig = ZeroAuthSavedPaymentMethods | ZeroAuthVerifyCard;
export declare function isZeroAuthVerifyCard(config: ZeroAuthorizationConfig): config is ZeroAuthVerifyCard;
export declare function isZeroAuthSavedPaymentMethods(config: ZeroAuthorizationConfig): config is ZeroAuthSavedPaymentMethods;
export declare enum MerchantStyle {
    Rounded = "rounded",
    Sharp = "sharp",
    Pill = "pill"
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
    fontSize?: string;
    fontWeight?: string;
    cardNumberPlaceholder?: string;
    cvvPlaceholder?: string;
    expirationPlaceholder?: string;
    showCardIcon?: boolean;
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
    email?: string;
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
export type CoinflowBlockchain = 'solana' | 'eth' | 'polygon' | 'base' | 'arbitrum' | 'stellar' | 'monad' | 'tempo' | 'user';
export type CoinflowEnvs = 'prod' | 'staging' | 'staging-live' | 'sandbox' | 'local';
export interface CoinflowTypes {
    merchantId: string;
    env?: CoinflowEnvs;
    loaderBackground?: string;
    blockchain?: CoinflowBlockchain | undefined;
    handleHeightChange?: (height: string) => void;
    theme?: MerchantTheme;
}
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type MergeWithOptionalDiff<A, B> = Pick<A, Extract<keyof A, keyof B>> & Pick<B, Extract<keyof B, keyof A>> & Partial<Omit<A, keyof B>> & Partial<Omit<B, keyof A>>;
export type OnSuccessMethod = (args: {
    paymentId: string;
    hash?: string | undefined;
} | string) => void | Promise<void>;
export type AuthDeclinedWalletCallInfo = {
    title: string;
    code: string;
    action: string;
    message: string;
    total: string;
};
export type OnAuthDeclinedMethod = (args: AuthDeclinedWalletCallInfo) => void | Promise<void>;
/** Wallets **/
export interface SolanaWallet {
    publicKey: PublicKey | null;
    signTransaction?: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
    sendTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<string>;
    signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
}
type AccessList = Array<{
    address: string;
    storageKeys: Array<string>;
}>;
type AccessListish = AccessList | Array<[string, Array<string>]> | Record<string, Array<string>>;
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
    }) => Promise<{
        hash: string;
    }>;
    signMessage: (message: string) => Promise<string>;
};
export interface StellarWallet {
    address: string | null;
    sendTransaction: (base64Xdr: string) => Promise<string>;
    signTransaction: (base64Xdr: string) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
}
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
    blockchain: 'eth' | 'polygon' | 'base' | 'arbitrum' | 'monad' | 'tempo';
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
export interface CoinflowStellarHistoryProps extends CoinflowTypes {
    wallet: StellarWallet;
    blockchain: 'stellar';
}
export interface CoinflowMonadHistoryProps extends CoinflowEvmHistoryProps {
    blockchain: 'monad';
}
export interface CoinflowTempoHistoryProps extends CoinflowEvmHistoryProps {
    blockchain: 'tempo';
}
export type CoinflowHistoryProps = CoinflowSolanaHistoryProps | CoinflowPolygonHistoryProps | CoinflowEthHistoryProps | CoinflowBaseHistoryProps | CoinflowArbitrumHistoryProps | CoinflowStellarHistoryProps | CoinflowMonadHistoryProps | CoinflowTempoHistoryProps | CoinflowSessionKeyHistoryProps;
type Bytes = ArrayLike<number>;
type BytesLike = Bytes | string;
/**
 * Cart item details required for Coinflow Chargeback Protection. Required if the merchant uses chargeback protection.
 */
export type CartClassOmitted = CartItemClassOmitted[];
export type ChargebackProtectionData = CartClassOmitted;
export declare enum ChargebackProtectionAccountType {
    GUEST = "guest",
    PRIVATE = "private",
    BUSINESS = "business"
}
export type CartItemClassOmitted = NftCartItemClassOmitted | Omit<GiftCardCartItem, 'listPrice'> | CryptoCartItem | MoneyTopUpCartItem;
export type ChargebackProtectionItem = CartItemClassOmitted;
export type NftCartItemClassOmitted = Omit<nftCartItem, 'sellingPrice' | 'itemClass'>;
export type Cart = CartItem[];
export type CartItem = Omit<nftCartItem, 'listPrice' | 'sellingPrice'> | Omit<GiftCardCartItem, 'listPrice'> | CryptoCartItem | MoneyTopUpCartItem;
export declare enum ThreeDsChallengePreference {
    NoPreference = "NoPreference",
    Frictionless = "Frictionless",
    Challenge = "Challenge"
}
export declare enum PaymentMethods {
    card = "card",
    ach = "ach",
    fasterPayments = "fasterPayments",
    sepa = "sepa",
    pix = "pix",
    usdc = "usdc",
    googlePay = "googlePay",
    applePay = "applePay",
    credits = "credits",
    crypto = "crypto",
    wire = "wire",
    cashApp = "cashApp"
}
export declare const paymentMethodLabels: Record<PaymentMethods, string>;
export interface CoinflowCommonPurchaseProps extends CoinflowTypes {
    subtotal?: Subtotal;
    /**
     * Custom pay-in fees to add to checkout. Each fee appears as a separate line item.
     * These fees are added to the subtotal and displayed to the customer.
     */
    customPayInFees?: PurchaseCustomPayInFee[];
    presentment?: Currency;
    onSuccess?: OnSuccessMethod;
    sessionKey?: string;
    onAuthDeclined?: OnAuthDeclinedMethod;
    webhookInfo?: {
        [key: string]: any;
    };
    email?: string;
    chargebackProtectionData?: ChargebackProtectionData;
    chargebackProtectionAccountType?: ChargebackProtectionAccountType;
    planCode?: string;
    /**
     * The payment methods displayed on the UI. If omitted, all available payment methods will be displayed.
     */
    allowedPaymentMethods?: PaymentMethods[];
    customerInfo?: CustomerInfo;
    settlementType?: SettlementType;
    authOnly?: boolean;
    /**
     * @deprecated Use zeroAuthorizationConfig instead for more control over zero auth behavior.
     * Simple boolean flag for zero authorization mode. When true, defaults to showing saved payment methods.
     */
    isZeroAuthorization?: boolean;
    /**
     * Configuration for zero authorization flow. Takes precedence over isZeroAuthorization if both are provided.
     * Use this to control whether saved payment methods are shown and to pre-select a specific card for verification.
     */
    zeroAuthorizationConfig?: ZeroAuthorizationConfig;
    /**
     * If true, pre-checks the partial USDC payment checkbox when USDC balance is available.
     * If false or undefined, maintains default behavior (unchecked).
     */
    partialUsdcChecked?: boolean;
    /**
     * The DeviceID gotten from the Coinflow SDK:
     *  https://docs.coinflow.cash/guides/checkout/fraud-protection/chargeback-protection/implement-chargeback-protection#how-to-add-chargeback-protection
     *
     * nSureSDK.getDeviceId()
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
    accountFundingTransaction?: AccountFundingTransaction;
}
/**
 * Used for Account Funding Transactions
 */
export interface AccountFundingTransaction {
    /**
     * Recipient information for Account Funding Transactions (AFT).
     * Required when AFT is enabled and type requires it.
     */
    recipientAftInfo?: RecipientAftInfo;
}
export interface CoinflowSolanaPurchaseProps extends CoinflowCommonPurchaseProps {
    wallet: SolanaWallet;
    transaction?: Transaction | VersionedTransaction;
    partialSigners?: Signer[];
    debugTx?: boolean;
    connection: Connection;
    blockchain: 'solana';
    rent?: {
        lamports: string | number;
    };
    nativeSolToConvert?: {
        lamports: string | number;
    };
    redemptionCheck?: boolean;
}
export interface CoinflowSessionKeyPurchaseProps extends CoinflowCommonPurchaseProps {
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
export interface CoinflowArbitrumPurchaseProps extends CoinflowEvmPurchaseProps {
    blockchain: 'arbitrum';
}
export interface CoinflowStellarPurchaseProps extends CoinflowCommonPurchaseProps {
    wallet: StellarWallet;
    transaction?: string;
    blockchain: 'stellar';
}
export interface CoinflowMonadPurchaseProps extends CoinflowEvmPurchaseProps {
    blockchain: 'monad';
}
export interface CoinflowTempoPurchaseProps extends CoinflowEvmPurchaseProps {
    blockchain: 'tempo';
}
export type CoinflowPurchaseProps = CoinflowSolanaPurchaseProps | CoinflowSessionKeyPurchaseProps | CoinflowPolygonPurchaseProps | CoinflowEthPurchaseProps | CoinflowBasePurchaseProps | CoinflowArbitrumPurchaseProps | CoinflowStellarPurchaseProps | CoinflowMonadPurchaseProps | CoinflowTempoPurchaseProps;
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
        blockchain: 'solana' | 'eth' | 'polygon' | 'base' | 'arbitrum' | 'monad' | 'tempo' | 'stellar';
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
    /**
     * Array of allowed withdrawal speeds. If not provided, all speeds are allowed.
     */
    allowedWithdrawSpeeds?: WithdrawSpeed[];
}
export type WalletTypes = SolanaWallet | EthWallet | StellarWallet;
export interface SolanaWalletProps {
    wallet: SolanaWallet;
    connection: Connection;
    blockchain: 'solana';
}
export type CoinflowSolanaWithdrawProps = CoinflowCommonWithdrawProps & SolanaWalletProps;
interface EvmWalletProps {
    wallet: EthWallet;
    usePermit?: boolean;
}
type CoinflowEvmWithdrawProps = CoinflowCommonWithdrawProps & EvmWalletProps;
export interface EthWalletProps {
    blockchain: 'eth';
}
export type CoinflowEthWithdrawProps = CoinflowEvmWithdrawProps & EthWalletProps;
export interface PolygonWalletProps {
    blockchain: 'polygon';
}
export type CoinflowPolygonWithdrawProps = CoinflowEvmWithdrawProps & PolygonWalletProps;
export interface BaseWalletProps {
    blockchain: 'base';
}
export type CoinflowBaseWithdrawProps = CoinflowEvmWithdrawProps & BaseWalletProps;
export interface ArbitrumWalletProps {
    blockchain: 'arbitrum';
}
export type CoinflowArbitrumWithdrawProps = CoinflowEvmWithdrawProps & ArbitrumWalletProps;
export interface StellarWalletProps {
    wallet: StellarWallet;
    blockchain: 'stellar';
}
export type CoinflowStellarWithdrawProps = CoinflowCommonWithdrawProps & StellarWalletProps;
export interface MonadWalletProps {
    blockchain: 'monad';
}
export type CoinflowMonadWithdrawProps = CoinflowEvmWithdrawProps & MonadWalletProps;
export interface TempoWalletProps {
    blockchain: 'tempo';
}
export type CoinflowTempoWithdrawProps = CoinflowEvmWithdrawProps & TempoWalletProps;
export type CoinflowWithdrawProps = CoinflowSolanaWithdrawProps | CoinflowEthWithdrawProps | CoinflowPolygonWithdrawProps | CoinflowBaseWithdrawProps | CoinflowArbitrumWithdrawProps | CoinflowStellarWithdrawProps | CoinflowMonadWithdrawProps | CoinflowTempoWithdrawProps;
export interface CommonEvmRedeem {
    /**
     * Whether the UI should wait
     * for the transaction to be sent and
     * the hash to be returned.
     */
    waitForHash?: boolean;
}
/**
 * (EVM only) If your contract sends the item/service being purchased via a custom "receiver" field, then utilize this object.
 *
 * The coinflow contract calls the "to" contract, which transfers the NFT/item to the "receiver" address defined in the contract function arguments.
 */
export interface NormalRedeem extends CommonEvmRedeem {
    /**
     * Transaction to be called.
     */
    transaction: {
        /**
         * The merchant's whitelisted contract
         */
        to: string;
        /**
         * The data to call this contract with, HEX encoded.
         *
         * The coinflow contract calls the "to" contract, contract pulls USDC from msg.sender, and transfers the NFT/item to the "receiver" address defined in the contract function arguments.
         */
        data: string;
    };
}
/**
 * (EVM only) If your know the ID of the NFT being purchased, then utilize this object.
 *
 * The contract transfers the NFT to msg.sender (which is the Coinflow contract), the Coinflow contract fwd's the NFT to the end user's wallet.
 */
export interface KnownTokenIdRedeem extends NormalRedeem {
    /**
     * The address of the Nft's Contract
     *
     * @minLength 42 Please provide a valid EVM Address (42 Characters Long)
     * @maxLength 42 Please provide a valid EVM Address (42 Characters Long)
     */
    nftContract: string;
    /**
     * The ID of the NFT being purchased. Will be forwarded by the Coinflow contract to the customer's wallet.
     *
     * @minLength 1 Please provide a valid Nft Id
     */
    nftId: string;
}
/**
 * (EVM only) If your contract mints an NFT via a OpenZeppelin Safe Mint Call, then utilize this object.
 *
 * The contract mints the NFT to msg.sender (which is the Coinflow contract), the Coinflow contract picks up the SafeMint event, and fwd's the NFT to the end user's wallet.
 */
export interface SafeMintRedeem extends NormalRedeem {
    type: 'safeMint';
    nftContract?: string;
}
/**
 * (EVM only) If your contract returns the NFT ID, then utilize this object.
 *
 * The contract mints the NFT to msg.sender (which is the Coinflow contract), the Coinflow contract picks up the returned NFT ID, and fwd's the NFT to the end user's wallet.
 */
export interface ReturnedTokenIdRedeem extends NormalRedeem {
    type: 'returned';
    nftContract?: string;
}
export interface TokenRedeem extends CommonEvmRedeem {
    type: 'token';
    destination: string;
}
/**
 * If your contract exists on a chain supported by Decent, pass this object in order to call it.
 */
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
/**
 * (EVM only) if you want to execute an EVM transaction on a successful purchase, you can pass a transaction request here.
 *
 * Gas fees for the transaction will be automatically calculated and added to the total charged to the customer. Optionally the merchant can opt to pay for these gas fees.
 */
export type EvmTransactionData = SafeMintRedeem | ReturnedTokenIdRedeem | KnownTokenIdRedeem | NormalRedeem | TokenRedeem | DecentRedeem;
export interface CoinflowIFrameProps extends Omit<CoinflowTypes, 'merchantId' | 'handleHeightChange'>, Pick<CoinflowCommonPurchaseProps, 'chargebackProtectionData' | 'chargebackProtectionAccountType' | 'webhookInfo' | 'subtotal' | 'customPayInFees' | 'presentment' | 'customerInfo' | 'settlementType' | 'email' | 'planCode' | 'deviceId' | 'jwtToken' | 'origins' | 'threeDsChallengePreference' | 'supportEmail' | 'allowedPaymentMethods' | 'accountFundingTransaction' | 'partialUsdcChecked' | 'isZeroAuthorization' | 'zeroAuthorizationConfig'>, Pick<CoinflowCommonWithdrawProps, 'bankAccountLinkRedirect' | 'additionalWallets' | 'transactionSigner' | 'lockAmount' | 'lockDefaultToken' | 'origins' | 'allowedWithdrawSpeeds'>, Pick<CoinflowEvmPurchaseProps, 'authOnly'>, Pick<CoinflowSolanaPurchaseProps, 'rent' | 'nativeSolToConvert' | 'destinationAuthKey' | 'redemptionCheck'> {
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
export declare enum CardType {
    VISA = "VISA",
    MASTERCARD = "MSTR",
    AMEX = "AMEX",
    DISCOVER = "DISC"
}
export interface RecipientAftInfo {
    /**
     * @minLength 2
     */
    firstName: string;
    /**
     * @minLength 2
     */
    lastName: string;
    /**
     * @minLength 2
     */
    address1: string;
    /**
     * @minLength 2
     */
    city: string;
    /**
     * @minLength 2
     */
    postalCode: string;
    /**
     * @minLength 2
     */
    state?: string;
    /**
     * @minLength 2
     * @maxLength 2
     */
    countryCode: string;
    /**
     * Recipients Date Of Birth in YYYMMDD format.
     * @pattern ^\d{8}$
     */
    dateOfBirth?: string;
    /**
     * @pattern ^\d+$
     */
    phoneNumber?: string;
    documentReference?: string;
}
export declare const RN_REDIRECT_MESSAGE_NAME = "rnredirect";
export {};
