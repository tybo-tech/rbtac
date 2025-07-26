import { Component, Input } from '@angular/core';
import { ICollection, ICollectionData } from '../../../../models/ICollection';
import { IView } from '../../../../models/IView';

@Component({
  selector: 'app-boolean-distribution',
  imports: [],
  templateUrl: './boolean-distribution.component.html',
  styleUrl: './boolean-distribution.component.scss'
})
export class BooleanDistributionComponent {
  @Input() collection?: ICollection;
  @Input() collectionData: ICollectionData[] = [];  @Input({ required: true }) view!: IView;
}
