import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { ICollectionData } from '../../../../../models/ICollection';
import { IFormField, IFormTemplate } from '../../../../../models/mentorship-form.interfaces';
import { SIMPLE_FORM_TEMPLATE } from './templates/simple';
import { FormsModule } from '@angular/forms';

export const COLLECTION_NAMES = {
  FORM_TEMPLATES: 'form_templates',
};

@Component({
  selector: 'app-form-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.scss'],
})
export class FormTemplateComponent implements OnInit {

  templateId: string = '';
  template: ICollectionData<IFormTemplate> = {
    collection_id: COLLECTION_NAMES.FORM_TEMPLATES,
    id: 0,
    data: {
      title: '',
      description: '',
      groups: [],
    },
  };

  loading = false;
  error: string | null = null;
// These will not be saved to DB; only for UI editing support
optionDrafts: Record<string, string> = {}; // field.key -> string
  constructor(
    private route: ActivatedRoute,
    private dataService: CollectionDataService<IFormTemplate>
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
    this.template.data = SIMPLE_FORM_TEMPLATE;
  }

  loadTemplateById(id: string): void {
    this.loading = true;
    this.dataService.getDataById(+id).subscribe({
      next: (res) => {
        this.template = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading template:', err);
        this.error = 'Could not load template';
        this.loading = false;
      },
    });
  }

  saveTemplate(): void {
    if (this.templateId === 'create') {
      this.dataService.addData(this.template).subscribe({
        next: (res) => {
          alert('Template created successfully');
          // Optionally redirect
        },
        error: (err) => {
          console.error('Error saving template:', err);
          alert('Failed to save template');
        },
      });
    } else {
      this.dataService.updateData(this.template).subscribe({
        next: () => alert('Template updated'),
        error: (err) => {
          console.error('Error updating template:', err);
          alert('Failed to update template');
        },
      });
    }
  }

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
generateKey(input: string): string {
  return (input || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}
}
