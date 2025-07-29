import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface MentorshipTemplate {
  id?: number;
  name: string;
  description: string;
  program_type: string;
  version: string;
  is_active: boolean;
  categories: MentorshipCategory[];
}

interface MentorshipCategory {
  name: string;
  description?: string;
  order: number;
  questions: MentorshipQuestion[];
}

interface MentorshipQuestion {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea' | 'list' | 'task' | 'calculated' | 'boolean';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-6">

      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Mentorship Template Manager</h1>
          <p class="text-gray-400">Create and manage mentorship templates with categories and questions</p>
        </div>
        <button
          (click)="createNewTemplate()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          + New Template
        </button>
      </div>

      <!-- Templates List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" *ngIf="!showTemplateForm">
        <div
          *ngFor="let template of templates"
          class="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-white">{{ template.name }}</h3>
            <span class="text-xs bg-blue-600 text-white px-2 py-1 rounded">v{{ template.version }}</span>
          </div>
          <p class="text-gray-300 text-sm mb-4">{{ template.description }}</p>
          <div class="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>{{ template.categories.length }} categories</span>
            <span>{{ getTotalQuestions(template) }} questions</span>
          </div>
          <div class="flex space-x-2">
            <button
              (click)="editTemplate(template)"
              class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-sm rounded transition-colors">
              Edit
            </button>
            <button
              (click)="viewTemplate(template)"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition-colors">
              View
            </button>
          </div>
        </div>
      </div>

      <!-- Template Form -->
      <div class="bg-gray-800 rounded-lg p-6" *ngIf="showTemplateForm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">
            {{ editingTemplate ? 'Edit Template' : 'Create New Template' }}
          </h2>
          <button
            (click)="cancelTemplateForm()"
            class="text-gray-400 hover:text-gray-200">
            ✕ Close
          </button>
        </div>

        <form [formGroup]="templateForm" (ngSubmit)="saveTemplate()">

          <!-- Basic Template Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Template Name *</label>
              <input
                type="text"
                formControlName="name"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Program Type</label>
              <select
                formControlName="program_type"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="baseline">Baseline</option>
                <option value="financial_turnaround">Financial Turnaround</option>
                <option value="growth_strategy">Growth Strategy</option>
                <option value="compliance_readiness">Compliance Readiness</option>
              </select>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              formControlName="description"
              rows="3"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <!-- Categories -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-white">Categories</h3>
              <button
                type="button"
                (click)="addCategory()"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded transition-colors">
                + Add Category
              </button>
            </div>

            <div formArrayName="categories" class="space-y-6">
              <div
                *ngFor="let category of categoriesArray.controls; let categoryIndex = index"
                [formGroupName]="categoryIndex"
                class="bg-gray-700 rounded-lg p-4">

                <!-- Category Header -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-md font-semibold text-blue-400">Category {{ categoryIndex + 1 }}</h4>
                  <button
                    type="button"
                    (click)="removeCategory(categoryIndex)"
                    class="text-red-400 hover:text-red-300 text-sm">
                    Remove
                  </button>
                </div>

                <!-- Category Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Category Name *</label>
                    <input
                      type="text"
                      formControlName="name"
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Order</label>
                    <input
                      type="number"
                      formControlName="order"
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    formControlName="description"
                    rows="2"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </textarea>
                </div>

                <!-- Questions -->
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="text-sm font-semibold text-gray-300">Questions</h5>
                    <button
                      type="button"
                      (click)="addQuestion(categoryIndex)"
                      class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition-colors">
                      + Add Question
                    </button>
                  </div>

                  <div formArrayName="questions" class="space-y-4">
                    <div
                      *ngFor="let question of getQuestionsArray(categoryIndex).controls; let questionIndex = index"
                      [formGroupName]="questionIndex"
                      class="bg-gray-600 rounded p-3">

                      <div class="flex justify-between items-center mb-3">
                        <span class="text-sm text-gray-300">Question {{ questionIndex + 1 }}</span>
                        <button
                          type="button"
                          (click)="removeQuestion(categoryIndex, questionIndex)"
                          class="text-red-400 hover:text-red-300 text-sm">
                          Remove
                        </button>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label class="block text-xs text-gray-400 mb-1">Question Key *</label>
                          <input
                            type="text"
                            formControlName="key"
                            placeholder="e.g., business_name"
                            class="w-full px-2 py-1 bg-gray-500 border border-gray-400 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </div>
                        <div>
                          <label class="block text-xs text-gray-400 mb-1">Type *</label>
                          <select
                            formControlName="type"
                            class="w-full px-2 py-1 bg-gray-500 border border-gray-400 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="textarea">Textarea</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="date">Date</option>
                            <option value="boolean">Boolean</option>
                            <option value="list">List</option>
                          </select>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label class="block text-xs text-gray-400 mb-1">Question Label *</label>
                        <input
                          type="text"
                          formControlName="label"
                          placeholder="e.g., What is your business name?"
                          class="w-full px-2 py-1 bg-gray-500 border border-gray-400 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs text-gray-400 mb-1">Placeholder</label>
                          <input
                            type="text"
                            formControlName="placeholder"
                            class="w-full px-2 py-1 bg-gray-500 border border-gray-400 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </div>
                        <div class="flex items-center space-x-3 mt-4">
                          <label class="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              formControlName="required"
                              class="w-3 h-3 text-blue-600 bg-gray-500 border-gray-400 rounded focus:ring-blue-500">
                            <span class="text-xs text-gray-400">Required</span>
                          </label>
                        </div>
                      </div>

                      <!-- Options for dropdown/list types -->
                      <div *ngIf="getQuestionType(categoryIndex, questionIndex) === 'dropdown' || getQuestionType(categoryIndex, questionIndex) === 'list'" class="mt-3">
                        <label class="block text-xs text-gray-400 mb-1">Options (one per line)</label>
                        <textarea
                          (blur)="updateQuestionOptions(categoryIndex, questionIndex, $event)"
                          rows="3"
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          class="w-full px-2 py-1 bg-gray-500 border border-gray-400 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        </textarea>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex space-x-4">
            <button
              type="submit"
              [disabled]="templateForm.invalid"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded transition-colors">
              {{ editingTemplate ? 'Update' : 'Create' }} Template
            </button>
            <button
              type="button"
              (click)="cancelTemplateForm()"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition-colors">
              Cancel
            </button>
          </div>

        </form>
      </div>

    </div>
  `,
  styleUrls: ['./template-manager.component.scss']
})
export class TemplateManagerComponent implements OnInit {
  templates: MentorshipTemplate[] = [];
  showTemplateForm = false;
  editingTemplate: MentorshipTemplate | null = null;
  templateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.templateForm = this.createTemplateForm();
  }

  ngOnInit() {
    this.loadSampleTemplates();
  }

  get categoriesArray() {
    return this.templateForm.get('categories') as FormArray;
  }

  getQuestionsArray(categoryIndex: number) {
    return this.categoriesArray.at(categoryIndex).get('questions') as FormArray;
  }

  createTemplateForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      program_type: ['baseline'],
      version: ['1.0'],
      is_active: [true],
      categories: this.fb.array([])
    });
  }

  createCategoryForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      order: [0],
      questions: this.fb.array([])
    });
  }

  createQuestionForm(): FormGroup {
    return this.fb.group({
      key: ['', Validators.required],
      label: ['', Validators.required],
      type: ['text', Validators.required],
      options: [[]],
      required: [false],
      placeholder: ['']
    });
  }

  createNewTemplate() {
    this.editingTemplate = null;
    this.templateForm = this.createTemplateForm();
    this.showTemplateForm = true;
  }

  editTemplate(template: MentorshipTemplate) {
    this.editingTemplate = template;
    this.populateForm(template);
    this.showTemplateForm = true;
  }

  viewTemplate(template: MentorshipTemplate) {
    console.log('Viewing template:', template);
    // Implement template preview
  }

  populateForm(template: MentorshipTemplate) {
    this.templateForm.patchValue({
      name: template.name,
      description: template.description,
      program_type: template.program_type,
      version: template.version,
      is_active: template.is_active
    });

    // Clear and populate categories
    const categoriesArray = this.categoriesArray;
    categoriesArray.clear();

    template.categories.forEach(category => {
      const categoryForm = this.createCategoryForm();
      categoryForm.patchValue({
        name: category.name,
        description: category.description,
        order: category.order
      });

      const questionsArray = categoryForm.get('questions') as FormArray;
      category.questions.forEach(question => {
        const questionForm = this.createQuestionForm();
        questionForm.patchValue(question);
        questionsArray.push(questionForm);
      });

      categoriesArray.push(categoryForm);
    });
  }

  addCategory() {
    const categoryForm = this.createCategoryForm();
    categoryForm.patchValue({
      order: this.categoriesArray.length
    });
    this.categoriesArray.push(categoryForm);
  }

  removeCategory(index: number) {
    this.categoriesArray.removeAt(index);
  }

  addQuestion(categoryIndex: number) {
    const questionsArray = this.getQuestionsArray(categoryIndex);
    questionsArray.push(this.createQuestionForm());
  }

  removeQuestion(categoryIndex: number, questionIndex: number) {
    const questionsArray = this.getQuestionsArray(categoryIndex);
    questionsArray.removeAt(questionIndex);
  }

  getQuestionType(categoryIndex: number, questionIndex: number): string {
    const questionsArray = this.getQuestionsArray(categoryIndex);
    return questionsArray.at(questionIndex).get('type')?.value || 'text';
  }

  updateQuestionOptions(categoryIndex: number, questionIndex: number, event: any) {
    const optionsText = event.target.value;
    const options = optionsText.split('\n').filter((opt: string) => opt.trim());
    const questionsArray = this.getQuestionsArray(categoryIndex);
    questionsArray.at(questionIndex).get('options')?.setValue(options);
  }

  getTotalQuestions(template: MentorshipTemplate): number {
    return template.categories.reduce((total, category) => total + category.questions.length, 0);
  }

  saveTemplate() {
    if (this.templateForm.valid) {
      const templateData = this.templateForm.value;

      if (this.editingTemplate) {
        // Update existing template
        const index = this.templates.findIndex(t => t.id === this.editingTemplate!.id);
        if (index > -1) {
          this.templates[index] = { ...templateData, id: this.editingTemplate.id };
        }
      } else {
        // Create new template
        const newTemplate = {
          ...templateData,
          id: Date.now() // Simple ID generation for demo
        };
        this.templates.push(newTemplate);
      }

      this.cancelTemplateForm();
      alert('Template saved successfully!');
    }
  }

  cancelTemplateForm() {
    this.showTemplateForm = false;
    this.editingTemplate = null;
    this.templateForm = this.createTemplateForm();
  }

  loadSampleTemplates() {
    // Load sample templates for demo
    this.templates = [
      {
        id: 1,
        name: 'Baseline – Entrepreneur Information',
        description: 'Captures baseline business info, goals, and strategic vision for new entrepreneurs.',
        program_type: 'baseline',
        version: '1.0',
        is_active: true,
        categories: [
          {
            name: 'Entrepreneur Info',
            description: 'Basic business and entrepreneur information',
            order: 0,
            questions: [
              { key: 'business_name', label: 'Business Name', type: 'text', required: true },
              { key: 'entrepreneur_name', label: 'Entrepreneur Name', type: 'text', required: true },
              { key: 'industry', label: 'Industry', type: 'text' },
              { key: 'gps_date', label: 'GPS Date', type: 'date' }
            ]
          },
          {
            name: 'Self Assessment',
            description: 'Self-assessment metrics and compliance status',
            order: 1,
            questions: [
              { key: 'sales_ability', label: 'Sales Ability (1–10)', type: 'number', required: true },
              { key: 'marketing_ability', label: 'Marketing Ability (1–10)', type: 'number', required: true },
              { key: 'vat_compliance', label: 'State of VAT', type: 'dropdown', options: ['Compliant', 'Non-Compliant'] }
            ]
          }
        ]
      }
    ];
  }
}
