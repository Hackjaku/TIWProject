import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { BackendService } from './backend-service';
import { StorageService } from './storage-service';
import { BuyOfferNotificationDTO, SellOfferNotificationDTO } from '../interfaces/Notification';
import { ExchangeOfferNotificationDTO } from '../interfaces/ExchangeOffer';
import { PersonalNftNotificationDTO } from '../interfaces/Nft';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private hubConnection!: signalR.HubConnection;

  private personalBuyOfferNotification = new Subject<BuyOfferNotificationDTO>();
  private refreshBuyOffers = new Subject<void>();
  personalBuyOfferNotification$ = this.personalBuyOfferNotification.asObservable();
  refreshBuyOffers$ = this.refreshBuyOffers.asObservable();

  private refreshCurrencies = new Subject<void>();
  refreshCurrencies$ = this.refreshCurrencies.asObservable();

  private refreshExchangeOffers = new Subject<void>();
  private personalExchangeOfferNotification = new Subject<ExchangeOfferNotificationDTO>();
  refreshExchangeOffers$ = this.refreshExchangeOffers.asObservable();
  personalExchangeOfferNotification$ = this.personalExchangeOfferNotification.asObservable();

  private refreshTokens = new Subject<void>();
  private personalTokenNotification = new Subject<string>();
  refreshTokens$ = this.refreshTokens.asObservable();
  personalTokenNotification$ = this.personalTokenNotification.asObservable();

  private refreshSellOffers = new Subject<void>();
  private personalSellOfferNotification = new Subject<SellOfferNotificationDTO>();
  refreshSellOffers$ = this.refreshSellOffers.asObservable();
  personalSellOfferNotification$ = this.personalSellOfferNotification.asObservable();


  private currencyTransfer = new Subject<string>();

  currencyTransfer$ = this.currencyTransfer.asObservable();

  constructor(
    private _backendService: BackendService,
    private _storageService: StorageService
  ) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(_backendService.getNotificationUrl(), {
        accessTokenFactory: () => _storageService.getToken() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.registerListeners();

    this.hubConnection.start()
      .catch(err => console.error('Error while starting SignalR connection: ', err));
  }

  private registerListeners(): void {
    this.hubConnection.on('CurrencyTransfer', (currencyId: string) => {
      console.log('Received currency:', currencyId);
      this.currencyTransfer.next(currencyId);
    });

    // #region Buy Offer Listeners
    // ? PERSONAL, YOU RECEIVED AN OFFER
    this.hubConnection.on('PersonalBuyOffer', (buyOfferNotification: BuyOfferNotificationDTO) => {
      console.log('Received personal offer:', buyOfferNotification);
      this.personalBuyOfferNotification.next(buyOfferNotification);
    });

    // * PUBLIC, SHOULD REFRESH THE BUY OFFERS LIST
    this.hubConnection.on('RefreshBuyOffers', () => {
      console.log('Received refresh buy offers signal');
      this.refreshBuyOffers.next();
    });
    // #endregion

    // #region Currency Listeners
    this.hubConnection.on('RefreshCurrencies', () => {
      console.log('Received refresh currencies signal');
      this.refreshCurrencies.next();
    });
    // #endregion

    // #region Exchange Offer Listeners
    this.hubConnection.on('PersonalExchangeOffer', (exchangeOfferNotification: ExchangeOfferNotificationDTO) => {
      console.log('Received personal exchange offer:', exchangeOfferNotification);
      this.personalExchangeOfferNotification.next(exchangeOfferNotification);
    });

    this.hubConnection.on('RefreshExchangeOffers', () => {
      console.log('Received refresh exchange offers signal');
      this.refreshExchangeOffers.next();
    });
    // #endregion

    // #region Token Listeners
    this.hubConnection.on('RefreshTokens', () => {
      console.log('Received refresh tokens signal');
      this.refreshTokens.next();
    });

    this.hubConnection.on('PersonalTokenNotification', (tokenNotification: PersonalNftNotificationDTO) => {
      console.log('Received personal token notification:', tokenNotification);
      this.personalTokenNotification.next(tokenNotification.Name);
    });
    // #endregion

    // #region Sell Offer Listeners
    this.hubConnection.on('PersonalSellOffer', (sellOfferNotification: SellOfferNotificationDTO) => {
      console.log('Received personal sell offer:', sellOfferNotification);
      this.personalSellOfferNotification.next(sellOfferNotification);
    });

    this.hubConnection.on('RefreshSellOffers', () => {
      console.log('Received refresh sell offers signal');
      this.refreshSellOffers.next();
    });
    // #endregion

  }
}
