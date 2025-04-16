import {CurrencyAmount, RecipientInfo} from './CartitemCommon';

/**
 * Represents a money top-up item in a shopping cart
 */
export interface MoneyTopUpCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: moneyTopUp
   * Example: moneyTopUp
   */
  itemClass: 'moneyTopUp';

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
   * The item's selling price
   */
  sellingPrice: CurrencyAmount;

  /**
   * The user's personal info
   */
  recipientInfo?: RecipientInfo;

  /**
   * The item's topUp amount
   */
  topUpAmount: CurrencyAmount;

  /**
   * Quantity
   * Example: 2
   */
  quantity: number;

  /**
   * Represents whether the item amount is taken from a preset list, e.g. 25, 50, 100, etc.
   * or whether it was a different amount, e.g. 27
   */
  isPresetAmount: boolean;
}
