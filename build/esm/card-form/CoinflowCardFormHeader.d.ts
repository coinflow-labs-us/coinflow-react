import { CoinflowEnvs, MerchantIdOrCheckoutJwt } from '../common';
export declare function CoinflowCardFormHeader(props: {
    env: CoinflowEnvs;
} & MerchantIdOrCheckoutJwt): null;
/** @deprecated Use CoinflowCardForm instead — header is no longer needed */
export declare const CoinflowLegacyCardFormHeader: typeof CoinflowCardFormHeader;
