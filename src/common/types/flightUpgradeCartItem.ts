import {CurrencyAmount, RecipientInfo} from './CartitemCommon';
import {AnyObject} from './AnyObject';

/**
 * Represents a flight upgrade item in a shopping cart
 */
export interface FlightUpgradeCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: flightUpgrade
   * Example: flightUpgrade
   */
  itemClass: 'flightUpgrade';

  /**
   * The cart items's unique ID
   * Example: 5de33332-546a-4171-8988-2a43d2bfe9c6
   */
  id?: string;

  /**
   * Any additional product data which can be provided, e.g. description, link to image, etc
   * Example: {"any":"data","description":"This is the product description"}
   */
  rawProductData?: AnyObject;

  /**
   * The item's selling price
   */
  sellingPrice: CurrencyAmount;

  /**
   * The item's list price
   */
  listPrice?: CurrencyAmount;

  /**
   * The user's personal info
   */
  recipientInfo?: RecipientInfo;

  /**
   * The flight ticket's PNR code
   * Example: X36Q9C
   */
  pnr?: string;

  /**
   * The type of upgrade
   * Example: changes
   */
  upgradeType:
    | 'changes'
    | 'fareIncrease'
    | 'baggage'
    | 'seats'
    | 'insurance'
    | 'other';

  /**
   * The upgrade description, required when the upgrade type is `other`
   */
  description?: string;
}
