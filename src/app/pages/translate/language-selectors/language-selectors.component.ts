import {Component, HostBinding, OnInit} from '@angular/core';
import {
  FlipTranslationDirection,
  SetSignedLanguage,
  SetSpokenLanguage,
} from '../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {TranslationService} from '../../../modules/translate/translate.service';
import {BaseComponent} from '../../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-language-selectors',
  templateUrl: './language-selectors.component.html',
  styleUrls: ['./language-selectors.component.scss'],
})
export class LanguageSelectorsComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenLanguage$: Observable<boolean>;
  detectedLanguage$: Observable<boolean>;

  @HostBinding('class.spoken-to-signed') spokenToSigned: boolean;

  constructor(private store: Store, public translation: TranslationService) {
    super();
    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
    this.spokenLanguage$ = this.store.select<boolean>(state => state.translate.spokenLanguage);
    this.detectedLanguage$ = this.store.select<boolean>(state => state.translate.detectedLanguage);
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

  swapLanguages(): void {
    this.store.dispatch(FlipTranslationDirection);
  }
}
