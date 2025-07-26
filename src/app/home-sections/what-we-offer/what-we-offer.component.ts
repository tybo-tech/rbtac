import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-what-we-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './what-we-offer.component.html',
  styleUrl: './what-we-offer.component.scss',
})
export class WhatWeOfferComponent {
  title = '  Why Teams Love VentureFlow';
  services = [
    {
      icon: 'fa-building',
      title: 'Multi-Company Support',
      desc: 'Easily manage multiple organizations under one platform — ideal for incubators, agencies, and service providers.',
    },
    {
      icon: 'fa-user-plus',
      title: 'Onboarding & CRM',
      desc: 'Streamline client onboarding and track engagement with built-in CRM tools customized to your business.',
    },
    {
      icon: 'fa-layer-group',
      title: 'Modular System',
      desc: 'Choose only what you need — from booking to invoicing, inventory to performance tracking.',
    },
    {
      icon: 'fa-calendar-alt',
      title: 'Smart Scheduling',
      desc: 'Plan training, sessions, or appointments with a shared calendar and automated reminders.',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Secure Access Control',
      desc: 'Manage user roles, company permissions, and secure data flows across all tenants.',
    },
    {
      icon: 'fa-chart-line',
      title: 'Realtime Insights',
      desc: 'Monitor KPIs, project stages, client progress, and system-wide performance from one central dashboard.',
    },
  ];
}
