import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICollection } from '../../../models/ICollection';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-collection-tabs',
  imports: [NgFor,NgIf, NgClass],
  templateUrl: './collection-tabs.component.html',
  styleUrl: './collection-tabs.component.scss',
})
export class CollectionTabsComponent {
  @Input() collection?: ICollection;
  @Input({ required: true }) collections!: ICollection[];
  @Output() onSelectCollection = new EventEmitter<ICollection>();
  @Output() onAddCollection = new EventEmitter<ICollection>();
  @Output() onEditCollection = new EventEmitter<ICollection>();
  
}
