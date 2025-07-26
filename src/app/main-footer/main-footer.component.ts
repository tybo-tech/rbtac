import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterLink, FooterContact, FooterSocial } from '../../models/main.ui';

@Component({
  selector: 'app-main-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './main-footer.component.html',
})
export class MainFooterComponent {
  brand = 'VentureFlow';
  tagline = 'Empower • Incubate • Grow';
  year = new Date().getFullYear();

  longDescription = `VentureFlow is a powerful multi-tenant platform built for incubators, accelerators, and development hubs to manage training, funding, mentorship, and track entrepreneur growth — all in one place.`;

  navLinks: FooterLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Login', href: '/login' },
  ];

  quickLinks: FooterLink[] = [
    { label: 'Start Free Trial', href: '/register' },
    { label: 'Explore Features', href: '/features' },
    { label: 'FAQs', href: '/faqs' },
  ];

  contacts: FooterContact[] = [
    { type: 'phone', value: '+27 84 252 9472', icon: 'fa-phone' },
    { type: 'email', value: 'info@ventureflow.app', icon: 'fa-envelope' },
    { type: 'address', value: 'South Africa', icon: 'fa-location-dot' },
  ];

  socials: FooterSocial[] = [
    { icon: 'fa-facebook-f', href: 'https://facebook.com/ventureflow' },
    { icon: 'fa-instagram', href: 'https://instagram.com/ventureflow' },
    { icon: 'fa-x-twitter', href: 'https://x.com/ventureflow' },
  ];
}
