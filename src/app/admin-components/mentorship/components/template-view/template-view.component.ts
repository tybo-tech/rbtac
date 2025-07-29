import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMentorshipTemplate, IMentorshipCategory, IExtendedMentorshipQuestion } from '../../../../../models/mentorship';

@Component({
  selector: 'app-template-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Template Header -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white mb-2">{{ template().title }}</h2>
            <p class="text-gray-400 mb-4">{{ template().description }}</p>
            <div class="flex items-center space-x-6 text-sm text-gray-400">
              <span class="flex items-center">
                <i class="fas fa-tag mr-1"></i>
                {{ template().category || 'No category' }}
              </span>
              <span class="flex items-center">
                <i class="fas fa-question-circle mr-1"></i>
                {{ questions().length }} questions
              </span>
              <span class="flex items-center">
                <i class="fas fa-users mr-1"></i>
                {{ template().session_count || 0 }} sessions
              </span>
              <span
                class="px-2 py-1 text-xs rounded-full"
                [class]="(template().is_active ?? true) ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-100'">
                {{ (template().is_active ?? true) ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              (click)="onEdit.emit(template())"
              class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 btn-secondary">
              <i class="fas fa-edit mr-2"></i>
              Edit Template
            </button>
            <button
              (click)="onDuplicate.emit(template())"
              class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 btn-secondary">
              <i class="fas fa-copy mr-2"></i>
              Duplicate
            </button>
          </div>
        </div>
      </div>

      <!-- Categories and Questions -->
      @for (category of categories(); track category.id) {
        <div class="bg-gray-800 rounded-lg border border-gray-700">
          <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="text-lg font-medium text-white">
              <i class="fas fa-folder mr-2"></i>
              {{ category.name }}
            </h3>
          </div>
          <div class="p-6">
            @for (question of getQuestionsByCategory(category.id!); track question.id) {
              <div class="mb-6 last:mb-0">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="text-white font-medium">{{ question.question_text }}</h4>
                  <div class="flex items-center space-x-2">
                    @if (question.is_required) {
                      <span class="px-2 py-1 text-xs bg-red-600 text-red-100 rounded">
                        <i class="fas fa-asterisk mr-1"></i>Required
                      </span>
                    }
                    @if (question.trigger_task) {
                      <span class="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded">
                        <i class="fas fa-tasks mr-1"></i>Triggers Task
                      </span>
                    }
                    <span class="px-2 py-1 text-xs bg-gray-600 text-gray-100 rounded capitalize">
                      <i class="fas fa-cog mr-1"></i>{{ question.question_type }}
                    </span>
                  </div>
                </div>
                @if (question.question_type === 'dropdown' && question.options) {
                  <div class="text-sm text-gray-400">
                    <i class="fas fa-list mr-1"></i>
                    Options: {{ getOptionsText(question.options) }}
                  </div>
                }
              </div>
            } @empty {
              <div class="text-gray-400 text-sm">
                <i class="fas fa-info-circle mr-1"></i>
                No questions in this category
              </div>
            }
          </div>
        </div>
      }

      @if (categories().length === 0) {
        <div class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <i class="fas fa-file-alt text-gray-500 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-white mb-2">No categories or questions</h3>
          <p class="text-gray-400 mb-4">This template doesn't have any categories or questions yet.</p>
          <button
            (click)="onEdit.emit(template())"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add Categories & Questions
          </button>
        </div>
      }
    </div>
  `
})
export class TemplateViewComponent {
  template = input.required<IMentorshipTemplate>();
  categories = input.required<IMentorshipCategory[]>();
  questions = input.required<IExtendedMentorshipQuestion[]>();

  onEdit = output<IMentorshipTemplate>();
  onDuplicate = output<IMentorshipTemplate>();

  getQuestionsByCategory(categoryId: number): IExtendedMentorshipQuestion[] {
    return this.questions().filter(q => q.category_id === categoryId);
  }

  getOptionsText(options: any): string {
    if (Array.isArray(options)) {
      return options.join(', ');
    }
    return String(options);
  }
}
