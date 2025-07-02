import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { NFT } from '../interfaces/NFT';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(
    private _backendService: BackendService
  ) { }

  getPersonalNFTs(): Observable<NFT[]> {
    return this._backendService.get('NFT/Personal');
  }
}
