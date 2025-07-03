import { Component, OnDestroy, OnInit } from '@angular/core';
import { Currency } from '../../interfaces/Currency';
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../services/currency-service';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../services/storage-service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NewCurrencyDialog } from '../dialogs/new-currency-dialog/new-currency-dialog';


@Component({
  selector: 'app-currencies',
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './currencies.html',
  styleUrl: './currencies.scss'
})
export class Currencies implements OnInit, OnDestroy {

  displayedColumns: string[] = ['symbol', 'name', 'market_cap', 'generated_balance', 'actions'];

  currencies: Currency[] = [];
  loading: boolean = true; // Flag to indicate loading state

  currentUserId: number = 0; // This should be set to the current user's ID, possibly from a user service

  public currencySub$!: Subscription;

  constructor(
    private _currencyService: CurrencyService,
    private _dialog: MatDialog,
    private _storageService: StorageService
  ) { }

  ngOnInit(): void {

    this.currentUserId = this._storageService.getUserId() || 0; // Get the current user's ID from storage service

    this.currencySub$ = this._currencyService.getAllCyrrencies().subscribe({
      next: (currencies: Currency[]) => {
        this.currencies = currencies;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching currencies:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currencySub$) {
      this.currencySub$.unsubscribe();
    }
  }

  getOwnedClass(currency: Currency) {
    return currency.OwnerId === this.currentUserId ? 'owned' : '';
  }

  newCurrencyDialog(): void {
    const dialogRef = this._dialog.open(NewCurrencyDialog, {
      width: '400px',
      height: '500px'
    });
  }

}
