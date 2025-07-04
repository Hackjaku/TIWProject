import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NftDTO } from '../../../interfaces/Nft';
import { WalletService } from '../../../services/wallet-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WalletDTO } from '../../../interfaces/Wallet';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BuyOfferService } from '../../../services/buy-offer-service';
import { CreateBuyOfferDTO } from '../../../interfaces/BuyOffer';

@Component({
  selector: 'app-buy-order-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  templateUrl: './buy-order-dialog.html',
  styleUrl: './buy-order-dialog.scss'
})
export class BuyOrderDialog implements OnInit {

  form!: FormGroup;
  wallets: WalletDTO[] = [];

  constructor(
    public dialogRef: MatDialogRef<BuyOrderDialog>,
    private _walletService: WalletService,
    private _buyOfferService: BuyOfferService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { nft: NftDTO } // Replace 'any' with the actual type of your NFT
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      walletId: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });

    this._walletService.getWallets().subscribe({
      next: (wallets) => {
        this.wallets = wallets;
      },
      error: (err) => {
        console.error('Error fetching wallets:', err);
      }
    });

    this.form.get('walletId')?.valueChanges.subscribe(() => {
      this.form.get('amount')?.updateValueAndValidity(); // Reset amount when wallet changes
    });

    this.form.get('amount')?.setValidators([
      Validators.required,
      Validators.min(0),
      this.balanceValidator.bind(this)
    ]);
  }

  balanceValidator(control: any) {
    const walletId = this.form.get('walletId')?.value;
    const selectedWallet = this.wallets.find(wallet => wallet.WalletId === walletId);

    if (selectedWallet && control.value > selectedWallet.AvailableBalance) {
      return { insufficientBalance: true };
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const buyOffer: CreateBuyOfferDTO = {
      Amount: this.form.value.amount,
      WalletId: this.form.value.walletId,
      TokenId: this.data.nft.Id
    }

    this._buyOfferService.createBuyOffer(buyOffer).subscribe({
      next: () => {
        console.log('Buy Order Created Successfully');
      },
      error: (err) => {
        console.error('Error creating buy order:', err);
      }
    });

    this.dialogRef.close();
  }

  cancel(): void {
    console.log('Buy Order Cancelled');
    this.dialogRef.close();
  }
}
