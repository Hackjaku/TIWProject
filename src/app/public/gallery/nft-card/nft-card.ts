import { Component, Input, OnInit } from '@angular/core';
import { NftDTO } from '../../../interfaces/Nft';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../services/storage-service';
import { MatDialog } from '@angular/material/dialog';
import { BuyOrderDialog } from '../../../private/dialogs/buy-order-dialog/buy-order-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nft-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './nft-card.html',
  styleUrl: './nft-card.scss'
})
export class NftCard implements OnInit {

  @Input() nft!: NftDTO;

  isLoggedIn: boolean = false;

  constructor(
    private _storageService: StorageService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this._storageService.getUserId() !== null;
  }

  openBuyDialog(): void {
    this._dialog.open(BuyOrderDialog, {
      data: {
        nft: this.nft
      }
    });
  }

  isImage(): boolean {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(this.nft.Link);
  }

  isPdf(): boolean {
    return /\.(pdf)$/i.test(this.nft.Link);
  }

  isAudio(): boolean {
    return /\.(mp3|wav|ogg|flac)$/i.test(this.nft.Link);
  }

  isVideo(): boolean {
    return /\.(mp4|webm|ogg)$/i.test(this.nft.Link);
  }

}
