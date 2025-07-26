import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

@Component({
  selector: 'app-main-testimonials',
  imports: [CommonModule],
  templateUrl: './main-testimonials.component.html',
  styleUrl: './main-testimonials.component.scss',
})
export class MainTestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      name: 'Thabo M.',
      role: 'Program Director',
      company: 'Startup Launchpad',
      image: 'https://avatar.iran.liara.run/public/61',
      quote:
        'VentureFlow completely transformed how we manage our incubator. Everything from onboarding to grant tracking is now seamless.',
    },
    {
      name: 'Nadine L.',
      role: 'Impact Manager',
      company: 'AccelerateHub',
      image: 'https://avatar.iran.liara.run/public/60',
      quote:
        'We used to juggle spreadsheets, emails, and forms. VentureFlow brought it all under one roof — it’s a total game-changer.',
    },
    {
      name: 'Sipho D.',
      role: 'Operations Lead',
      company: 'FounderNest',
      image: 'https://avatar.iran.liara.run/public/55',
      quote:
        'What used to take days now takes minutes. Our team can focus on supporting entrepreneurs instead of chasing data.',
    },
  ];
}
