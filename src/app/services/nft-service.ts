import { Injectable } from '@angular/core';
import { BackendService } from './backend-service';
import { Observable } from 'rxjs';
import { CreateNftDTO, NftDTO, NftOrdersDTO, TransferNftDTO } from '../interfaces/Nft';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(
    private _backendService: BackendService
  ) { }

  getPersonalNFTs(): Observable<NftDTO[]> {
    return this._backendService.get('Nft/personal');
  }

  createNft(nft: CreateNftDTO): Observable<void> {
    return this._backendService.post('Nft/create', nft);
  }

  transferNft(nft: TransferNftDTO): Observable<void> {
    return this._backendService.post('Nft/transfer', nft);
  }

  getPublicNFTs(): Observable<NftDTO[]> {
    return this._backendService.get('Nft/all');
  }

  getNftOrders(nftId: string): Observable<NftOrdersDTO> {
    return this._backendService.get(`Nft/orders?nftId=${nftId}`);
  }

}
