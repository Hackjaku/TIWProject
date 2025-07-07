export interface SimpleTransactionDTO {
  FromWalletId: string | null;
  ToWalletId: string;
  Amount: number;
  Timestamp: Date
}

export interface DailyTransactionsDTO {
  Date: Date;
  SentTransactions: SimpleTransactionDTO[];
  ReceivedTransactions: SimpleTransactionDTO[];
  WalletBalance: number;
}
