import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NftActions } from './nft-actions/nft-actions';
import { NftDTO } from '../../interfaces/Nft';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage-service';
import { NftService } from '../../services/nft-service';
import { MatDialog } from '@angular/material/dialog';
import { NewNftDialog } from '../dialogs/new-nft-dialog/new-nft-dialog';

@Component({
  selector: 'app-nfts',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    NftActions
  ],
  templateUrl: './nfts.html',
  styleUrl: './nfts.scss'
})
export class Nfts implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'creator', 'creation_date', 'link', 'actions'];

  nfts: NftDTO[] = [];
  loading: boolean = true; // Flag to indicate loading state

  currentUserId: number = 0; // This should be set to the current user's ID, possibly from a user service

  public nftSub$!: Subscription;

  constructor(
    private _storageService: StorageService,
    private _nftService: NftService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.currentUserId = this._storageService.getUserId() || 0; // Get the current user's ID from storage service

    this.nftSub$ = this._nftService.getPersonalNFTs().subscribe({
      next: (nfts: NftDTO[]) => {
        this.nfts = nfts;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching NFTs:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });
  }

  truncateLink(link: string): string {
    try {
      const url = new URL(link);
      const base = `${url.hostname}${url.pathname.length > 30 ? url.pathname.substring(0, 30) + '...' : url.pathname}`;
      return base;
    } catch {
      return link.length > 40 ? link.substring(0, 37) + '...' : link;
    }
  }

  newNFTDialog(): void {
    const dialogRef = this._dialog.open(NewNftDialog, {
      width: '400px',
      height: '400px'
    });
  }

  ngOnDestroy(): void {
    if (this.nftSub$) {
      this.nftSub$.unsubscribe();
    }
  }

}
