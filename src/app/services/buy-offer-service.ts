import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { CreateBuyOfferDTO, PersonalBuyOffersDTO } from '../interfaces/BuyOffer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuyOfferService {

  constructor(
    private _backendService: BackendService
  ) { }

  createBuyOffer(offer: CreateBuyOfferDTO): Observable<void> {
    return this._backendService.post('BuyOffer/create', offer);
  }

  acceptBuyOffer(offerId: string): Observable<void> {
    return this._backendService.post(`BuyOffer/accept?offerId=${offerId}`, {});
  }

  getPersonalBuyOffers(): Observable<PersonalBuyOffersDTO> {
    return this._backendService.get('BuyOffer/personal');
  }

  cancelBuyOffer(offerId: string): Observable<void> {
    return this._backendService.delete(`BuyOffer/cancel?offerId=${offerId}`);
  }
}
