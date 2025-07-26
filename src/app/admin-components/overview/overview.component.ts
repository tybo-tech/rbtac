import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  icon: string;
  title: string;
  value: string | number;
  label: string;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface ProgressChart {
  title: string;
  description: string;
  type: 'placeholder' | 'progress' | 'chart';
  data?: {
    percentage?: number;
    amount?: string;
    used?: string;
    total?: string;
  };
}

interface ScheduleItem {
  date: string;
  title: string;
  time: string;
  type: 'training' | 'booking';
  participant?: string;
  room?: string;
}

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  // User info
  userName = 'Alex Johnson';
  userRole = 'Hub Director';
  currentDate = new Date().toLocaleDateString();
  
  // Dashboard stats
  statsCards: StatCard[] = [
    {
      icon: 'fas fa-building',
      title: 'Active Companies',
      value: 105,
      label: 'Companies',
      trend: { value: 12, isPositive: true }
    },
    {
      icon: 'fas fa-users',
      title: 'Active Entrepreneurs',
      value: 243,
      label: 'Entrepreneurs',
      trend: { value: 8, isPositive: true }
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Grants Active',
      value: 14,
      label: 'Grant Programs',
      trend: { value: 2, isPositive: true }
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Sessions Today',
      value: 5,
      label: 'Scheduled',
      trend: { value: 1, isPositive: false }
    }
  ];

  // Progress charts
  progressCharts: ProgressChart[] = [
    {
      title: 'Entrepreneur Progress',
      description: 'Monthly cohort completion tracking',
      type: 'chart'
    },
    {
      title: 'Grant Funding',
      description: 'Current funding utilization',
      type: 'progress',
      data: {
        percentage: 56,
        used: '$428,000',
        total: '$764,000'
      }
    }
  ];

  // Schedule items
  scheduleItems: ScheduleItem[] = [
    {
      date: 'July 8',
      title: 'Grant Writing Workshop',
      time: '10:00 AM',
      type: 'training'
    },
    {
      date: 'July 10',
      title: 'Mentor Course',
      time: '11:00 AM',
      type: 'training'
    },
    {
      date: 'July 12',
      title: 'Pitch Preparation',
      time: '12:00 PM',
      type: 'training'
    }
  ];

  // Recent bookings
  recentBookings: ScheduleItem[] = [
    {
      date: 'July 8',
      title: 'Strategy Session',
      time: '14:00',
      type: 'booking',
      participant: 'Alex Smith',
      room: 'Room 203'
    },
    {
      date: 'July 9',
      title: 'Team Meeting',
      time: '15:30',
      type: 'booking',
      participant: 'Maria Rodriguez',
      room: 'Room 207'
    },
    {
      date: 'July 10',
      title: 'Client Consultation',
      time: '09:00',
      type: 'booking',
      participant: 'David Chen',
      room: 'Room 101'
    }
  ];

  // Get current date for greeting
  getCurrentTimeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // Format trend display
  formatTrend(trend: { value: number; isPositive: boolean }): string {
    const sign = trend.isPositive ? '+' : '-';
    return `${sign}${Math.abs(trend.value)}%`;
  }
}
