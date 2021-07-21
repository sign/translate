import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {

  @Input() flags = false;
  @Input() hasLanguageDetection = false;
  @Input() languages: string[];
  @Input() translationKey: string;

  language: string;
  topLanguages: string[];

  selectedIndex = 0;

  ngOnInit(): void {
    this.topLanguages = this.languages.slice(0, 3);
    this.selectLanguage(this.languages[0]);
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
