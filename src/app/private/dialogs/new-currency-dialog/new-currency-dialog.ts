import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../../services/currency-service';
import { CreateCurrencyDTO } from '../../../interfaces/Currency';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-currency-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './new-currency-dialog.html',
  styleUrl: './new-currency-dialog.scss'
})


export class NewCurrencyDialog implements OnInit {

  form!: FormGroup;

  constructor(
    private _currencyService: CurrencyService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<NewCurrencyDialog>
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      Symbol: ['', Validators.required],
      Name: ['', Validators.required],
      MarketCap: [null],
      GeneratedBalance: [0, Validators.required],
    });
  }

  confirmCreate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newCurrency: CreateCurrencyDTO = {
      Symbol: this.form.value.Symbol,
      Name: this.form.value.Name,
      MarketCap: this.form.value.MarketCap,
      GeneratedBalance: this.form.value.GeneratedBalance
    }

    this._currencyService.createCurrency(newCurrency).subscribe({
      next: (currency) => {
        console.log('New currency created:', currency);
        // Optionally, you can close the dialog or reset the form here
      },
      error: (err) => {
        console.error('Error creating currency:', err);
      }
    });

    this._dialogRef.close(newCurrency); // Close the dialog and pass the new currency data
  }
}
