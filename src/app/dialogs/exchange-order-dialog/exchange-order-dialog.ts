import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyDetailsDTO } from '../../interfaces/Currency';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletService } from '../../services/wallet-service';
import { CurrencyService } from '../../services/currency-service';
import { ExchangeOfferService } from '../../services/exchange-offer-service';
import { WalletDTO } from '../../interfaces/Wallet';
import { Subscription } from 'rxjs';
import { CreateExchangeOfferDTO } from '../../interfaces/ExchangeOffer';

@Component({
  selector: 'app-exchange-order-dialog',
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './exchange-order-dialog.html',
  styleUrl: './exchange-order-dialog.scss'
})
export class ExchangeOrderDialog implements OnInit, OnDestroy {

  form!: FormGroup;
  currencies: CurrencyDetailsDTO[] = [];
  wallets: WalletDTO[] = [];

  walletSub$!: Subscription;
  currencySub$!: Subscription;

  constructor(
    private _dialogRef: MatDialogRef<ExchangeOrderDialog>,
    private _fb: FormBuilder,
    private _walletService: WalletService,
    private _currencyService: CurrencyService,
    private _exchangeOfferService: ExchangeOfferService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      walletId: [null, Validators.required],
      currencyId: [null, Validators.required],
      givingAmount: [0, [Validators.required, Validators.min(0)]],
      requestingAmount: [0, [Validators.required, Validators.min(0)]]
    });

    this.walletSub$ = this._walletService.getWallets().subscribe({
      next: (wallets) => {
        this.wallets = wallets;
      },
      error: (err) => {
        console.error('Error fetching wallets:', err);
      }
    });

    this.currencySub$ = this._currencyService.getAllCyrrencies().subscribe({
      next: (currencies) => {
        this.currencies = currencies;
      },
      error: (err) => {
        console.error('Error fetching currencies:', err);
      }
    });

    this.form.get('walletId')?.valueChanges.subscribe(() => {
      this.form.get('givingAmount')?.updateValueAndValidity(); // Reset giving amount when wallet changes
    });

    this.form.get('givingAmount')?.setValidators([
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

  cancel() {
    this._dialogRef.close(false); // Close the dialog and return false on cancel
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const exchangeOffer: CreateExchangeOfferDTO = {
      WalletId: this.form.get('walletId')?.value,
      CurrencyId: this.form.get('currencyId')?.value,
      GivingAmount: this.form.get('givingAmount')?.value,
      RequestingAmount: this.form.get('requestingAmount')?.value
    }

    this._exchangeOfferService.createExchangeOffer(exchangeOffer).subscribe({
      next: () => {
        this._dialogRef.close(true); // Close the dialog and return true on success
      },
      error: (err) => {
        console.error('Error creating exchange offer:', err);
        // Optionally, you can show an error message to the user here
      }
    });

  }

  ngOnDestroy(): void {
    if (this.walletSub$) {
      this.walletSub$.unsubscribe();
    }
    if (this.currencySub$) {
      this.currencySub$.unsubscribe();
    }
  }

}
