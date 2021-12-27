import {Component} from '@angular/core';
import {TranslationService} from '../../modules/translate/translate.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  pages = ['about', 'languages', 'contribute', 'tools'];
  legalPages = ['terms', 'privacy', 'licenses'];
}
