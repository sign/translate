import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Store} from '@ngxs/store';
import {switchMap} from 'rxjs';
import {TranslocoService} from '@ngneat/transloco';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';
import {IANASignedLanguages} from '../../../core/helpers/iana/languages';

const IntlTypeMap: {[key: string]: Intl.DisplayNamesType} = {languages: 'language', countries: 'region'};

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent extends BaseComponent implements OnInit, OnChanges {
  detectedLanguage: string;

  @Input() flags = false;
  @Input() hasLanguageDetection = false;
  @Input() languages: string[];
  @Input() translationKey: string;

  @Input() language: string | null;

  @Output() languageChange = new EventEmitter<string>();

  topLanguages: string[];
  selectedIndex = 0;

  displayNames: Intl.DisplayNames;
  langNames: {[lang: string]: string} = {};
  langCountries: {[lang: string]: string} = {};

  constructor(private store: Store, private transloco: TranslocoService) {
    super();
  }

  ngOnInit(): void {
    if (!this.language) {
      this.selectLanguage(this.languages[0]);
    }

    // Initialize langNames, relevant for SSR
    this.setLangNames(this.transloco.getActiveLang());
    this.transloco.langChanges$
      .pipe(
        // wait until relevant language file has been loaded
        switchMap(() => this.transloco.events$),
        filter(e => e.type === 'translationLoadSuccess' && e.payload.scope === this.translationKey),
        tap(() => this.setLangNames(this.transloco.getActiveLang())),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.setLangCountries();

    // Get detected language
    this.store
      .select<string>(state => state.translate.detectedLanguage)
      .pipe(
        tap(detectedLanguage => (this.detectedLanguage = detectedLanguage)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.language) {
      this.selectLanguage(changes.language.currentValue);
    }
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
    if (this.translationKey in IntlTypeMap) {
      this.displayNames = new Intl.DisplayNames([locale], {type: IntlTypeMap[this.translationKey]});
      if (this.displayNames.resolvedOptions().locale !== locale) {
        console.error('Failed to set language display names for locale', locale);
        delete this.displayNames;
      }
    }

    for (const lang of this.languages) {
      this.langNames[lang] = this.langName(lang);
    }
  }

  setLangCountries() {
    const key = this.translationKey === 'languages' ? 'language' : 'signed';
    for (const lang of this.languages) {
      const match = IANASignedLanguages.find(l => l[key] === lang);
      this.langCountries[lang] = match?.country ?? 'xx';
    }

    // World flag
    this.langCountries.ils = 'ils';
  }

  selectLanguage(lang: string): void {
    if (!this.topLanguages) {
      this.topLanguages = this.languages.slice(0, 3);
    }

    if (lang !== this.language) {
      // Update selected language
      this.language = lang;
      this.languageChange.emit(this.language);
    }

    if (lang && !this.topLanguages.includes(lang)) {
      this.topLanguages.unshift(lang);
      this.topLanguages.pop();
    }

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
