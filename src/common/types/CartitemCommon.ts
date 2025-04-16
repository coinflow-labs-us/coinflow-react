/**
 * Address structure
 */
export interface Address {
  /**
   * Country code specified as a two letter code according to ISO 3166 Alpha-2
   * Between 2 and 2 characters
   * Example: US
   * Pattern: ^[A-Z]{2}$
   */
  country?: string;

  /**
   * The state or province
   * Example: PA
   */
  state?: string;

  /**
   * The city or locality
   * Example: Pittsburgh
   */
  city?: string;

  /**
   * The street name
   * Example: Baker St
   */
  street?: string;

  /**
   * The address postal code
   */
  postalCode?: string;
}

/**
 * Phone information structure
 */
export interface PhoneInfo {
  /**
   * The mobile carrier
   * Example: T-Mobile
   */
  carrier?: string;

  /**
   * The country code (leading `+` is optional)
   * Example: 42
   * Pattern: ^\+?[0-9]+$
   */
  countryCode: string;

  /**
   * The phone number without the country code or hyphens
   * Example: 2025550169
   * Pattern: ^[0-9]+$
   */
  phone: string;
}

/**
 * Common currency amount structure
 */
export interface CurrencyAmount {
  /**
   * The amount in the currency, which is specified in the `currency` property
   * Example: 90
   */
  valueInCurrency: number;

  /**
   * Currency specified as a three letter code according to ISO 4217
   * Example: USD
   */
  currency: string;
}

export interface RecipientInfo {
  /**
   * The ID of the account that will receive the purchased goods
   */
  accountId?: string;

  /**
   * Date of birth, formatted as YYYY-MM-DD. If only the year is known, use YYYY
   * Pattern: ^\d{4}(-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))?$
   */
  dob?: string;

  /**
   * Email
   * Example: lois.lane@dailyplanet.com
   */
  email?: string | null;

  /**
   * First name
   * Example: Lois
   */
  firstName?: string;

  /**
   * Gender
   * Example: female
   */
  gender?: string;

  /**
   * Last name
   * Example: Lois
   */
  lastName?: string;

  /**
   * The message that the recipient will receive
   */
  message?: string;

  /**
   * A phone number descriptor
   */
  phoneInfo?: PhoneInfo;

  /**
   * Shipping address
   */
  shippingAddress?: Address;

  /**
   * The crypto wallet that will receive the funds
   */
  wallet?: {
    /**
     * The crypto wallet address that will receive the funds
     */
    address: string;

    /**
     * The blockchain on which the transaction was made
     * Example: BTC
     * Pattern: ^[A-Z0-9-]+$
     */
    blockchain: string;

    /**
     * The type of the wallet
     * Allowed values: custodial, nonCustodial, unknown
     * Example: custodial
     */
    custodialType: 'custodial' | 'nonCustodial' | 'unknown';
  };
}

export interface SellerInfo {
  /**
   * Id of the seller
   */
  id?: string;

  /**
   * Email
   * Example: lois.lane@dailyplanet.com
   */
  email?: string | null;

  /**
   * First name
   * Example: Lois
   */
  firstName?: string;

  /**
   * Last name
   * Example: Lois
   */
  lastName?: string;

  /**
   * Date of birth, formatted as YYYY-MM-DD. If only the year is known, use YYYY
   * Pattern: ^\d{4}(-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]))?$
   */
  dob?: string;

  /**
   * Additional raw data about the seller
   * Example: {"FeedbackCount":100,"FeedbackScore":99.5,"FirstSeenTimestamp":1731841819965,"LatestWithdrawal":3263,"OrderCount":101,"DisputeCount":2}
   */
  rawSellerData?: Record<string, any>;
}
