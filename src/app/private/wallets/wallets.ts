import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletDTO } from '../../interfaces/Wallet';
import { WalletService } from '../../services/wallet-service';
import { SendDialog } from '../../dialogs/send-dialog/send-dialog';
import { NotificationService } from '../../services/notification-service';
import { WalletHistoryDialog } from '../../dialogs/wallet-history-dialog/wallet-history-dialog';
import { WalletNotificationDTO } from '../../interfaces/Notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallets',
  imports: [CommonModule],
  templateUrl: './wallets.html',
  styleUrl: './wallets.scss'
})
export class Wallets implements OnInit, OnDestroy {
  wallets: WalletDTO[] = [];
  loading = true;

  allWalletsSub$!: Subscription;
  refreshSubs: Subscription[] = [];


  constructor(
    private _walletService: WalletService,
    private _dialog: MatDialog,
    private _notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.allWalletsSub$ = this._walletService.getWallets().subscribe({
      next: (data) => { this.wallets = data; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });

    this._notificationService.personalWalletNotification$.subscribe({
      next: (notification: WalletNotificationDTO) => {
        console.log('Received wallet notification:', notification);
        console.log('Refreshing wallet with ID:', notification.walletId);
        this.refreshWallet(notification.walletId);
      },
      error: (err) => console.error('Error in personal wallet notification:', err)
    });
  }

  refreshWallet(walletId: string): void {
    const sub = this._walletService.getWalletById(walletId).subscribe({
      next: (wallet) => this.updateWalletList(wallet),
      error: (err) => console.error('Refresh error:', err)
    });
    this.refreshSubs.push(sub);
  }

  updateWalletList(updated: WalletDTO): void {
    const idx = this.wallets.findIndex(w => w.WalletId === updated.WalletId);
    if (idx !== -1) this.wallets[idx] = updated;
    else this.wallets.push(updated);
  }

  send(wallet: WalletDTO): void {
    const dialogRef = this._dialog.open(SendDialog, {
      width: '400px',
      height: '300px',
      data: { wallet } // what i'm sending to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openHistory(wallet: WalletDTO): void {
    this._dialog.open(WalletHistoryDialog, {
      width: '1100px',
      maxWidth: '1100px',
      height: '80vh',
      data: { wallet: wallet } // Pass the wallet ID to the dialog
    });
  }

  ngOnDestroy(): void {
    this.allWalletsSub$?.unsubscribe();
    this.refreshSubs.forEach(s => s.unsubscribe());
  }

}
