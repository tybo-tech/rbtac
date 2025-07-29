import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMentorshipTemplate } from '../../../../../models/mentorship';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200 template-card">
      <div class="p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-white mb-2">{{ template().title }}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ template().description || 'No description provided' }}</p>

            <div class="flex items-center space-x-4 text-sm text-gray-400 mb-4">
              <span class="flex items-center">
                <i class="fas fa-question-circle mr-1"></i>
                {{ template().question_count || 0 }} questions
              </span>
              <span class="flex items-center">
                <i class="fas fa-users mr-1"></i>
                {{ template().session_count || 0 }} sessions
              </span>
            </div>

            <div class="flex items-center justify-between">
              <span
                class="px-2 py-1 text-xs rounded-full"
                [class]="(template().is_active ?? true) ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-100'">
                {{ (template().is_active ?? true) ? 'Active' : 'Inactive' }}
              </span>
              <span class="text-xs text-gray-500">{{ formatDate(template().created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-between">
          <button
            (click)="onView.emit(template())"
            class="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View Details
          </button>
          <div class="flex items-center space-x-2">
            <button
              (click)="onEdit.emit(template())"
              class="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              title="Edit Template">
              <i class="fas fa-edit"></i>
            </button>
            <button
              (click)="onDuplicate.emit(template())"
              class="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              title="Duplicate Template">
              <i class="fas fa-copy"></i>
            </button>
            <button
              (click)="onDelete.emit(template())"
              class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
              title="Delete Template">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TemplateCardComponent {
  template = input.required<IMentorshipTemplate>();

  onView = output<IMentorshipTemplate>();
  onEdit = output<IMentorshipTemplate>();
  onDuplicate = output<IMentorshipTemplate>();
  onDelete = output<IMentorshipTemplate>();

  formatDate(dateString?: string): string {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  }
}
