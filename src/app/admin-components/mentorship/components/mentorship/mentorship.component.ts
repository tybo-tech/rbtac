import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mentorship',
  imports: [],
  templateUrl: './mentorship.component.html',
  styleUrl: './mentorship.component.scss'
})
export class MentorshipComponent  implements OnInit {
  // Mock stats for now
  totalTemplates = 5;
  totalSessions = 38;
  activePrograms = 3;
constructor(private router: Router) {}
  ngOnInit(): void {
    // TODO: Load real stats using CollectionDataService if needed
  }

  goToTemplates(): void {
    // Navigate or open the template list
    //mentorship/templates
    this.router.navigate(['/admin/mentorship/templates']);
  }

  goToSessions(): void {
    this.router.navigate(['/admin/mentorship/sessions']);
  }

  createNewTemplate(): void {
    this.router.navigate(['/admin/mentorship/templates/create']);
  }

  createNewSession(): void {
    this.router.navigate(['/admin/mentorship/pick-session-template']);
  }
}
