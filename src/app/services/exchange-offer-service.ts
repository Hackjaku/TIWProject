import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { CreateExchangeOfferDTO, ExchangeOfferDTO } from '../interfaces/ExchangeOffer';

@Injectable({
  providedIn: 'root'
})
export class ExchangeOfferService {

  constructor(
    private _backendService: BackendService
  ) { }

  createExchangeOffer(offer: CreateExchangeOfferDTO): Observable<void> {
    return this._backendService.post('ExchangeOffer/create', offer);
  }

  getAllExchangeOffers(): Observable<ExchangeOfferDTO[]> {
    return this._backendService.get('ExchangeOffer/all');
  }

}
