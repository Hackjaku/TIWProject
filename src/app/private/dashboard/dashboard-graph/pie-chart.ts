import { Component, ElementRef, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { WalletPieChartData } from '../../../interfaces/Wallet';

@Component({
  selector: 'app-pie-chart',
  template: `<canvas #chart></canvas>`,
  standalone: true,
})
export class PieChart implements OnDestroy, OnChanges {
  @ViewChild('chart', { static: true }) chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() data: WalletPieChartData[] = [];

  private chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length > 0 && this.chartRef) {
      this.renderChart();
    }
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy the old one before creating a new one
    }

    const labels = this.data.map(d => d.Currency);
    const values = this.data.map(d => d.Balance);

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Currency Balances',
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#9CCC65', '#FF7043',
            '#42A5F5', '#AB47BC', '#26C6DA', '#D4E157'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
