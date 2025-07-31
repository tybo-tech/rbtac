import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime } from 'rxjs';

import {
  IFormTemplate,
  IFormValues,
  FormSession,
  IFormField,
  ITableColumn,
  ApiResponse,
  IFormState
} from '../../../../../models/mentorship-form.interfaces';

import { FormTemplateService } from '../../../../../services/form-template.service';
import { FormStateService } from '../../../../../services/form-state.service';
import { FormValidationService } from '../../../../../services/form-validation.service';

@Component({
  selector: 'app-mentorship-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-session.component.html',
  styleUrl: './mentorship-session.component.scss'
})
export class MentorshipSessionComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private autoSaveSubject$ = new Subject<void>();

  // Core data
  templateId: number | null = null;
  template: IFormTemplate | null = null;
  session: FormSession | null = null;
  formValues: IFormValues = {};

  // UI state
  loading = true;
  saving = false;
  error: string | null = null;
  currentGroupIndex = 0;
  isDirty = false;
  lastSaved: Date | null = null;

  // Form state
  formState: IFormState = {
    template: null,
    session: null,
    currentGroup: 0,
    isSubmitting: false,
    isDirty: false,
    validationErrors: {},
    syncStatus: null
  };

  // Validation
  validationErrors: { [fieldKey: string]: string[] } = {};
  isFormValid = true;

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Make public for template access
    private formTemplateService: FormTemplateService,
    private formStateService: FormStateService,
    private formValidationService: FormValidationService
  ) {
    this.initializeAutoSave();
  }

  ngOnInit(): void {
    const templateIdParam = this.route.snapshot.queryParamMap.get('template_id');

    if (templateIdParam) {
      this.templateId = parseInt(templateIdParam, 10);
      this.loadTemplate();
    } else {
      this.error = 'No template ID provided.';
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize auto-save functionality
   */
  private initializeAutoSave(): void {
    this.autoSaveSubject$
      .pipe(
        debounceTime(2000), // Wait 2 seconds after user stops typing
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.isDirty && this.session) {
          this.autoSaveSession();
        }
      });
  }

  /**
   * Load the form template
   */
  loadTemplate(): void {
    if (!this.templateId) return;

    this.loading = true;
    this.error = null;

    this.formTemplateService.getFormTemplateById(this.templateId).subscribe({
      next: (response: ApiResponse<IFormTemplate>) => {
        if (response.success && response.data) {
          this.template = response.data;
          this.formState.template = this.template;
          this.initializeFormValues();
          this.createSession();
        } else {
          this.error = response.message || 'Failed to load template';
          this.loading = false;
        }
      },
      error: (error: any) => {
        console.error('Failed to load template:', error);
        this.error = 'Failed to load template. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Initialize form values based on template structure
   */
  initializeFormValues(): void {
    if (!this.template || !this.template.structure) return;

    this.formValues = {};

    for (const group of this.template.structure) {
      this.formValues[group.key] = {};
      for (const field of group.fields) {
        // Initialize field values based on type
        switch (field.type) {
          case 'table':
            this.formValues[group.key][field.key] = [this.createEmptyTableRow(field.columns || [])];
            break;
          case 'boolean':
            this.formValues[group.key][field.key] = false;
            break;
          case 'number':
          case 'rating':
            this.formValues[group.key][field.key] = 0;
            break;
          default:
            this.formValues[group.key][field.key] = field.value || '';
        }
      }
    }
  }

  /**
   * Create a new session for this template
   */
  createSession(): void {
    if (!this.template || !this.templateId) return;

    const newSession: FormSession = {
      form_template_id: this.templateId,
      company_id: 1, // TODO: Get from user context
      user_id: 1, // TODO: Get from user context
      values: this.formValues
    };

    // For now, create session locally - later integrate with backend
    this.session = { ...newSession, id: Date.now() }; // Temporary ID
    this.formState.session = this.session;
    this.loading = false;
  }

  /**
   * Auto-save session data
   */
  private autoSaveSession(): void {
    if (!this.session || this.saving) return;

    this.saving = true;
    this.session.values = this.formValues;

    // TODO: Integrate with backend API for auto-save
    // For now, simulate saving
    setTimeout(() => {
      this.saving = false;
      this.isDirty = false;
      this.lastSaved = new Date();
    }, 500);
  }

  /**
   * Create empty table row
   */
  private createEmptyTableRow(columns: ITableColumn[]): { [key: string]: any } {
    const row: { [key: string]: any } = {};
    for (const col of columns) {
      switch (col.type) {
        case 'number':
          row[col.key] = 0;
          break;
        case 'boolean':
          row[col.key] = false;
          break;
        default:
          row[col.key] = '';
      }
    }
    return row;
  }

  /**
   * Add new row to table field
   */
  addTableRow(groupKey: string, fieldKey: string, columns: ITableColumn[] = []): void {
    if (columns.length === 0) {
      console.warn('No columns defined for this table field.');
      return;
    }

    // Ensure the structure exists
    if (!this.formValues[groupKey]) {
      this.formValues[groupKey] = {};
    }

    if (!Array.isArray(this.formValues[groupKey][fieldKey])) {
      this.formValues[groupKey][fieldKey] = [];
    }

    // Add new row
    const newRow = this.createEmptyTableRow(columns);
    this.formValues[groupKey][fieldKey].push(newRow);

    this.markAsDirty();
  }

  /**
   * Remove table row
   */
  removeTableRow(groupKey: string, fieldKey: string, rowIndex: number): void {
    if (this.formValues[groupKey] &&
        Array.isArray(this.formValues[groupKey][fieldKey]) &&
        this.formValues[groupKey][fieldKey].length > 1) {
      this.formValues[groupKey][fieldKey].splice(rowIndex, 1);
      this.markAsDirty();
    }
  }

  /**
   * Handle field value changes
   */
  onFieldChange(): void {
    this.markAsDirty();
    this.validateForm();
  }

  /**
   * Mark form as dirty and trigger auto-save
   */
  private markAsDirty(): void {
    this.isDirty = true;
    this.formState.isDirty = true;
    this.autoSaveSubject$.next();
  }

  /**
   * Validate the entire form
   */
  validateForm(): void {
    if (!this.template) return;

    this.validationErrors = {};
    this.isFormValid = true;

    if (!this.template.structure) return;

    for (const group of this.template.structure) {
      for (const field of group.fields) {
        const value = this.formValues[group.key]?.[field.key];
        const errors = this.formValidationService.validateField(field, value);

        if (errors.length > 0) {
          const fieldKey = `${group.key}.${field.key}`;
          this.validationErrors[fieldKey] = errors;
          this.isFormValid = false;
        }
      }
    }

    this.formState.validationErrors = this.validationErrors;
  }

  /**
   * Navigate between form groups/sections
   */
  goToGroup(index: number): void {
    if (this.template && this.template.structure && index >= 0 && index < this.template.structure.length) {
      this.currentGroupIndex = index;
      this.formState.currentGroup = index;
    }
  }

  nextGroup(): void {
    if (this.template && this.template.structure && this.currentGroupIndex < this.template.structure.length - 1) {
      this.goToGroup(this.currentGroupIndex + 1);
    }
  }

  previousGroup(): void {
    if (this.currentGroupIndex > 0) {
      this.goToGroup(this.currentGroupIndex - 1);
    }
  }

  /**
   * Get field errors for display
   */
  getFieldErrors(groupKey: string, fieldKey: string): string[] {
    return this.validationErrors[`${groupKey}.${fieldKey}`] || [];
  }

  /**
   * Check if field has errors
   */
  hasFieldErrors(groupKey: string, fieldKey: string): boolean {
    return this.getFieldErrors(groupKey, fieldKey).length > 0;
  }

  /**
   * Submit the complete session
   */
  submitSession(): void {
    this.validateForm();

    if (!this.isFormValid) {
      this.error = 'Please fix validation errors before submitting.';
      return;
    }

    if (!this.session) {
      this.error = 'No active session to submit.';
      return;
    }

    this.formState.isSubmitting = true;
    this.session.values = this.formValues;

    // TODO: Integrate with backend API
    console.log('Submitting session:', this.session);

    // Simulate submission
    setTimeout(() => {
      this.formState.isSubmitting = false;
      alert('Session submitted successfully!');
      this.router.navigate(['/admin/mentorship/sessions']);
    }, 1000);
  }

  /**
   * Save as draft
   */
  saveAsDraft(): void {
    this.autoSaveSession();
  }

  /**
   * Get total progress percentage
   */
  getProgressPercentage(): number {
    if (!this.template) return 0;

    let totalFields = 0;
    let filledFields = 0;

    if (!this.template.structure) return 0;

    for (const group of this.template.structure) {
      for (const field of group.fields) {
        totalFields++;
        const value = this.formValues[group.key]?.[field.key];
        if (value && value !== '' && value !== 0 && value !== false) {
          filledFields++;
        }
      }
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }

  /**
   * For debugging - log current values
   */
  logValues(): void {
    console.log('Form values:', this.formValues);
    console.log('Form state:', this.formState);
    console.log('Validation errors:', this.validationErrors);
  }

  /**
   * Track by function for field list
   */
  trackByField(index: number, field: IFormField): string {
    return field.key;
  }
}
