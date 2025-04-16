/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import {AnyObject} from './AnyObject';

/**
 * An nft cart item
 */
export type nftCartItem = {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value
   */
  itemClass: 'nft';
  /**
   * The name of the related product
   *
   * @minLength 1
   */
  productName: string;
  /**
   * The product type. Possible values include: inGameProduct, gameOfSkill, dataStorage, computingResources, sportsTicket, eSportsTicket, musicTicket, conferenceTicket, virtualSportsTicket, virtualESportsTicket, virtualMusicTicket, virtualConferenceTicket, alcohol, DLC, subscription, fundACause, realEstate, computingContract, digitalArt, topUp
   */
  productType: productType;
  /**
   * The item's list price
   */
  listPrice?: {
    /**
     * The amount in the currency, which is specified in the `currency` property
     */
    valueInCurrency?: number;
    /**
     * Currency specified as a three letter code according to ISO 4217
     */
    currency?: string;
  };
  /**
   * The item's list price
   */
  sellingPrice: {
    /**
     * The amount in the currency, which is specified in the `currency` property
     */
    valueInCurrency?: number;
    /**
     * Currency specified as a three-letter code according to ISO 4217
     */
    currency?: string;
  };
  /**
   * The number of units sold
   */
  quantity: number;
  /**
   * Any additional data that the store can provide on the product, e.g. description, link to image, etc.
   */
  rawProductData?: AnyObject;
  seller?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    rawSellerData: Record<string, any>;
  };
};

export type productType =
  | 'inGameProduct'
  | 'gameOfSkill'
  | 'dataStorage'
  | 'computingResources'
  | 'sportsTicket'
  | 'eSportsTicket'
  | 'musicTicket'
  | 'conferenceTicket'
  | 'virtualSportsTicket'
  | 'virtualESportsTicket'
  | 'virtualMusicTicket'
  | 'virtualConferenceTicket'
  | 'alcohol'
  | 'DLC'
  | 'subscription'
  | 'fundACause'
  | 'realEstate'
  | 'computingContract'
  | 'digitalArt'
  | 'topUp'
  | 'ownershipContract'
  | 'inGameCurrency';

export namespace nftCartItem {
  /**
   * Denotes the cart item class. The item schema is chosen based on this value
   */
  export enum itemClass {
    NFT = 'nft',
  }

  /**
   * The product type. Possible values include: inGameProduct, gameOfSkill, dataStorage, computingResources, sportsTicket, eSportsTicket, musicTicket, conferenceTicket, virtualSportsTicket, virtualESportsTicket, virtualMusicTicket, virtualConferenceTicket, alcohol, DLC, subscription, fundACause, realEstate, computingContract, digitalArt, topUp
   */
  export enum productType {
    IN_GAME_PRODUCT = 'inGameProduct',
    GAME_OF_SKILL = 'gameOfSkill',
    DATA_STORAGE = 'dataStorage',
    COMPUTING_RESOURCES = 'computingResources',
    SPORTS_TICKET = 'sportsTicket',
    E_SPORTS_TICKET = 'eSportsTicket',
    MUSIC_TICKET = 'musicTicket',
    CONFERENCE_TICKET = 'conferenceTicket',
    VIRTUAL_SPORTS_TICKET = 'virtualSportsTicket',
    VIRTUAL_ESPORTS_TICKET = 'virtualESportsTicket',
    VIRTUAL_MUSIC_TICKET = 'virtualMusicTicket',
    VIRTUAL_CONFERENCE_TICKET = 'virtualConferenceTicket',
    ALCOHOL = 'alcohol',
    DLC = 'DLC',
    SUBSCRIPTION = 'subscription',
    FUND_ACAUSE = 'fundACause',
    REAL_ESTATE = 'realEstate',
    COMPUTING_CONTRACT = 'computingContract',
    DIGITAL_ART = 'digitalArt',
    TOP_UP = 'topUp',
    OWNERSHIP_CONTRACT = 'ownershipContract',
    IN_GAME_CURRENCY = 'inGameCurrency',
    MONEY_TOP_UP_CART_ITEM = 'moneyTopUpCartItem',
  }
}
