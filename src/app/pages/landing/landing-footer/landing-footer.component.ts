import {Component} from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss',
})
export class LandingFooterComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
