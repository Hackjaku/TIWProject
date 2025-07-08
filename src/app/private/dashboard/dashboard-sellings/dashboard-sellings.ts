import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SellOfferService } from '../../../services/sell-offer-service';
import { Subscription } from 'rxjs';
import { SellOfferDTO } from '../../../interfaces/SellOffer';
import { NotificationService } from '../../../services/notification-service';

@Component({
  selector: 'app-dashboard-sellings',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-sellings.html',
  styleUrl: './dashboard-sellings.scss'
})
export class DashboardSellings implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nft_name', 'currency_symbol', 'amount', 'actions'];

  sellOrders: SellOfferDTO[] = []; // Replace with actual type
  loading: boolean = true; // Flag to indicate loading state

  public sellOrdersSub$!: Subscription;

  constructor(
    private _sellOrderService: SellOfferService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.sellOrdersSub$ = this._sellOrderService.getPersonalSellOffers().subscribe({
      next: (orders: SellOfferDTO[]) => { // Replace with actual type
        this.sellOrders = orders;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching sell orders:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });

    this._notificationService.refreshSellOffers$.subscribe(() => {
      console.log('Refreshing sell orders due to notification');
      this.refreshSellOrders();
    });

  }

  refreshSellOrders(): void {
    console.log('Refreshing sell orders');
    this._sellOrderService.getPersonalSellOffers().subscribe({
      next: (orders: SellOfferDTO[]) => {
        this.sellOrders = orders;
        console.log('Sell orders refreshed successfully');
      },
      error: (err) => {
        console.error('Error refreshing sell orders:', err);
      }
    });
  }

  deleteOrder(order: SellOfferDTO): void {
    console.log('Order cancelled:', order);
    this._sellOrderService.cancelSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Order cancelled successfully');
        // Optionally, refresh the sell orders list or update the UI
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
    if (this.sellOrdersSub$) {
      this.sellOrdersSub$.unsubscribe();
    }
  }

}
