import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipCategory, IExtendedMentorshipQuestion } from '../../../../../models/mentorship';

@Component({
  selector: 'app-question-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-medium text-white">Questions</h3>
        <button
          (click)="onAdd.emit()"
          [disabled]="categories().length === 0"
          class="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <i class="fas fa-plus mr-2"></i>
          Add Question
        </button>
      </div>

      @if (categories().length === 0) {
        <div class="text-center py-8 text-gray-400">
          <i class="fas fa-question-circle text-3xl mb-2"></i>
          <p>Add categories first before creating questions.</p>
        </div>
      } @else {
        <!-- Questions List -->
        <div class="space-y-6">
          @for (question of questions(); track question.id || $index) {
            <div class="p-6 bg-gray-700 rounded-lg border border-gray-600 question-item">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    [(ngModel)]="question.category_id"
                    (ngModelChange)="onUpdate.emit(questions())"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Category</option>
                    @for (category of categories(); track category.id) {
                      <option [value]="category.id">{{ category.name }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
                  <select
                    [(ngModel)]="question.question_type"
                    (ngModelChange)="onUpdate.emit(questions())"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="text">Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Yes/No</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-300 mb-2">Question Text</label>
                <textarea
                  [(ngModel)]="question.question_text"
                  (ngModelChange)="onUpdate.emit(questions())"
                  rows="2"
                  placeholder="Enter your question here"
                  class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </textarea>
              </div>

              @if (question.question_type === 'dropdown') {
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Options (one per line)</label>
                  <textarea
                    [(ngModel)]="question.optionsText"
                    (ngModelChange)="onOptionsChange.emit({ question, optionsText: $event })"
                    rows="3"
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  </textarea>
                </div>
              }

              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6">
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      [(ngModel)]="question.is_required"
                      (ngModelChange)="onUpdate.emit(questions())"
                      class="rounded border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-300">Required</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      [(ngModel)]="question.trigger_task"
                      (ngModelChange)="onUpdate.emit(questions())"
                      class="rounded border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <span class="ml-2 text-sm text-gray-300">Trigger Task</span>
                  </label>
                </div>
                <button
                  (click)="onRemove.emit(question)"
                  class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-600">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          }

          @if (questions().length === 0) {
            <div class="text-center py-8 text-gray-400">
              <i class="fas fa-question-circle text-3xl mb-2"></i>
              <p>No questions added yet. Add questions to complete your template.</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class QuestionManagerComponent {
  categories = input.required<IMentorshipCategory[]>();
  questions = input.required<IExtendedMentorshipQuestion[]>();

  onAdd = output<void>();
  onRemove = output<IExtendedMentorshipQuestion>();
  onUpdate = output<IExtendedMentorshipQuestion[]>();
  onOptionsChange = output<{ question: IExtendedMentorshipQuestion, optionsText: string }>();
}
