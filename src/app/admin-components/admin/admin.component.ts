import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/LoginService ';
import { Users } from '../../../models/User';
import { ICollection } from '../../../models/ICollection';
import { CommonModule, NgFor, NgIf } from '@angular/common';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  type: 'fixed' | 'collection';
  id?: number;
}

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  // Fixed navigation items
  fixedNavItems: NavItem[] = [
    {
      icon: 'fas fa-chart-line',
      label: 'Dashboard',
      route: '/admin',
      type: 'fixed',
    },
    {
      icon: 'fas fa-building',
      label: 'Companies',
      route: '/admin/companies',
      type: 'fixed',
    },
    {
      icon: 'fas fa-briefcase',
      label: 'Programs',
      route: '/admin/programs',
      type: 'fixed',
    },
    {
      icon: 'fas fa-users',
      label: 'Users',
      route: '/admin/users',
      type: 'fixed',
    },
    {
      icon: 'fas fa-user-graduate',
      label: 'Mentorship',
      route: '/admin/mentorship',
      type: 'fixed',
    },
    {
      icon: 'fas fa-cog',
      label: 'Settings',
      route: '/admin/settings',
      type: 'fixed',
    },
    {
      icon: 'fas fa-envelope',
      label: 'Email Templates',
      route: '/admin/email-templates',
      type: 'fixed',
    },
    {
      icon: 'fas fa-file-alt',
      label: 'Collections',
      route: '/admin/collections',
      type: 'fixed',
    },
  ];

  // Dynamic navigation items based on collections
  dynamicNavItems: NavItem[] = [];

  // All navigation items combined
  allNavItems: NavItem[] = [];

  user?: Users;
  collections: ICollection[] = [];
  isLoading = false;
  showAddCollectionModal = false;

  constructor(private loginService: LoginService) {
    this.user = this.loginService.userValue;
  }

  ngOnInit() {}

  // Get website ID as number
  get websiteId(): number {
    return Number(this.user?.website_id) || 1;
  }
}
