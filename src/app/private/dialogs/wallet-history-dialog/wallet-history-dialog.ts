import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DailyTransactionsDTO } from '../../../interfaces/Transaction';
import { TransactionService } from '../../../services/transaction-service';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WalletDTO } from '../../../interfaces/Wallet';
import { ViewChild, ElementRef } from '@angular/core';

Chart.register(...registerables);

@Component({
  selector: 'app-wallet-history-dialog',
  imports: [],
  templateUrl: './wallet-history-dialog.html',
  styleUrl: './wallet-history-dialog.scss'
})


export class WalletHistoryDialog implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('balanceCanvas', { static: false }) balanceCanvas!: ElementRef<HTMLCanvasElement>;

  chartData: DailyTransactionsDTO[] = [];

  chartLabels: string[] = [];
  chartValues: number[] = [];

  transactionHistorySub$!: Subscription;

  chartReady = false; // flag to avoid early rendering
  dataReady = false;

  constructor(
    private _transactionService: TransactionService,
    private _dialogRef: MatDialogRef<WalletHistoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { wallet: WalletDTO } // Assuming you pass walletId in data
  ) { }

  ngOnInit(): void {
    this.transactionHistorySub$ = this._transactionService.getWalletHistory(this.data.wallet.WalletId)
      .subscribe({
        next: (data) => {
          this.chartData = data;
          this.processChartData();
          this.dataReady = true;
          this.tryRenderChart();
        },
        error: (error) => {
          console.error('Error fetching wallet history:', error);
        }
      });
  }

  ngAfterViewInit(): void {
    this.chartReady = true;
    this.tryRenderChart();
  }

  tryRenderChart(): void {
    if (this.chartReady && this.dataReady) {
      this.renderChart();
    }
  }

  processChartData() {
    this.chartData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    this.chartLabels = this.chartData.map(day => new Date(day.Date).toLocaleDateString());
    this.chartValues = this.chartData.map(day => day.WalletBalance);

    console.log('Chart Labels:', this.chartLabels);
    console.log('Chart Values:', this.chartValues);
  }

  renderChart() {
    const ctx = this.balanceCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    console.log('Rendering chart with labels:', this.chartLabels);
    console.log('Rendering chart with values:', this.chartValues);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: 'Wallet Balance',
          data: this.chartValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Optional: lets you control size better
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Balance'
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.transactionHistorySub$) {
      this.transactionHistorySub$.unsubscribe();
    }
  }
}
