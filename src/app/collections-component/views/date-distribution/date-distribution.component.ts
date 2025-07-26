import { Component, Input } from '@angular/core';
import { ICollection, ICollectionData } from '../../../../models/ICollection';
import { IView } from '../../../../models/IView';

@Component({
  selector: 'app-date-distribution',
  imports: [],
  templateUrl: './date-distribution.component.html',
  styleUrl: './date-distribution.component.scss'
})
export class DateDistributionComponent {
  @Input() collection?: ICollection;
  @Input() collectionData: ICollectionData[] = [];  @Input({ required: true }) view!: IView;
}
