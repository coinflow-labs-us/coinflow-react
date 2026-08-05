import {CurrencyAmount, RecipientInfo} from './CartitemCommon';
import {AnyObject} from './AnyObject';

/**
 * The booked hotel details
 */
export interface TravelLodgingHotel {
  /**
   * The name of the hotel
   * Example: The Plaza Hotel
   */
  name: string;

  /**
   * The two-letter code of the country in which the hotel is located
   * Example: US
   * Pattern: ^[A-Z]{2}$
   */
  country: string;

  /**
   * The city in which the hotel is located
   * Example: New York
   */
  city: string;
}

/**
 * The lodging details of the travel booking
 */
export interface TravelLodging {
  /**
   * Hotel reservation id
   * Example: X36Q9C
   */
  reservationId: string;

  /**
   * The number of nights booked in the reservation
   * Min value: 1
   * Example: 2
   */
  nights: number;

  /**
   * The check-in date
   * Example: 2022-05-02
   */
  checkInDate: string;

  /**
   * The hour of day in which the check-in is done
   * Example: 18
   * Pattern: ^([01][0-9]|2[0-3])$
   */
  checkInHour: string;

  /**
   * The booked hotel details
   */
  hotel: TravelLodgingHotel;

  /**
   * Indicates whether extras were purchased in the reservation
   */
  wereExtrasPurchased: boolean;

  /**
   * Indicates whether the reservation is refundable
   */
  isRefundable: boolean;

  /**
   * The most luxurious room booked in the reservation
   * Example: Presidential Suite
   */
  highestRoomType: string;

  /**
   * The number of rooms booked in the reservation
   * Min value: 1
   * Example: 2
   */
  numberOfRooms: number;

  /**
   * The number of guests in the reservation
   * Min value: 1
   * Example: 4
   */
  numberOfGuests: number;

  /**
   * The number of kids, out of the number of guests in the reservation
   * Min value: 0
   * Example: 2
   */
  numberOfKids: number;
}

/**
 * The trip details of the travel booking
 */
export interface TravelTrip {
  /**
   * The number of flights in the trip
   * Min value: 1
   * Example: 2
   */
  numberOfFlights: number;

  /**
   * The number of checked bags
   * Min value: 0
   * Example: 1
   */
  numberOfCheckedBags: number;

  /**
   * The first-way destination's three-letter IATA airport code
   * Example: JFK
   * Pattern: ^[A-Z]{3}$
   */
  firstWayDestination: string;

  /**
   * `true` if the trip is a round-trip
   * Example: true
   */
  isRoundTrip: boolean;

  /**
   * `luxurious` if the highest bought travel class in the trip is a luxury class (business/first), `economy` otherwise
   * Example: luxurious
   */
  highestClass: 'economy' | 'luxurious';

  /**
   * True if the trip ticket is a flexible ticket
   * Example: true
   */
  isFlexibleTicket: boolean;

  /**
   * True if extras were included in the trip purchase
   * Example: true
   */
  wereExtrasPurchased: boolean;
}

/**
 * The first flight details of the trip
 */
export interface TravelFirstFlight {
  /**
   * The number of travelers in the first flight
   * Min value: 1
   * Example: 2
   */
  numberOfTravelers: number;

  /**
   * The timestamp of the departure, in *milliseconds* since the unix epoch
   * Example: 1551398400000
   */
  departureTime: number;

  /**
   * The first-flight departure airport's three-letter IATA code
   * Example: JFK
   * Pattern: ^[A-Z]{3}$
   */
  departureAirport: string;

  /**
   * The first-flight duration, in hours
   * Min value: 0
   * Example: 3.5
   */
  duration: number;

  /**
   * The alphanumeric flight code
   * Example: BA2491A
   * Pattern: ^[A-Z0-9]+$
   */
  flightNumber: string;
}

/**
 * Represents a travel booking item in a shopping cart
 */
export interface TravelCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value.
   * Allowed value: travel
   * Example: travel
   */
  itemClass: 'travel';

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
   * The lodging details of the travel booking
   */
  lodging: TravelLodging;

  /**
   * The flight ticket's PNR code
   * Example: X36Q9C
   */
  pnr: string;

  /**
   * The trip details of the travel booking
   */
  trip: TravelTrip;

  /**
   * The first flight details of the trip
   */
  firstFlight: TravelFirstFlight;
}
