import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IFormTemplate,
  ApiResponse,
  IFormAnalytics,
  IFormSearchFilters
} from '../../../../../models/mentorship-form.interfaces';
import { FormTemplateService } from '../../../../../services/form-template.service';
import { FormAnalyticsService } from '../../../../../services/form-analytics.service';

@Component({
  selector: 'app-form-template-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './form-template-list.component.html',
  styleUrls: ['./form-template-list.component.scss'],
})
export class FormTemplateListComponent implements OnInit {
  templates: IFormTemplate[] = [];
  filteredTemplates: IFormTemplate[] = [];

  // UI state
  loading = false;
  deleting: { [templateId: number]: boolean } = {};
  error: string | null = null;
  success: string | null = null;

  // Search and filtering
  searchTerm = '';
  selectedStatus = 1; // Active templates
  showFilters = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalTemplates = 0;

  // Analytics data
  templateAnalytics: { [templateId: number]: IFormAnalytics } = {};

  constructor(
    private formTemplateService: FormTemplateService,
    private formAnalyticsService: FormAnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.loading = true;
    this.clearMessages();

    this.formTemplateService.getFormTemplates(this.selectedStatus).subscribe({
      next: (response: ApiResponse<IFormTemplate[]>) => {
        if (response.success && response.data) {
          this.templates = response.data;
          this.applyFilters();
          this.loadTemplateAnalytics();
        } else {
          this.error = response.message || 'Failed to load templates';
          this.templates = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load templates:', err);
        this.error = 'Failed to load templates. Please try again.';
        this.templates = [];
        this.loading = false;
      },
    });
  }

  loadTemplateAnalytics(): void {
    // Load analytics for each template
    this.templates.forEach(template => {
      if (template.id) {
        this.formAnalyticsService.getTemplateAnalytics(template.id, 'overview').subscribe({
          next: (response: ApiResponse<IFormAnalytics>) => {
            if (response.success && response.data && template.id) {
              this.templateAnalytics[template.id] = response.data;
            }
          },
          error: (err: any) => {
            console.error(`Failed to load analytics for template ${template.id}:`, err);
          }
        });
      }
    });
  }

  createTemplate(): void {
    this.router.navigate(['/admin/mentorship/templates/create']);
  }

  editTemplate(template: IFormTemplate): void {
    if (template.id) {
      this.router.navigate(['/admin/mentorship/templates', template.id]);
    }
  }

  deleteTemplate(template: IFormTemplate): void {
    if (!template.id) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${template.title}"?\n\nThis action cannot be undone.`);
    if (!confirmDelete) return;

    this.deleting[template.id] = true;
    this.clearMessages();

    this.formTemplateService.deleteFormTemplate(template.id).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.templates = this.templates.filter(t => t.id !== template.id);
          this.applyFilters();
          this.success = 'Template deleted successfully';

          // Clear analytics data
          if (template.id) {
            delete this.templateAnalytics[template.id];
          }
        } else {
          this.error = response.message || 'Failed to delete template';
        }
        if (template.id) {
          this.deleting[template.id] = false;
        }
      },
      error: (err: any) => {
        console.error('Error deleting template:', err);
        this.error = 'Failed to delete template';
        if (template.id) {
          this.deleting[template.id] = false;
        }
      },
    });
  }

  archiveTemplate(template: IFormTemplate): void {
    if (!template.id) return;

    const confirmArchive = confirm(`Archive "${template.title}"?\n\nArchived templates can be restored later.`);
    if (!confirmArchive) return;

    this.deleting[template.id] = true;
    this.clearMessages();

    this.formTemplateService.archiveFormTemplate(template.id).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.templates = this.templates.filter(t => t.id !== template.id);
          this.applyFilters();
          this.success = 'Template archived successfully';
        } else {
          this.error = response.message || 'Failed to archive template';
        }
        if (template.id) {
          this.deleting[template.id] = false;
        }
      },
      error: (err: any) => {
        console.error('Error archiving template:', err);
        this.error = 'Failed to archive template';
        if (template.id) {
          this.deleting[template.id] = false;
        }
      },
    });
  }

  cloneTemplate(template: IFormTemplate): void {
    if (!template.id) return;

    const newTitle = prompt('Enter title for cloned template:', `${template.title} (Copy)`);
    if (!newTitle?.trim()) return;

    this.clearMessages();

    this.formTemplateService.cloneTemplate(template.id, newTitle.trim()).subscribe({
      next: (response: ApiResponse<IFormTemplate>) => {
        if (response.success && response.data) {
          this.success = 'Template cloned successfully';
          // Refresh the list to include the new clone
          this.loadTemplates();
        } else {
          this.error = response.message || 'Failed to clone template';
        }
      },
      error: (err: any) => {
        console.error('Error cloning template:', err);
        this.error = 'Failed to clone template';
      },
    });
  }

  previewTemplate(template: IFormTemplate): void {
    if (template.id) {
      this.router.navigate(['/forms/preview', template.id]);
    }
  }

  viewAnalytics(template: IFormTemplate): void {
    if (template.id) {
      this.router.navigate(['/admin/mentorship/analytics', template.id]);
    }
  }

  // Search and filtering methods
  applyFilters(): void {
    let filtered = [...this.templates];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchLower) ||
        template.description?.toLowerCase().includes(searchLower)
      );
    }

    this.filteredTemplates = filtered;
    this.totalTemplates = filtered.length;
    this.currentPage = 1; // Reset to first page when filtering
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.loadTemplates();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Pagination methods
  get paginatedTemplates(): IFormTemplate[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTemplates.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalTemplates / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Utility methods
  clearMessages(): void {
    this.error = null;
    this.success = null;
  }

  getTemplateAnalytics(templateId: number): IFormAnalytics | null {
    return this.templateAnalytics[templateId] || null;
  }

  getFieldCount(template: IFormTemplate): number {
    return template.structure.reduce((total, group) => total + group.fields.length, 0);
  }

  getGroupCount(template: IFormTemplate): number {
    return template.structure.length;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  isDeleting(templateId: number | undefined): boolean {
    return templateId ? this.deleting[templateId] || false : false;
  }

  // Bulk operations
  selectAllTemplates(): void {
    // TODO: Implement bulk selection logic
  }

  deleteSelectedTemplates(): void {
    // TODO: Implement bulk delete logic
  }

  exportTemplates(): void {
    // TODO: Implement export functionality
  }

  refreshTemplates(): void {
    this.loadTemplates();
  }
}
