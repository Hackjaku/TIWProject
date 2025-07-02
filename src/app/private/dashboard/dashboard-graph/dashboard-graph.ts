import { Component, OnInit } from '@angular/core';
import { WalletDTO, WalletPieChartData } from '../../../interfaces/Wallet';
import { WalletService } from '../../../services/wallet-service';
import { CommonModule } from '@angular/common';
import { PieChart } from './pie-chart';

@Component({
  selector: 'app-dashboard-graph',
  imports: [CommonModule, PieChart],
  templateUrl: './dashboard-graph.html',
  styleUrl: './dashboard-graph.scss'
})
export class DashboardGraph implements OnInit {
  constructor(
    private _walletService: WalletService
  ) { }

  chartData: WalletPieChartData[] = [];

  ngOnInit(): void {
    this._walletService.getWallets().subscribe({
      next: (data: WalletDTO[]) => {
        this.chartData = data
          .filter(wallet => wallet.AvailableBalance > 0)
          .map(wallet => ({
            Currency: wallet.CurrencySymbol,
            Balance: wallet.AvailableBalance + wallet.FrozenBalance
          }));
      }
    });
  }

}
