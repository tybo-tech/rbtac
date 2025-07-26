import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [CommonModule],
  template: `
    <div class="tabs-container">
      <div
        *ngFor="let tab of tabs; let i = index"
        class="tab"
        [class.active]="i === activeTabIndex"
        (click)="setActiveTab(i)"
      >
        {{ tab }}
      </div>
    </div>
  `,
  styles: [
    `
      .tabs-container {
        display: flex;
        border-bottom: 1px solid rgb(80, 78, 78);
      }
      .tab {
        padding: 10px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        font-size: 12px !important;
        color: #ffffff;
      }
      .tab:hover {
        color: var(--accent);
      }
      .tab.active {
        border-bottom: 2px solid var(--accent);;
        font-weight: bold;
      }
    `,
  ],
})
export class TabsComponent {
  @Input() tabs: string[] = []; // List of tab names
  @Input() activeTabIndex: number = 0; // Index of the active tab
  @Output() activeTabChange = new EventEmitter<number>(); // Event emitter to emit the active tab index

  // Method to set the active tab
  setActiveTab(index: number): void {
    this.activeTabIndex = index;
    this.activeTabChange.emit(index);
    localStorage.setItem('activeTabIndex', index.toString());
  }
}
