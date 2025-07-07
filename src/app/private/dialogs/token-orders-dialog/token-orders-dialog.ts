import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NftDTO, NftOrdersDTO } from '../../../interfaces/Nft';
import { NftService } from '../../../services/nft-service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SellOfferSimpleDTO } from '../../../interfaces/SellOffer';
import { MatIconModule } from '@angular/material/icon';
import { SellOfferService } from '../../../services/sell-offer-service';
import { StorageService } from '../../../services/storage-service';

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
  canAcceptSellOrders: boolean = false; // Replace with actual login check logic

  public ordersSub$!: Subscription;

  constructor(
    private _nftService: NftService,
    private _sellOfferService: SellOfferService,
    private _dialogref: MatDialogRef<TokenOrdersDialog>,
    private _storageService: StorageService,
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

    // Check if the user is logged in (replace with actual login check logic)
    this.canAcceptSellOrders = this.showSellOrderButton();

  }

  acceptOrder(order: SellOfferSimpleDTO): void {
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

  showSellOrderButton(): boolean {
    const user = this._storageService.getLoggedUser;
    if (user) {
      console.log('User logged in:', user.Username);
      console.log('NFT Owner:', this.data.nft.OwnerName);
      if (user.Username === this.data.nft.OwnerName) {
        console.log('User is the owner of the NFT:', user.Username);
        return false; // User is the owner of the NFT, do not show accept button
      } else {
        console.log('User is not the owner of the NFT:', user.Username);
        console.log('Accept button will be shown for user:', user.Username);
        return true; // User is not the owner, show accept button
      }
    }
    console.log('No user logged in');
    return false; // Default to false if no user is logged in
  }

  ngOnDestroy(): void {
    // Cleanup if necessary
    if (this.ordersSub$) {
      this.ordersSub$.unsubscribe();
    }
  }

}
