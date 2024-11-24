import {Component} from '@angular/core';
import {I18NLanguageSelectorComponent} from '../../../components/i18n-language-selector/i18n-language-selector.component';
import {RouterLink} from '@angular/router';
import {TranslocoDirective} from '@ngneat/transloco';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss',
  imports: [I18NLanguageSelectorComponent, RouterLink, TranslocoDirective],
})
export class LandingFooterComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
