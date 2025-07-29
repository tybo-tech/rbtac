import { Component, OnInit, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTemplate, IMentorshipCategory, IMentorshipQuestion, IExtendedMentorshipQuestion } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';
import { TemplateListComponent } from '../template-list/template-list.component';
import { TemplateFormComponent } from '../template-form/template-form.component';
import { TemplateViewComponent } from '../template-view/template-view.component';
import { ViewMode, FormMode } from '../../types/mentorship-template.types';

@Component({
  selector: 'app-mentorship-template',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateListComponent, TemplateFormComponent, TemplateViewComponent],
  templateUrl: './mentorship-template.component.html',
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

  // Computed properties as getters (not signals)
  get activeTemplatesCount(): number {
    return this.templates().filter(t => t.is_active !== false).length;
  }

  get totalQuestionsCount(): number {
    return this.templates().reduce((sum, t) => sum + (t.question_count || 0), 0);
  }

  get totalSessionsCount(): number {
    return this.templates().reduce((sum, t) => sum + (t.session_count || 0), 0);
  }

  // Make Array available in template
  Array = Array;

  // Output event emitter for parent communication
  onTemplateChange = output<IMentorshipTemplate>();

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
    if (template.id) {
      this.loadTemplateDetails(template.id);
    }
    this.setView('edit');
  }

  viewTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
    if (template.id) {
      this.loadTemplateDetails(template.id);
    }
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
  searchTemplates(searchTerm: string) {
    this.searchTerm = searchTerm;
    // Filtering is handled by computed property
  }

  filterTemplates(category: string) {
    this.filterCategory = category;
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

  // Methods for sub-component integration
  updateCurrentTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
  }

  updateCategories(categories: IMentorshipCategory[]) {
    this.templateCategories.set(categories);
  }

  updateQuestions(questions: IExtendedMentorshipQuestion[]) {
    this.templateQuestions.set(questions);
  }

  getFormMode(): FormMode {
    const currentMode = this.currentView();
    return currentMode === 'create' || currentMode === 'edit' ? currentMode : 'create';
  }
}
