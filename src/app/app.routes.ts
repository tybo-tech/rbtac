import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { OverviewComponent } from './admin-components/overview/overview.component';
import { AdminComponent } from './admin-components/admin/admin.component';
import { LoginComponent } from './accounts/login/login.component';
import { SignUpComponent } from './accounts/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './accounts/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './accounts/reset-password/reset-password.component';
import { CollectionCanvasComponent } from './collections-component/collection-canvas/collection-canvas.component';
import { CompaniesComponent } from './admin-components/companies/companies/companies.component';
import { UsersComponent } from './admin-components/users/users/users.component';
import { ProgramsComponent } from './admin-components/programs/programs/programs.component';
import { ProgramStagesComponent } from './admin-components/program-stages/program-stages.component';
// import { ProgramStagesComponent } from './admin-components/program-stages/program-stages.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: LandingComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordComponent,
      },
    ],
  },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'companies',
        component: CompaniesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'programs',
        component: ProgramsComponent,
      },
      {
        path: 'programs/:id/stages',
       component: ProgramStagesComponent
      },
      {
        path: 'collections',
        component: CollectionCanvasComponent,
      },
      {
        path: 'collections/:collectionId',
        component: CollectionCanvasComponent,
      },
      {
        path: 'collections/:collectionId/:viewId',
        component: CollectionCanvasComponent,
      },
    ],
  },
];
