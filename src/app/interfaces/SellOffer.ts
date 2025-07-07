export interface CreateSellOfferDTO {
  TokenId: string;
  CurrencyId: string;
  Amount: number;
}

export interface SellOfferDTO extends SellOfferSimpleDTO {
  TokenDescription: string | null;
  TokenLink: string;
  CurrencyId: string;
  OwnerId: number;
  OwnerName: string;
}

export interface SellOfferSimpleDTO {
  Id: string,
  TokenId: string;
  TokenName: string;
  CurrencySymbol: string;
  Amount: number;
}
