import { Component, Input } from '@angular/core';
import {
  ICollection,
  ICollectionData,
  IColumn,
} from '../../../models/ICollection';
import {
  NgFor,
  NgIf,
  KeyValuePipe,
  TitleCasePipe,
  NgClass,
} from '@angular/common';
import { BarChartComponent } from '../../shared/charts/bar-chart/bar-chart.component';
import { DoughnutComponent } from '../../shared/charts/doughnut/doughnut.component';
import {
  IBarChart,
  IDoughnutChart,
  ILineChart,
} from '../../shared/charts/Charts';

// Professional interfaces for reporting
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface ReportSummary {
  totalRecords: number;
  columnName: string;
  reportType: ReportType;
  data: ChartDataPoint[];
  metadata?: Record<string, any>;
}

export type ReportType =
  | 'select'
  | 'multi-select'
  | 'number'
  | 'date'
  | 'boolean';

export interface ReportConfig {
  type: ReportType;
  label: string;
  icon: string;
  description: string;
  chartType: 'bar' | 'pie' | 'line' | 'summary';
}

@Component({
  selector: 'app-collection-report-view',
  imports: [
    NgIf,
    NgFor,
    KeyValuePipe,
    TitleCasePipe,
    BarChartComponent,
    DoughnutComponent,
    NgClass,
  ],
  templateUrl: './collection-report-view.component.html',
})
export class CollectionReportViewComponent {
  @Input() collection?: ICollection;
  @Input() collectionData: ICollectionData[] = [];

  // Professional report configuration
  readonly REPORT_CONFIGS: Record<ReportType, ReportConfig> = {
    select: {
      type: 'select',
      label: 'Single Select Analysis',
      icon: 'fas fa-chart-pie',
      description: 'Distribution of selected options',
      chartType: 'pie',
    },
    'multi-select': {
      type: 'multi-select',
      label: 'Multi-Select Frequency',
      icon: 'fas fa-chart-bar',
      description: 'Frequency of each option selection',
      chartType: 'bar',
    },
    number: {
      type: 'number',
      label: 'Numerical Summary',
      icon: 'fas fa-calculator',
      description: 'Statistical analysis of numerical data',
      chartType: 'summary',
    },
    date: {
      type: 'date',
      label: 'Date Distribution',
      icon: 'fas fa-chart-line',
      description: 'Timeline distribution analysis',
      chartType: 'line',
    },
    boolean: {
      type: 'boolean',
      label: 'Boolean Distribution',
      icon: 'fas fa-toggle-on',
      description: 'True/False distribution',
      chartType: 'pie',
    },
  };

  // Available report types (ordered by priority)
  readonly AVAILABLE_REPORT_TYPES: ReportType[] = [
    'select',
    'multi-select',
    'number',
    'date',
    'boolean',
  ];

  selectedColumn: IColumn | null = null;
  currentReport: ReportSummary | null = null;

  // Chart.js data properties
  currentBarChart: IBarChart | null = null;
  currentDoughnutChart: IDoughnutChart | null = null;

  get reportableColumns(): Record<ReportType, IColumn[]> {
    if (!this.collection?.columns) {
      return {
        select: [],
        'multi-select': [],
        number: [],
        date: [],
        boolean: [],
      };
    }

    return {
      select: this.collection.columns.filter((col) => col.type === 'select'),
      'multi-select': this.collection.columns.filter(
        (col) => col.type === 'multi-select'
      ),
      number: this.collection.columns.filter((col) => col.type === 'number'),
      date: this.collection.columns.filter((col) => col.type === 'date'),
      boolean: this.collection.columns.filter((col) => col.type === 'boolean'),
    };
  }

  get hasReportableColumns(): boolean {
    return this.AVAILABLE_REPORT_TYPES.some(
      (type) => this.reportableColumns[type].length > 0
    );
  }

  get totalRecords(): number {
    return this.collectionData.length;
  }

  selectReport(column: IColumn): void {
    this.selectedColumn = column;
    this.currentReport = this.generateReport(column);
    this.generateChartJsData(); // Convert to Chart.js format
  }

  private generateReport(column: IColumn): ReportSummary {
    const reportType = column.type as ReportType;
    let data: ChartDataPoint[] = [];
    let metadata: Record<string, any> = {};

    switch (reportType) {
      case 'select':
        data = this.generateSelectReport(column);
        break;
      case 'multi-select':
        data = this.generateMultiSelectReport(column);
        break;
      case 'number':
        data = this.generateNumberReport(column);
        metadata = this.generateNumberMetadata(column);
        break;
      case 'date':
        data = this.generateDateReport(column);
        break;
      case 'boolean':
        data = this.generateBooleanReport(column);
        break;
    }

    // Add percentages for categorical data
    if (['select', 'multi-select', 'boolean'].includes(reportType)) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      data = data.map((item) => ({
        ...item,
        percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
      }));
    }

    return {
      totalRecords: this.totalRecords,
      columnName: column.name,
      reportType,
      data: data.sort((a, b) => b.value - a.value), // Sort by value descending
      metadata,
    };
  }

  // Convert our ChartDataPoint[] to Chart.js format
  private generateChartJsData(): void {
    if (!this.currentReport) return;

    const { data, reportType } = this.currentReport;
    const labels = data.map((item) => item.label);
    const values = data.map((item) => item.value);
    const colors = data.map(
      (item) => item.color || this.getDefaultColor(labels.indexOf(item.label))
    );

    // Generate Bar Chart data
    this.currentBarChart = {
      labels,
      datasets: [
        {
          label: this.currentReport.columnName,
          data: values,
          backgroundColor: colors.map((color) => color + '80'), // Add transparency
          borderColor: colors,
          borderWidth: 2,
        },
      ],
    };

    // Generate Doughnut Chart data (for select/multi-select/boolean)
    if (['select', 'multi-select', 'boolean'].includes(reportType)) {
      this.currentDoughnutChart = {
        labels,
        datasets: [
          {
            label: this.currentReport.columnName,
            data: values,
            backgroundColor: colors,
            hoverOffset: 4,
          },
        ],
      };
    }
  }

  private getDefaultColor(index: number): string {
    const defaultColors = [
      '#3B82F6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
      '#F97316',
      '#6366F1',
      '#84CC16',
    ];
    return defaultColors[index % defaultColors.length];
  }

  private generateSelectReport(column: IColumn): ChartDataPoint[] {
    const counts: Record<string, number> = {};
    const colors = [
      '#3B82F6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#EC4899',
    ];

    this.collectionData.forEach((row) => {
      const value = row.data[column.id];
      if (value) {
        const option = column.options?.find((opt) => opt.value === value);
        const label = option?.label || value;
        counts[label] = (counts[label] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
  }

  private generateMultiSelectReport(column: IColumn): ChartDataPoint[] {
    const counts: Record<string, number> = {};
    const colors = [
      '#3B82F6',
      '#EF4444',
      '#10B981',
      '#F59E0B',
      '#8B5CF6',
      '#EC4899',
    ];

    this.collectionData.forEach((row) => {
      const values: string[] = row.data[column.id] || [];
      values.forEach((value) => {
        const option = column.options?.find((opt) => opt.value === value);
        const label = option?.label || value;
        counts[label] = (counts[label] || 0) + 1;
      });
    });

    return Object.entries(counts).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
  }

  private generateNumberReport(column: IColumn): ChartDataPoint[] {
    const values = this.collectionData
      .map((row) => parseFloat(row.data[column.id]))
      .filter((value) => !isNaN(value));

    if (values.length === 0) {
      return [];
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return [
      { label: 'Count', value: values.length },
      { label: 'Sum', value: Math.round(sum * 100) / 100 },
      { label: 'Average', value: Math.round(average * 100) / 100 },
      { label: 'Maximum', value: max },
      { label: 'Minimum', value: min },
    ];
  }

  private generateNumberMetadata(column: IColumn): Record<string, any> {
    const values = this.collectionData
      .map((row) => parseFloat(row.data[column.id]))
      .filter((value) => !isNaN(value));

    if (values.length === 0) return {};

    const sorted = [...values].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    return {
      median: Math.round(median * 100) / 100,
      range: Math.max(...values) - Math.min(...values),
      nullCount: this.collectionData.length - values.length,
    };
  }

  private generateDateReport(column: IColumn): ChartDataPoint[] {
    const counts: Record<string, number> = {};

    this.collectionData.forEach((row) => {
      const value = row.data[column.id];
      if (value) {
        const date = new Date(value);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        counts[monthYear] = (counts[monthYear] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateBooleanReport(column: IColumn): ChartDataPoint[] {
    const counts = { True: 0, False: 0, 'Not Set': 0 };

    this.collectionData.forEach((row) => {
      const value = row.data[column.id];
      if (value === true) counts['True']++;
      else if (value === false) counts['False']++;
      else counts['Not Set']++;
    });

    return [
      { label: 'True', value: counts['True'], color: '#10B981' },
      { label: 'False', value: counts['False'], color: '#EF4444' },
      { label: 'Not Set', value: counts['Not Set'], color: '#6B7280' },
    ].filter((item) => item.value > 0);
  }

  getReportConfig(type: ReportType): ReportConfig {
    return this.REPORT_CONFIGS[type];
  }

  getTimelineWidth(value: number): number {
    if (!this.currentReport?.data) return 0;
    const maxValue = Math.max(
      ...this.currentReport.data.map((item) => item.value)
    );
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }

  // 🔥 EXPORT FUNCTIONALITY - Ship it to CSV/JSON
  exportToCsv(report: ReportSummary): void {
    if (!report) return;

    const headers =
      report.reportType === 'number'
        ? 'Statistic,Value\n'
        : 'Label,Count,Percentage\n';

    const rows = report.data.map((item) =>
      report.reportType === 'number'
        ? `${item.label},${item.value}`
        : `${item.label},${item.value},${item.percentage ?? 0}%`
    );

    const csvContent = headers + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${report.columnName.replace(/\s+/g, '_')}_report.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToJson(report: ReportSummary): void {
    if (!report) return;

    const exportData = {
      reportTitle: `${report.columnName} Analysis`,
      reportType: report.reportType,
      generatedAt: new Date().toISOString(),
      totalRecords: report.totalRecords,
      data: report.data,
      metadata: report.metadata || {},
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], {
      type: 'application/json;charset=utf-8;',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${report.columnName.replace(/\s+/g, '_')}_report.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 🎯 ADVANCED FEATURES
  getTopPerformers(limit: number = 3): ChartDataPoint[] {
    if (!this.currentReport?.data) return [];
    return [...this.currentReport.data]
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  getTotalDataPoints(): number {
    if (!this.currentReport?.data) return 0;
    return this.currentReport.data.reduce((sum, item) => sum + item.value, 0);
  }

  getReportInsight(): string {
    if (!this.currentReport) return '';

    const { reportType, data } = this.currentReport;
    const topItem = data[0];

    if (!topItem) return 'No data available';

    switch (reportType) {
      case 'select':
      case 'multi-select':
        const percentage = topItem.percentage || 0;
        return `"${topItem.label}" is the most popular choice (${percentage}% of responses)`;

      case 'number':
        const avgItem = data.find((item) => item.label === 'Average');
        return avgItem
          ? `Average value is ${avgItem.value}`
          : 'Statistical summary available';

      case 'date':
        return `Peak activity in ${topItem.label} with ${topItem.value} records`;

      case 'boolean':
        return `${topItem.label} represents ${topItem.percentage}% of responses`;

      default:
        return 'Data analysis complete';
    }
  }

  clearReport(): void {
    this.selectedColumn = null;
    this.currentReport = null;
    this.currentBarChart = null;
    this.currentDoughnutChart = null;
  }

  // Podium styling methods for top performers
  getPodiumClass(index: number): string {
    const classes = ['podium-gold', 'podium-silver', 'podium-bronze'];
    return classes[index] || 'podium-other';
  }

  getPodiumIcon(index: number): string {
    const icons = ['fas fa-trophy', 'fas fa-medal', 'fas fa-award'];
    return icons[index] || 'fas fa-star';
  }
}
