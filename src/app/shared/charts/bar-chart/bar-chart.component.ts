import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
import { IBarChart, initBarChart } from '../Charts';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() componentTitle = 'Colours overview';
  @Input() data: IBarChart = initBarChart();
  config: any;
  chart: any;
  chartId: string;

  constructor() {
    this.chartId = 'bar-chart-' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    // Initialize config here but don't create chart yet
    this.config = {
      type: 'bar',
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
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
