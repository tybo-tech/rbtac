import { Component, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTemplate } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';

@Component({
  selector: 'app-mentorship-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-template.component.html',
  styleUrls: ['./mentorship-template.component.scss']
})
export class MentorshipTemplateComponent implements OnInit {
  // Signals for reactive data
  templates = signal<IMentorshipTemplate[]>([]);
  isLoading = signal<boolean>(false);

  // Events
  countChanged = output<number>();

  // Component state
  editingTemplate: IMentorshipTemplate | null = null;
  templateSearch = '';

  constructor(private mentorshipService: MentorshipService) {}

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
    this.editingTemplate = { ...template };
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

  viewTemplate(templateId: number) {
    // Navigate to template detail view
    console.log('View template details:', templateId);
    // TODO: Implement template detail modal or navigation
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
