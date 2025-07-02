export interface WalletDTO {
  WalletId: string;
  CurrencyId: string;
  CurrencySymbol: string;
  CurrencyName: string;
  AvailableBalance: number;
  FrozenBalance: number;
}

export interface WalletPieChartData {
  Currency: string;
  Balance: number;
}
