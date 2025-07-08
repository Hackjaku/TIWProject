import { Component, OnInit } from '@angular/core';
import { Nft, NftDTO } from '../../../interfaces/Nft';
import { NftService } from '../../../services/nft-service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification-service';

@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss'
})
export class DashboardList implements OnInit {

  nfts: NftDTO[] = [];
  loading: boolean = true;

  constructor(
    private _nftService: NftService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this._nftService.getPersonalNFTs().subscribe({
      next: (data: NftDTO[]) => {
        this.nfts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this._notificationService.refreshTokens$.subscribe(() => {
      this.refreshNFTs();
    });

  }

  refreshNFTs(): void {
    this.loading = true;
    this._nftService.getPersonalNFTs().subscribe({
      next: (data: NftDTO[]) => {
        this.nfts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
