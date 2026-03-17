// Type definitions for TokenEx iframe integration
/// <reference path="./TokenEx.global.d.ts" />
import { CardType } from '../CoinflowTypes';
export const TokenExCardNumberIframeId = 'tokenExCardNumber';
export const TokenExCvvContainerID = 'tokenExCardCvv';
export const CARD_TYPE_MAPPING = {
    [CardType.VISA]: 'visa',
    [CardType.MASTERCARD]: 'masterCard',
    [CardType.AMEX]: 'americanExpress',
    [CardType.DISCOVER]: 'discover',
};
//# sourceMappingURL=TokenEx.js.map