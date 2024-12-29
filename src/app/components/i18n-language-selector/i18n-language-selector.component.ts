import {Component, inject} from '@angular/core';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {ActivatedRoute, Router} from '@angular/router';
import {SITE_LANGUAGES} from '../../core/modules/transloco/languages';

@Component({
  selector: 'app-i18n-language-selector',
  templateUrl: './i18n-language-selector.component.html',
  styleUrls: ['./i18n-language-selector.component.scss'],
  imports: [TranslocoPipe],
})
export class I18NLanguageSelectorComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  current = this.transloco.getActiveLang();

  languages = this.groupLanguages();

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
