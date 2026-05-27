export interface AirbnbListing {
  id:          string;
  thumbnail:   string;
  title:       string;
  description: string;
  rating:      Rating;
  price:       Price;
  coordinates: Coordinates;
  url:         string;
}

export interface Coordinates {
  latitude:  number;
  longitude: number;
}

export interface Price {
  label:           string;
  qualifier:       Qualifier;
  price:           string;
  originalPrice:   null | string;
  discountedPrice: null | string;
  breakDown:       BreakDown;
}

export interface BreakDown {
  basePrice:          BasePrice;
  basePriceBreakdown: any[];
  serviceFee:         null;
  taxes:              BasePrice;
  total:              BasePrice;
  totalBeforeTaxes:   null;
  cleaningFee:        null;
  specialOffer:       BasePrice | null;
  earlyBirdDiscount:  null;
}

export interface BasePrice {
  description: string;
  price:       string;
}

export enum Qualifier {
  Total = "total",
}

export interface Rating {
  accuracy:          number;
  checking:          number;
  cleanliness:       number;
  communication:     number;
  location:          number;
  value:             number;
  guestSatisfaction: number;
  reviewsCount:      number;
}
