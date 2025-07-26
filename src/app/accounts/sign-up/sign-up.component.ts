import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../services/LoginService ';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  imports: [ToastComponent, ReactiveFormsModule, CommonModule,RouterModule],
})
export class SignUpComponent {
  loginForm: FormGroup;
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone_number: [''],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, phone_number, email } = this.loginForm.value;
      this.loginService
        .register(
          username,
          email,
          password,
          'admin'
        )
        .subscribe(
          (user) => {
            this.loginService.updateUser(user);
            user.role === 'admin' && this.router.navigate(['/projects']);
          },
          (error) => {
            console.error(error);
            this.showError = true;
            this.errorMessage = error;
          }
        );
    } else {
    }
  }

}
