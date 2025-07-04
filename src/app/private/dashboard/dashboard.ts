import { Component } from '@angular/core';
import { Offers } from '../offers/offers';
import { Sellings } from './sellings/sellings';
import { DashboardGraph } from './dashboard-graph/dashboard-graph';
import { DashboardList } from './dashboard-list/dashboard-list';
import { DashboardOffers } from './offers/dashboard-offers';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardOffers,
    Sellings,
    DashboardGraph,
    DashboardList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
