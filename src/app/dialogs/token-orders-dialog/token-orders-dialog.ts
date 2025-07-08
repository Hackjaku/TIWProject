import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NftDTO, NftOrdersDTO } from '../../interfaces/Nft';
import { NftService } from '../../services/nft-service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SellOfferSimpleDTO } from '../../interfaces/SellOffer';
import { MatIconModule } from '@angular/material/icon';
import { SellOfferService } from '../../services/sell-offer-service';
import { StorageService } from '../../services/storage-service';
import { BuyOfferService } from '../../services/buy-offer-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-token-orders-dialog',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './token-orders-dialog.html',
  styleUrl: './token-orders-dialog.scss'
})
export class TokenOrdersDialog implements OnInit, OnDestroy {

  displayedColumns: string[] = ['currency_symbol', 'amount', 'actions'];

  orders!: NftOrdersDTO; // Replace with actual type
  loading: boolean = true; // Flag to indicate loading state

  loggedUserId: number | null = null;

  public ordersSub$!: Subscription;

  constructor(
    private _nftService: NftService,
    private _sellOfferService: SellOfferService,
    private _buyOfferService: BuyOfferService,
    private _dialogref: MatDialogRef<TokenOrdersDialog>,
    private _storageService: StorageService,
    private _notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { nft: NftDTO }
  ) { }

  ngOnInit(): void {
    this.ordersSub$ = this._nftService.getNftOrders(this.data.nft.Id).subscribe({
      next: (orders: NftOrdersDTO) => {
        this.orders = orders;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });

    this.loggedUserId = this._storageService.getUserId();

    this._notificationService.refreshBuyOffers$.subscribe(() => {
      console.log('Refreshing buy offers due to notification');
      this.refreshOrders();
    });

    this._notificationService.refreshSellOffers$.subscribe(() => {
      console.log('Refreshing sell offers due to notification');
      this.refreshOrders();
    });

  }

  isLoggedIn(): boolean {
    return this.loggedUserId !== null;
  }

  refreshOrders(): void {
    this.loading = true;
    this._nftService.getNftOrders(this.data.nft.Id).subscribe({
      next: (orders: NftOrdersDTO) => {
        this.orders = orders;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });
  }

  canAcceptSellOrder(order: SellOfferSimpleDTO): boolean {
    if (this.data.nft.OwnerId === this.loggedUserId) {
      return false; // User cannot accept their own order
    }
    return true;
  }

  acceptSellOrder(order: SellOfferSimpleDTO): void {
    this._sellOfferService.acceptSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Order accepted successfully');
        // Optionally, you can refresh the orders or close the dialog
        this._dialogref.close();
      },
      error: (err) => {
        console.error('Error accepting order:', err);
      }
    });
  }

  canCancelSellOrder(order: SellOfferSimpleDTO): boolean {
    if (order.UserId === this.loggedUserId) {
      return true; // User can cancel their own order
    }
    return false; // User cannot cancel someone else's order
  }

  cancelSellOrder(order: SellOfferSimpleDTO): void {
    this._sellOfferService.cancelSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Order cancelled successfully');
        // Optionally, you can refresh the orders or close the dialog
        this._dialogref.close();
      },
      error: (err) => {
        console.error('Error cancelling order:', err);
      }
    });
  }

  canAcceptBuyOrder(): boolean {
    if (this.data.nft.OwnerId === this.loggedUserId) {
      console.log('User can accept buy orders as they are the owner of the NFT');
      return true; // User can accept buy orders if they are the owner of the NFT
    }
    console.log('User cannot accept buy orders as they are not the owner of the NFT');
    return false;
  }

  acceptBuyOrder(order: SellOfferSimpleDTO): void {
    this._buyOfferService.acceptBuyOffer(order.Id).subscribe({
      next: () => {
        console.log('Buy order accepted successfully');
        // Optionally, you can refresh the orders or close the dialog
        this._dialogref.close();
      },
      error: (err) => {
        console.error('Error accepting buy order:', err);
      }
    });
  }

  rejectBuyOrder(order: SellOfferSimpleDTO): void {
    this._buyOfferService.rejectBuyOffer(order.Id).subscribe({
      next: () => {
        console.log('Buy order rejected successfully');
        // Optionally, you can refresh the orders or close the dialog
        this._dialogref.close();
      },
      error: (err) => {
        console.error('Error rejecting buy order:', err);
      }
    });
  }

  canCancelBuyOrder(order: SellOfferSimpleDTO): boolean {
    if (order.UserId === this.loggedUserId) {
      console.log('user can cancel order as it is its own');
      return true;
    }
    return false;
  }

  cancelBuyOrder(order: SellOfferSimpleDTO): void {
    this._sellOfferService.cancelSellOffer(order.Id).subscribe({
      next: () => {
        console.log('Buy order cancelled successfully');
        // Optionally, you can refresh the orders or close the dialog
        this._dialogref.close();
      },
      error: (err) => {
        console.error('Error cancelling buy order:', err);
      }
    });
  }


  ngOnDestroy(): void {
    // Cleanup if necessary
    if (this.ordersSub$) {
      this.ordersSub$.unsubscribe();
    }
  }

}
