import { Component, Input } from '@angular/core';
import { NftDTO } from '../../../interfaces/Nft';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nft-card',
  imports: [
    CommonModule
  ],
  templateUrl: './nft-card.html',
  styleUrl: './nft-card.scss'
})
export class NftCard {

  @Input() nft!: NftDTO;

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
