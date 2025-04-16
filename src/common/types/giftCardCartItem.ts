import {RecipientInfo, SellerInfo} from './CartitemCommon';

export interface GiftCardCartItem {
  itemClass: 'giftCard';
  productType: 'giftCard';

  /**
   * The cart items’s unique ID
   */
  id: string;
  /**
   * The number of units sold
   */
  quantity: number;
  /**
   * How the product was fulfilled.
   */
  itemFulfillment: 'digital' | 'physical';
  sellingPrice: {
    valueInCurrency: number;
    currency: string;
  };

  /**
   * Any additional product data which can be provided, e.g. description, link to image, etc
   */
  rawProductData?: Record<string, any>;

  /**
   * The stock-keeping unit (SKU) number
   */
  sku?: string;
  /**
   * The name of the brand
   */
  brand?: string;
  /**
   * The category in the site/app in which the item was classified (e.g., fashion)
   */
  categories?: string[];
  listPrice?: {
    valueInCurrency: number;
    currency: string;
  };

  isGift?: boolean;

  /**
   * The user's personal info
   */
  recipientInfo?: RecipientInfo;
  /**
   * The item's selling price
   */
  seller?: SellerInfo;

  /**
   * The expected delay in delivery, in hours
   */
  expectedDeliveryDelay?: number;
  /**
   * Represents whether the item amount is taken from a preset list, e.g. 25, 50, 100, etc. or whether it was a different amount, e.g. 27
   */
  isPresetAmount?: boolean;
}
