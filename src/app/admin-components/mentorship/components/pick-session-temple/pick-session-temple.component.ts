import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IFormTemplate,
  ApiResponse,
  IFormAnalytics
} from '../../../../../models/mentorship-form.interfaces';
import { FormTemplateService } from '../../../../../services/form-template.service';
import { FormAnalyticsService } from '../../../../../services/form-analytics.service';

@Component({
  selector: 'app-pick-session-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pick-session-temple.component.html',
  styleUrl: './pick-session-temple.component.scss'
})
export class PickSessionTemplateComponent implements OnInit {
  templates: IFormTemplate[] = [];
  filteredTemplates: IFormTemplate[] = [];

  // UI state
  loading = false;
  error: string | null = null;
  searchTerm = '';

  // Analytics data for templates
  templateAnalytics: { [templateId: number]: IFormAnalytics } = {};

  constructor(
    private formTemplateService: FormTemplateService,
    private formAnalyticsService: FormAnalyticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  /**
   * Start a new session with the selected template
   */
  startSession(template: IFormTemplate): void {
    this.router.navigate(['/admin/mentorship/sessions/create'], {
      queryParams: { template_id: template.id }
    });
  }

  /**
   * Load all available form templates
   */
  loadTemplates(): void {
    this.loading = true;
    this.error = null;

    this.formTemplateService.getFormTemplates().subscribe({
      next: (response: ApiResponse<IFormTemplate[]>) => {
        if (response.success && response.data) {
          this.templates = response.data;
          this.filteredTemplates = [...this.templates];
          this.loadTemplateAnalytics();
        } else {
          this.error = response.message || 'Failed to load templates';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load templates:', error);
        this.error = 'Failed to load templates. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Load analytics for all templates
   */
  private loadTemplateAnalytics(): void {
    this.templates.forEach(template => {
      this.formAnalyticsService.getTemplateAnalytics(template.id!).subscribe({
        next: (response: ApiResponse<IFormAnalytics>) => {
          if (response.success && response.data) {
            this.templateAnalytics[template.id!] = response.data;
          }
        },
        error: (error: any) => {
          console.warn(`Failed to load analytics for template ${template.id}:`, error);
        }
      });
    });
  }

  /**
   * Filter templates based on search term
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTemplates = [...this.templates];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredTemplates = this.templates.filter(template =>
      template.title.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Get analytics for a specific template
   */
  getTemplateAnalytics(templateId: number): IFormAnalytics | null {
    return this.templateAnalytics[templateId] || null;
  }

  /**
   * Get formatted completion rate
   */
  getCompletionRate(templateId: number): string {
    const analytics = this.getTemplateAnalytics(templateId);
    if (!analytics || analytics.total_sessions === 0) {
      return 'No data';
    }
    const rate = analytics.completion_rate * 100;
    return `${rate.toFixed(1)}%`;
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  /**
   * Track by function for template list
   */
  trackByTemplateId(index: number, template: IFormTemplate): number {
    return template.id || index;
  }

  /**
   * Get total number of fields in a template
   */
  getTotalFields(template: IFormTemplate): number {
    return template.structure.reduce((total, group) => total + group.fields.length, 0);
  }
}
