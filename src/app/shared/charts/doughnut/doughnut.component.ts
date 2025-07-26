import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, ArcElement, DoughnutController, Tooltip, Legend } from 'chart.js';
import { IDoughnutChart, initDoughnutChart } from '../Charts';

// Register Chart.js components
Chart.register(ArcElement, DoughnutController, Tooltip, Legend);
@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss'],
})
export class DoughnutComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() componentTitle = 'Colours overview';
  @Input() data: IDoughnutChart = initDoughnutChart();
  config: any;
  chart: any;
  chartId: string;

  constructor() {
    this.chartId = 'doughnut-chart-' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    // Initialize config here but don't create chart yet
    this.config = {
      type: 'doughnut',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  }

  ngAfterViewInit(): void {
    // Create chart after view is initialized
    setTimeout(() => {
      const canvas = document.getElementById(this.chartId);
      if (canvas) {
        this.chart = new Chart(this.chartId, this.config);
      } else {
        console.error('Canvas element not found:', this.chartId);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
