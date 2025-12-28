import {Component, inject} from '@angular/core';
import {SetSpokenLanguage} from '../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {TranslationService} from '../../../modules/translate/translate.service';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-language-selectors',
  templateUrl: './language-selectors.component.html',
  styleUrls: ['./language-selectors.component.scss'],
  imports: [LanguageSelectorComponent, AsyncPipe],
})
export class LanguageSelectorsComponent {
  private store = inject(Store);
  translation = inject(TranslationService);

  spokenLanguage$: Observable<string>;

  constructor() {
    this.spokenLanguage$ = this.store.select<string>(state => state.translate.spokenLanguage);
  }

  setSpokenLanguage(lang: string): void {
    this.store.dispatch(new SetSpokenLanguage(lang));
  }
}
