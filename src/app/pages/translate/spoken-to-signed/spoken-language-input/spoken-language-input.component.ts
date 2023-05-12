import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounce, distinctUntilChanged, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {SetSpokenLanguageText} from '../../../../modules/translate/translate.actions';
import {Store} from '@ngxs/store';
import {TranslateStateModel} from '../../../../modules/translate/translate.state';
import {BaseComponent} from '../../../../components/base/base.component';

@Component({
  selector: 'app-spoken-language-input',
  templateUrl: './spoken-language-input.component.html',
  styleUrls: ['./spoken-language-input.component.scss'],
})
export class SpokenLanguageInputComponent extends BaseComponent implements OnInit {
  translate$!: Observable<TranslateStateModel>;
  text$!: Observable<string>;

  text = new FormControl();
  maxTextLength = 500;
  spokenLanguage: string;

  constructor(private store: Store) {
    super();
    this.translate$ = this.store.select<TranslateStateModel>(state => state.translate);
    this.text$ = this.store.select<string>(state => state.translate.spokenLanguageText);
  }

  ngOnInit() {
    this.translate$
      .pipe(
        tap(({spokenLanguage, detectedLanguage}) => (this.spokenLanguage = spokenLanguage || detectedLanguage)),
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

    // Changes from the store
    this.text$
      .pipe(
        tap(text => this.text.setValue(text)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
