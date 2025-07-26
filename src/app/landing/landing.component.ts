import { Component } from '@angular/core';
import { HeroComponent } from '../home-sections/hero/hero.component';
import { WhatWeOfferComponent } from '../home-sections/what-we-offer/what-we-offer.component';
import { IntroComponent } from '../home-sections/intro/intro.component';
import { HowItWorksComponent } from '../home-sections/how-it-works/how-it-works.component';
import { MainTestimonialsComponent } from '../home-sections/main-testimonials/main-testimonials.component';
import { MainPricingSectionComponent } from '../home-sections/main-pricing-section/main-pricing-section.component';
import { MainCtaComponent } from '../home-sections/main-cta/main-cta.component';

@Component({
  selector: 'app-landing',
  imports: [
    HeroComponent,
    WhatWeOfferComponent,
    IntroComponent,
    HowItWorksComponent,
    MainTestimonialsComponent,
    MainPricingSectionComponent,
    MainCtaComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {}
