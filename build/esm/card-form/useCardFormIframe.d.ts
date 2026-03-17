import { CoinflowEnvs, setTokenExScriptTag, TokenExIframe, MerchantIdOrCheckoutJwt } from '../common';
export declare function useCardFormIframe({ env, merchantId, checkoutJwt }: {
    env: CoinflowEnvs;
} & MerchantIdOrCheckoutJwt): {
    tokenExIframe: TokenExIframe | undefined;
    initializeTokenExIframe: (args: Omit<import("..").DoInitializeTokenExIframeArgs, "env" | "setCachedToken" | "setLoaded" | "tokenExScriptLoaded">) => Promise<TokenExIframe | undefined>;
    initializeCvvOnlyTokenExIframe: (args: Omit<import("..").DoInitializeCvvOnlyTokenExIframeArgs, "env" | "setCachedToken" | "setLoaded" | "tokenExScriptLoaded">) => Promise<TokenExIframe | undefined>;
    initializeTokenExCardOnlyIframe: (args: Omit<import("..").DoInitializeTokenExIframeArgs, "env" | "setCachedToken" | "setLoaded" | "tokenExScriptLoaded">) => Promise<TokenExIframe | undefined>;
    loaded: boolean;
    cachedToken: string | undefined;
    setTokenExScriptTag: typeof setTokenExScriptTag;
};
