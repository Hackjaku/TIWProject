export interface BuyOfferNotificationDTO {
  tokenName: string;
  amout: number;
  currencySymbol: string;
  notificationType:BuyOfferNotificationType
}

enum BuyOfferNotificationType {
    BuyOfferCreated = 0,
    BuyOfferReceived = 1,
    BuyOfferAccepted = 2,
    BuyOfferRejected = 3,
    BuyOfferCancelled = 4
}

export interface SellOfferNotificationDTO {
  tokenName: string;
  amount: number;
  currencySymbol: string;
}

export interface WalletNotificationDTO {
  currencySymbol: string;
  amount: number;
  username: string;
  walletId: string;
}

export interface TokenNotificationDTO {
  name: string;
  creatorName: string;
}

export interface ExchangeOfferNotificationDTO {
  requestingCurrencySymbol: string;
  givingCurrencySymbol: string;
  givingAmount: number;
  requestingAmount: number;
}
