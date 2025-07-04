export interface CreateBuyOfferDTO {
  TokenId: string;
  WalletId: string;
  Amount: number;
}

export interface BuyOfferDTO {
  Id: string;
  TokenId: string;
  TokenName: string;
  TokenDescription: string | null;
  TokenLink: string;
  WalletId: string;
  WalletCurrencySymbol: string;
  Amount: number;
}

export interface PersonalBuyOffersDTO {
  OutgingBuyOffers: BuyOfferDTO[];
  IncomingBuyOffers: BuyOfferDTO[];
}
