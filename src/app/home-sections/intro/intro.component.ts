import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
})
export class IntroComponent {
  aboutHeading = 'Built by Tybo Solutions';
  aboutText = `VentureFlow is proudly built by Tybo Solutions — a forward-thinking South African tech company focused on empowering ecosystems of growth. 
  With deep roots in building scalable digital tools, our mission is to help incubators, accelerators, and development hubs run smarter programs, 
  track impact, and unlock entrepreneurial potential at scale.`;
  ctaLabel = 'Learn More About Tybo Solutions';
}
