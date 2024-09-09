import { CoinflowBlockchain, CoinflowEnvs, CoinflowIFrameProps, CoinflowPurchaseProps, SolanaWallet } from './CoinflowTypes';
export declare class CoinflowUtils {
    env: CoinflowEnvs;
    url: string;
    constructor(env?: CoinflowEnvs);
    getNSurePartnerId(merchantId: string): Promise<string | undefined>;
    getCreditBalance(publicKey: string, merchantId: string, blockchain: 'solana' | 'near'): Promise<{
        cents: number;
    }>;
    static getCoinflowBaseUrl(env?: CoinflowEnvs): string;
    static getCoinflowApiUrl(env?: CoinflowEnvs): string;
    static getCoinflowUrl({ walletPubkey, route, routePrefix, env, amount, transaction, blockchain, webhookInfo, email, loaderBackground, handleHeightChange, bankAccountLinkRedirect, additionalWallets, nearDeposit, chargebackProtectionData, merchantCss, color, rent, lockDefaultToken, token, tokens, planCode, disableApplePay, disableGooglePay, customerInfo, settlementType, lockAmount, nativeSolToConvert, theme, usePermit, transactionSigner, authOnly, deviceId, jwtToken, origins, threeDsChallengePreference, }: CoinflowIFrameProps): string;
    static getTransaction(props: CoinflowPurchaseProps): string | undefined;
    static byBlockchain<T>(blockchain: CoinflowBlockchain, args: {
        solana: T;
        near: T;
        eth: T;
        polygon: T;
        base: T;
    }): T;
    static getWalletFromUserId({ userId, merchantId, env, }: {
        userId: string;
        merchantId: string;
        env: CoinflowEnvs;
    }): Promise<SolanaWallet>;
    static getWalletFromEmail({ email, merchantId, env, }: {
        email: string;
        merchantId: string;
        env: CoinflowEnvs;
    }): Promise<SolanaWallet>;
}
