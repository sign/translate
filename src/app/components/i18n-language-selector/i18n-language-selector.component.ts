import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';
import {ActivatedRoute, Router} from '@angular/router';
import {SITE_LANGUAGES} from '../../core/modules/transloco/languages';

@Component({
  selector: 'app-i18n-language-selector',
  templateUrl: './i18n-language-selector.component.html',
  styleUrls: ['./i18n-language-selector.component.scss'],
})
export class I18NLanguageSelectorComponent {
  current: string;

  languages = this.groupLanguages();

  constructor(private router: Router, private route: ActivatedRoute, private transloco: TranslocoService) {
    this.current = transloco.getActiveLang();
  }

  private groupLanguages() {
    const languageGroups = [];
    let lastGroup = {label: 'A', languages: []};
    let didCrossZ = false;
    for (const language of SITE_LANGUAGES) {
      let label = language.value.charAt(0);
      const isAZ = label.charCodeAt(0) > 64 && label.charCodeAt(0) < 91;
      if (!isAZ || didCrossZ) {
        didCrossZ = true;
        label = 'OTHER';
      }

      if (label !== lastGroup.label) {
        languageGroups.push(lastGroup);
        lastGroup = {label, languages: []};
      }
      lastGroup.languages.push(language);
    }

    languageGroups.push(lastGroup);
    return languageGroups;
  }

  async change(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    this.transloco.setActiveLang(lang);

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {lang},
      queryParamsHandling: 'merge',
    });
  }
}
