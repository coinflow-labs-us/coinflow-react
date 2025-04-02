export enum Currency {
  USD = 'USD', // Dollar - USA
  EUR = 'EUR', // Euro - European Union
  GBP = 'GBP', // Pound - United Kingdom
  BRL = 'BRL', // Real - Brazil
  ARS = 'ARS', // Peso - Argentina
  BHD = 'BHD', // Dinar - Bahrain
  BWP = 'BWP', // Pula - Botswana
  BND = 'BND', // Dollar - Brunei
  BGN = 'BGN', // Lev - Bulgaria
  CLP = 'CLP', // Peso - Chile
  HRK = 'HRK', // Kuna - Croatia
  DJF = 'DJF', // Djibouti Franc - Djibouti
  DOP = 'DOP', // Peso - Dominican Republic
  EGP = 'EGP', // Pounds - Egypt
  GEL = 'GEL', // Lari - Georgia
  HUF = 'HUF', // Forint - Hungary
  ISK = 'ISK', // Krona - Iceland
  INR = 'INR', // Rupees - India
  ILS = 'ILS', // New Shekel - Israel
  JMD = 'JMD', // Dollar - Jamaica
  JOD = 'JOD', // Dinar - Jordan
  KZT = 'KZT', // Tenge - Kazakhstan
  KWD = 'KWD', // Dinar - Kuwait
  KGS = 'KGS', // Som - Kyrgyzstan
  LVL = 'LVL', // Lat - Latvia
  LTL = 'LTL', // Litai - Lithuania
  MWK = 'MWK', // Kwacha - Malawi
  MYR = 'MYR', // Ringgit - Malaysia
  MUR = 'MUR', // Rupee - Mauritius
  MXN = 'MXN', // Peso - Mexico
  MAD = 'MAD', // Dirham - Morocco
  NAD = 'NAD', // Dollar - Namibia
  NZD = 'NZD', // Dollars - New Zealand
  PEN = 'PEN', // Nuevo Sol - Peru
  PHP = 'PHP', // Peso - Philippines
  PLN = 'PLN', // Zloty - Poland
  RON = 'RON', // Leu - Romania
  SAR = 'SAR', // Riyal - Saudi Arabia
  SGD = 'SGD', // Dollar - Singapore
  LKR = 'LKR', // Rupee - Sri Lanka
  TWD = 'TWD', // New Dollar - Taiwan
  TZS = 'TZS', // Shilling - Tanzania
  THB = 'THB', // Baht - Thailand
  TRY = 'TRY', // New Lira - Turkey
  UAH = 'UAH', // Hryvnia - Ukraine
}

export type WithdrawCurrency =
  | Currency.USD
  | Currency.EUR
  | Currency.GBP
  | Currency.BRL;

export const WithdrawCurrencies = {
  [Currency.USD]: Currency.USD,
  [Currency.EUR]: Currency.EUR,
  [Currency.GBP]: Currency.GBP,
  [Currency.BRL]: Currency.BRL,
} as const;

export function isWithdrawCurrency(
  currency: Currency
): currency is WithdrawCurrency {
  return currency in WithdrawCurrencies;
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
