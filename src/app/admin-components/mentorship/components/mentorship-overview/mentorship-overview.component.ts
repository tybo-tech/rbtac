import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MentorshipService } from '../../../../../services/mentorship.service';
import { IMentorshipTemplate, IMentorshipSession, IMentorshipTask, IApiResponse } from '../../../../../models/mentorship';

@Component({
  selector: 'app-mentorship-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Mentorship Overview Dashboard -->
    <div class="space-y-6">

      <!-- Header with Quick Actions -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-white">Mentorship Overview</h2>
          <p class="text-gray-400 mt-1">Comprehensive dashboard for mentorship program management</p>
        </div>
        <div class="flex space-x-3">
          <button
            (click)="startNewSession()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Start New Session
          </button>
          <button
            (click)="createTemplate()"
            class="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Create Template
          </button>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <!-- Active Sessions -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Active Sessions</p>
              <p class="text-2xl font-bold text-white">{{ activeSessions() }}</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span class="text-green-400 font-medium">+{{ newSessionsThisWeek() }}</span>
              <span class="text-gray-400 ml-1">this week</span>
            </div>
          </div>
        </div>

        <!-- Total Templates -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Templates</p>
              <p class="text-2xl font-bold text-white">{{ totalTemplates() }}</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span class="text-blue-400 font-medium">{{ activeTemplates() }}</span>
              <span class="text-gray-400 ml-1">active</span>
            </div>
          </div>
        </div>

        <!-- Pending Tasks -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Pending Tasks</p>
              <p class="text-2xl font-bold text-white">{{ pendingTasks() }}</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center text-sm">
              <span class="text-red-400 font-medium">{{ overdueTasks() }}</span>
              <span class="text-gray-400 ml-1">overdue</span>
            </div>
          </div>
        </div>

        <!-- Completion Rate -->
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-400">Completion Rate</p>
              <p class="text-2xl font-bold text-white">{{ completionRate() }}%</p>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-700 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                [style.width.%]="completionRate()">
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Recent Sessions -->
        <div class="bg-gray-800 rounded-lg border border-gray-700">
          <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="text-lg font-medium text-white">Recent Sessions</h3>
          </div>
          <div class="p-6">
            <div *ngIf="recentSessions().length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <p class="text-gray-400 mt-2">No recent sessions</p>
            </div>
            <div class="space-y-4" *ngIf="recentSessions().length > 0">
              <div
                *ngFor="let session of recentSessions()"
                class="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 rounded-full"
                       [class]="getStatusColor(session.status)"></div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ session.template_name || 'Unnamed Session' }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(session.session_date) }}</p>
                  </div>
                </div>
                <span class="text-xs px-2 py-1 rounded-full font-medium"
                      [class]="getStatusBadgeClass(session.status)">
                  {{ session.status | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Center -->
        <div class="bg-gray-800 rounded-lg border border-gray-700">
          <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="text-lg font-medium text-white">Quick Actions</h3>
          </div>
          <div class="p-6 space-y-4">

            <!-- Quick Session Starter -->
            <div class="border border-gray-600 rounded-lg p-4">
              <h4 class="text-sm font-medium text-white mb-3">Start Quick Session</h4>
              <div class="space-y-3">
                <select class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Template</option>
                  <option *ngFor="let template of templates()" [value]="template.id">
                    {{ template.title }}
                  </option>
                </select>
                <select class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Company</option>
                  <!-- Companies would be loaded from CompanyService -->
                </select>
                <button
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Start Session
                </button>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateToTemplates()"
                class="flex flex-col items-center p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                <svg class="w-6 h-6 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs text-gray-300">Templates</span>
              </button>
              <button
                (click)="navigateToTasks()"
                class="flex flex-col items-center p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                <svg class="w-6 h-6 text-yellow-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                <span class="text-xs text-gray-300">Tasks</span>
              </button>
              <button
                (click)="navigateToSessions()"
                class="flex flex-col items-center p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                <svg class="w-6 h-6 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="text-xs text-gray-300">Sessions</span>
              </button>
              <button
                (click)="navigateToAnalytics()"
                class="flex flex-col items-center p-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                <svg class="w-6 h-6 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="text-xs text-gray-300">Analytics</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  `,
  styleUrls: ['./mentorship-overview.component.scss']
})
export class MentorshipOverviewComponent implements OnInit {
  // Signals for reactive data
  templates = signal<IMentorshipTemplate[]>([]);
  sessions = signal<IMentorshipSession[]>([]);
  tasks = signal<IMentorshipTask[]>([]);
  recentSessions = signal<IMentorshipSession[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit() {
    this.loadOverviewData();
  }

  // Load all overview data
  loadOverviewData() {
    this.isLoading.set(true);

    // Load templates
    this.mentorshipService.getTemplates().subscribe({
      next: (response: IApiResponse<IMentorshipTemplate[]>) => {
        if (response.success && response.data) {
          this.templates.set(response.data);
        }
      },
      error: (error) => console.error('Error loading templates:', error)
    });

    // Load sessions
    this.mentorshipService.getSessions().subscribe({
      next: (response: IApiResponse<IMentorshipSession[]>) => {
        if (response.success && response.data) {
          this.sessions.set(response.data);
        }
      },
      error: (error) => console.error('Error loading sessions:', error)
    });

    // Load recent sessions
    this.mentorshipService.getRecentSessions(5).subscribe({
      next: (response: IApiResponse<IMentorshipSession[]>) => {
        if (response.success && response.data) {
          this.recentSessions.set(response.data);
        }
      },
      error: (error) => console.error('Error loading recent sessions:', error)
    });

    // Load tasks
    this.mentorshipService.getTasks().subscribe({
      next: (response: IApiResponse<IMentorshipTask[]>) => {
        if (response.success && response.data) {
          this.tasks.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  // Computed properties for metrics
  activeSessions(): number {
    return this.sessions().filter(s => s.status === 'in_progress' || s.status === 'scheduled').length;
  }

  newSessionsThisWeek(): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.sessions().filter(s => {
      const sessionDate = new Date(s.session_date || '');
      return sessionDate >= oneWeekAgo;
    }).length;
  }

  totalTemplates(): number {
    return this.templates().length;
  }

  activeTemplates(): number {
    return this.templates().filter(t => t.is_active !== false).length;
  }

  pendingTasks(): number {
    return this.tasks().filter(t => t.status === 'pending').length;
  }

  overdueTasks(): number {
    return this.tasks().filter(t => {
      if (!t.due_date) return false;
      const today = new Date();
      const dueDate = new Date(t.due_date);
      return dueDate < today && t.status !== 'done';
    }).length;
  }

  completionRate(): number {
    const totalTasks = this.tasks().length;
    if (totalTasks === 0) return 0;

    const completedTasks = this.tasks().filter(t => t.status === 'done').length;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  // Action methods
  startNewSession() {
    // Navigate to sessions tab with create mode
    // This will be implemented when we update the parent component
    console.log('Starting new session...');
  }

  createTemplate() {
    // Navigate to templates tab with create mode
    console.log('Creating new template...');
  }

  // Navigation methods (will emit events to parent)
  navigateToTemplates() {
    console.log('Navigate to templates');
  }

  navigateToSessions() {
    console.log('Navigate to sessions');
  }

  navigateToTasks() {
    console.log('Navigate to tasks');
  }

  navigateToAnalytics() {
    console.log('Navigate to analytics');
  }

  // Utility methods
  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'bg-yellow-400';
      case 'in_progress': return 'bg-blue-400';
      case 'completed': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
