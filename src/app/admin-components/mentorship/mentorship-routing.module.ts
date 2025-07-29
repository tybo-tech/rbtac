import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import sub-components
import { MentorshipOverviewComponent } from './components/mentorship-overview/mentorship-overview.component';
import { MentorshipTemplateComponent } from './components/mentorship-template/mentorship-template.component';
import { MentorshipSessionComponent } from './components/mentorship-session/mentorship-session.component';
import { MentorshipTaskComponent } from './components/mentorship-task/mentorship-task.component';
import { MentorshipAnalyticsComponent } from './components/mentorship-analytics/mentorship-analytics.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    component: MentorshipOverviewComponent
  },
  {
    path: 'templates',
    component: MentorshipTemplateComponent
  },
  {
    path: 'sessions',
    component: MentorshipSessionComponent
  },
  {
    path: 'tasks',
    component: MentorshipTaskComponent
  },
  {
    path: 'analytics',
    component: MentorshipAnalyticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorshipRoutingModule { }
