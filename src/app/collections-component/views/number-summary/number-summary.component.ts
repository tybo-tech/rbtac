import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICollection, ICollectionData, IColumn } from '../../../../models/ICollection';
import { IView } from '../../../../models/IView';
import { ViewService } from '../ViewService';
import { NumbersChartComponent } from '../../../shared/charts/numbers-chart/numbers-chart.component';
import { IChartViewData } from '../../../shared/charts/Charts';
import { LineChartComponent } from "../../../shared/charts/line-chart/line-chart.component";

@Component({
  selector: 'app-number-summary',
  standalone: true,
  imports: [CommonModule, NumbersChartComponent, LineChartComponent],
  templateUrl: './number-summary.component.html',
  styleUrl: './number-summary.component.scss'
})
export class NumberSummaryComponent implements OnChanges {
  @Input({ required: true }) collection!: ICollection;
  @Input({ required: true }) collectionData: ICollectionData[] = [];
  @Input({ required: true }) view!: IView;

  viewData: IChartViewData = {};
  columnName = 'Field'; // Will be updated dynamically

  constructor(private viewService: ViewService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['collection'] ||
      changes['collectionData'] ||
      changes['view']
    ) {
      this.viewData = this.viewService.loadViewData(
        this.view,
        this.collectionData,
        this.collection
      );

      // 🧠 Set column name for titles
      const field: IColumn | undefined = this.collection.columns.find(
        (col) => col.id === this.view.field
      );
      this.columnName = field?.name || this.view.name || 'Field';
    }
  }
}
