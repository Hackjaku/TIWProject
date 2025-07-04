import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { BackendService } from './backend-service';
import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private hubConnection!: signalR.HubConnection;

  private currencyTransfer = new Subject<string>();
  private tokenCreated = new Subject<string>();
  private tokenTransfer = new Subject<string>();
  private buyOfferCreated = new Subject<string>();


  currencyTransfer$ = this.currencyTransfer.asObservable();
  tokenCreated$ = this.tokenCreated.asObservable();
  tokenTransfer$ = this.tokenTransfer.asObservable();
  buyOfferCreated$ = this.buyOfferCreated.asObservable();

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

    this.hubConnection.on('BuyOfferCreated', (offerId: string) => { // todo need something more here
      console.log('Received offer created:', offerId);
      this.buyOfferCreated.next(offerId);
    });

    this.hubConnection.on('TokenCreated', (tokenId: string) => {
      console.log('Received token created:', tokenId);
      this.tokenCreated.next(tokenId);
    });

    this.hubConnection.on('TokenTransfer', (tokenId: string) => {
      console.log('Received token transfer:', tokenId);
      this.tokenTransfer.next(tokenId);
    });

  }
}
