import {Component} from '@angular/core';
import {I18NLanguageSelectorComponent} from '../../../components/i18n-language-selector/i18n-language-selector.component';
import {RouterLink} from '@angular/router';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: './landing-footer.component.scss',
  imports: [RouterLink, TranslocoDirective],
})
export class LandingFooterComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];
}
