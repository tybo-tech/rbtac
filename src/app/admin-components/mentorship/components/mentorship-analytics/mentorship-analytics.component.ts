import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipStatistics } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';

@Component({
  selector: 'app-mentorship-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-analytics.component.html',
  styleUrls: ['./mentorship-analytics.component.scss']
})
export class MentorshipAnalyticsComponent implements OnInit {
  // Signals for reactive data
  analytics = signal<IMentorshipStatistics>({});
  isLoading = signal<boolean>(false);

  // Component state
  analyticsFilter = 'all';
  selectedCompanyId: number | null = null;
  selectedTemplateId: number | null = null;

  // Computed analytics
  get sessionStats() {
    const stats = this.analytics();
    return {
      total: stats.totalSessions || stats.total_sessions || 0,
      active: stats.activeSessions || 0,
      completed: stats.completedSessions || 0,
      completionRate: this.calculateCompletionRate()
    };
  }

  get taskStats() {
    const stats = this.analytics();
    return {
      total: stats.total_tasks || 0,
      pending: stats.pendingTasks || stats.pending_tasks || 0,
      inProgress: stats.in_progress_tasks || 0,
      completed: stats.completed_tasks || 0,
      overdue: stats.overdueTasks || stats.overdue_tasks || 0
    };
  }

  constructor(private mentorshipService: MentorshipService) {}

  ngOnInit() {
    this.refreshAnalytics();
  }

  refreshAnalytics() {
    this.isLoading.set(true);

    // Load session statistics
    this.mentorshipService.getSessionStatistics(
      this.selectedCompanyId || undefined,
      this.selectedTemplateId || undefined
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.analytics.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading session analytics:', error);
        this.isLoading.set(false);
      }
    });

    // Also load task statistics
    this.mentorshipService.getTaskStatistics(
      this.selectedCompanyId || undefined
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Merge task statistics with existing analytics
          const currentAnalytics = this.analytics();
          this.analytics.set({
            ...currentAnalytics,
            ...response.data
          });
        }
      },
      error: (error) => console.error('Error loading task analytics:', error)
    });
  }

  updateAnalytics() {
    console.log('Update analytics for:', this.analyticsFilter);
    // TODO: Implement time-based filtering based on analyticsFilter
    this.refreshAnalytics();
  }

  exportAnalytics() {
    // TODO: Implement export functionality
    console.log('Export analytics data');
  }

  filterByCompany(companyId: number) {
    this.selectedCompanyId = companyId;
    this.refreshAnalytics();
  }

  filterByTemplate(templateId: number) {
    this.selectedTemplateId = templateId;
    this.refreshAnalytics();
  }

  clearFilters() {
    this.selectedCompanyId = null;
    this.selectedTemplateId = null;
    this.refreshAnalytics();
  }

  private calculateCompletionRate(): number {
    const stats = this.analytics();
    const total = stats.totalSessions || stats.total_sessions || 0;
    const completed = stats.completedSessions || 0;

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  getTaskCompletionRate(): number {
    const total = this.taskStats.total;
    const completed = this.taskStats.completed;

    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  getOverdueRate(): number {
    const total = this.taskStats.total;
    const overdue = this.taskStats.overdue;

    if (total === 0) return 0;
    return Math.round((overdue / total) * 100);
  }

  getProgressBarWidth(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.min((value / max) * 100, 100);
  }

  getStatusColor(type: string, value: number): string {
    switch (type) {
      case 'completion':
        if (value >= 80) return 'success';
        if (value >= 60) return 'warning';
        return 'danger';
      case 'overdue':
        if (value <= 10) return 'success';
        if (value <= 25) return 'warning';
        return 'danger';
      default:
        return 'primary';
    }
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }
}
