// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GoogleUser } from '../../../models/User';
import { LoginService } from '../../../services/LoginService ';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ToastComponent, CommonModule, ReactiveFormsModule,RouterModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showError = false;
  errorMessage = '';
  loaded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username, password).subscribe(
        (user) => {
          this.loginService.updateUser(user);
          user.role.toLowerCase() === 'admin' &&
            this.router.navigate(['/projects']);
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
