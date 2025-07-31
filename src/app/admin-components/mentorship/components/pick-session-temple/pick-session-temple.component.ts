import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICollectionData } from '../../../../../models/ICollection';
import { IFormTemplate } from '../../../../../models/mentorship-form.interfaces';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { COLLECTION_NAMES } from '../form-template/form-template.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pick-session-temple',
  imports: [CommonModule],
  templateUrl: './pick-session-temple.component.html',
  styleUrl: './pick-session-temple.component.scss'
})
export class PickSessionTempleComponent implements OnInit {
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
startSession(template: ICollectionData<IFormTemplate>) {
  this.router.navigate(['/admin/mentorship/sessions/create'], {
    queryParams: { template_id: template.id }
  });
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
}
