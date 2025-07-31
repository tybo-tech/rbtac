import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ICollectionData } from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { COLLECTION_NAMES, IFormTemplate } from '../../../../../models/mentorship-form.interfaces';



@Component({
  selector: 'app-form-template-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './form-template-list.component.html',
  styleUrls: ['./form-template-list.component.scss'],
})
export class FormTemplateListComponent implements OnInit {
  templates: ICollectionData<IFormTemplate>[] = [];

  // UI state
  loading = false;
  error: string | null = null;

  constructor(private dataService: CollectionDataService<IFormTemplate>,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.getTemplates();
  }

  getTemplates(): void {
    this.loading = true;
    this.dataService
      .getAllByCollection(COLLECTION_NAMES.FORM_TEMPLATES)
      .subscribe({
        next: (res) => {
          this.templates = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load templates:', err);
          this.error = 'Failed to load templates. Please try again.';
          this.loading = false;
        },
      });
  }

  createTemplate(): void {
    // TODO: Open modal or navigate to form creation component
    this.router.navigate(['/admin/mentorship/templates/create']);
  }

  editTemplate(template: ICollectionData<IFormTemplate>): void {
    // TODO: Implement edit logic (modal or routing)
    this.router.navigate(['/admin/mentorship/templates', template.id]);
  }

  deleteTemplate(template: ICollectionData<IFormTemplate>): void {
    const confirmDelete = confirm(`Are you sure you want to delete "${template.data.title}"?`);
    if (!confirmDelete || !template.id) return;

    this.dataService.deleteData(template.id).subscribe({
      next: () => {
        this.templates = this.templates.filter(t => t.id !== template.id);
        alert('Template deleted');
      },
      error: (err) => {
        console.error('Error deleting template:', err);
        alert('Failed to delete template');
      },
    });
  }

  previewTemplate(template: ICollectionData<IFormTemplate>): void {
    // TODO: Route to preview page or open preview modal
    alert(`Previewing: ${template.data.title}`);
  }
}
