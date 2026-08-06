import {CurrencyAmount, RecipientInfo} from './CartitemCommon';
import {AnyObject} from './AnyObject';
import {TravelLodging} from './travelCartItem';

/**
 * Represents a lodging reservation item in a shopping cart.
 * The reservation fields are flattened at the top level of the item.
 */
export interface LodgingCartItem extends TravelLodging {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: lodging
   * Example: lodging
   */
  itemClass: 'lodging';

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
}
