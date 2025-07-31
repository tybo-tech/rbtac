import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IFormTemplate,
  IFormGroup,
  IFormField,
  FormFieldType,
  ApiResponse
} from '../../../../../models/mentorship-form.interfaces';
import { FormTemplateService } from '../../../../../services/form-template.service';
import { SIMPLE_FORM_TEMPLATE } from './templates/simple';

@Component({
  selector: 'app-form-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss'],
})
export class FormTemplateComponent implements OnInit {

  templateId: string = '';
  template: IFormTemplate = {
    title: '',
    description: '',
    structure: [], // Changed from 'groups' to 'structure'
  };

  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  // UI editing support
  optionDrafts: Record<string, string> = {}; // field.key -> string

  // Available field types for dropdowns
  fieldTypes: FormFieldType[] = [
    'text', 'textarea', 'number', 'select',
    'date', 'rating', 'boolean', 'table'
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Make public for template access
    private formTemplateService: FormTemplateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.templateId = params.get('id') || '';
      if (this.templateId === 'create') {
        this.loadDefaultTemplate();
      } else {
        this.loadTemplateById(this.templateId);
      }
    });
  }

  loadDefaultTemplate(): void {
    // Load the simple template structure
    this.template = { ...SIMPLE_FORM_TEMPLATE };
    // Ensure structure exists
    if (!this.template.structure) {
      this.template.structure = [];
    }
    this.clearMessages();
  }

  loadTemplateById(id: string): void {
    this.loading = true;
    this.clearMessages();

    this.formTemplateService.getFormTemplateById(+id).subscribe({
      next: (response: ApiResponse<IFormTemplate>) => {
        if (response.success && response.data) {
          this.template = response.data;
        } else {
          this.error = response.message || 'Failed to load template';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading template:', err);
        this.error = 'Could not load template';
        this.loading = false;
      },
    });
  }

  saveTemplate(): void {
    if (!this.isValid()) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.clearMessages();

    // Use the new service save method
    this.formTemplateService.saveFormTemplate(this.template).subscribe({
      next: (response: ApiResponse<IFormTemplate>) => {
        if (response.success && response.data) {
          this.template = response.data;
          this.success = this.templateId === 'create'
            ? 'Template created successfully!'
            : 'Template updated successfully!';

          // If it was a create, navigate to edit mode
          if (this.templateId === 'create' && response.data.id) {
            this.router.navigate(['../edit', response.data.id], { relativeTo: this.route });
          }
        } else {
          this.error = response.message || 'Failed to save template';
        }
        this.saving = false;
      },
      error: (err: any) => {
        console.error('Error saving template:', err);
        this.error = 'Failed to save template';
        this.saving = false;
      },
    });
  }

  deleteTemplate(): void {
    if (!this.template.id) return;

    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    this.loading = true;
    this.clearMessages();

    this.formTemplateService.deleteFormTemplate(this.template.id).subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.success) {
          this.success = 'Template deleted successfully!';
          setTimeout(() => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          }, 1500);
        } else {
          this.error = response.message || 'Failed to delete template';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error deleting template:', err);
        this.error = 'Failed to delete template';
        this.loading = false;
      },
    });
  }

  // Group management methods
  addGroup(): void {
    if (!this.template.structure) {
      this.template.structure = [];
    }

    const newGroup: IFormGroup = {
      key: `group_${this.template.structure.length + 1}`,
      title: 'New Group',
      description: '',
      fields: []
    };
    this.template.structure.push(newGroup);
  }

  removeGroup(index: number): void {
    if (!this.template.structure) return;

    if (confirm('Are you sure you want to remove this group?')) {
      this.template.structure.splice(index, 1);
    }
  }

  // Field management methods
  addField(groupIndex: number): void {
    if (!this.template.structure) return;

    const newField: IFormField = {
      key: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false
    };
    this.template.structure[groupIndex].fields.push(newField);
  }

  removeField(groupIndex: number, fieldIndex: number): void {
    if (!this.template.structure) return;

    if (confirm('Are you sure you want to remove this field?')) {
      this.template.structure[groupIndex].fields.splice(fieldIndex, 1);
    }
  }

  // Field type change handler
  onFieldTypeChange(field: IFormField): void {
    // Reset type-specific properties
    delete field.options;
    delete field.columns;

    // Set defaults for specific types
    if (field.type === 'select') {
      field.options = [];
    } else if (field.type === 'table') {
      field.columns = [];
    }
  }

  // Option management for select fields
  addOption(field: IFormField): void {
    const key = field.key;
    const newOpt = this.optionDrafts[key]?.trim();
    if (!newOpt) return;

    field.options = field.options || [];
    if (!field.options.includes(newOpt)) {
      field.options.push(newOpt);
    }
    this.optionDrafts[key] = '';
  }

  removeOption(field: IFormField, optionIndex: number): void {
    if (field.options) {
      field.options.splice(optionIndex, 1);
    }
  }

  // Table column management
  addTableColumn(field: IFormField): void {
    if (field.type !== 'table') return;

    field.columns = field.columns || [];
    field.columns.push({
      key: `col_${field.columns.length + 1}`,
      label: 'New Column',
      type: 'text',
      required: false
    });
  }

  removeTableColumn(field: IFormField, columnIndex: number): void {
    if (field.columns && confirm('Are you sure you want to remove this column?')) {
      field.columns.splice(columnIndex, 1);
    }
  }

  // Utility methods
  generateKey(input: string): string {
    return (input || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  }

  updateGroupKey(group: IFormGroup): void {
    group.key = this.generateKey(group.title);
  }

  updateFieldKey(field: IFormField): void {
    field.key = this.generateKey(field.label);
  }

  isValid(): boolean {
    if (!this.template.title?.trim()) return false;
    if (!this.template.structure || this.template.structure.length === 0) return false;

    // Check each group has at least one field
    for (const group of this.template.structure) {
      if (!group.title?.trim() || !group.key?.trim()) return false;
      if (group.fields.length === 0) return false;

      // Check each field is valid
      for (const field of group.fields) {
        if (!field.label?.trim() || !field.key?.trim()) return false;
      }
    }

    return true;
  }

  clearMessages(): void {
    this.error = null;
    this.success = null;
  }

  // Preview functionality
  previewTemplate(): void {
    if (this.template.id) {
      // Navigate to preview with template ID
      this.router.navigate(['/forms/preview', this.template.id]);
    } else {
      this.error = 'Please save the template first to preview it';
    }
  }

  // Clone template
  cloneTemplate(): void {
    if (!this.template.id) return;

    const newTitle = prompt('Enter title for cloned template:', `${this.template.title} (Copy)`);
    if (!newTitle) return;

    this.loading = true;
    this.clearMessages();

    this.formTemplateService.cloneTemplate(this.template.id, newTitle).subscribe({
      next: (response: ApiResponse<IFormTemplate>) => {
        if (response.success && response.data) {
          this.success = 'Template cloned successfully!';
          setTimeout(() => {
            this.router.navigate(['../edit', response.data!.id], { relativeTo: this.route });
          }, 1500);
        } else {
          this.error = response.message || 'Failed to clone template';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cloning template:', err);
        this.error = 'Failed to clone template';
        this.loading = false;
      },
    });
  }

  // Helper method for template display
  getTotalFieldCount(): number {
    if (!this.template.structure) return 0;
    return this.template.structure.reduce((total, group) => total + group.fields.length, 0);
  }
}
