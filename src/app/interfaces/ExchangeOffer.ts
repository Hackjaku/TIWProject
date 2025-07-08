import { NumberValueAccessor } from "@angular/forms";

export interface ExchangeOfferDTO {
  Id: string;
  RequestingCurrencyId: string;
  RequestingCurrencySymbol: string;
  WalletId: string;
  GivingCurrencyId: string;
  GivingCurrencySymbol: string;
  GivingAmount: number;
  RequestingAmount: number;
  UserId: number;
  UserName: string;
}

export interface CreateExchangeOfferDTO {
  CurrencyId: string;
  WalletId: string;
  GivingAmount: number;
  RequestingAmount: number;
}

export interface ExchangeOfferNotificationDTO {
  RequestingCurrencySymbol: string;
  GivingCurrencySymbol: string;
  GivingAmount: number;
  RequestingAmount: number;
}
