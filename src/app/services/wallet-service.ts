import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { WalletDTO } from '../interfaces/Wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private _backendService: BackendService
  ) { }

  getWallets(): Observable<WalletDTO[]> {
    return this._backendService.get('Wallet');
  }
}
