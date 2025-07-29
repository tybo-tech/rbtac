import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
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
            <a
              *ngFor="let tab of tabs"
              [routerLink]="['/admin/mentorship', tab.id]"
              [routerLinkActiveOptions]="{ exact: true }"
              routerLinkActive="border-blue-500 text-blue-400"
              class="whitespace-nowrap py-4 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300 font-medium text-sm transition-colors duration-200">
              {{ tab.label }}
              <span
                *ngIf="tab.count > 0"
                class="ml-2 px-2 py-1 text-xs rounded-full text-white bg-gray-600">
                {{ tab.count }}
              </span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['./mentorship.component.scss']
})
export class MentorshipComponent implements OnInit {
  // Component state
  tabs = [
    { id: 'overview', label: 'Overview', count: 0 },
    { id: 'templates', label: 'Templates', count: 0 },
    { id: 'sessions', label: 'Sessions', count: 0 },
    { id: 'tasks', label: 'Tasks', count: 0 },
    { id: 'analytics', label: 'Analytics', count: 0 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // No need to load data here - sub-components handle their own data
  }

  updateTabCount(tabId: string, count: number) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.count = count;
    }
  }
}
