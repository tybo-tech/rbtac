import { Component, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMentorshipTask } from '../../../../../models/mentorship';
import { MentorshipService } from '../../../../../services/mentorship.service';

@Component({
  selector: 'app-mentorship-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorship-task.component.html',
  styleUrls: ['./mentorship-task.component.scss']
})
export class MentorshipTaskComponent implements OnInit {
  // Signals for reactive data
  tasks = signal<IMentorshipTask[]>([]);
  isLoading = signal<boolean>(false);

  // Events
  countChanged = output<number>();

  // Component state
  taskFilter = '';

  constructor(private mentorshipService: MentorshipService) {}

  // Computed properties for statistics
  get pendingTasksCount(): number {
    return this.tasks().filter(t => t.status === 'pending').length;
  }

  get inProgressTasksCount(): number {
    return this.tasks().filter(t => t.status === 'in_progress').length;
  }

  get completedTasksCount(): number {
    return this.tasks().filter(t => t.status === 'done').length;
  }

  get overdueTasksCount(): number {
    return this.tasks().filter(t => this.isOverdue(t.due_date)).length;
  }

  get completionPercentage(): number {
    const totalTasks = this.tasks().length;
    if (totalTasks === 0) return 0;
    
    const completedTasks = this.completedTasksCount;
    return Math.round((completedTasks / totalTasks) * 100);
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading.set(true);
    this.mentorshipService.getTasks().subscribe({
      next: (response) => {
        if (response.success) {
          this.tasks.set(response.data || []);
          this.countChanged.emit(this.tasks().length);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  filterTasks() {
    if (this.taskFilter === 'overdue') {
      this.isLoading.set(true);
      this.mentorshipService.getOverdueTasks().subscribe({
        next: (response) => {
          if (response.success) {
            this.tasks.set(response.data || []);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading overdue tasks:', error);
          this.isLoading.set(false);
        }
      });
    } else if (this.taskFilter) {
      this.isLoading.set(true);
      this.mentorshipService.getTasksByStatus(this.taskFilter as any).subscribe({
        next: (response) => {
          if (response.success) {
            this.tasks.set(response.data || []);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error filtering tasks:', error);
          this.isLoading.set(false);
        }
      });
    } else {
      this.loadTasks();
    }
  }

  createNewTask() {
    const newTask: Partial<IMentorshipTask> = {
      session_id: 1, // This should come from a session selector
      company_id: 1, // This should come from a company selector
      task_title: 'New Task',
      title: 'New Task',
      task_description: '',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    this.mentorshipService.createTask(newTask).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTasks();
        }
      },
      error: (error) => console.error('Error creating task:', error)
    });
  }

  updateTaskStatus(task: IMentorshipTask) {
    if (!task.id) return;

    this.mentorshipService.updateTaskStatus(task.id, task.status!).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Task status updated successfully');
          // Update the local task in the signal
          const updatedTasks = this.tasks().map(t =>
            t.id === task.id ? { ...t, status: task.status } : t
          );
          this.tasks.set(updatedTasks);
        }
      },
      error: (error) => console.error('Error updating task status:', error)
    });
  }

  editTask(task: IMentorshipTask) {
    console.log('Edit task:', task);
    // TODO: Open task edit modal
  }

  viewTask(taskId: number) {
    console.log('View task details:', taskId);
    // TODO: Navigate to task detail view or open modal
  }

  deleteTask(task: IMentorshipTask) {
    if (confirm(`Are you sure you want to delete "${task.title || task.task_title}"?`)) {
      // TODO: Implement delete functionality once API endpoint is available
      console.log('Delete task:', task.id);
    }
  }

  assignTask(task: IMentorshipTask, userId: number) {
    if (!task.id) return;

    const updateData = { ...task, assigned_to: userId };
    this.mentorshipService.updateTask(task.id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadTasks(); // Refresh the list
        }
      },
      error: (error) => console.error('Error assigning task:', error)
    });
  }

  getTasksByCompany(companyId: number) {
    this.isLoading.set(true);
    this.mentorshipService.getTasksByCompany(companyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.tasks.set(response.data || []);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading company tasks:', error);
        this.isLoading.set(false);
      }
    });
  }

  trackByTaskId(index: number, task: IMentorshipTask): any {
    return task.id;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  }

  isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  getPriorityColor(priority: string | undefined): string {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'pending';
      case 'in_progress': return 'in_progress';
      case 'done': return 'done';
      default: return 'pending';
    }
  }

  getDaysUntilDue(dueDate: string | undefined): number {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysOverdue(dueDate: string | undefined): number {
    const daysUntilDue = this.getDaysUntilDue(dueDate);
    return Math.abs(daysUntilDue);
  }
}
