import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTemplate, IMentorshipCategory, IExtendedMentorshipQuestion } from '../../../../../models/mentorship';
import { CategoryManagerComponent } from '../category-manager/category-manager.component';
import { QuestionManagerComponent } from '../question-manager/question-manager.component';
import { FormMode } from '../../types/mentorship-template.types';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryManagerComponent, QuestionManagerComponent],
  template: `
    <div class="space-y-6">
      <!-- Template Basic Info -->
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 class="text-lg font-medium text-white mb-6">Template Information</h3>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
            <input
              type="text"
              [(ngModel)]="template().title"
              (ngModelChange)="onTemplateChange.emit(template())"
              placeholder="Enter template name"
              class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              [(ngModel)]="template().category"
              (ngModelChange)="onTemplateChange.emit(template())"
              class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Category</option>
              <option value="business">Business Development</option>
              <option value="technical">Technical Assessment</option>
              <option value="financial">Financial Planning</option>
              <option value="marketing">Marketing Strategy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              [(ngModel)]="template().description"
              (ngModelChange)="onTemplateChange.emit(template())"
              rows="3"
              placeholder="Describe the purpose and scope of this template"
              class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              [(ngModel)]="template().is_active"
              (ngModelChange)="onTemplateChange.emit(template())"
              class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option [value]="true">Active</option>
              <option [value]="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Categories Section -->
      <app-category-manager
        [categories]="categories()"
        (onAdd)="onAddCategory.emit()"
        (onRemove)="onRemoveCategory.emit($event)"
        (onUpdate)="onCategoriesChange.emit($event)">
      </app-category-manager>

      <!-- Questions Section -->
      <app-question-manager
        [categories]="categories()"
        [questions]="questions()"
        (onAdd)="onAddQuestion.emit()"
        (onRemove)="onRemoveQuestion.emit($event)"
        (onUpdate)="onQuestionsChange.emit($event)"
        (onOptionsChange)="onQuestionOptionsChange.emit($event)">
      </app-question-manager>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between">
        <button
          (click)="onCancel.emit()"
          class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 btn-secondary">
          <i class="fas fa-times mr-2"></i>
          Cancel
        </button>
        <div class="flex items-center space-x-3">
          @if (mode() === 'edit') {
            <button
              (click)="onPreview.emit()"
              class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 btn-secondary">
              <i class="fas fa-eye mr-2"></i>
              Preview
            </button>
          }
          <button
            (click)="onSave.emit()"
            [disabled]="!isValid()"
            class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed btn-primary">
            <i class="fas fa-save mr-2"></i>
            {{ mode() === 'create' ? 'Create Template' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class TemplateFormComponent {
  mode = input.required<FormMode>();
  template = input.required<IMentorshipTemplate>();
  categories = input.required<IMentorshipCategory[]>();
  questions = input.required<IExtendedMentorshipQuestion[]>();
  isValid = input<boolean>(false);

  // Template events
  onTemplateChange = output<IMentorshipTemplate>();

  // Category events
  onAddCategory = output<void>();
  onRemoveCategory = output<IMentorshipCategory>();
  onCategoriesChange = output<IMentorshipCategory[]>();

  // Question events
  onAddQuestion = output<void>();
  onRemoveQuestion = output<IExtendedMentorshipQuestion>();
  onQuestionsChange = output<IExtendedMentorshipQuestion[]>();
  onQuestionOptionsChange = output<{ question: IExtendedMentorshipQuestion, optionsText: string }>();

  // Form actions
  onSave = output<void>();
  onCancel = output<void>();
  onPreview = output<void>();
}
