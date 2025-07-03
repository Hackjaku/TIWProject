import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { CreateCurrencyDTO, Currency, GenerateCurrencyDTO } from '../interfaces/Currency';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private _backendService: BackendService
  ) { }

  createCurrency(currency: CreateCurrencyDTO): Observable<void> {
    return this._backendService.post('Currency/create', currency);
  }

  generateCurrency(value: GenerateCurrencyDTO): Observable<void> {
    return this._backendService.post('Currency/generate', value);
  }

  getAllCyrrencies(): Observable<Currency[]> {
    return this._backendService.get('Currency');
  }

}
