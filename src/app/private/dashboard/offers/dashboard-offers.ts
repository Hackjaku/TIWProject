import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PersonalBuyOffersDTO } from '../../../interfaces/BuyOffer';
import { Subscription } from 'rxjs';
import { BuyOfferService } from '../../../services/buy-offer-service';

@Component({
  selector: 'app-dashboard-offers',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-offers.html',
  styleUrl: './dashboard-offers.scss'
})
export class DashboardOffers implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nft_name', 'currency_symbol', 'amount', 'actions'];

  offers!: PersonalBuyOffersDTO;
  loading: boolean = true; // Flag to indicate loading state

  public offersSub$!: Subscription

  constructor(
    private _buyOfferService: BuyOfferService
  ) { };

  ngOnInit(): void {
    this.offersSub$ = this._buyOfferService.getPersonalBuyOffers().subscribe({
      next: (offers: PersonalBuyOffersDTO) => {
        this.offers = offers;
        this.loading = false; // Set loading to false once data is fetched
      },
      error: (err) => {
        console.error('Error fetching offers:', err);
        this.loading = false; // Set loading to false even if there's an error
      }
    });
  }

  ngOnDestroy(): void {
    if (this.offersSub$) {
      this.offersSub$.unsubscribe();
    }
  }

}
