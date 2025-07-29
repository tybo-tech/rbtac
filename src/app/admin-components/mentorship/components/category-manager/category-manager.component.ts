import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipCategory } from '../../../../../models/mentorship';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-white">Question Categories</h3>
        <button
          (click)="onAdd.emit()"
          class="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
          <i class="fas fa-plus mr-2"></i>
          Add Category
        </button>
      </div>

      <!-- Categories List -->
      <div class="space-y-4">
        @for (category of categories(); track category.id || $index) {
          <div class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg category-item">
            <div class="flex-1">
              <input
                type="text"
                [(ngModel)]="category.name"
                (ngModelChange)="onUpdate.emit(categories())"
                placeholder="Category name"
                class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="w-24">
              <input
                type="number"
                [(ngModel)]="category.sort_order"
                (ngModelChange)="onUpdate.emit(categories())"
                placeholder="Order"
                min="0"
                class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button
              (click)="onRemove.emit(category)"
              class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-600">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        }
        @if (categories().length === 0) {
          <div class="text-center py-8 text-gray-400">
            <i class="fas fa-folder-open text-3xl mb-2"></i>
            <p>No categories added yet. Add categories to organize your questions.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class CategoryManagerComponent {
  categories = input.required<IMentorshipCategory[]>();

  onAdd = output<void>();
  onRemove = output<IMentorshipCategory>();
  onUpdate = output<IMentorshipCategory[]>();
}
