import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  template: `
    <div class="empty-state">
      <i [class]="icon"></i>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  `, 
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 2rem auto;
    }
    .empty-state i {
      font-size: 4rem;
      color: #ccc;
    }
    .empty-state h2 {
      margin: 0.5rem 0;
      font-size: 1rem;
      text-align: left;
    }
    .empty-state p {
      font-size: 0.875rem;
      text-align: left;
      color: #666;
    }
  `]

})
export class EmptyStateComponent {
  //   <app-empty-state
  //   *ngIf="!collections || collections.length === 0"
  //   [icon]="'bi bi-box'"
  //   [title]="'No collections'"
  //   [description]="'Click the + icon to add a new collection.'"
  // ></app-empty-state>

  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}
