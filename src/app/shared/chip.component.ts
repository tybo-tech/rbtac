import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [NgIf],
  template: `
    <div
      class="inline-flex items-center rounded-md px-2 py-[2px] text-xs font-medium whitespace-nowrap"
      [style.background-color]="background || '#e5e7eb'"
      [style.color]="color || '#111827'"
    >
      {{ label }}
      <button
        *ngIf="removable"
        (click)="remove.emit()"
        class="ml-1 text-[10px] hover:text-red-600 focus:outline-none p-0 m-0"
        style="margin: 0; padding: 0; width: 16px; height: 16px; margin-left: 6px;"
        title="Remove"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  `,
})
export class ChipComponent {
  @Input() label!: string;
  @Input() removable = false;
  @Input() background?: string;
  @Input() color?: string;
  @Output() remove = new EventEmitter<void>();
}
