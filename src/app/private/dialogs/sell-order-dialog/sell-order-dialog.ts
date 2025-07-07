import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {  MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  MatSelectModule } from '@angular/material/select';
import { Currency } from '../../../interfaces/Currency';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurrencyService } from '../../../services/currency-service';
import { SellOfferService } from '../../../services/sell-offer-service';
import { NftDTO } from '../../../interfaces/Nft';
import { CreateSellOfferDTO } from '../../../interfaces/SellOffer';

@Component({
  selector: 'app-sell-order-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  templateUrl: './sell-order-dialog.html',
  styleUrl: './sell-order-dialog.scss'
})
export class SellOrderDialog implements OnInit {
  form!: FormGroup;
  currencies: Currency[] = [];

  constructor(
    public dialogRef: MatDialogRef<SellOrderDialog>,
    private _currencyService: CurrencyService,
    private _sellOfferService: SellOfferService,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {nft: NftDTO }
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      currencyId: [null, Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
    });

    this._currencyService.getAllCyrrencies().subscribe({
      next: (currencies) => {
        this.currencies = currencies;
      },
      error: (err) => {
        console.error('Error fetching currencies:', err);
      }
    });

    this.form.get('currencyId')?.valueChanges.subscribe(() => {
      this.form.get('amount')?.updateValueAndValidity(); // Reset amount when currency changes
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return; // Prevent submission if the form is invalid
    }

    const sellOffer: CreateSellOfferDTO = {
      Amount: this.form.value.amount,
      CurrencyId: this.form.value.currencyId,
      TokenId: this.data.nft.Id
    }

    this._sellOfferService.createSellOffer(sellOffer).subscribe({
      next: () => {
        console.log('Sell offer created successfully');
        this.dialogRef.close(true); // Close the dialog and return true on success
      },
      error: (err) => {
        console.error('Error creating sell offer:', err);
      }
    });

  }

  cancel(): void {
    console.log('Dialog cancelled');
    this.dialogRef.close(false); // Close the dialog and return false on cancel
  }

}
