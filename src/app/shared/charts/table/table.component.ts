import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IKeyValue } from '../../../../models/IKeyValue';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [NgIf, NgFor],
})
export class TableComponent {
  @Input() minHeight = '384px';
  @Input() showAddButton = false
  @Input() data: any[] = [
    { name: 'John', age: 25, city: 'New York' },
    { name: 'Jane', age: 24, city: 'Los Angeles' },
    { name: 'Doe', age: 26, city: 'Chicago' },
    { name: 'Smith', age: 27, city: 'Houston' },
    { name: 'Wilson', age: 28, city: 'Philadelphia' },
    { name: 'Brown', age: 29, city: 'Phoenix' },
  ];

  @Input() columns: IKeyValue[] = [
    {
      value: 'Name',
      key: 'name',
    },
    {
      value: 'Age',
      key: 'age',
    },
    {
      value: 'City',
      key: 'city',
    },
  ];
  @Input() componentTitle = 'Our Visitors';

  @Output() rowClick = new EventEmitter<any>();

@Output() addClick = new EventEmitter<any>();
}
