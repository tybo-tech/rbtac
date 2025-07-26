import { Injectable } from '@angular/core';
import {
  ICollectionData,
  ICollection,
  IColumn,
} from '../../../models/ICollection';
import { IView } from '../../../models/IView';
import {
  IBarChart,
  IDoughnutChart,
  ILineChart,
  IChartViewData,
} from '../../shared/charts/Charts';

@Injectable({ providedIn: 'root' })
export class ViewService {
  loadViewData(
    view: IView,
    collectionData: ICollectionData[],
    collection: ICollection
  ): IChartViewData {
    const field = this.getField(collection, view.field);
    if (!field) return {};

    switch (field.type) {
      case 'select':
      case 'multi-select':
      case 'boolean':
        return this.buildSelectDistribution(view, collectionData, field);
      case 'number':
      case 'currency':
        return this.buildNumberSummary(view, collectionData, field);
      default:
        return {};
    }
  }

  // 🧩 Select / Boolean / Multi-select Distribution
  private buildSelectDistribution(
    view: IView,
    collectionData: ICollectionData[],
    field: IColumn
  ): IChartViewData {
    const values = this.getFieldValues(collectionData, field.id);
    if (!values.length) return {};

    const frequency = this.countFrequencies(values);
    const labels = Object.keys(frequency);
    const data = labels.map((label) => frequency[label]);

    const bgColorMap = this.getOptionColors(field);
    const bgColors = labels.map(
      (label) => bgColorMap[label] || this.getFallbackColor(label)
    );

    const total = data.reduce((sum, count) => sum + count, 0);
    const tableRows = labels.map((label) => ({
      label,
      value: frequency[label],
      percentage: total ? Math.round((frequency[label] / total) * 100) : 0,
    }));

    // Generate line chart for categorical trend over time
    const lineChartData = this.generateCategoricalTrendData(collectionData, field.id, field.name || 'Values');

    return {
      bar: this.initBarChart(labels, data, bgColors, bgColors, field.name),
      doughnut: this.initDoughnutChart(labels, data, bgColors, field.name),
      line: lineChartData,
      tableRows,
      tableColumns: [
        { key: 'label', value: 'Option' },
        { key: 'value', value: 'Count' },
        { key: 'percentage', value: 'Percentage' },
      ],
    };
  }

  // 🧮 Numeric Summary View
  private buildNumberSummary(
    view: IView,
    collectionData: ICollectionData[],
    field: IColumn
  ): IChartViewData {
    const values = this.getNumericValues(collectionData, field.id);
    if (!values.length) return {};

    const total = values.reduce((sum, val) => sum + val, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = total / values.length;
    const count = values.length;

    // Calculate median
    const sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    const median = sortedValues.length % 2 !== 0 
      ? sortedValues[mid] 
      : (sortedValues[mid - 1] + sortedValues[mid]) / 2;

    // Generate line chart data showing values over time
    const lineChartData = this.generateTrendLineData(collectionData, field.id);

    return {
      numberSummary: [
        { key: 'Total Records', value: count.toString() },
        { key: 'Sum', value: this.formatNumber(total) },
        { key: 'Average', value: this.formatNumber(avg) },
        { key: 'Minimum', value: this.formatNumber(min) },
        { key: 'Maximum', value: this.formatNumber(max) },
        { key: 'Median', value: this.formatNumber(median) },
      ],
      line: lineChartData,
    };
  }

  // 🔒 PRIVATE HELPERS

  private getField(collection: ICollection, fieldId: string): IColumn | undefined {
    const field = collection.columns.find((col) => col.id === fieldId);
    if (!field) console.warn(`Field with id ${fieldId} not found.`);
    return field;
  }

  private getFieldValues(collectionData: ICollectionData[], fieldId: string): any[] {
    return collectionData
      .map((row) => row.data[fieldId])
      .filter((v) => v !== undefined && v !== null);
  }

  private getNumericValues(collectionData: ICollectionData[], fieldId: string): number[] {
    return this.getFieldValues(collectionData, fieldId)
      .map((v) => Number(v))
      .filter((n) => !isNaN(n));
  }

  private countFrequencies(values: any[]): Record<string, number> {
    const freq: Record<string, number> = {};
    values.forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
      } else {
        freq[val] = (freq[val] || 0) + 1;
      }
    });
    return freq;
  }

  private getOptionColors(field: IColumn): Record<string, string> {
    const map: Record<string, string> = {};
    field.options?.forEach((opt) => {
      if (opt.value && opt.background) {
        map[opt.value] = opt.background;
      }
    });
    return map;
  }

  private getFallbackColor(label: string): string {
    const fallbackPalette = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
      '#22C55E', '#EAB308',
    ];
    const hash = [...label].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackPalette[hash % fallbackPalette.length];
  }

  private initBarChart(
    labels: string[],
    data: number[],
    backgroundColor: string[] = [],
    borderColor: string[] = [],
    label: string = 'Bar Chart',
    borderWidth: number = 1
  ): IBarChart {
    return {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor,
        borderColor,
        borderWidth,
      }],
    };
  }

  private initDoughnutChart(
    labels: string[],
    data: number[],
    backgroundColor: string[] = [],
    label: string = 'Doughnut Chart'
  ): IDoughnutChart {
    return {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor,
        hoverOffset: 4,
      }],
    };
  }

  private formatNumber(value: number): string {
    // Format number with thousand separators and 2 decimal places if needed
    if (value % 1 === 0) {
      // Integer value
      return value.toLocaleString();
    } else {
      // Decimal value - show up to 2 decimal places
      return value.toLocaleString(undefined, { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      });
    }
  }

  private generateTrendLineData(collectionData: ICollectionData[], fieldId: string): ILineChart {
    // Sort data by creation date
    const sortedData = [...collectionData]
      .filter(row => row.data[fieldId] !== undefined && row.data[fieldId] !== null)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateA - dateB;
      });

    if (sortedData.length === 0) {
      return this.initLineChart([], [], 'No Data Available');
    }

    // Create labels and data points
    const labels: string[] = [];
    const dataPoints: number[] = [];

    sortedData.forEach((row, index) => {
      const value = Number(row.data[fieldId]);
      if (!isNaN(value)) {
        // Create label from creation date or record index
        const date = row.created_at ? new Date(row.created_at) : new Date();
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        labels.push(label);
        dataPoints.push(value);
      }
    });

    return this.initLineChart(labels, dataPoints, 'Value Trend Over Time');
  }

  private generateCategoricalTrendData(collectionData: ICollectionData[], fieldId: string, fieldName: string): ILineChart {
    // Sort data by creation date and group by date
    const sortedData = [...collectionData]
      .filter(row => row.data[fieldId] !== undefined && row.data[fieldId] !== null)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateA - dateB;
      });

    if (sortedData.length < 2) {
      return this.initLineChart([], [], 'Insufficient Data for Trend');
    }

    // Group data by date and count frequency of most common value
    const dateGroups: { [date: string]: { [value: string]: number } } = {};
    
    sortedData.forEach(row => {
      const date = row.created_at ? new Date(row.created_at).toDateString() : new Date().toDateString();
      const value = String(row.data[fieldId]);
      
      if (!dateGroups[date]) {
        dateGroups[date] = {};
      }
      dateGroups[date][value] = (dateGroups[date][value] || 0) + 1;
    });

    // Create time series showing count of most frequent value per day
    const labels: string[] = [];
    const dataPoints: number[] = [];

    Object.keys(dateGroups).forEach(dateStr => {
      const date = new Date(dateStr);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(label);
      
      // Get the count of the most frequent value for this date
      const values = Object.values(dateGroups[dateStr]);
      const maxCount = Math.max(...values);
      dataPoints.push(maxCount);
    });

    return this.initLineChart(labels, dataPoints, `${fieldName} Activity Over Time`, 'rgb(34, 197, 94)');
  }

  private initLineChart(
    labels: string[], 
    data: number[], 
    label: string = 'Line Chart',
    borderColor: string = 'rgb(75, 192, 192)',
    tension: number = 0.1
  ): ILineChart {
    return {
      labels,
      datasets: [{
        label,
        data,
        fill: false,
        borderColor,
        tension,
      }],
    };
  }
}
