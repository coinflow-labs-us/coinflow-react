import { TokenExIframe, TokenExIFrameConfiguration } from './TokenEx';
import { CardType, CoinflowEnvs } from '../CoinflowTypes';
export interface DoInitializeTokenExIframeArgs {
    css: string;
    debug?: boolean;
    font?: string;
    origins: string[] | undefined;
    tokenExScriptLoaded: boolean;
    env: CoinflowEnvs;
    setCachedToken: (s: string | undefined) => void;
    setLoaded: (b: boolean) => void;
}
export interface DoInitializeCvvOnlyTokenExIframeArgs extends DoInitializeTokenExIframeArgs {
    token: string;
    cardType: CardType;
}
export declare function getIframeConfig({ token, origins, env, }: {
    token?: string;
    origins: string[] | undefined;
    env: CoinflowEnvs;
}): Promise<TokenExIFrameConfiguration>;
export declare function setTokenExScriptTag({ env, setTokenExScriptLoaded, }: {
    env: CoinflowEnvs;
    setTokenExScriptLoaded: (b: boolean) => void;
}): void;
export declare function doInitializeCvvOnlyTokenExIframe(args: DoInitializeCvvOnlyTokenExIframeArgs): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExIframe(args: DoInitializeTokenExIframeArgs): Promise<TokenExIframe | undefined>;
export declare function doInitializeTokenExCardOnlyIframe(args: DoInitializeTokenExIframeArgs): Promise<TokenExIframe | undefined>;
