import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ICollection } from '../../../models/ICollection';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { ViewService } from '../../../services/view.service';
import { IView } from '../../../models/IView';
import { ViewComponent } from '../view/view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-views',
  imports: [NgFor, NgIf, ViewComponent],
  templateUrl: './collection-views.component.html',
  styleUrl: './collection-views.component.scss',
})
export class CollectionViewsComponent implements OnChanges {
  @Input({ required: true }) collection!: ICollection;
  @Input() viewId = 0; // Used to track the current view ID for editing

  @Input() view?: IView;
  @Input() newView?: IView;
  @Output() onViewChange = new EventEmitter<IView>();
  // views: ('table' | 'report')[] = ['table', 'report'];
  views: IView[] = [];
  constructor(private viewService: ViewService, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewId'] ||  changes['collection']) {
      this.loadViews();
    }
  }
  loadViews() {
    if (!this.collection) return;
    this.viewService
      .getViewsByCollectionId(this.collection.id)
      .subscribe((views) => {
        if (views && views.length > 0) {
          this.views = views;
          this.view =
            views.find((v) => v.id === Number(this.viewId)) || views[0]; // Set first view as default
          this.onViewChange.emit(this.view);
        } else {
          this.createDefaultView();
        }
      });
  }

  createDefaultView() {
    const defaultView: IView = {
      id: 0,
      name: 'Table',
      type: 'table',
      field: '',
      collection_id: this.collection.id,
      config: {
        columns: this.collection.columns?.map((col) => col.id) || [],
        filters: [],
      },
    };
    this.viewService.addView(defaultView).subscribe((view) => {
      if (view && view.id) {
        this.view = view;
        this.views.push(view);
        this.onViewChange.emit(this.view);
      }
    });
  }
  addNewView(newView: IView) {
    console.log('Adding new view:', newView);
    this.viewService.addView(newView).subscribe((view) => {
      if (view && view.id) {
        this.gotoView(view);
      }
    });
  }
  gotoView(view: IView) {
    this.router.navigate(['/admin/collections', this.collection.id, view.id]);
  }
  toggleAddView(): any {
    this.newView = {
      id: 0,
      name: '',
      type: 'table',
      field: '',
      collection_id: this.collection.id,
      config: {
        columns: [],
        filters: [],
      },
    };
  }
  getViewIcon(type: string): string {
    switch (type) {
      case 'table':
        return 'fas fa-table';
      case 'select-distribution':
        return 'fas fa-chart-pie';
      case 'multi-select-frequency':
        return 'fas fa-bars';
      case 'number-summary':
        return 'fas fa-chart-bar';
      case 'date-distribution':
        return 'fas fa-calendar-alt';
      case 'boolean-distribution':
        return 'fas fa-toggle-on';
      default:
        return 'fas fa-eye';
    }
  }
}
