import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from '@ngxs/store';
import {delay, Observable, switchMap} from 'rxjs';
import {TranslocoService} from '@ngneat/transloco';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent extends BaseComponent implements OnInit {
  @Select(state => state.translate.detectedLanguage) detectedLanguage$: Observable<string>;

  @Input() flags = false;
  @Input() hasLanguageDetection = false;
  @Input() languages: string[];
  @Input() translationKey: string;
  @Input() urlParameter: string;

  @Input() language: string;

  @Output() languageChange = new EventEmitter<string>();

  topLanguages: string[];
  selectedIndex = 0;

  displayNames: Intl.DisplayNames;
  langNames: {[lang: string]: string} = {};

  constructor(private transloco: TranslocoService) {
    super();
  }

  ngOnInit(): void {
    this.topLanguages = this.languages.slice(0, 3);

    const searchParams = 'window' in globalThis ? window.location.search : '';
    const urlParams = new URLSearchParams(searchParams);
    const initial = urlParams.get(this.urlParameter) || this.languages[0];
    this.selectLanguage(initial);

    this.transloco.langChanges$
      .pipe(
        // wait until relevant language file has been loaded
        switchMap(() => this.transloco.events$),
        filter(e => e.type === 'translationLoadSuccess' && e.payload.scope === this.translationKey),
        tap(() => this.setLangNames(this.transloco.getActiveLang())),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  langName(lang: string): string {
    if (this.displayNames && lang.length === 2) {
      const result = this.displayNames.of(lang.toUpperCase());
      if (result && result !== lang) {
        return result;
      }
    }

    // Fallback to predefined list
    return this.transloco.translate(`${this.translationKey}.${lang}`);
  }

  setLangNames(locale: string) {
    const type = this.translationKey === 'languages' ? 'language' : 'region';
    this.displayNames = new Intl.DisplayNames([locale], {type});
    if (this.displayNames.resolvedOptions().locale !== locale) {
      console.error('Failed to set language display names for locale', locale);
      delete this.displayNames;
    }

    for (const lang of this.languages) {
      this.langNames[lang] = this.langName(lang);
    }
  }

  selectLanguage(lang: string): void {
    if (lang === this.language) {
      return;
    }

    if (lang && !this.topLanguages.includes(lang)) {
      this.topLanguages.unshift(lang);
      this.topLanguages.pop();
    }

    // Update selected language
    this.language = lang;
    this.languageChange.emit(this.language);

    const index = this.topLanguages.indexOf(this.language);
    this.selectedIndex = index + Number(this.hasLanguageDetection);
  }

  selectLanguageIndex(index: number): void {
    if (index === 0 && this.hasLanguageDetection) {
      this.selectLanguage(null);
    } else {
      this.selectLanguage(this.topLanguages[index - Number(this.hasLanguageDetection)]);
    }
  }
}
