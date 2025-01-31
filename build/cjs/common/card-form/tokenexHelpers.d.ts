import { TokenExIframe, TokenExIFrameConfiguration } from './TokenEx';
import { CardType, CoinflowEnvs } from '../CoinflowTypes';
export type MerchantIdOrCheckoutJwt = {
    checkoutJwt: string;
} | {
    merchantId: string;
};
export interface CommonDoInitializeTokenExIframeArgs {
    css: string;
    debug?: boolean;
    font?: string;
    origins: string[];
    tokenExScriptLoaded: boolean;
    env: CoinflowEnvs;
    setCachedToken: (s: string | undefined) => void;
    setLoaded: (b: boolean) => void;
}
export type DoInitializeTokenExIframeArgs = CommonDoInitializeTokenExIframeArgs & MerchantIdOrCheckoutJwt;
export type DoInitializeCvvOnlyTokenExIframeArgs = DoInitializeTokenExIframeArgs & {
    token: string;
    cardType: CardType;
};
export type GetIFrameConfigArgs = {
    token?: string;
    origins: string[];
    env: CoinflowEnvs;
} & MerchantIdOrCheckoutJwt;
export declare function getIframeConfig(args: GetIFrameConfigArgs): Promise<TokenExIFrameConfiguration>;
export declare function setTokenExScriptTag({ env, setTokenExScriptLoaded, }: {
    env: CoinflowEnvs;
    setTokenExScriptLoaded: (b: boolean) => void;
}): void;
export declare function doInitializeCvvOnlyTokenExIframe(args: DoInitializeCvvOnlyTokenExIframeArgs): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExIframe(args: DoInitializeTokenExIframeArgs): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExCardOnlyIframe(args: DoInitializeTokenExIframeArgs): Promise<TokenExIframe | undefined>;
