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

export interface SimpleTransactionHistoryDTO {
  WalletId: string;
  Amount: number;
  Timestamp: Date;
  IsSent: boolean;
}
