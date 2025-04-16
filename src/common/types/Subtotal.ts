export enum Currency {
  AED = 'AED',
  AFN = 'AFN',
  ALL = 'ALL',
  ANG = 'ANG',
  AOA = 'AOA',
  AUD = 'AUD',
  AWG = 'AWG',
  AZN = 'AZN',
  BAM = 'BAM',
  BBD = 'BBD',
  BDT = 'BDT',
  BGN = 'BGN',
  BHD = 'BHD',
  BIF = 'BIF',
  BND = 'BND',
  BOB = 'BOB',
  BRL = 'BRL',
  BTN = 'BTN',
  BWP = 'BWP',
  BZD = 'BZD',
  CAD = 'CAD',
  CHF = 'CHF',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CRC = 'CRC',
  CVE = 'CVE',
  CZK = 'CZK',
  DJF = 'DJF',
  DKK = 'DKK',
  DOP = 'DOP',
  DZD = 'DZD',
  EGP = 'EGP',
  ETB = 'ETB',
  EUR = 'EUR',
  GBP = 'GBP',
  GEL = 'GEL',
  GHS = 'GHS',
  GMD = 'GMD',
  GNF = 'GNF',
  GTQ = 'GTQ',
  GYD = 'GYD',
  HKD = 'HKD',
  HNL = 'HNL',
  HTG = 'HTG',
  HUF = 'HUF',
  IDR = 'IDR',
  INR = 'INR',
  IQD = 'IQD',
  IRR = 'IRR',
  ISK = 'ISK',
  JMD = 'JMD',
  JOD = 'JOD',
  JPY = 'JPY',
  KES = 'KES',
  KGS = 'KGS',
  KHR = 'KHR',
  KMF = 'KMF',
  KRW = 'KRW',
  KWD = 'KWD',
  KYD = 'KYD',
  KZT = 'KZT',
  LKR = 'LKR',
  LRD = 'LRD',
  LSL = 'LSL',
  LYD = 'LYD',
  MAD = 'MAD',
  MDL = 'MDL',
  MGA = 'MGA',
  MKD = 'MKD',
  MMK = 'MMK',
  MNT = 'MNT',
  MOP = 'MOP',
  MRU = 'MRU',
  MUR = 'MUR',
  MVR = 'MVR',
  MXN = 'MXN',
  MYR = 'MYR',
  NAD = 'NAD',
  NGN = 'NGN',
  NIO = 'NIO',
  NOK = 'NOK',
  NPR = 'NPR',
  NZD = 'NZD',
  OMR = 'OMR',
  PAB = 'PAB',
  PEN = 'PEN',
  PHP = 'PHP',
  PKR = 'PKR',
  PLN = 'PLN',
  PYG = 'PYG',
  QAR = 'QAR',
  RON = 'RON',
  RSD = 'RSD',
  RWF = 'RWF',
  SAR = 'SAR',
  SCR = 'SCR',
  SDG = 'SDG',
  SEK = 'SEK',
  SGD = 'SGD',
  SLE = 'SLE',
  SLL = 'SLL',
  SOS = 'SOS',
  STN = 'STN',
  SVC = 'SVC',
  SYP = 'SYP',
  SZL = 'SZL',
  THB = 'THB',
  TJS = 'TJS',
  TMT = 'TMT',
  TND = 'TND',
  TRY = 'TRY',
  TTD = 'TTD',
  TWD = 'TWD',
  TZS = 'TZS',
  UAH = 'UAH',
  UGX = 'UGX',
  USD = 'USD',
  UYU = 'UYU',
  UZS = 'UZS',
  VND = 'VND',
  XAF = 'XAF',
  XCD = 'XCD',
  XOF = 'XOF',
  XPF = 'XPF',
  YER = 'YER',
  ZAR = 'ZAR',
  ZMW = 'ZMW',
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

export interface TypedCurrencyCents<T extends Currency> extends Cents {
  currency: T;
}

export function isTypedCurrencyCents<T extends Currency>(
  cents: CurrencyCents,
  currency: T
): cents is TypedCurrencyCents<T> {
  return cents.currency === currency;
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
