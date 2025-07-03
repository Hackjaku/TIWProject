export interface CreateCurrencyDTO {
  Symbol: string;
  Name: string;
  MarketCap: number | null;
  GeneratedBalance: number
}

export interface GenerateCurrencyDTO {
  CurrencyId: string;
  Amount: number;
}

export interface Currency {
  Id: string;
  Symbol: string;
  Name: string;
  OwnerId: number;
  MarketCap: number | null;
  GeneratedBalance: number
}
