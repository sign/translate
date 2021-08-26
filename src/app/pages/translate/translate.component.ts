import {Component, HostBinding, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {SetSetting} from '../../modules/settings/settings.actions';
import {Observable} from 'rxjs';
import {BaseComponent} from '../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';
import {InputMode} from '../../modules/translate/translate.state';
import {FlipTranslationDirection, SetInputMode, SetSignedLanguage, SetSpokenLanguage} from '../../modules/translate/translate.actions';
import {TranslocoService} from '@ngneat/transloco';
import {TranslationService} from '../../modules/translate/translate.service';


@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent extends BaseComponent implements OnInit {
  @Select(state => state.translate.spokenToSigned) spokenToSigned$: Observable<boolean>;
  @Select(state => state.translate.inputMode) inputMode$: Observable<InputMode>;

  @HostBinding('class.spoken-to-signed') spokenToSigned: boolean;


  constructor(private store: Store, private transloco: TranslocoService, public translation: TranslationService) {
    super();

    // Default settings
    this.store.dispatch([
      new SetSetting('receiveVideo', true),
      new SetSetting('detectSign', false),
      new SetSetting('drawPose', true),
      new SetSetting('poseViewer', 'pose'),
    ]);
  }

  ngOnInit(): void {
    this.transloco.events$.pipe(
      tap(() => {
        document.title = this.transloco.translate('translate.title');

        const descriptionEl = document.head.children.namedItem('description');
        if (descriptionEl) {
          descriptionEl.setAttribute('content', this.transloco.translate('translate.description'));
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    this.spokenToSigned$.pipe(
      tap((spokenToSigned) => this.spokenToSigned = spokenToSigned),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }


  setSignedLanguage(lang: string): void {
    this.store.dispatch(new SetSignedLanguage(lang));
  }

  setSpokenLanguage(lang: string): void {
    this.store.dispatch(new SetSpokenLanguage(lang));
  }

  setInputMode(mode: InputMode): void {
    this.store.dispatch(new SetInputMode(mode));
  }

  swapLanguages(): void {
    this.store.dispatch(FlipTranslationDirection);
  }
}

