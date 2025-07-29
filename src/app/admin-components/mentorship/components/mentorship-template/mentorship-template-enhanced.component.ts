import { Component, OnInit, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTemplate, IMentorshipCategory, IMentorshipQuestion, IExtendedMentorshipQuestion } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';

type ViewMode = 'list' | 'create' | 'edit' | 'view';

@Component({
  selector: 'app-mentorship-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Template Management Container -->
    <div class="bg-gray-900 min-h-screen">

      <!-- Header with Navigation -->
      <div class="border-b border-gray-700 bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <h1 class="text-3xl font-bold text-white">
                  @if (currentView() === 'list') {
                    Template Management
                  } @else if (currentView() === 'create') {
                    Create New Template
                  } @else if (currentView() === 'edit') {
                    Edit Template
                  } @else if (currentView() === 'view') {
                    Template Details
                  }
                </h1>
                @if (currentView() !== 'list') {
                  <button
                    (click)="setView('list')"
                    class="text-blue-400 hover:text-blue-300 font-medium">
                    ← Back to Templates
                  </button>
                }
              </div>
              @if (currentView() === 'list') {
                <button
                  (click)="createNewTemplate()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Create Template
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Template List View -->
        @if (currentView() === 'list') {
          <div class="space-y-6">

            <!-- Search and Filters -->
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    [(ngModel)]="searchTerm"
                    (input)="searchTemplates()"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <select
                  [(ngModel)]="filterCategory"
                  (change)="filterTemplates()"
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
                <div class="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200">
                  <div class="p-6">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="text-lg font-medium text-white mb-2">{{ template.title }}</h3>
                        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ template.description || 'No description provided' }}</p>

                        <div class="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ template.question_count || 0 }} questions
                          </span>
                          <span class="flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {{ template.session_count || 0 }} sessions
                          </span>
                        </div>

                        <div class="flex items-center justify-between">
                          <span
                            class="px-2 py-1 text-xs rounded-full"
                            [class]="(template.is_active ?? true) ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-100'">
                            {{ (template.is_active ?? true) ? 'Active' : 'Inactive' }}
                          </span>
                          <span class="text-xs text-gray-500">{{ formatDate(template.created_at) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-6 flex items-center justify-between">
                      <button
                        (click)="viewTemplate(template)"
                        class="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View Details
                      </button>
                      <div class="flex items-center space-x-2">
                        <button
                          (click)="editTemplate(template)"
                          class="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                          title="Edit Template">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          (click)="duplicateTemplate(template)"
                          class="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                          title="Duplicate Template">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                        <button
                          (click)="deleteTemplate(template)"
                          class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          title="Delete Template">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Empty State -->
            @if (filteredTemplates().length === 0 && !isLoading()) {
              <div class="text-center py-12">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-white mb-2">No templates found</h3>
                <p class="text-gray-400 mb-6">Get started by creating your first mentorship template.</p>
                <button
                  (click)="createNewTemplate()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
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
        }

        <!-- Create/Edit Template View -->
        @if (currentView() === 'create' || currentView() === 'edit') {
          <div class="space-y-6">
            <!-- Template Basic Info -->
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 class="text-lg font-medium text-white mb-6">Template Information</h3>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Template Name</label>
                  <input
                    type="text"
                    [(ngModel)]="currentTemplate.title"
                    placeholder="Enter template name"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    [(ngModel)]="currentTemplate.category"
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
                    [(ngModel)]="currentTemplate.description"
                    rows="3"
                    placeholder="Describe the purpose and scope of this template"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  </textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    [(ngModel)]="currentTemplate.is_active"
                    class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option [value]="true">Active</option>
                    <option [value]="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Categories Section -->
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-medium text-white">Question Categories</h3>
                <button
                  (click)="addCategory()"
                  class="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Category
                </button>
              </div>

              <!-- Categories List -->
              <div class="space-y-4">
                @for (category of templateCategories(); track category.id || $index) {
                  <div class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div class="flex-1">
                      <input
                        type="text"
                        [(ngModel)]="category.name"
                        placeholder="Category name"
                        class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="w-24">
                      <input
                        type="number"
                        [(ngModel)]="category.sort_order"
                        placeholder="Order"
                        min="0"
                        class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <button
                      (click)="removeCategory(category)"
                      class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                }
                @if (templateCategories().length === 0) {
                  <div class="text-center py-8 text-gray-400">
                    No categories added yet. Add categories to organize your questions.
                  </div>
                }
              </div>
            </div>

            <!-- Questions Section -->
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-medium text-white">Questions</h3>
                <button
                  (click)="addQuestion()"
                  [disabled]="templateCategories().length === 0"
                  class="inline-flex items-center px-3 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Question
                </button>
              </div>

              @if (templateCategories().length === 0) {
                <div class="text-center py-8 text-gray-400">
                  Add categories first before creating questions.
                </div>
              } @else {
                <!-- Questions List -->
                <div class="space-y-6">
                  @for (question of templateQuestions(); track question.id || $index) {
                    <div class="p-6 bg-gray-700 rounded-lg border border-gray-600">
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-300 mb-2">Category</label>
                          <select
                            [(ngModel)]="question.category_id"
                            class="block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select Category</option>
                            @for (category of templateCategories(); track category.id) {
                              <option [value]="category.id">{{ category.name }}</option>
                            }
                          </select>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
                          <select
                            [(ngModel)]="question.question_type"
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
                            (ngModelChange)="updateQuestionOptions(question, $event)"
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
                              class="rounded border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-300">Required</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              type="checkbox"
                              [(ngModel)]="question.trigger_task"
                              class="rounded border-gray-600 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <span class="ml-2 text-sm text-gray-300">Trigger Task</span>
                          </label>
                        </div>
                        <button
                          (click)="removeQuestion(question)"
                          class="p-2 text-red-400 hover:text-red-300 rounded-md hover:bg-gray-600">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  }

                  @if (templateQuestions().length === 0) {
                    <div class="text-center py-8 text-gray-400">
                      No questions added yet. Add questions to complete your template.
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between">
              <button
                (click)="setView('list')"
                class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                Cancel
              </button>
              <div class="flex items-center space-x-3">
                @if (currentView() === 'edit') {
                  <button
                    (click)="previewTemplate()"
                    class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                    Preview
                  </button>
                }
                <button
                  (click)="saveTemplate()"
                  [disabled]="!isTemplateValid()"
                  class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ currentView() === 'create' ? 'Create Template' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- View Template Details -->
        @if (currentView() === 'view') {
          <div class="space-y-6">
            <!-- Template Header -->
            <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div class="flex items-start justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-2">{{ currentTemplate.title }}</h2>
                  <p class="text-gray-400 mb-4">{{ currentTemplate.description }}</p>
                  <div class="flex items-center space-x-6 text-sm text-gray-400">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                      {{ currentTemplate.category || 'No category' }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ templateQuestions().length }} questions
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {{ currentTemplate.session_count || 0 }} sessions
                    </span>
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      [class]="(currentTemplate.is_active ?? true) ? 'bg-green-600 text-green-100' : 'bg-gray-600 text-gray-100'">
                      {{ (currentTemplate.is_active ?? true) ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <button
                    (click)="editTemplate(currentTemplate)"
                    class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                    Edit Template
                  </button>
                  <button
                    (click)="duplicateTemplate(currentTemplate)"
                    class="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">
                    Duplicate
                  </button>
                </div>
              </div>
            </div>

            <!-- Categories and Questions -->
            @for (category of templateCategories(); track category.id) {
              <div class="bg-gray-800 rounded-lg border border-gray-700">
                <div class="px-6 py-4 border-b border-gray-700">
                  <h3 class="text-lg font-medium text-white">{{ category.name }}</h3>
                </div>
                <div class="p-6">
                  @for (question of getQuestionsByCategory(category.id!); track question.id) {
                    <div class="mb-6 last:mb-0">
                      <div class="flex items-start justify-between mb-2">
                        <h4 class="text-white font-medium">{{ question.question_text }}</h4>
                        <div class="flex items-center space-x-2">
                          @if (question.is_required) {
                            <span class="px-2 py-1 text-xs bg-red-600 text-red-100 rounded">Required</span>
                          }
                          @if (question.trigger_task) {
                            <span class="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded">Triggers Task</span>
                          }
                          <span class="px-2 py-1 text-xs bg-gray-600 text-gray-100 rounded capitalize">{{ question.question_type }}</span>
                        </div>
                      </div>
                      @if (question.question_type === 'dropdown' && question.options) {
                        <div class="text-sm text-gray-400">
                          Options: {{ Array.isArray(question.options) ? question.options.join(', ') : question.options }}
                        </div>
                      }
                    </div>
                  } @empty {
                    <div class="text-gray-400 text-sm">No questions in this category</div>
                  }
                </div>
              </div>
            }

            @if (templateCategories().length === 0) {
              <div class="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 class="text-lg font-medium text-white mb-2">No categories or questions</h3>
                <p class="text-gray-400 mb-4">This template doesn't have any categories or questions yet.</p>
                <button
                  (click)="editTemplate(currentTemplate)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Add Categories & Questions
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./mentorship-template.component.scss']
})
export class MentorshipTemplateComponent implements OnInit {
  // Signals for reactive state management
  templates = signal<IMentorshipTemplate[]>([]);
  currentView = signal<ViewMode>('list');
  isLoading = signal<boolean>(false);
  templateCategories = signal<IMentorshipCategory[]>([]);
  templateQuestions = signal<IExtendedMentorshipQuestion[]>([]);

  // Output events
  countChanged = output<number>();

  // Component state
  currentTemplate: IMentorshipTemplate = {
    title: '',
    description: '',
    category: '',
    is_active: true
  };

  searchTerm = '';
  filterCategory = '';

  // Computed properties
  filteredTemplates = computed(() => {
    let filtered = this.templates();

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search)) ||
        (t.category && t.category.toLowerCase().includes(search))
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter(t => t.category === this.filterCategory);
    }

    return filtered;
  });

  activeTemplatesCount = computed(() =>
    this.templates().filter(t => t.is_active !== false).length
  );

  totalQuestionsCount = computed(() =>
    this.templates().reduce((sum, t) => sum + (t.question_count || 0), 0)
  );

  totalSessionsCount = computed(() =>
    this.templates().reduce((sum, t) => sum + (t.session_count || 0), 0)
  );

  // Make Array available in template
  Array = Array;

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit() {
    this.loadTemplates();
  }

  // View management
  setView(view: ViewMode) {
    this.currentView.set(view);
    if (view === 'list') {
      this.resetCurrentTemplate();
    }
  }

  // Template CRUD operations
  loadTemplates() {
    this.isLoading.set(true);
    this.mentorshipService.getTemplates().subscribe({
      next: (response) => {
        if (response.success) {
          this.templates.set(response.data || []);
          this.countChanged.emit(this.templates().length);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.isLoading.set(false);
      }
    });
  }

  createNewTemplate() {
    this.resetCurrentTemplate();
    this.setView('create');
  }

  editTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
    this.loadTemplateDetails(template.id!);
    this.setView('edit');
  }

  viewTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
    this.loadTemplateDetails(template.id!);
    this.setView('view');
  }

  saveTemplate() {
    if (!this.isTemplateValid()) return;

    const templateData = {
      ...this.currentTemplate,
      categories: this.templateCategories(),
      questions: this.templateQuestions()
    };

    const saveOperation = this.currentView() === 'create'
      ? this.mentorshipService.createTemplate(templateData)
      : this.mentorshipService.updateTemplate(this.currentTemplate.id!, templateData);

    saveOperation.subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTemplates();
          this.setView('list');
        }
      },
      error: (error) => console.error('Error saving template:', error)
    });
  }

  deleteTemplate(template: IMentorshipTemplate) {
    if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
      this.mentorshipService.deleteTemplate(template.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadTemplates();
          }
        },
        error: (error) => console.error('Error deleting template:', error)
      });
    }
  }

  duplicateTemplate(template: IMentorshipTemplate) {
    const duplicateData: Partial<IMentorshipTemplate> = {
      title: `${template.title} (Copy)`,
      description: template.description,
      category: template.category,
      is_active: template.is_active
    };

    this.mentorshipService.createTemplate(duplicateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTemplates();
        }
      },
      error: (error) => console.error('Error duplicating template:', error)
    });
  }

  // Category management
  addCategory() {
    const newCategory: IMentorshipCategory = {
      template_id: this.currentTemplate.id || 0,
      name: '',
      sort_order: this.templateCategories().length
    };
    this.templateCategories.update(categories => [...categories, newCategory]);
  }

  removeCategory(categoryToRemove: IMentorshipCategory) {
    this.templateCategories.update(categories =>
      categories.filter(c => c !== categoryToRemove)
    );
    // Remove questions that belong to this category
    this.templateQuestions.update(questions =>
      questions.filter(q => q.category_id !== categoryToRemove.id)
    );
  }

  // Question management
  addQuestion() {
    const newQuestion: IExtendedMentorshipQuestion = {
      template_id: this.currentTemplate.id || 0,
      category_id: undefined,
      question_text: '',
      question_type: 'text',
      is_required: false,
      trigger_task: false,
      sort_order: this.templateQuestions().length,
      optionsText: ''
    };
    this.templateQuestions.update(questions => [...questions, newQuestion]);
  }

  removeQuestion(questionToRemove: IExtendedMentorshipQuestion) {
    this.templateQuestions.update(questions =>
      questions.filter(q => q !== questionToRemove)
    );
  }

  updateQuestionOptions(question: IExtendedMentorshipQuestion, optionsText: string) {
    question.optionsText = optionsText;
    question.options = optionsText.split('\n').filter(option => option.trim());
  }

  getQuestionsByCategory(categoryId: number): IExtendedMentorshipQuestion[] {
    return this.templateQuestions().filter(q => q.category_id === categoryId);
  }

  // Utility methods
  searchTemplates() {
    // Filtering is handled by computed property
  }

  filterTemplates() {
    // Filtering is handled by computed property
  }

  isTemplateValid(): boolean {
    return !!(this.currentTemplate.title && this.currentTemplate.title.trim());
  }

  previewTemplate() {
    this.setView('view');
  }

  resetCurrentTemplate() {
    this.currentTemplate = {
      title: '',
      description: '',
      category: '',
      is_active: true
    };
    this.templateCategories.set([]);
    this.templateQuestions.set([]);
  }

  loadTemplateDetails(templateId: number) {
    // Load categories and questions for the template
    this.mentorshipService.getTemplateDetails(templateId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.templateCategories.set(response.data.categories || []);
          this.templateQuestions.set(response.data.questions || []);
        }
      },
      error: (error) => console.error('Error loading template details:', error)
    });
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }
}
