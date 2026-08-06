import {CurrencyAmount, RecipientInfo} from './CartitemCommon';
import {AnyObject} from './AnyObject';
import {TravelFirstFlight, TravelTrip} from './travelCartItem';

/**
 * Represents a flight ticket item in a shopping cart
 */
export interface FlightTicketCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: flightTicket
   * Example: flightTicket
   */
  itemClass: 'flightTicket';

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
  pnr: string;

  /**
   * The trip details of the flight ticket
   */
  trip: TravelTrip;

  /**
   * The first flight details of the trip
   */
  firstFlight: TravelFirstFlight;
}
