import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { BackendService } from './backend-service';
import { StorageService } from './storage-service';
import { BuyOfferNotificationDTO, SellOfferNotificationDTO, WalletNotificationDTO } from '../interfaces/Notification';
import { ExchangeOfferNotificationDTO } from '../interfaces/Notification';
import { TokenNotificationDTO } from '../interfaces/Notification';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  private personalTokenNotification = new Subject<TokenNotificationDTO>();
  refreshTokens$ = this.refreshTokens.asObservable();
  personalTokenNotification$ = this.personalTokenNotification.asObservable();

  private refreshSellOffers = new Subject<void>();
  private personalSellOfferNotification = new Subject<SellOfferNotificationDTO>();
  refreshSellOffers$ = this.refreshSellOffers.asObservable();
  personalSellOfferNotification$ = this.personalSellOfferNotification.asObservable();


  private personalWalletNotification = new Subject<WalletNotificationDTO>();
  personalWalletNotification$ = this.personalWalletNotification.asObservable();

  constructor(
    private _backendService: BackendService,
    private _storageService: StorageService,
    private _matSnackBar: MatSnackBar
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

    // #region Buy Offer Listeners
    // ? PERSONAL, YOU RECEIVED AN OFFER
    this.hubConnection.on('PersonalBuyOffer', (buyOfferNotification: BuyOfferNotificationDTO) => {
      console.log('Received personal offer:', buyOfferNotification);
      this.personalBuyOfferNotification.next(buyOfferNotification);
      this.showSnackbar(`You received a buy offer for ${buyOfferNotification.tokenName}
        at ${buyOfferNotification.amount} ${buyOfferNotification.currencySymbol}`
      );
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
      this.showSnackbar(`Your exchange offer of
        ${exchangeOfferNotification.givingAmount} ${exchangeOfferNotification.givingCurrencySymbol} for
        ${exchangeOfferNotification.requestingAmount} ${exchangeOfferNotification.requestingCurrencySymbol} has been accepted`
      );
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

    this.hubConnection.on('PersonalTokenNotification', (tokenNotification: TokenNotificationDTO) => {
      console.log('Received personal token notification:', tokenNotification);
      this.personalTokenNotification.next(tokenNotification);
      this.showSnackbar(`You received a new token: ${tokenNotification.name}`);
    });
    // #endregion

    // #region Sell Offer Listeners
    this.hubConnection.on('PersonalSellOffer', (sellOfferNotification: SellOfferNotificationDTO) => {
      console.log('Received personal sell offer:', sellOfferNotification);
      this.personalSellOfferNotification.next(sellOfferNotification);
      this.showSnackbar(`Your sell offer for ${sellOfferNotification.tokenName} has been accepted for ${sellOfferNotification.amount} ${sellOfferNotification.currencySymbol}`);
    });

    this.hubConnection.on('RefreshSellOffers', () => {
      console.log('Received refresh sell offers signal');
      this.refreshSellOffers.next();
    });
    // #endregion

    // #region Wallet Listeners
    this.hubConnection.on('PersonalWallet', (walletNotification: WalletNotificationDTO) => {
      this.personalWalletNotification.next(walletNotification);
      const username: string | null = this._storageService.getUsername();
      if (username !== walletNotification.username) {
        this.showSnackbar(`You received ${walletNotification.amount} ${walletNotification.currencySymbol} from ${walletNotification.username}`);
      }

    });
    // #endregion
  }

  showSnackbar(message: string): void {
    this._matSnackBar.open(message, 'Close', {
      duration: 8000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['notification-snackbar']
    });
  }
}
