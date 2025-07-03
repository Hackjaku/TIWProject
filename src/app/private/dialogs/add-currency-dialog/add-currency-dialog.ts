import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../../services/currency-service';
import { Currency, GenerateCurrencyDTO } from '../../../interfaces/Currency';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-currency-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-currency-dialog.html',
  styleUrl: './add-currency-dialog.scss'
})
export class AddCurrencyDialog implements OnInit {

  form!: FormGroup;

  constructor(
    private _currencyService: CurrencyService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AddCurrencyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { currency: Currency } // Injecting data passed to the dialog
  ) { }

  ngOnInit(): void {
    // Initialization logic can go here
    this.form = this._fb.group({
      Amount: [0, Validators.required],
    });
  }

  confirmAdd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let amount: number = parseFloat(this.form.value.Amount);
    let finalAmount: number = amount + this.data.currency.GeneratedBalance;

    if (amount <= 0) {
      this.form.controls['Amount'].setErrors({ min: true });
      return;
    }

    if (this.data.currency.MarketCap && finalAmount > this.data.currency.MarketCap) {
      this.form.controls['Amount'].setErrors({ max: true });
      return;
    }

    const addCurrencyData: GenerateCurrencyDTO= {
      CurrencyId: this.data.currency.Id, // Using the currency ID passed to the dialog
      Amount: this.form.value.Amount
    }

    this._currencyService.generateCurrency(addCurrencyData).subscribe({
      next: (response) => {
        console.log('Currency added successfully:', response);
        // Optionally, you can close the dialog or reset the form here
        this._dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error adding currency:', err);
      }
    });

  }

}
