import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { BackendService } from './backend-service';
import { StorageService } from './storage-service';
import { BuyOfferNotificationDTO } from '../interfaces/Notification';
import { ExchangeOfferNotificationDTO } from '../interfaces/ExchangeOffer';

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



  private currencyTransfer = new Subject<string>();
  private tokenCreated = new Subject<string>();
  private tokenTransfer = new Subject<string>();



  currencyTransfer$ = this.currencyTransfer.asObservable();
  tokenCreated$ = this.tokenCreated.asObservable();
  tokenTransfer$ = this.tokenTransfer.asObservable();

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


    this.hubConnection.on('TokenCreated', (tokenId: string) => {
      console.log('Received token created:', tokenId);
      this.tokenCreated.next(tokenId);
    });

    this.hubConnection.on('TokenTransfer', (tokenId: string) => {
      console.log('Received token transfer:', tokenId);
      this.tokenTransfer.next(tokenId);
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

  }
}
