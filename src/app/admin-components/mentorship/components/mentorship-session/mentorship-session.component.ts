import { Component, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipSession } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';

@Component({
  selector: 'app-mentorship-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-session.component.html',
  styleUrls: ['./mentorship-session.component.scss']
})
export class MentorshipSessionComponent implements OnInit {
  // Signals for reactive data
  sessions = signal<IMentorshipSession[]>([]);
  isLoading = signal<boolean>(false);

  // Events
  countChanged = output<number>();

  // Component state
  sessionFilter = '';

  constructor(private mentorshipService: MentorshipService) {}

  // Computed properties for statistics
  get scheduledSessionsCount(): number {
    return this.sessions().filter(s => s.status === 'scheduled').length;
  }

  get inProgressSessionsCount(): number {
    return this.sessions().filter(s => s.status === 'in_progress').length;
  }

  get completedSessionsCount(): number {
    return this.sessions().filter(s => s.status === 'completed').length;
  }

  get averageProgress(): number {
    const sessions = this.sessions();
    if (sessions.length === 0) return 0;

    const totalProgress = sessions.reduce((sum, s) => sum + (s.completion_percentage || 0), 0);
    return Math.round(totalProgress / sessions.length);
  }

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.isLoading.set(true);
    this.mentorshipService.getSessions().subscribe({
      next: (response) => {
        if (response.success) {
          this.sessions.set(response.data || []);
          this.countChanged.emit(this.sessions().length);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading sessions:', error);
        this.isLoading.set(false);
      }
    });
  }

  filterSessions() {
    if (this.sessionFilter) {
      // Filter by status
      const filteredSessions = this.sessions().filter(session =>
        session.status === this.sessionFilter
      );
      // For now, we'll just log the filter. In production, you'd want to update the signal
      console.log('Filtered sessions:', filteredSessions);
    } else {
      this.loadSessions();
    }
  }

  createNewSession() {
    const newSession: Partial<IMentorshipSession> = {
      company_id: 1, // This should come from a company selector
      template_id: 1, // This should come from a template selector
      session_date: new Date().toISOString(),
      status: 'scheduled'
    };

    this.mentorshipService.createSession(newSession).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadSessions();
        }
      },
      error: (error) => console.error('Error creating session:', error)
    });
  }

  viewSession(sessionId: number) {
    console.log('View session details:', sessionId);
    // TODO: Navigate to session detail view or open modal
  }

  editSession(session: IMentorshipSession) {
    console.log('Edit session:', session);
    // TODO: Open session edit modal
  }

  viewSessionTasks(sessionId: number) {
    console.log('View session tasks:', sessionId);
    // TODO: Filter tasks by session or navigate to tasks view
  }

  getRecentSessions() {
    this.isLoading.set(true);
    this.mentorshipService.getRecentSessions(10).subscribe({
      next: (response) => {
        if (response.success) {
          this.sessions.set(response.data || []);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading recent sessions:', error);
        this.isLoading.set(false);
      }
    });
  }

  updateSessionStatus(session: IMentorshipSession, newStatus: string) {
    if (!session.id) return;

    const updateData = { ...session, status: newStatus as any };
    this.mentorshipService.updateSession(session.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadSessions(); // Refresh the list
        }
      },
      error: (error) => console.error('Error updating session status:', error)
    });
  }

  trackBySessionId(index: number, session: IMentorshipSession): any {
    return session.id;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'scheduled': return 'scheduled';
      case 'in_progress': return 'in_progress';
      case 'completed': return 'completed';
      default: return 'scheduled';
    }
  }

  getProgressPercentage(session: IMentorshipSession): number {
    return session.completion_percentage || 0;
  }
}
