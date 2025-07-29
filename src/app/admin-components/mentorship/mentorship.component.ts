import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import sub-components
import { MentorshipTemplateComponent } from './components/mentorship-template/mentorship-template.component';
import { MentorshipSessionComponent } from './components/mentorship-session/mentorship-session.component';
import { MentorshipTaskComponent } from './components/mentorship-task/mentorship-task.component';
import { MentorshipAnalyticsComponent } from './components/mentorship-analytics/mentorship-analytics.component';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MentorshipTemplateComponent,
    MentorshipSessionComponent,
    MentorshipTaskComponent,
    MentorshipAnalyticsComponent
  ],
  template: `
    <div class="mentorship-container">
      <!-- Header -->
      <div class="header-section">
        <h1>Mentorship Management</h1>
        <p class="subtitle">Excel-style management for mentorship templates, sessions, and tasks</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="tab-navigation">
        <button
          *ngFor="let tab of tabs"
          class="tab-button"
          [class.active]="activeTab() === tab.id"
          (click)="setActiveTab(tab.id)">
          {{ tab.label }}
          <span class="count" *ngIf="tab.count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">

        <!-- Templates Tab -->
        <div *ngIf="activeTab() === 'templates'" class="tab-panel">
          <app-mentorship-template
            (countChanged)="updateTabCount('templates', $event)">
          </app-mentorship-template>
        </div>

        <!-- Sessions Tab -->
        <div *ngIf="activeTab() === 'sessions'" class="tab-panel">
          <app-mentorship-session
            (countChanged)="updateTabCount('sessions', $event)">
          </app-mentorship-session>
        </div>

        <!-- Tasks Tab -->
        <div *ngIf="activeTab() === 'tasks'" class="tab-panel">
          <app-mentorship-task
            (countChanged)="updateTabCount('tasks', $event)">
          </app-mentorship-task>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab() === 'analytics'" class="tab-panel">
          <app-mentorship-analytics></app-mentorship-analytics>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./mentorship.component.scss']
})
export class MentorshipComponent implements OnInit {
  // Active tab signal
  activeTab = signal<string>('templates');

  // Component state
  tabs = [
    { id: 'templates', label: 'Templates', count: 0 },
    { id: 'sessions', label: 'Sessions', count: 0 },
    { id: 'tasks', label: 'Tasks', count: 0 },
    { id: 'analytics', label: 'Analytics', count: 0 }
  ];

  constructor() {}

  ngOnInit() {
    // No need to load data here - sub-components handle their own data
  }

  // Tab management
  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  updateTabCount(tabId: string, count: number) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.count = count;
    }
  }
}
