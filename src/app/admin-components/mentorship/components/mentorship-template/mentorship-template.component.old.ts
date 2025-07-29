import { Component, OnInit, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipCategory, IExtendedMentorshipQuestion, IMentorshipTemplate } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';
import { TemplateFormComponent } from "../template-form/template-form.component";
import { TemplateViewComponent } from "../template-view/template-view.component";
import { TemplateListComponent } from "../template-list/template-list.component";
import { ViewMode, FormMode } from '../../types/mentorship-template.types';

@Component({
  selector: 'app-mentorship-template',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateFormComponent, TemplateViewComponent, TemplateListComponent],
  templateUrl: './mentorship-template.component.html',
  styleUrls: ['./mentorship-template.component.scss']
})
export class MentorshipTemplateComponent implements OnInit {
  // Signals for reactive data
  templates = signal<IMentorshipTemplate[]>([]);
  isLoading = signal<boolean>(false);
  currentView = signal<ViewMode>('list');
  templateCategories = signal<IMentorshipCategory[]>([]);
  templateQuestions = signal<IExtendedMentorshipQuestion[]>([]);

  // Component state (non-signal properties)
  currentTemplate: IMentorshipTemplate = {
    title: '',
    description: '',
    category: '',
    is_active: true
  };

  templateSearch = '';

  // Computed properties
  filteredTemplates = computed(() => {
    const templates = this.templates();
    if (!this.templateSearch.trim()) {
      return templates;
    }
    const search = this.templateSearch.toLowerCase();
    return templates.filter(template =>
      template.title?.toLowerCase().includes(search) ||
      template.description?.toLowerCase().includes(search) ||
      template.category?.toLowerCase().includes(search)
    );
  });

  // Events
  countChanged = output<number>();

  // Legacy property for compatibility
  editingTemplate: IMentorshipTemplate | null = null;

  constructor(private mentorshipService: MentorshipService) {}

  // Method implementations
  setView(view: string) {
    this.currentView.set(view as ViewMode);
  }

  filterTemplates() {
    // This is handled by the computed filteredTemplates signal
    // No additional logic needed as filtering is reactive
  }

  updateSearch(searchTerm: string) {
    this.templateSearch = searchTerm;
    // The filteredTemplates computed property will automatically update
  }

  updateFilter(filterCategory: string) {
    // Handle filter category change if needed
    // For now, just log it since filtering is handled by the computed property
    console.log('Filter changed:', filterCategory);
  }

  getFormMode(): FormMode {
    return this.currentTemplate?.id ? 'edit' : 'create';
  }

  isTemplateValid(): boolean {
    return !!(this.currentTemplate?.title && this.currentTemplate?.description);
  }

  updateCurrentTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
  }

  addCategory() {
    const newCategory: Partial<IMentorshipCategory> = {
      name: 'New Category',
      template_id: this.currentTemplate?.id || 0,
      sort_order: this.templateCategories().length + 1
    };

    if (!this.currentTemplate?.id) {
      // Add to local array if template not saved yet
      const categories = this.templateCategories();
      this.templateCategories.set([...categories, newCategory as IMentorshipCategory]);
      return;
    }

    this.mentorshipService.createCategory(newCategory).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.templateCategories.set([...this.templateCategories(), response.data]);
        }
      },
      error: (error: any) => console.error('Error adding category:', error)
    });
  }

  removeCategory(category: IMentorshipCategory) {
    // For now, just remove from local array since delete method doesn't exist
    const categories = this.templateCategories().filter(c => c.id !== category.id);
    this.templateCategories.set(categories);
  }

  updateCategories(categories: IMentorshipCategory[]) {
    this.templateCategories.set(categories);
  }

  addQuestion() {
    const newQuestion: Partial<IExtendedMentorshipQuestion> = {
      question_text: 'New Question',
      question_type: 'text',
      template_id: this.currentTemplate?.id || 0,
      sort_order: this.templateQuestions().length + 1,
      is_required: false,
      trigger_task: false
    };

    if (!this.currentTemplate?.id) {
      // Add to local array if template not saved yet
      const questions = this.templateQuestions();
      this.templateQuestions.set([...questions, newQuestion as IExtendedMentorshipQuestion]);
      return;
    }

    this.mentorshipService.createQuestion(newQuestion).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.templateQuestions.set([...this.templateQuestions(), response.data]);
        }
      },
      error: (error: any) => console.error('Error adding question:', error)
    });
  }

  removeQuestion(question: IExtendedMentorshipQuestion) {
    // For now, just remove from local array since delete method doesn't exist
    const questions = this.templateQuestions().filter(q => q.id !== question.id);
    this.templateQuestions.set(questions);
  }

  updateQuestions(questions: IExtendedMentorshipQuestion[]) {
    this.templateQuestions.set(questions);
  }

  updateQuestionOptions(question: IExtendedMentorshipQuestion, options: string) {
    const updatedQuestion = { ...question, options };
    const questions = this.templateQuestions().map(q =>
      q.id === question.id ? updatedQuestion : q
    );
    this.templateQuestions.set(questions);

    if (question.id) {
      this.mentorshipService.updateQuestion(question.id, { options }).subscribe({
        next: (response: any) => {
          if (!response.success) {
            console.error('Error updating question options');
            // Revert on error
            this.templateQuestions.set(this.templateQuestions().map(q =>
              q.id === question.id ? question : q
            ));
          }
        },
        error: (error: any) => {
          console.error('Error updating question options:', error);
          // Revert on error
          this.templateQuestions.set(this.templateQuestions().map(q =>
            q.id === question.id ? question : q
          ));
        }
      });
    }
  }

  previewTemplate() {
    this.setView('view');
  }

  loadTemplateDetails(templateId: number) {
    this.mentorshipService.getTemplateDetails(templateId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.templateCategories.set(response.data.categories || []);
          this.templateQuestions.set(response.data.questions || []);
        }
      },
      error: (error: any) => console.error('Error loading template details:', error)
    });
  }

  // Computed properties for statistics
  get activeTemplatesCount(): number {
    return this.templates().filter(t => t.is_active !== false).length;
  }

  get totalQuestionsCount(): number {
    return this.templates().reduce((sum, t) => sum + (t.question_count || 0), 0);
  }

  get totalSessionsCount(): number {
    return this.templates().reduce((sum, t) => sum + (t.session_count || 0), 0);
  }

  ngOnInit() {
    this.loadTemplates();
  }

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

  searchTemplates() {
    if (this.templateSearch.trim()) {
      this.isLoading.set(true);
      this.mentorshipService.searchTemplates(this.templateSearch).subscribe({
        next: (response) => {
          if (response.success) {
            this.templates.set(response.data || []);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error searching templates:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.loadTemplates();
    }
  }

  createNewTemplate() {
    const newTemplate: Partial<IMentorshipTemplate> = {
      title: 'New Template',
      description: '',
      category: 'general',
      is_active: true
    };

    this.mentorshipService.createTemplate(newTemplate).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTemplates(); // Refresh the list
          // Automatically start editing the new template
          if (response.data) {
            this.editTemplate(response.data);
          }
        }
      },
      error: (error) => console.error('Error creating template:', error)
    });
  }

  editTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
    this.setView('edit');
    // Load the template details
    if (template.id) {
      this.loadTemplateDetails(template.id);
    }
  }

  saveTemplate() {
    if (!this.editingTemplate?.id) return;

    this.mentorshipService.updateTemplate(this.editingTemplate.id, this.editingTemplate).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTemplates();
          this.editingTemplate = null;
        }
      },
      error: (error) => console.error('Error saving template:', error)
    });
  }

  cancelEdit() {
    this.editingTemplate = null;
  }

  viewTemplate(template: IMentorshipTemplate) {
    this.currentTemplate = { ...template };
    this.setView('view');
    // Load the template details
    if (template.id) {
      this.loadTemplateDetails(template.id);
    }
  }

  deleteTemplate(template: IMentorshipTemplate) {
    if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
      // TODO: Implement delete functionality
      console.log('Delete template:', template.id);
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

  trackByTemplateId(index: number, template: IMentorshipTemplate): any {
    return template.id;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }
}
