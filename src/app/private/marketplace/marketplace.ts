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

  exchangeTableColumns: string[] = ['requesting_currency', 'giving_currency', 'giving_amount', 'requesting_amount', 'actions'];
  sellTableColumns: string[] = ['token_name', 'currency', 'amount', 'actions'];

  sellOrders: SellOfferDTO[] = [];
  exchangeOffers: ExchangeOfferDTO[] = [];

  loadingSellOrders: boolean = true; // Flag to indicate loading state for sell orders
  loadingExchangeOffers: boolean = true; // Flag to indicate loading state for exchange offers

  public sellOrdersSub$!: Subscription;
  public exchangeOffersSub$!: Subscription;

  constructor(
    private _exchangeOfferService: ExchangeOfferService,
    private _sellOfferService: SellOfferService,
    private _dialog: MatDialog
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
  }

  openCreateExchangeOfferDialog(): void {
    // const dialogRef = this.dialog.open(CreateExchangeOfferDialogComponent, {
    //   width: '600px',
    //   data: {
    //     // Pass anything the dialog needs
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'refresh') {
    //     this.loadExchangeOffers(); // Your method to refresh the exchangeOffers list
    //   }
    // });
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
