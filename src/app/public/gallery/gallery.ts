import { Component, OnInit } from '@angular/core';
import { NftDTO } from '../../interfaces/Nft';
import { Subscription } from 'rxjs';
import { NftService } from '../../services/nft-service';
import { NotificationService } from '../../services/notification-service';
import { CommonModule } from '@angular/common';
import { NftCard } from './nft-card/nft-card';

@Component({
  selector: 'app-gallery',
  imports: [
    CommonModule,
    NftCard
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss'
})
export class Gallery implements OnInit {

  nfts: NftDTO[] = [];
  loading: boolean = true; // Flag to indicate loading state

  public nftSub$!: Subscription;

  constructor(
    private _nftService: NftService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.nftSub$ = this._nftService.getPublicNFTs().subscribe({
      next: (nfts: NftDTO[]) => {
        this.nfts = nfts;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching NFTs:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });

    this._notificationService.tokenCreated$.subscribe((nftId: string) => {
      this.refreshNFTs();
    });
  }

    refreshNFTs(): void {
    this.loading = true; // Set loading to true while fetching data
    this._nftService.getPublicNFTs().subscribe({
      next: (nfts: NftDTO[]) => {
        this.nfts = nfts;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error refreshing NFTs:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });
  }
}
