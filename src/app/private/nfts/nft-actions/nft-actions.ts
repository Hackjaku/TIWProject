import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NftDTO } from '../../../interfaces/Nft';
import { MatDialog } from '@angular/material/dialog';
import { SendNftDialog } from '../../dialogs/send-nft-dialog/send-nft-dialog';

@Component({
  selector: 'app-nft-actions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './nft-actions.html',
  styleUrl: './nft-actions.scss'
})
export class NftActions implements OnInit {

  @Input() userId!: number;
  @Input() nft!: NftDTO;

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  transferNft(): void {
    const dialogRef = this._dialog.open(SendNftDialog, {
      width: '400px',
      height: '300px',
      data: { nft: this.nft } // Pass the NFT data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result from the modal if needed
        console.log('Transfer action completed:', result);
      }
    });
  }
}
