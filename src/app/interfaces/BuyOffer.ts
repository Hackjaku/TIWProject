export interface CreateBuyOfferDTO {
  TokenId: string;
  WalletId: string;
  Amount: number;
}

export interface BuyOfferDTO extends BuyOfferSimpleDTO {
  TokenDescription: string | null;
  TokenLink: string;
  WalletId: string;
}

export interface BuyOfferSimpleDTO {
  Id: string;
  TokenId: string;
  TokenName: string;
  WalletCurrencySymbol: string;
  Amount: number;
  UserId: number;
}

export interface PersonalBuyOffersDTO {
  OutgoingBuyOffers: BuyOfferDTO[];
  IncomingBuyOffers: BuyOfferDTO[];
}
