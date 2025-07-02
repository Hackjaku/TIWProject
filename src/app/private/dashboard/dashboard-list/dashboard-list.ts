import { Component, OnInit } from '@angular/core';
import { NFT } from '../../../interfaces/NFT';
import { NftService } from '../../../services/nft-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-list',
  imports: [CommonModule],
  templateUrl: './dashboard-list.html',
  styleUrl: './dashboard-list.scss'
})
export class DashboardList implements OnInit {

  nfts: NFT[] = [];
  loading: boolean = true;

  constructor(
    private _nftService: NftService
  ) {}

  ngOnInit(): void {
    this._nftService.getPersonalNFTs().subscribe({
      next: (data: NFT[]) => {
        this.nfts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
