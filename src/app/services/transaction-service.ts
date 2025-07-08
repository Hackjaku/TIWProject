import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { DailyTransactionsDTO, SimpleTransactionHistoryDTO } from '../interfaces/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private _backendService: BackendService
  ) { }

  getWalletHistory(walletId: string): Observable<DailyTransactionsDTO[]> {
    return this._backendService.get(`Transaction/wallet-history?walletId=${walletId}`);
  }

  getWallet(walletId: string): Observable<SimpleTransactionHistoryDTO[]> {
    return this._backendService.get(`Transaction/wallet?walletId=${walletId}`);
  }
}
