import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/LoginService ';
import { Users } from '../../../models/User';
import { ICollection } from '../../../models/ICollection';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  type: 'fixed' | 'collection';
  id?: number;
}

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet],
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
  ];

  // Dynamic navigation items based on collections
  dynamicNavItems: NavItem[] = [];

  // All navigation items combined
  allNavItems: NavItem[] = [];

  user?: Users;
  collections: ICollection[] = [];
  isLoading = false;
  showAddCollectionModal = false;

  constructor(
    private loginService: LoginService
  ) {
    this.user = this.loginService.userValue;
  }

  ngOnInit() {
  }

  // Get website ID as number
  get websiteId(): number {
    return Number(this.user?.website_id) || 1;
  }
}
