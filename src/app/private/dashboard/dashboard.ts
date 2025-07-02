import { Component } from '@angular/core';
import { Offers } from '../offers/offers';
import { Sellings } from './sellings/sellings';
import { DashboardGraph } from './dashboard-graph/dashboard-graph';
import { DashboardList } from './dashboard-list/dashboard-list';

@Component({
  selector: 'app-dashboard',
  imports: [
    Offers,
    Sellings,
    DashboardGraph,
    DashboardList
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
