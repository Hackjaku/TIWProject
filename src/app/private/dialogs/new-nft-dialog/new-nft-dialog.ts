import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NftService } from '../../../services/nft-service';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateNftDTO } from '../../../interfaces/Nft';

@Component({
  selector: 'app-new-nft-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './new-nft-dialog.html',
  styleUrl: './new-nft-dialog.scss'
})
export class NewNftDialog implements OnInit {

  form!: FormGroup;

  constructor(
    private _nftService: NftService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<NewNftDialog>
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      Name: ['', Validators.required],
      Link: ['', Validators.required],
      Description: [null]
    });
  }

  confirmCreate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newNft: CreateNftDTO = {
      Name: this.form.value.Name,
      Link: this.form.value.Link,
      Description: this.form.value.Description
    };

    this._nftService.createNft(newNft).subscribe({
      next: (nft) => {
        console.log('New NFT created:', nft);
        this._dialogRef.close(nft); // Close the dialog and return the created NFT
      },
      error: (err) => {
        console.error('Error creating NFT:', err);
      }
    });
  }

}
