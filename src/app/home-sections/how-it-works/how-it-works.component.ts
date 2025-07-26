import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  steps = [
    {
      icon: 'fa-building',
      title: '1. Set Up Your Organization',
      desc: 'Create your hub, define teams, and onboard your stakeholders into a secure workspace.',
    },
    {
      icon: 'fa-graduation-cap',
      title: '2. Launch Programs & Training',
      desc: 'Plan mentorship, funding rounds, or accelerator tracks using built-in program tools.',
    },
    {
      icon: 'fa-chart-line',
      title: '3. Track Progress & Outcomes',
      desc: 'Monitor key KPIs, grant utilization, and participant success from your dashboard.',
    },
  ];
}
