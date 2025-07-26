import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { INav } from '../../models/main.ui';

@Component({
  selector: 'app-main-nav',
  imports: [RouterModule, CommonModule],
  templateUrl: './main-nav.component.html',
})
export class MainNavComponent {
   brand = 'VentureFlow';
  logo = 'logo.svg'; // Update if branding changes

  navItems: INav[] = [
    { name: 'Home', link: '/', icon: 'fa-home', id: 'home', roles: ['guest', 'admin', 'user'] },
    { name: 'Features', link: '/features', icon: 'fa-cogs', id: 'features', roles: ['guest'] },
    { name: 'Pricing', link: '/pricing', icon: 'fa-money-bill', id: 'pricing', roles: ['guest'] },
    { name: 'Contact', link: '/contact', icon: 'fa-envelope', id: 'contact', roles: ['guest'] },
    { name: 'Login', link: '/login', icon: 'fa-sign-in-alt', id: 'login', roles: ['guest'] },
  ];

  showMobileMenu = false;
  user?: any;

  constructor() {}

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }
}
