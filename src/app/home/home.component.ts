import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavComponent } from "../main-nav/main-nav.component";
import { MainFooterComponent } from "../main-footer/main-footer.component";

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, MainNavComponent, MainFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
