import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounce, distinctUntilChanged, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {
  SetSpokenLanguage,
  SetSpokenLanguageText,
  SuggestAlternativeText,
} from '../../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';
import {TranslateStateModel} from '../../../../modules/translate/translate.state';
import {BaseComponent} from '../../../../components/base/base.component';
import {IonButton, IonButtons, IonIcon, IonTextarea, IonToolbar} from '@ionic/angular/standalone';
import {SpeechToTextComponent} from '../../../../components/speech-to-text/speech-to-text.component';
import {TranslocoDirective, TranslocoPipe} from '@jsverse/transloco';
import {addIcons} from 'ionicons';
import {addOutline, sparkles} from 'ionicons/icons';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {TextToSpeechComponent} from '../../../../components/text-to-speech/text-to-speech.component';
import {DesktopTextareaComponent} from './desktop-textarea/desktop-textarea.component';

@Component({
  selector: 'app-spoken-language-input',
  templateUrl: './spoken-language-input.component.html',
  styleUrls: ['./spoken-language-input.component.scss'],
  imports: [
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTextarea,
    DesktopTextareaComponent,
    SpeechToTextComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    DecimalPipe,
    TextToSpeechComponent,
    AsyncPipe,
    TranslocoDirective,
  ],
})
export class SpokenLanguageInputComponent extends BaseComponent implements OnInit {
  private store = inject(Store);

  translate$!: Observable<TranslateStateModel>;
  text$!: Observable<string>;
  normalizedText$!: Observable<string>;

  text = new FormControl();
  maxTextLength = 500;
  detectedLanguage!: string;
  spokenLanguage!: string;

  @Input() isMobile = false;

  constructor() {
    super();
    this.translate$ = this.store.select<TranslateStateModel>(state => state.translate);
    this.text$ = this.store.select<string>(state => state.translate.spokenLanguageText);
    this.normalizedText$ = this.store.select<string>(state => state.translate.normalizedSpokenLanguageText);

    addIcons({sparkles, addOutline});
  }

  ngOnInit() {
    this.translate$
      .pipe(
        tap(({spokenLanguage, detectedLanguage}) => {
          this.detectedLanguage = detectedLanguage;
          this.spokenLanguage = spokenLanguage ?? detectedLanguage;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Local text changes
    this.text.valueChanges
      .pipe(
        debounce(() => interval(300)),
        skipWhile(text => !text), // Don't run on empty text, on app launch
        distinctUntilChanged((a, b) => a.trim() === b.trim()),
        tap(text => this.store.dispatch(new SetSpokenLanguageText(text))),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.text.valueChanges
      .pipe(
        debounce(() => interval(1000)),
        distinctUntilChanged((a, b) => a.trim() === b.trim()),
        tap(text => this.store.dispatch(new SuggestAlternativeText())),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Changes from the store
    this.text$
      .pipe(
        tap(text => this.text.setValue(text)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  setText(text: string) {
    this.store.dispatch(new SetSpokenLanguageText(text));
  }

  setDetectedLanguage() {
    this.store.dispatch(new SetSpokenLanguage(this.detectedLanguage));
  }
}
