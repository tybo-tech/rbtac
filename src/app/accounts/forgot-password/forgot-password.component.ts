import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../shared/toast/toast.component';
import { LoginService } from '../../../services/LoginService ';
import { Users } from '../../../models/User';
import { EmailService } from '../../../services/email.service';
import { IEmail } from '../../../models/Email';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [CommonModule, ReactiveFormsModule, ToastComponent],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  showError = false;
  errorMessage = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private emailService: EmailService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.forgotForm.get('email')!;
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
    this.loading = true;
    const email = this.email.value;
    const token = this.loginService.generateToken();

    // get user by email
    this.loginService.checkEmail(email).subscribe(
      (user) => {
        if (!user || !user.email) {
          this.loading = false;
          this.showError = true;
          this.errorMessage = 'Email not found. Please check and try again.';
          return;
        }
        // Proceed to send reset password email
        this.sendResetPasswordEmail(user, token);
      },
      (error) => {
        this.loading = false;
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    );
  }
  sendResetPasswordEmail(user: Users, token: string) {
    if (!user) return;
    if (!user.metadata)
      user.metadata = {
        source: 'web',
      };

    user.metadata.token = token;
    this.loginService.update(user).subscribe({
      next: () => {
        const host = window.location.host;
        const resetLink = `https://${host}/reset-password/${token}`;
        const message = `
        <p>Hi ${user.name || user.email},</p>
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        `;

        const email: IEmail = {
          message,
          recipient_email: user.email,
          subject: 'Reset Your Password',
          recipient_name: user.name || user.email,
          sender_name: 'VentureFlow Support Team',
        };
        this.emailService.send(email).subscribe({
          next: () => {
            this.success = true;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.showError = true;
            this.errorMessage = 'Failed to send reset password email.';
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.showError = true;
        this.errorMessage = 'Failed to update user metadata.';
      },
    });
  }
}
