import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import sub-components
import { MentorshipOverviewComponent } from './components/mentorship-overview/mentorship-overview.component';
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
    MentorshipOverviewComponent,
    MentorshipTemplateComponent,
    MentorshipSessionComponent,
    MentorshipTaskComponent,
    MentorshipAnalyticsComponent
  ],
  template: `
    <!-- Enhanced Mentorship Management with Dark Theme -->
    <div class="min-h-screen bg-gray-900 text-white">

      <!-- Header -->
      <div class="border-b border-gray-700 bg-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-white">Mentorship Management</h1>
                <p class="mt-2 text-gray-300">Comprehensive mentorship program administration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              *ngFor="let tab of tabs"
              (click)="setActiveTab(tab.id)"
              [class]="activeTab() === tab.id ?
                'border-blue-500 text-blue-400' :
                'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200">
              {{ tab.label }}
              <span
                *ngIf="tab.count > 0"
                [class]="activeTab() === tab.id ? 'bg-blue-500' : 'bg-gray-600'"
                class="ml-2 px-2 py-1 text-xs rounded-full text-white">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Overview Tab -->
        <div *ngIf="activeTab() === 'overview'" class="space-y-6">
          <app-mentorship-overview></app-mentorship-overview>
        </div>

        <!-- Templates Tab -->
        <div *ngIf="activeTab() === 'templates'" class="space-y-6">
          <app-mentorship-template
            (countChanged)="updateTabCount('templates', $event)">
          </app-mentorship-template>
        </div>

        <!-- Sessions Tab -->
        <div *ngIf="activeTab() === 'sessions'" class="space-y-6">
          <app-mentorship-session
            (countChanged)="updateTabCount('sessions', $event)">
          </app-mentorship-session>
        </div>

        <!-- Tasks Tab -->
        <div *ngIf="activeTab() === 'tasks'" class="space-y-6">
          <app-mentorship-task
            (countChanged)="updateTabCount('tasks', $event)">
          </app-mentorship-task>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab() === 'analytics'" class="space-y-6">
          <app-mentorship-analytics></app-mentorship-analytics>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./mentorship.component.scss']
})
export class MentorshipComponent implements OnInit {
  // Active tab signal
  activeTab = signal<string>('overview');

  // Component state
  tabs = [
    { id: 'overview', label: 'Overview', count: 0 },
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
