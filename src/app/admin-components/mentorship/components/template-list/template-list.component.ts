import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTemplate } from '../../../../../models/mentorship';
import { TemplateCardComponent } from '../template-card/template-card.component';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Search and Filters -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              [(ngModel)]="searchTerm"
              (input)="onSearch.emit(searchTerm())"
              class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <select
            [(ngModel)]="filterCategory"
            (change)="onFilterChange.emit(filterCategory())"
            class="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Categories</option>
            <option value="business">Business Development</option>
            <option value="technical">Technical Assessment</option>
            <option value="financial">Financial Planning</option>
            <option value="marketing">Marketing Strategy</option>
          </select>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (template of filteredTemplates(); track template.id) {
          <app-template-card
            [template]="template"
            (onView)="onView.emit($event)"
            (onEdit)="onEdit.emit($event)"
            (onDuplicate)="onDuplicate.emit($event)"
            (onDelete)="onDelete.emit($event)">
          </app-template-card>
        }
      </div>

      <!-- Empty State -->
      @if (filteredTemplates().length === 0 && !isLoading()) {
        <div class="text-center py-12">
          <i class="fas fa-file-alt text-gray-500 text-5xl mb-4"></i>
          <h3 class="text-lg font-medium text-white mb-2">No templates found</h3>
          <p class="text-gray-400 mb-6">Get started by creating your first mentorship template.</p>
          <button
            (click)="onCreate.emit()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <i class="fas fa-plus mr-2"></i>
            Create Template
          </button>
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-400 mt-4">Loading templates...</p>
        </div>
      }

      <!-- Statistics -->
      @if (templates().length > 0) {
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 class="text-lg font-medium text-white mb-4">Template Statistics</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">{{ templates().length }}</div>
              <div class="text-sm text-gray-400">Total Templates</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-400">{{ activeTemplatesCount() }}</div>
              <div class="text-sm text-gray-400">Active Templates</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-purple-400">{{ totalQuestionsCount() }}</div>
              <div class="text-sm text-gray-400">Total Questions</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-400">{{ totalSessionsCount() }}</div>
              <div class="text-sm text-gray-400">Total Sessions</div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TemplateListComponent {
  templates = input.required<IMentorshipTemplate[]>();
  filteredTemplates = input.required<IMentorshipTemplate[]>();
  isLoading = input<boolean>(false);

  searchTerm = signal('');
  filterCategory = signal('');

  // Computed statistics
  activeTemplatesCount = computed(() =>
    this.templates().filter(t => t.is_active ?? true).length
  );

  totalQuestionsCount = computed(() =>
    this.templates().reduce((sum, t) => sum + (t.question_count || 0), 0)
  );

  totalSessionsCount = computed(() =>
    this.templates().reduce((sum, t) => sum + (t.session_count || 0), 0)
  );

  // Output events
  onSearch = output<string>();
  onFilterChange = output<string>();
  onCreate = output<void>();
  onView = output<IMentorshipTemplate>();
  onEdit = output<IMentorshipTemplate>();
  onDuplicate = output<IMentorshipTemplate>();
  onDelete = output<IMentorshipTemplate>();
}
