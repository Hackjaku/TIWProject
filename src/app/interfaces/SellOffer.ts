export interface CreateSellOfferDTO {
  TokenId: string;
  CurrencyId: string;
  Amount: number;
}

export interface SellOfferDTO {
  Id: string,
  TokenId: string;
  TokenName: string;
  TokenDescription: string | null;
  TokenLink: string;
  CurrencyId: string;
  CurrencySymbol: string;
  Amount: number;
  OwnerId: number;
  OwnerName: string;
}
