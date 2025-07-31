import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICollectionData } from '../../../../../models/ICollection';
import { IFormField, IFormTemplate, IFormValues } from '../../../../../models/mentorship-form.interfaces';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { COLLECTION_NAMES } from '../form-template/form-template.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mentorship-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-session.component.html',
  styleUrl: './mentorship-session.component.scss'
})
export class MentorshipSessionComponent implements OnInit {

  templateId = '';
  template: ICollectionData<IFormTemplate> | null = null;
  formValues: IFormValues = {};
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private dataService: CollectionDataService<IFormTemplate>
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.queryParamMap.get('template_id') || '';
    if (this.templateId) {
      this.loadTemplate();
    } else {
      this.error = 'No template ID provided.';
      this.loading = false;
    }
  }

  loadTemplate() {
    this.dataService.getDataById(+this.templateId).subscribe({
      next: (res) => {
        this.template = res;
        this.initializeFormValues();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load template.';
        this.loading = false;
      }
    });
  }

  initializeFormValues() {
    if (!this.template) return;
    for (const group of this.template.data.groups) {
      this.formValues[group.key] = {};
      for (const field of group.fields) {
        this.formValues[group.key][field.key] = field.value || '';
      }
    }
  }

  // For testing
  logValues() {
    console.log('Form values:', this.formValues);
  }addTableRow(groupKey: string, fieldKey: string, columns?: IFormField[]) {
  if (!columns || columns.length === 0) {
    console.warn('No columns defined for this table field.');
    return;
  }

  const newRow: { [key: string]: any } = {};

  for (const col of columns) {
    newRow[col.key] = ''; // default empty value
  }

  // Ensure the array is initialized
  if (!this.formValues[groupKey]) {
    this.formValues[groupKey] = {};
  }

  if (!Array.isArray(this.formValues[groupKey][fieldKey])) {
    this.formValues[groupKey][fieldKey] = [];
  }

  this.formValues[groupKey][fieldKey].push(newRow);
}

}
