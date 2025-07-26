import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CTAAction } from '../../../models/main.ui';

@Component({
  selector: 'app-main-cta',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-cta.component.html',
  styleUrl: './main-cta.component.scss'
})
export class MainCtaComponent {
  ctaHeading = 'Empower Your Incubator with VentureFlow';
  ctaSubheading = 'Track training, grants, and business growth — all in one modern platform built for impact.';
  
  actions: CTAAction[] = [
    {
      label: 'Get Started',
      icon: 'fa-rocket',
      href: '/register',
      variant: 'accent'
    },
    {
      label: 'See the Platform',
      icon: 'fa-desktop',
      href: '/how-it-works',
      variant: 'primary'
    },
    {
      label: 'Request a Demo',
      icon: 'fa-handshake',
      href: '/contact',
      variant: 'primary'
    }
  ];
}
