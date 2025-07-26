import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-collection-filters',
  imports: [NgFor],
  templateUrl: './collection-filters.component.html',
  styleUrl: './collection-filters.component.scss',
})
export class CollectionFiltersComponent {
  onFilterClick(arg0: string) {
    throw new Error('Method not implemented.');
  }
  filterMenu = [
    {
      name: 'Filter',
      icon: 'fa fa-filter',
    },
    {
      name: 'Sort',
      icon: 'fa fa-sort',
    },
    {
      name: 'Search',
      icon: 'fa fa-search',
    },
    {
      name: 'Show/Hide Fields',
      icon: 'fa fa-eye-slash',
    },
  ];
}
