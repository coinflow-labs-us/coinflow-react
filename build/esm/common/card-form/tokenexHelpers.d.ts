import { CardType, CoinflowEnvs } from '../CoinflowTypes';
import { TokenExIframe, TokenExIFrameConfiguration } from './cardFormTypes';
export declare function getIframeConfig({ token, origins, env, }: {
    token?: string;
    origins: string[] | undefined;
    env: CoinflowEnvs;
}): Promise<TokenExIFrameConfiguration>;
export declare function setTokenExScriptTag({ env, setTokenExScriptLoaded, }: {
    env: CoinflowEnvs;
    setTokenExScriptLoaded: (b: boolean) => void;
}): void;
export declare function doInitializeCvvOnlyTokenExIframe({ token, cardType, css, debug, fontFamily, origins, tokenExScriptLoaded, env, setCachedToken, setLoaded, }: {
    token: string;
    cardType: CardType;
    css: string;
    debug?: boolean;
    fontFamily?: string;
    origins: string[] | undefined;
    tokenExScriptLoaded: boolean;
    env: CoinflowEnvs;
    setCachedToken: (s: string | undefined) => void;
    setLoaded: (b: boolean) => void;
}): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExIframe({ css, debug, fontFamily, origins, tokenExScriptLoaded, env, setCachedToken, setLoaded, }: {
    css: string;
    debug?: boolean;
    fontFamily?: string;
    origins: string[] | undefined;
    tokenExScriptLoaded: boolean;
    env: CoinflowEnvs;
    setCachedToken: (s: string | undefined) => void;
    setLoaded: (b: boolean) => void;
}): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExCardOnlyIframe({ css, debug, fontFamily, origins, tokenExScriptLoaded, env, setCachedToken, setLoaded, }: {
    css: string;
    debug?: boolean;
    fontFamily?: string;
    origins: string[] | undefined;
    tokenExScriptLoaded: boolean;
    env: CoinflowEnvs;
    setCachedToken: (s: string | undefined) => void;
    setLoaded: (b: boolean) => void;
}): Promise<TokenExIframe | undefined>;
