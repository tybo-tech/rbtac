import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IMentorshipTemplate, IMentorshipSession } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';


interface Company {
  id: number;
  name: string;
  industry?: string;
  contact_person?: string;
}

@Component({
  selector: 'app-mentorship-session-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-6">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Mentorship Session Manager</h1>
        <p class="text-gray-400">Search companies, select templates, and conduct mentorship sessions</p>
      </div>

      <!-- Step 1: Company Search -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6" *ngIf="currentStep === 'company-search'">
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">1</span>
          Select Company
        </h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">Search Company by Name</label>
          <input
            type="text"
            [(ngModel)]="companySearchTerm"
            (input)="searchCompanies()"
            placeholder="Type company name..."
            class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <!-- Company Search Results -->
        <div class="space-y-2 mb-4" *ngIf="searchResults.length > 0">
          <div
            *ngFor="let company of searchResults"
            (click)="selectCompany(company)"
            class="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium text-white">{{ company.name }}</h3>
                <p class="text-sm text-gray-400" *ngIf="company.industry">{{ company.industry }}</p>
              </div>
              <span class="text-blue-400">Select →</span>
            </div>
          </div>
        </div>

        <!-- Selected Company -->
        <div class="bg-green-900 border border-green-700 rounded-lg p-4" *ngIf="selectedCompany">
          <h3 class="text-green-100 font-medium">Selected Company:</h3>
          <p class="text-green-200">{{ selectedCompany.name }}</p>
          <button
            (click)="proceedToTemplateSelection()"
            class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Continue to Template Selection
          </button>
        </div>
      </div>

      <!-- Step 2: Template Selection -->
      <div class="bg-gray-800 rounded-lg p-6 mb-6" *ngIf="currentStep === 'template-selection'">
        <h2 class="text-xl font-semibold mb-4 flex items-center">
          <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">2</span>
          Select Mentorship Template
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div
            *ngFor="let template of templates"
            (click)="selectTemplate(template)"
            [class]="selectedTemplate?.id === template.id ?
              'bg-blue-900 border-blue-500' : 'bg-gray-700 border-gray-600'"
            class="border-2 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors">
            <h3 class="font-medium text-white mb-2">{{ template.name }}</h3>
            <p class="text-sm text-gray-300 mb-3">{{ template.description }}</p>
            <div class="flex justify-between text-xs text-gray-400">
              <span>{{ template.categories?.length || 0 }} categories</span>
              <span>v{{ template.version }}</span>
            </div>
          </div>
        </div>

        <div class="flex space-x-4" *ngIf="selectedTemplate">
          <button
            (click)="goBackToCompanySearch()"
            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
            ← Back
          </button>
          <button
            (click)="startSession()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Start Mentorship Session
          </button>
        </div>
      </div>

      <!-- Step 3: Session Form -->
      <div class="bg-gray-800 rounded-lg p-6" *ngIf="currentStep === 'session-form' && selectedTemplate">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold flex items-center">
            <span class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">3</span>
            Mentorship Session: {{ selectedTemplate.name }}
          </h2>
          <div class="text-sm text-gray-400">
            Company: {{ selectedCompany?.name }}
          </div>
        </div>

        <form [formGroup]="sessionForm" (ngSubmit)="saveSession()">

          <!-- Progress Bar -->
          <div class="mb-6">
            <div class="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{{ getCompletionPercentage() }}% Complete</span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                [style.width.%]="getCompletionPercentage()">
              </div>
            </div>
          </div>

          <!-- Categories and Questions -->
          <div class="space-y-8">
            <div *ngFor="let category of selectedTemplate.categories; let categoryIndex = index">

              <!-- Category Header -->
              <div class="border-b border-gray-700 pb-3 mb-6">
                <h3 class="text-lg font-semibold text-blue-400">{{ category.name }}</h3>
                <p class="text-sm text-gray-400" *ngIf="category.description">{{ category.description }}</p>
              </div>

              <!-- Questions -->
              <div class="space-y-6">
                <div *ngFor="let question of category.questions; let questionIndex = index"
                     class="bg-gray-700 rounded-lg p-4">

                  <!-- Question Label -->
                  <label class="block text-sm font-medium text-gray-200 mb-3">
                    {{ question.label }}
                    <span class="text-red-400" *ngIf="question.required">*</span>
                  </label>

                  <!-- Text Input -->
                  <input
                    *ngIf="question.type === 'text'"
                    type="text"
                    [formControlName]="question.key"
                    [placeholder]="question.placeholder || ''"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <!-- Number Input -->
                  <input
                    *ngIf="question.type === 'number'"
                    type="number"
                    [formControlName]="question.key"
                    [min]="question.validation?.min"
                    [max]="question.validation?.max"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <!-- Textarea -->
                  <textarea
                    *ngIf="question.type === 'textarea'"
                    [formControlName]="question.key"
                    rows="3"
                    [placeholder]="question.placeholder || ''"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </textarea>

                  <!-- Dropdown -->
                  <select
                    *ngIf="question.type === 'dropdown'"
                    [formControlName]="question.key"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select an option...</option>
                    <option *ngFor="let option of question.options" [value]="option">{{ option }}</option>
                  </select>

                  <!-- Date Input -->
                  <input
                    *ngIf="question.type === 'date'"
                    type="date"
                    [formControlName]="question.key"
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <!-- Boolean/Checkbox -->
                  <label *ngIf="question.type === 'boolean'" class="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      [formControlName]="question.key"
                      class="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500">
                    <span class="text-gray-300">Yes</span>
                  </label>

                  <!-- List Type -->
                  <div *ngIf="question.type === 'list'" class="space-y-2">
                    <div *ngFor="let item of question.items; let i = index" class="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        [id]="question.key + '_' + i"
                        (change)="updateListValue(question.key, item, $event)"
                        class="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500">
                      <label [for]="question.key + '_' + i" class="text-gray-300 cursor-pointer">{{ item }}</label>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- Session Notes -->
          <div class="mt-8 bg-gray-700 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-200 mb-3">Session Notes</label>
            <textarea
              formControlName="notes"
              rows="3"
              placeholder="Add any additional notes about this mentorship session..."
              class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4 mt-8">
            <button
              type="button"
              (click)="saveAsDraft()"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
              Save as Draft
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Complete Session
            </button>
            <button
              type="button"
              (click)="goBackToTemplateSelection()"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
              ← Back to Templates
            </button>
          </div>

        </form>
      </div>

      <!-- Loading States -->
      <div class="text-center py-8" *ngIf="isLoading">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="text-gray-400 mt-2">Loading...</p>
      </div>

    </div>
  `,
  styleUrls: ['./mentorship-session-manager.component.scss']
})
export class MentorshipSessionManagerComponent implements OnInit {
  // Current workflow step
  currentStep: 'company-search' | 'template-selection' | 'session-form' = 'company-search';

  // State variables
  companySearchTerm = '';
  searchResults: Company[] = [];
  selectedCompany: Company | null = null;
  templates: IMentorshipTemplate[] = [];
  selectedTemplate: IMentorshipTemplate | null = null;
  sessionForm: FormGroup;
  isLoading = false;
  currentSession: IMentorshipSession | null = null;

  constructor(
    private mentorshipService: MentorshipService,
    private fb: FormBuilder
  ) {
    this.sessionForm = this.fb.group({
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadTemplates();
  }

  // === COMPANY SEARCH ===

  searchCompanies() {
    if (this.companySearchTerm.length >= 2) {
      this.isLoading = true;
      this.mentorshipService.searchCompanies(this.companySearchTerm).subscribe({
        next: (response) => {
          this.searchResults = response.data || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching companies:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  selectCompany(company: Company) {
    this.selectedCompany = company;
    this.searchResults = [];
  }

  proceedToTemplateSelection() {
    this.currentStep = 'template-selection';
  }

  goBackToCompanySearch() {
    this.currentStep = 'company-search';
  }

  // === TEMPLATE MANAGEMENT ===

  loadTemplates() {
    this.isLoading = true;
    this.mentorshipService.getTemplates().subscribe({
      next: (response) => {
        this.templates = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.isLoading = false;
      }
    });
  }

  selectTemplate(template: IMentorshipTemplate) {
    this.selectedTemplate = template;

    // Load full template with questions
    this.mentorshipService.getTemplate(template.id!).subscribe({
      next: (response) => {
        this.selectedTemplate = response.data!;
      }
    });
  }

  goBackToTemplateSelection() {
    this.currentStep = 'template-selection';
  }

  // === SESSION MANAGEMENT ===

  startSession() {
    if (!this.selectedCompany || !this.selectedTemplate) return;

    // Create session
    const sessionData: IMentorshipSession = {
      company_id: this.selectedCompany.id,
      template_id: this.selectedTemplate.id!,
      session_date: new Date().toISOString(),
      status: 'in_progress'
    };

    this.mentorshipService.createSession(sessionData).subscribe({
      next: (response) => {
        this.currentSession = response.data!;
        this.buildSessionForm();
        this.currentStep = 'session-form';
      },
      error: (error) => {
        console.error('Error creating session:', error);
      }
    });
  }

  buildSessionForm() {
    if (!this.selectedTemplate) return;

    const formControls: { [key: string]: any } = {
      notes: ['']
    };

    // Add form controls for each question
    this.selectedTemplate.categories?.forEach(category => {
      category.questions.forEach(question => {
        const validators = question.required ? [Validators.required] : [];

        if (question.type === 'number' && question.validation) {
          if (question.validation.min !== undefined) {
            validators.push(Validators.min(question.validation.min));
          }
          if (question.validation.max !== undefined) {
            validators.push(Validators.max(question.validation.max));
          }
        }

        formControls[question.key] = ['', validators];
      });
    });

    this.sessionForm = this.fb.group(formControls);
  }

  updateListValue(questionKey: string, item: string, event: any) {
    const currentValue = this.sessionForm.get(questionKey)?.value || [];
    if (event.target.checked) {
      currentValue.push(item);
    } else {
      const index = currentValue.indexOf(item);
      if (index > -1) {
        currentValue.splice(index, 1);
      }
    }
    this.sessionForm.get(questionKey)?.setValue(currentValue);
  }

  getCompletionPercentage(): number {
    if (!this.selectedTemplate) return 0;

    let totalQuestions = 0;
    let answeredQuestions = 0;

    this.selectedTemplate.categories?.forEach(category => {
      category.questions.forEach(question => {
        totalQuestions++;
        const value = this.sessionForm.get(question.key)?.value;
        if (value && value !== '') {
          answeredQuestions++;
        }
      });
    });

    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }

  saveAsDraft() {
    this.saveSession('in_progress');
  }

  saveSession(status: string = 'completed') {
    if (!this.currentSession) return;

    const responses = this.sessionForm.value;
    const sessionUpdate = {
      status: status,
      completion_percentage: this.getCompletionPercentage(),
      notes: responses.notes
    };

    // Save session responses
    this.mentorshipService.saveSessionResponses(this.currentSession.id!, responses).subscribe({
      next: () => {
        // Update session status
        this.mentorshipService.updateSession(this.currentSession!.id!, sessionUpdate).subscribe({
          next: () => {
            alert(`Session ${status === 'completed' ? 'completed' : 'saved as draft'} successfully!`);
            this.resetWorkflow();
          }
        });
      },
      error: (error) => {
        console.error('Error saving session:', error);
      }
    });
  }

  resetWorkflow() {
    this.currentStep = 'company-search';
    this.selectedCompany = null;
    this.selectedTemplate = null;
    this.currentSession = null;
    this.companySearchTerm = '';
    this.searchResults = [];
    this.sessionForm = this.fb.group({ notes: [''] });
  }
}
