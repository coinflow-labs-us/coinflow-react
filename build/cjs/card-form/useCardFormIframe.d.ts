import { CoinflowEnvs, doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag, TokenExIframe } from '../common';
export declare function useCardFormIframe(env: CoinflowEnvs): {
    tokenExIframe: TokenExIframe | undefined;
    initializeTokenExIframe: (args: Omit<Parameters<typeof doInitializeTokenExIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    initializeCvvOnlyTokenExIframe: (args: Omit<Parameters<typeof doInitializeCvvOnlyTokenExIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    initializeTokenExCardOnlyIframe: (args: Omit<Parameters<typeof doInitializeTokenExCardOnlyIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    loaded: boolean;
    cachedToken: string | undefined;
    setTokenExScriptTag: typeof setTokenExScriptTag;
};
