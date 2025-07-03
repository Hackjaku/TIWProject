import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Currency } from '../../../interfaces/Currency';
import { MatDialog } from '@angular/material/dialog';
import { AddCurrencyDialog } from '../../dialogs/add-currency-dialog/add-currency-dialog';

@Component({
  selector: 'app-currency-actions',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './currency-actions.html',
  styleUrl: './currency-actions.scss'
})
export class CurrencyActions implements OnInit {

  @Input() userId!: number;
  @Input() currency!: Currency;

  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Check if the user owns the currency
  }

  addCurrency(): void {
    const dialogRef = this._dialog.open(AddCurrencyDialog, {
      width: '400px',
      height: '200px',
      data: { currency: this.currency } // Pass the currency ID to the dialog
    })
  }

  canAddCurrency(): boolean {
    if (this.currency.OwnerId !== this.userId) {
      return false;
    }

    if (this.currency.MarketCap && this.currency.GeneratedBalance >= this.currency.MarketCap) {
      return false; // Cannot add more if the market cap is reached
    }

    return true;
  }

}
