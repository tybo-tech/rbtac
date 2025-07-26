import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-collection-menu',
  imports: [NgFor, NgClass],
  templateUrl: './collection-menu.component.html',
  styleUrl: './collection-menu.component.scss',
})
export class CollectionMenuComponent {
  items = [
    {
      name: 'Data',
      url: '/collections/data',
      className: 'active',
    },
    {
      name: 'Forms',
      url: '/collections/forms',
      className: '',
    },
    {
      name: 'Settings',
      url: '/collections/settings',
      className: '',
    },
  ];
}
