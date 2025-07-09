import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ExchangeOfferService } from '../../services/exchange-offer-service';
import { SellOfferService } from '../../services/sell-offer-service';
import { MatDialog } from '@angular/material/dialog';
import { SellOfferDTO } from '../../interfaces/SellOffer';
import { ExchangeOfferDTO } from '../../interfaces/ExchangeOffer';
import { Subscription } from 'rxjs';
import { ExchangeOrderDialog } from '../../dialogs/exchange-order-dialog/exchange-order-dialog';
import { StorageService } from '../../services/storage-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-marketplace',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.scss'
})
export class Marketplace implements OnInit, OnDestroy {

  exchangeTableColumns: string[] = ['requesting_amount', 'giving_amount', 'actions'];
  sellTableColumns: string[] = ['token_name', 'currency', 'amount', 'actions'];

  sellOrders: SellOfferDTO[] = [];
  exchangeOffers: ExchangeOfferDTO[] = [];

  loadingSellOrders: boolean = true; // Flag to indicate loading state for sell orders
  loadingExchangeOffers: boolean = true; // Flag to indicate loading state for exchange offers

  loggedUserId: number | null = null;

  public sellOrdersSub$!: Subscription;
  public exchangeOffersSub$!: Subscription;

  constructor(
    private _exchangeOfferService: ExchangeOfferService,
    private _sellOfferService: SellOfferService,
    private _dialog: MatDialog,
    private _storageService: StorageService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    // Initialization logic here
    this.sellOrdersSub$ = this._sellOfferService.getAllSellOffers().subscribe({
      next: (sellOffers: SellOfferDTO[]) => {
        this.sellOrders = sellOffers;
        this.loadingSellOrders = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching sell offers:', err);
        this.loadingSellOrders = false; // Set loading to false even if there's an error
      }
    });

    this.exchangeOffersSub$ = this._exchangeOfferService.getAllExchangeOffers().subscribe({
      next: (exchangeOffers: ExchangeOfferDTO[]) => {
        this.exchangeOffers = exchangeOffers;
        this.loadingExchangeOffers = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching exchange offers:', err);
        this.loadingExchangeOffers = false; // Set loading to false even if there's an error
      }
    });

    this.loggedUserId = this._storageService.getUserId();

    this._notificationService.refreshExchangeOffers$.subscribe(() => {
      console.log('Refreshing exchange offers due to notification');
      this.refreshExchangeOffers();
    });

    this._notificationService.refreshSellOffers$.subscribe(() => {
      console.log('Refreshing sell offers due to notification');
      this.refreshSellOrders();
    });
  }

  refreshSellOrders(): void {
    this.loadingSellOrders = true; // Set loading to true while fetching data
    // close previous subscription if exists
    if (this.sellOrdersSub$) {
      this.sellOrdersSub$.unsubscribe();
    }
    this.sellOrdersSub$ = this._sellOfferService.getAllSellOffers().subscribe({
      next: (sellOffers: SellOfferDTO[]) => {
        this.sellOrders = sellOffers;
        this.loadingSellOrders = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching sell offers:', err);
        this.loadingSellOrders = false; // Set loading to false even if there's an error
      }
    });
  }

  refreshExchangeOffers(): void {
    this.loadingExchangeOffers = true; // Set loading to true while fetching data
    // close previous subscription if exists
    if (this.exchangeOffersSub$) {
      this.exchangeOffersSub$.unsubscribe();
    }
    this.exchangeOffersSub$ = this._exchangeOfferService.getAllExchangeOffers().subscribe({
      next: (exchangeOffers: ExchangeOfferDTO[]) => {
        this.exchangeOffers = exchangeOffers;
        this.loadingExchangeOffers = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching exchange offers:', err);
        this.loadingExchangeOffers = false; // Set loading to false even if there's an error
      }
    });
  }

  openCreateExchangeOfferDialog(): void {
    const dialogRef = this._dialog.open(ExchangeOrderDialog, {
      data: {
        // Pass anything the dialog needs
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result === 'refresh') {
      //   this.loadExchangeOffers(); // Your method to refresh the exchangeOffers list
      // }
    });
  }

  canAcceptSellOrder(order: SellOfferDTO): boolean {
    if (order.OwnerId === this.loggedUserId) {
      return false; // User cannot accept their own order
    }
    return true;
  }

  canCancelSellOrder(order: SellOfferDTO): boolean {
    if (order.OwnerId === this.loggedUserId) {
      return true; // User can delete their own order
    }
    return false; // User cannot delete others' orders
  }

  acceptSellOrder(order: SellOfferDTO): void {
    // Logic to accept the sell order
    this._sellOfferService.acceptSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Sell order accepted successfully');
      },
      error: (err) => {
        console.error('Error accepting sell order:', err);
      }
    });
  }

  cancelSellOrder(order: SellOfferDTO): void {
    // Logic to delete the sell order
    this._sellOfferService.cancelSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Sell order deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting sell order:', err);
      }
    });
  }

  canAcceptExchange(offer: ExchangeOfferDTO): boolean {
    if (offer.UserId === this.loggedUserId) {
      return false; // User cannot accept their own offer
    }
    return true;
  }

  canCancelExchange(offer: ExchangeOfferDTO): boolean {
    if (offer.UserId === this.loggedUserId) {
      return true; // User can delete their own offer
    }
    return false; // User cannot delete others' offers
  }

  acceptExchange(offer: ExchangeOfferDTO): void {
    // Logic to accept the exchange offer
    this._exchangeOfferService.acceptExchangeOffer(offer.Id).subscribe({
      next: () => {
        console.log('Exchange offer accepted successfully');
      },
      error: (err) => {
        console.error('Error accepting exchange offer:', err);
      }
    });
  }

  cancelExchange(offer: ExchangeOfferDTO): void {
    // Logic to delete the exchange offer
    this._exchangeOfferService.cancelExchangeOffer(offer.Id).subscribe({
      next: () => {
        console.log('Exchange offer deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting exchange offer:', err);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup logic here
    if (this.sellOrdersSub$) {
      this.sellOrdersSub$.unsubscribe();
    }
    if (this.exchangeOffersSub$) {
      this.exchangeOffersSub$.unsubscribe();
    }
  }
}
