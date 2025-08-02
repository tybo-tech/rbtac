import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IFormTemplate,
  ApiResponse,
  IFormAnalytics,
  FormSession
} from '../../../../../models/mentorship-form.interfaces';
import { FormTemplateService } from '../../../../../services/form-template.service';
import { FormAnalyticsService } from '../../../../../services/form-analytics.service';
import { FormSessionService } from '../../../../../services/form-session.service';

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
    private router: Router,
    private formSessionService: FormSessionService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  /**
   * Start a new session with the selected template
   */
  startSession(template: IFormTemplate): void {
    if (!template.id) {
      console.error('Template ID is required to start a session');
      return;
    }

    this.loading = true;
    this.error = null;

    // Create a new session with the selected template
    const newSession: FormSession = {
      form_template_id: template.id,
      company_id: 1, // TODO: Get from user context/authentication
      user_id: 1,     // TODO: Get from user context/authentication
      values: {}      // Start with empty values
    };

    this.formSessionService.addFormSession(newSession).subscribe({
      next: (response: ApiResponse<FormSession>) => {
        if (response.success && response.data) {
          // Redirect to the session URL with the new session ID
          this.router.navigate(['/admin/mentorship/sessions', response.data.id]);
        } else {
          this.error = response.message || 'Failed to create session';
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Failed to create session:', error);
        this.error = 'Failed to create session. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Load all available form templates
   */
  loadTemplates(): void {
    this.loading = true;
    this.error = null;

    // Load active templates only with summary data (optimized for picking)
    this.formTemplateService.getFormTemplates(1).subscribe({
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
    // Use summary data if available (optimized list), otherwise calculate from structure
    if (template.summary?.field_count !== undefined) {
      return template.summary.field_count;
    }

    // Fallback for templates with full structure
    if (template.structure?.length) {
      return template.structure.reduce((total, group) => total + group.fields.length, 0);
    }

    return 0;
  }

  /**
   * Get total number of groups in a template
   */
  getTotalGroups(template: IFormTemplate): number {
    // Use summary data if available (optimized list), otherwise calculate from structure
    if (template.summary?.group_count !== undefined) {
      return template.summary.group_count;
    }

    // Fallback for templates with full structure
    if (template.structure?.length) {
      return template.structure.length;
    }

    return 0;
  }

  /**
   * Get estimated completion time for a template
   */
  getEstimatedTime(template: IFormTemplate): number {
    return template.summary?.estimated_time || 0;
  }

  /**
   * Get complexity level for a template
   */
  getComplexity(template: IFormTemplate): string {
    return template.summary?.complexity || 'Unknown';
  }

  /**
   * Get field types breakdown for a template
   */
  getFieldTypeBreakdown(template: IFormTemplate): { [type: string]: number } {
    return template.summary?.field_types || {};
  }

  /**
   * Check if template has advanced field types
   */
  hasAdvancedFields(template: IFormTemplate): boolean {
    const types = template.summary?.field_types || {};
    return (types['table'] || 0) > 0 || (types['rating'] || 0) > 0 || (types['boolean'] || 0) > 0;
  }

  /**
   * Get field type count for display
   */
  getFieldTypeCount(template: IFormTemplate, fieldType: string): number {
    return template.summary?.field_types?.[fieldType] || 0;
  }
}
