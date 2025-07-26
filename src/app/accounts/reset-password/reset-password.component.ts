import { Component } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '../../../models/User';
import { LoginService } from '../../../services/LoginService ';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ToastComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  user?: Users;
  errorMessage = '';
  showError = false;
  resetForm!: FormGroup;
  token: string = '';
  loaded = true;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator }
    );

    this.route.params.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.loadUserProfile(this.token);
      } else {
        this.user = this.loginService.userValue;
      }
    });
  }

  loadUserProfile(token: string) {
    this.loginService.getByToken(token).subscribe({
      next: (user: Users) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Invalid or expired token';
        this.showError = true;
      },
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.value.password;

    this.loginService
      .resetPassword({
        email: this.user?.email || '',
        newPassword: newPassword,
        website_id: this.user?.website_id || 0,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { reset: 'success' },
          });
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          this.errorMessage = 'Failed to reset password. Please try again.';
          this.showError = true;
        },
      });
  }
}
