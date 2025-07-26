import { Component, Input } from '@angular/core';
import { ICollection, ICollectionData } from '../../../../models/ICollection';
import { IView } from '../../../../models/IView';

@Component({
  selector: 'app-multi-select-frequency',
  imports: [],
  templateUrl: './multi-select-frequency.component.html',
  styleUrl: './multi-select-frequency.component.scss'
})
export class MultiSelectFrequencyComponent {
  @Input() collection?: ICollection;
  @Input() collectionData: ICollectionData[] = [];
  @Input({ required: true }) view!: IView;
}
