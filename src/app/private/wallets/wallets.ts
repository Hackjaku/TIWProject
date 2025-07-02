import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WalletDTO } from '../../interfaces/Wallet';
import { WalletService } from '../../services/wallet-service';

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
    private _walletService: WalletService
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
  }

  send(wallet: WalletDTO): void {
    // Implement send functionality here
    console.log(`Sending from wallet: ${wallet.WalletId}`);
  }

}
