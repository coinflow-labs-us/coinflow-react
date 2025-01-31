import { CoinflowBlockchain, CoinflowEnvs, CoinflowIFrameProps, CoinflowPurchaseProps, CustomerInfo } from './CoinflowTypes';
export declare class CoinflowUtils {
    env: CoinflowEnvs;
    url: string;
    constructor(env?: CoinflowEnvs);
    getNSurePartnerId(merchantId: string): Promise<string | undefined>;
    static getCoinflowBaseUrl(env?: CoinflowEnvs): string;
    static getCoinflowApiUrl(env?: CoinflowEnvs): string;
    static getCoinflowUrl({ walletPubkey, sessionKey, route, routePrefix, env, subtotal, transaction, blockchain, webhookInfo, email, loaderBackground, handleHeightChange, bankAccountLinkRedirect, additionalWallets, nearDeposit, chargebackProtectionData, merchantCss, color, rent, lockDefaultToken, tokens, planCode, disableApplePay, disableGooglePay, customerInfo, settlementType, lockAmount, nativeSolToConvert, theme, usePermit, transactionSigner, authOnly, deviceId, jwtToken, origins, threeDsChallengePreference, supportEmail, destinationAuthKey, allowedPaymentMethods, }: CoinflowIFrameProps): string;
    static getTransaction(props: CoinflowPurchaseProps): string | undefined;
    static byBlockchain<T>(blockchain: CoinflowBlockchain, args: {
        solana: T;
        near: T;
        eth: T;
        polygon: T;
        base: T;
        arbitrum: T;
        user: T;
    }): T;
}
export interface FullName {
    firstName: string;
    lastName: string;
}
export declare function getCustomerName(info: CustomerInfo | undefined): FullName | undefined;
