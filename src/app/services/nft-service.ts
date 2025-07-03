import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { Nft, NftDTO } from '../interfaces/Nft';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(
    private _backendService: BackendService
  ) { }

  getPersonalNFTs(): Observable<NftDTO[]> {
    return this._backendService.get('Nft/Personal');
  }
}
