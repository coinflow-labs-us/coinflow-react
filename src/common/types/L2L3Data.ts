import {Cents} from './Subtotal';

export type L2L3Tax = {taxExempt: false; salesTax: Cents} | {taxExempt: true};

export type L2L3Level2 = L2L3Tax & {
  /**
   * @minLength 1
   * @maxLength 15
   * @pattern ^[a-zA-Z0-9\x20@!£*#$)(+_=.,/;:'"-]+$
   */
  invoiceReference?: string;
};

export interface L2L3Item {
  /**
   * @minLength 1
   * @maxLength 26
   * @pattern ^[a-zA-Z0-9\x20@!£*#$)(+_=.,/;:'"-]+$
   */
  name: string;
  /**
   * @minLength 1
   * @maxLength 12
   * @pattern ^[a-zA-Z0-9\x20@!£*#$)(+_=.,/;:'"-]+$
   */
  productCode: string;
  /**
   * @isInt
   * @minimum 1
   */
  quantity: number;
  unitCost: Cents;
  /**
   * @minLength 1
   * @maxLength 8
   * @pattern ^[a-zA-Z0-9\x20@!£*#$)(+_=.,/;:'"-]+$
   */
  unitOfMeasure: string;
  /**
   * NIGP commodity code
   * @minLength 1
   * @maxLength 12
   * @pattern ^[a-zA-Z0-9\x20@!£*#$)(+_=.,/;:'"-]+$
   */
  commodityCode: string;
  totalTaxAmount: Cents;
  totalDiscountAmount: Cents;
  totalAmountNoTax: Cents;
  totalAmount: Cents;
}

export interface L2L3Level3 {
  discountAmount: Cents;
  shippingAmount: Cents;
  dutyAmount: Cents;
  shipping: {
    /**
     * @minLength 1
     * @maxLength 10
     * @pattern ^[a-zA-Z0-9\x20]+$
     */
    postalCode: string;
    /**
     * @pattern ^[A-Z]{2}$
     */
    countryCode: string;
  };
  /**
   * @minItems 1
   * @maxItems 99
   */
  items: L2L3Item[];
}

export type L2L3Data =
  | {level: 'level2'; level2: L2L3Level2}
  | {
      level: 'level3';
      level2: L2L3Level2;
      level3: L2L3Level3;
    };
