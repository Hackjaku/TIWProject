export interface BuyOfferNotificationDTO {
  TokenName: string;
  Amout: number;
  CurrencySymbol: string;
  NotificationType:BuyOfferNotificationType
}

enum BuyOfferNotificationType {
    BuyOfferCreated = 0,
    BuyOfferReceived = 1,
    BuyOfferAccepted = 2,
    BuyOfferRejected = 3,
    BuyOfferCancelled = 4
}

export interface SellOfferNotificationDTO {
  TokenName: string;
  Amount: number;
  CurrencySymbol: string;
}
