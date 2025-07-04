import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { CreateSellOfferDTO, SellOfferDTO } from '../interfaces/SellOffer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellOfferService {

  constructor(
    private _backendService: BackendService
  ) { }

  createSellOffer(offer: CreateSellOfferDTO): Observable<void> {
    return this._backendService.post('SellOffer/create', offer);
  }

  acceptSellOffer(offerId: string): Observable<void> {
    return this._backendService.post(`SellOffer/accept?offerId=${offerId}`, {});
  }

  getPersonalSellOffers(): Observable<SellOfferDTO[]> {
    return this._backendService.get('SellOffer/personal');
  }

  cancelSellOffer(offerId: string): Observable<void> {
    return this._backendService.delete(`SellOffer/cancel?offerId=${offerId}`);
  }

  getAllSellOffers(): Observable<SellOfferDTO[]> {
    return this._backendService.get('SellOffer/all');
  }
}
