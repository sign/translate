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
import {addIcons} from 'ionicons';
import {swapHorizontal} from 'ionicons/icons';
import {IonButton, IonIcon} from '@ionic/angular/standalone';
import {LanguageSelectorComponent} from '../language-selector/language-selector.component';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslocoPipe} from '@ngneat/transloco';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@Component({
  selector: 'app-language-selectors',
  templateUrl: './language-selectors.component.html',
  styleUrls: ['./language-selectors.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, LanguageSelectorComponent, AsyncPipe, MatTooltip, TranslocoPipe],
})
export class LanguageSelectorsComponent extends BaseComponent implements OnInit {
  spokenToSigned$: Observable<boolean>;
  spokenLanguage$: Observable<string>;
  signedLanguage$: Observable<string>;
  detectedLanguage$: Observable<string>;

  @HostBinding('class.spoken-to-signed') spokenToSigned: boolean;

  constructor(private store: Store, public translation: TranslationService) {
    super();
    this.spokenToSigned$ = this.store.select<boolean>(state => state.translate.spokenToSigned);
    this.spokenLanguage$ = this.store.select<string>(state => state.translate.spokenLanguage);
    this.signedLanguage$ = this.store.select<string>(state => state.translate.signedLanguage);
    this.detectedLanguage$ = this.store.select<string>(state => state.translate.detectedLanguage);

    addIcons({swapHorizontal});
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
