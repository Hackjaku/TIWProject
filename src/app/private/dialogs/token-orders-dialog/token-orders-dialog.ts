import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NftDTO, NftOrderDTO } from '../../../interfaces/Nft';
import { NftService } from '../../../services/nft-service';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-token-orders-dialog',
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './token-orders-dialog.html',
  styleUrl: './token-orders-dialog.scss'
})
export class TokenOrdersDialog implements OnInit, OnDestroy {

  displayedColumns: string[] = ['currency_symbol', 'amount'];

  orders!: NftOrderDTO; // Replace with actual type
  loading: boolean = true; // Flag to indicate loading state

  public ordersSub$!: Subscription;

  constructor(
    private _nftService: NftService,
    private _dialogref: MatDialogRef<TokenOrdersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { nft: NftDTO }
  ) { }

  ngOnInit(): void {
    this.ordersSub$ = this._nftService.getNftOrders(this.data.nft.Id).subscribe({
      next: (orders: NftOrderDTO) => {
        this.orders = orders;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false; // Set loading to false even if there's an error
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
