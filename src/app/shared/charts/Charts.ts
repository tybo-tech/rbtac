import { IKeyValue } from "./numbers-chart/numbers-chart.component";

//Doughnut Chart
export interface IDoughnutChart {
  labels: string[];
  datasets: IDoughnutDataset[];
}

export interface IDoughnutDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  hoverOffset: number;
}

export function initDoughnutChart(): IDoughnutChart {
  return {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Colors Overview',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  };
}

// Bar Chart

export interface IBarChart {
  labels: string[];
  datasets: IBarDataset[];
}

export interface IBarDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string[];
  borderWidth: number;
}

export function initBarChart(): IBarChart {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Bar Graph',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };
}

// Line Chart

export interface ILineChart {
  labels: string[];
  datasets: ILineDataset[];
}

export interface ILineDataset {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
  tension: number;
}

export function initLineChart(): ILineChart {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Line Graph',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
}

export interface IChartViewData {
  bar?: IBarChart;
  doughnut?: IDoughnutChart;
  line?: ILineChart;
  tableRows?: { label: string; value: number; percentage: number }[];
  tableColumns?: { key: string; value: string }[];
  numberSummary?: IKeyValue[];
}
