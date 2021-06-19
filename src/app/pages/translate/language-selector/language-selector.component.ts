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


  ngOnInit(): void {
    this.topLanguages = this.languages.slice(0, 3);
    this.language = this.languages[0];
  }

  selectedIndex(): number {
    const index = this.topLanguages.indexOf(this.language);
    return this.hasLanguageDetection ? index + 1 : index;
  }
}
