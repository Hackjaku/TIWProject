import { Component, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../../services/currency-service';
import { CreateCurrencyDTO, Currency } from '../../../interfaces/Currency';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  owned: boolean = false; // This should be set based on whether the user owns the currency or not

  @Input() userId!: number;
  @Input() currency!: Currency;

  constructor() { }

  ngOnInit(): void {
    // Check if the user owns the currency
    this.owned = this.currency.OwnerId === this.userId;
    console.log('Currency Actions Component Initialized', this.currency, this.userId, this.owned);
  }

  addCurrency(): void {

  }

}
