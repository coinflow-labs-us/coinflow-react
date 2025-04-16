import {RecipientInfo, SellerInfo} from './CartitemCommon';

/**
 * Represents a crypto item in a shopping cart
 */
export interface CryptoCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: crypto
   * Example: crypto
   */
  itemClass: 'crypto';

  /**
   * The cart items's unique ID
   * Example: 5de33332-546a-4171-8988-2a43d2bfe9c6
   */
  id?: string;

  /**
   * Any additional product data which can be provided, e.g. description, link to image, etc
   * Example: {"any":"data","description":"This is the product description"}
   */
  rawProductData?: Record<string, any>;

  /**
   * The amount in the crypto currency which is specified in the `cryptoCurrency` property
   * Example: 1.04112
   * Pattern: ^[0-9]+(\.[0-9]+)?$
   */
  units: string;

  /**
   * The crypto-currency symbol (uppercase)
   * Example: BTC
   * Pattern: ^[A-Z0-9-]+$
   */
  cryptoCurrency: string;

  /**
   * The price per 1 unit
   */
  unitPrice: {
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
  };

  /**
   * The expected delay in delivery, in hours
   * Min value: 0
   */
  expectedDeliveryDelay?: number;

  /**
   * The user's personal info
   */
  recipientInfo: RecipientInfo;

  /**
   * Seller info
   */
  seller?: SellerInfo;
}
