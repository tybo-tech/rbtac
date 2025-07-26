import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICollection, ICollectionData, IColumn } from '../../../../models/ICollection';
import { IView } from '../../../../models/IView';
import { BarChartComponent } from '../../../shared/charts/bar-chart/bar-chart.component';
import { DoughnutComponent } from '../../../shared/charts/doughnut/doughnut.component';
import { LineChartComponent } from '../../../shared/charts/line-chart/line-chart.component';
import { ViewService } from '../ViewService';
import { TableComponent } from '../../../shared/charts/table/table.component';
import { IChartViewData } from '../../../shared/charts/Charts';

@Component({
  selector: 'app-select-distribution',
  standalone: true,
  imports: [CommonModule, BarChartComponent, DoughnutComponent, TableComponent, LineChartComponent],
  templateUrl: './select-distribution.component.html',
  styleUrl: './select-distribution.component.scss',
})
export class SelectDistributionComponent implements OnChanges {
  @Input({ required: true }) collection!: ICollection;
  @Input({ required: true }) collectionData!: ICollectionData[];
  @Input({ required: true }) view!: IView;

  viewData: IChartViewData = {};
  columnName = 'Field'; // Will be updated dynamically

  constructor(private viewService: ViewService) {}

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
