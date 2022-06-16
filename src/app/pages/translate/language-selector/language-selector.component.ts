import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
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

  ngOnInit(): void {
    this.topLanguages = this.languages.slice(0, 3);

    const urlParams = new URLSearchParams(window.location.search);
    const initial = urlParams.get(this.urlParameter) || this.languages[0];
    this.selectLanguage(initial);
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
