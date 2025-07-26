import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/LoginService ';
import { Users } from '../../../models/User';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: Users | undefined;
  constructor(private userService: LoginService, private router: Router) {
    this.user = this.userService.userValue;
    if (!this.user) {
      this.router.navigate(['/login']);
    }
   
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }
}
