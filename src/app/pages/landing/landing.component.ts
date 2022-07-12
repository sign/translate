import {Component} from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  pages: string[] = ['about', 'languages', 'contribute', 'tools'];
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
