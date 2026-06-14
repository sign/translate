import {Component, HostBinding, inject, OnInit} from '@angular/core';
import {SetSignedLanguage, SetSpokenLanguage} from '../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {TranslationService} from '../../../modules/translate/translate.service';
import {BaseComponent} from '../../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';
import {addIcons} from 'ionicons';
import {arrowForward} from 'ionicons/icons';
import {IonIcon} from '@ionic/angular/standalone';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-language-selectors',
  templateUrl: './language-selectors.component.html',
  styleUrls: ['./language-selectors.component.scss'],
  imports: [LanguageSelectorComponent, AsyncPipe, IonIcon],
})
export class LanguageSelectorsComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  translation = inject(TranslationService);

  spokenToSigned$: Observable<boolean>;
  spokenLanguage$: Observable<string>;
  signedLanguage$: Observable<string>;

  @HostBinding('class.spoken-to-signed') spokenToSigned: boolean;

  constructor() {
    super();
    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
    this.spokenLanguage$ = this.store.select<string>(state => state.translate.spokenLanguage);
    this.signedLanguage$ = this.store.select<string>(state => state.translate.signedLanguage);

    addIcons({arrowForward});
  }

  ngOnInit() {
    this.spokenToSigned$
      .pipe(
        tap(spokenToSigned => {
          this.spokenToSigned = spokenToSigned;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  setSignedLanguage(lang: string): void {
    this.store.dispatch(new SetSignedLanguage(lang));
  }

  setSpokenLanguage(lang: string): void {
    this.store.dispatch(new SetSpokenLanguage(lang));
  }
}
