import { CoinflowEnvs, doInitializeCvvOnlyTokenExIframe, doInitializeTokenExCardOnlyIframe, doInitializeTokenExIframe, setTokenExScriptTag, TokenExIframe } from '../common';
export declare function useCardFormIframe(env: CoinflowEnvs): {
    tokenExIframe: TokenExIframe | undefined;
    initializeTokenExIframe: ({ css, fontFamily, debug, origins, }: Omit<Parameters<typeof doInitializeTokenExIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    initializeCvvOnlyTokenExIframe: ({ token, cardType, css, debug, fontFamily, origins, }: Omit<Parameters<typeof doInitializeCvvOnlyTokenExIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    initializeTokenExCardOnlyIframe: ({ css, fontFamily, debug, origins, }: Omit<Parameters<typeof doInitializeTokenExCardOnlyIframe>[0], "env" | "tokenExScriptLoaded" | "setCachedToken" | "setLoaded">) => Promise<TokenExIframe | undefined>;
    loaded: boolean;
    cachedToken: string | undefined;
    setTokenExScriptTag: typeof setTokenExScriptTag;
};
