import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend } from 'chart.js';
import { ILineChart, initLineChart } from '../Charts';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, Title, Tooltip, Legend);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() componentTitle = 'Line Chart';
  @Input() data: ILineChart = initLineChart();
  config: any;
  chart: any;
  chartId: string;

  constructor() {
    this.chartId = 'line-chart-' + Math.random().toString(36).substr(2, 9);
  }

  ngOnInit(): void {
    // Initialize config here but don't create chart yet
    this.config = {
      type: 'line',
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
