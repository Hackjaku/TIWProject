import { Component } from '@angular/core';
import { Offers } from '../offers/offers';
import { DashboardSellings } from './dashboard-sellings/dashboard-sellings';
import { DashboardGraph } from './dashboard-graph/dashboard-graph';
import { DashboardList } from './dashboard-list/dashboard-list';
import { DashboardOffers } from './dashboard-offers/dashboard-offers';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardOffers,
    DashboardSellings,
    DashboardGraph,
    DashboardList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
