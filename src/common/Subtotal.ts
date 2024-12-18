export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  BRL = 'BRL',
}

export interface Cents {
  /**
   * @isInt Cents must be an integer
   * @minimum 0 Minimum Cents is 0
   */
  cents: number;
}

export interface CurrencyCents extends Cents {
  currency: Currency;
}

export interface TokenSubtotal {
  /**
   * The tokens address
   *
   * Solana - Token Mint Address
   * Evm - Token Contract Address
   */
  address: string;
  /**
   * Number of tokens
   */
  amount: number | string;
  /**
   * Number of decimals for the token
   */
  decimals?: number;
}

export type Subtotal = CurrencyCents | Cents | TokenSubtotal;

export interface NearDeposit {
  yocto: string;
}
