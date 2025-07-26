import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionViewsComponent } from '../collection-views/collection-views.component';
import { CollectionTableViewComponent } from '../collection-table-view/collection-table-view.component';
import {
  ICollection,
  ICollectionData,
  IColumn,
  IReferenceOptionMap,
} from '../../../models/ICollection';
import { NgIf } from '@angular/common';
import { IView, ViewTypes } from '../../../models/IView';
import { SelectDistributionComponent } from "../views/select-distribution/select-distribution.component";
import { MultiSelectFrequencyComponent } from "../views/multi-select-frequency/multi-select-frequency.component";
import { NumberSummaryComponent } from "../views/number-summary/number-summary.component";
import { DateDistributionComponent } from "../views/date-distribution/date-distribution.component";
import { BooleanDistributionComponent } from "../views/boolean-distribution/boolean-distribution.component";

@Component({
  selector: 'app-collection-data-setion',
  imports: [
    NgIf,
    CollectionViewsComponent,
    CollectionTableViewComponent,
    SelectDistributionComponent,
    MultiSelectFrequencyComponent,
    NumberSummaryComponent,
    DateDistributionComponent,
    BooleanDistributionComponent
],
  templateUrl: './collection-data-setion.component.html',
  styleUrl: './collection-data-setion.component.scss',
})
export class CollectionDataSetionComponent {
  view?: IView;
  ViewTypes = ViewTypes;
  @Input() collection?: ICollection;
  @Input() viewId = 0; // Used to track the current view ID for editing
  @Input() collectionData: ICollectionData[] = [];
  @Input() referenceOptionsMap: IReferenceOptionMap = {};

  @Output() onAddColumn = new EventEmitter<void>();
  @Output() onEditColumn = new EventEmitter<IColumn>();
  @Output() onAddRow = new EventEmitter<void>();
  @Output() onColumnDataUpdate = new EventEmitter<ICollectionData>();
  @Output() onEditRow = new EventEmitter<ICollectionData>();
  @Output() onDeleteRow = new EventEmitter<ICollectionData>();
  @Output() onDeleteColumn = new EventEmitter<IColumn>();
  @Output() onMoveLeft = new EventEmitter<IColumn>();
  @Output() onMoveRight = new EventEmitter<IColumn>();
    @Output() onSaveCollection = new EventEmitter<void>();

}
