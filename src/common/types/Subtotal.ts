export enum Currency {
  USD = 'USD',
  AED = 'AED',
  AFN = 'AFN',
  ALL = 'ALL',
  AMD = 'AMD',
  ANG = 'ANG',
  AOA = 'AOA',
  ARS = 'ARS',
  AUD = 'AUD',
  AWG = 'AWG',
  AZN = 'AZN',
  BAM = 'BAM',
  BBD = 'BBD',
  BDT = 'BDT',
  BGN = 'BGN',
  BHD = 'BHD',
  BIF = 'BIF',
  BMD = 'BMD',
  BND = 'BND',
  BOB = 'BOB',
  BRL = 'BRL',
  BSD = 'BSD',
  BTN = 'BTN',
  BWP = 'BWP',
  BYN = 'BYN',
  BZD = 'BZD',
  CAD = 'CAD',
  CHF = 'CHF',
  CLF = 'CLF',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CRC = 'CRC',
  CUP = 'CUP',
  CVE = 'CVE',
  CZK = 'CZK',
  DJF = 'DJF',
  DKK = 'DKK',
  DOP = 'DOP',
  DZD = 'DZD',
  EGP = 'EGP',
  ETB = 'ETB',
  EUR = 'EUR',
  FJD = 'FJD',
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
  ILS = 'ILS',
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
  LAK = 'LAK',
  LBP = 'LBP',
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
  MWK = 'MWK',
  MVR = 'MVR',
  MXN = 'MXN',
  MYR = 'MYR',
  MZN = 'MZN',
  NAD = 'NAD',
  NGN = 'NGN',
  NIO = 'NIO',
  NOK = 'NOK',
  NPR = 'NPR',
  NZD = 'NZD',
  OMR = 'OMR',
  PAB = 'PAB',
  PEN = 'PEN',
  PGK = 'PGK',
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
  SRD = 'SRD',
  STN = 'STN',
  SVC = 'SVC',
  SYP = 'SYP',
  SZL = 'SZL',
  THB = 'THB',
  TJS = 'TJS',
  TMT = 'TMT',
  TND = 'TND',
  TOP = 'TOP',
  TRY = 'TRY',
  TTD = 'TTD',
  TWD = 'TWD',
  TZS = 'TZS',
  UAH = 'UAH',
  UGX = 'UGX',
  UYU = 'UYU',
  UZS = 'UZS',
  VND = 'VND',
  VUV = 'VUV',
  WST = 'WST',
  XAF = 'XAF',
  XCD = 'XCD',
  XOF = 'XOF',
  XPF = 'XPF',
  YER = 'YER',
  ZAR = 'ZAR',
  ZMW = 'ZMW',
  ZWL = 'ZWL',

  CDF = 'CDF',
  ERN = 'ERN',
  FKP = 'FKP',
  KPW = 'KPW',
  RUB = 'RUB',
  SBD = 'SBD',
  SHP = 'SHP',
  SSP = 'SSP',
  VES = 'VES',
}

export const CurrencyToISO4217: Record<Currency, string> = {
  [Currency.AED]: '784',
  [Currency.AFN]: '971',
  [Currency.ALL]: '008',
  [Currency.AMD]: '051',
  [Currency.ANG]: '532',
  [Currency.AOA]: '973',
  [Currency.AUD]: '036',
  [Currency.AWG]: '533',
  [Currency.AZN]: '944',
  [Currency.BAM]: '977',
  [Currency.BBD]: '052',
  [Currency.BDT]: '050',
  [Currency.BGN]: '975',
  [Currency.BHD]: '048',
  [Currency.BIF]: '108',
  [Currency.BND]: '096',
  [Currency.BOB]: '068',
  [Currency.BRL]: '986',
  [Currency.BTN]: '064',
  [Currency.BWP]: '072',
  [Currency.BZD]: '084',
  [Currency.CAD]: '124',
  [Currency.CHF]: '756',
  [Currency.CLP]: '152',
  [Currency.CNY]: '156',
  [Currency.COP]: '170',
  [Currency.CRC]: '188',
  [Currency.CVE]: '132',
  [Currency.CZK]: '203',
  [Currency.DJF]: '262',
  [Currency.DKK]: '208',
  [Currency.DOP]: '214',
  [Currency.DZD]: '012',
  [Currency.EGP]: '818',
  [Currency.ETB]: '230',
  [Currency.EUR]: '978',
  [Currency.GBP]: '826',
  [Currency.GEL]: '981',
  [Currency.GHS]: '936',
  [Currency.GMD]: '270',
  [Currency.GNF]: '324',
  [Currency.GTQ]: '320',
  [Currency.GYD]: '328',
  [Currency.HKD]: '344',
  [Currency.HNL]: '340',
  [Currency.HTG]: '332',
  [Currency.HUF]: '348',
  [Currency.IDR]: '360',
  [Currency.INR]: '356',
  [Currency.IQD]: '368',
  [Currency.IRR]: '364',
  [Currency.ISK]: '352',
  [Currency.JMD]: '388',
  [Currency.JOD]: '400',
  [Currency.JPY]: '392',
  [Currency.KES]: '404',
  [Currency.KGS]: '417',
  [Currency.KHR]: '116',
  [Currency.KMF]: '174',
  [Currency.KRW]: '410',
  [Currency.KWD]: '414',
  [Currency.KYD]: '136',
  [Currency.KZT]: '398',
  [Currency.LKR]: '144',
  [Currency.LRD]: '430',
  [Currency.LSL]: '426',
  [Currency.LYD]: '434',
  [Currency.MAD]: '504',
  [Currency.MDL]: '498',
  [Currency.MGA]: '969',
  [Currency.MKD]: '807',
  [Currency.MMK]: '104',
  [Currency.MNT]: '496',
  [Currency.MOP]: '446',
  [Currency.MRU]: '929',
  [Currency.MUR]: '480',
  [Currency.MVR]: '462',
  [Currency.MXN]: '484',
  [Currency.MYR]: '458',
  [Currency.NAD]: '516',
  [Currency.NGN]: '566',
  [Currency.NIO]: '558',
  [Currency.NOK]: '578',
  [Currency.NPR]: '524',
  [Currency.NZD]: '554',
  [Currency.OMR]: '512',
  [Currency.PAB]: '590',
  [Currency.PEN]: '604',
  [Currency.PHP]: '608',
  [Currency.PKR]: '586',
  [Currency.PLN]: '985',
  [Currency.PYG]: '600',
  [Currency.QAR]: '634',
  [Currency.RON]: '946',
  [Currency.RSD]: '941',
  [Currency.RWF]: '646',
  [Currency.SAR]: '682',
  [Currency.SCR]: '690',
  [Currency.SDG]: '938',
  [Currency.SEK]: '752',
  [Currency.SGD]: '702',
  [Currency.SLE]: '925',
  [Currency.SLL]: '694',
  [Currency.SOS]: '706',
  [Currency.STN]: '930',
  [Currency.SVC]: '222',
  [Currency.SYP]: '760',
  [Currency.SZL]: '748',
  [Currency.THB]: '764',
  [Currency.TJS]: '972',
  [Currency.TMT]: '934',
  [Currency.TND]: '788',
  [Currency.TRY]: '949',
  [Currency.TTD]: '780',
  [Currency.TWD]: '901',
  [Currency.TZS]: '834',
  [Currency.UAH]: '980',
  [Currency.UGX]: '800',
  [Currency.USD]: '840',
  [Currency.UYU]: '858',
  [Currency.UZS]: '860',
  [Currency.VND]: '704',
  [Currency.XAF]: '950',
  [Currency.XCD]: '951',
  [Currency.XOF]: '952',
  [Currency.XPF]: '953',
  [Currency.YER]: '886',
  [Currency.ZAR]: '710',
  [Currency.ZMW]: '967',
  [Currency.ARS]: '032',
  [Currency.BMD]: '060',
  [Currency.BSD]: '044',
  [Currency.BYN]: '933',
  [Currency.CUP]: '192',
  [Currency.FJD]: '242',
  [Currency.ILS]: '376',
  [Currency.LAK]: '418',
  [Currency.LBP]: '422',
  [Currency.MWK]: '454',
  [Currency.MZN]: '943',
  [Currency.PGK]: '598',
  [Currency.SRD]: '968',
  [Currency.TOP]: '776',
  [Currency.VUV]: '548',
  [Currency.WST]: '882',
  [Currency.ZWL]: '932',
  [Currency.CLF]: '990',
  [Currency.CDF]: '976',
  [Currency.ERN]: '232',
  [Currency.FKP]: '238',
  [Currency.KPW]: '408',
  [Currency.RUB]: '643',
  [Currency.SBD]: '090',
  [Currency.SHP]: '654',
  [Currency.SSP]: '728',
  [Currency.VES]: '928',
};

export type WithdrawCurrency =
  | Currency.USD
  | Currency.EUR
  | Currency.GBP
  | Currency.BRL
  | Currency.CAD;

export const WithdrawCurrencies = {
  [Currency.USD]: Currency.USD,
  [Currency.EUR]: Currency.EUR,
  [Currency.GBP]: Currency.GBP,
  [Currency.BRL]: Currency.BRL,
  [Currency.CAD]: Currency.CAD,
} as const;

export function isWithdrawCurrency(
  currency: Currency
): currency is WithdrawCurrency {
  return currency in WithdrawCurrencies;
}

export type BankingCurrency =
  | Currency.USD
  | Currency.EUR
  | Currency.GBP
  | Currency.CAD
  | Currency.BRL;

export const BankingCurrencies = {
  [Currency.USD]: Currency.USD,
  [Currency.EUR]: Currency.EUR,
  [Currency.GBP]: Currency.GBP,
  [Currency.CAD]: Currency.CAD,
  [Currency.BRL]: Currency.BRL,
} as const;

export function isBankingCurrency(
  currency: Currency
): currency is BankingCurrency {
  return currency in BankingCurrencies;
}

const FourDecimalCurrencies = new Set<Currency>([Currency.CLF]);

const ThreeDecimalCurrencies = new Set<Currency>([
  Currency.BHD,
  Currency.IQD,
  Currency.JOD,
  Currency.KWD,
  Currency.LYD,
  Currency.OMR,
  Currency.TND,
]);

const ZeroDecimalCurrencies = new Set<Currency>([
  Currency.BIF,
  Currency.CLP,
  Currency.DJF,
  Currency.GNF,
  Currency.ISK,
  Currency.JPY,
  Currency.KMF,
  Currency.PYG,
  Currency.RWF,
  Currency.UGX,
  Currency.VND,
  Currency.VUV,
  Currency.XAF,
  Currency.XOF,
  Currency.XPF,
]);

export function getCurrencyDecimals(currency: Currency): number {
  if (FourDecimalCurrencies.has(currency)) return 4;
  if (ThreeDecimalCurrencies.has(currency)) return 3;
  if (ZeroDecimalCurrencies.has(currency)) return 0;
  return 2;
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
