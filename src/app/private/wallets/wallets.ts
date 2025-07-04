import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletDTO } from '../../interfaces/Wallet';
import { WalletService } from '../../services/wallet-service';
import { SendDialog } from '../dialogs/send-dialog/send-dialog';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-wallets',
  imports: [CommonModule],
  templateUrl: './wallets.html',
  styleUrl: './wallets.scss'
})
export class Wallets implements OnInit {
  wallets: WalletDTO[] = [];
  loading = true;

  constructor(
    private _walletService: WalletService,
    private _dialog: MatDialog,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this._walletService.getWallets().subscribe({
      next: (data: WalletDTO[]) => {
        this.wallets = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching wallets:', err);
        this.loading = false;
      }
    });

    this._notificationService.currencyTransfer$.subscribe((currencyId: string) => {
      this.refreshWallet(currencyId);
    })

  }

  refreshWallet(currencyId: string): void {
    this._walletService.getWalletByCurrencyId(currencyId).subscribe({
      next: (wallet: WalletDTO) => {
        const index = this.wallets.findIndex(w => w.CurrencyId === currencyId);
        if (index !== -1) {
          this.wallets[index] = wallet; // Update existing wallet
        } else {
          this.wallets.push(wallet); // Add new wallet if not found
        }
      },
      error: (err: any) => {
        console.error('Error refreshing wallet:', err);
      }
    });
  }

  send(wallet: WalletDTO): void {
    // Implement send functionality here
    const dialogRef = this._dialog.open(SendDialog, {
      width: '400px',
      height: '300px',
      data: { wallet } // what i'm sending to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the modal if needed
        console.log('Send action completed:', result);
        this.refreshWallet(wallet.CurrencyId); // Refresh the wallet after sending
      }
    });
  }

}
