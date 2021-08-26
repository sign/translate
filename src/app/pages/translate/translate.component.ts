import {Component, HostBinding, OnInit} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {SetSetting} from '../../modules/settings/settings.actions';
import {Observable} from 'rxjs';
import {BaseComponent} from '../../components/base/base.component';
import {takeUntil, tap} from 'rxjs/operators';
import {InputMode} from '../../modules/translate/translate.state';
import {FlipTranslationDirection, SetInputMode, SetSignedLanguage, SetSpokenLanguage} from '../../modules/translate/translate.actions';
import {TranslocoService} from '@ngneat/transloco';


@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent extends BaseComponent implements OnInit {
  @Select(state => state.translate.spokenToSigned) spokenToSigned$: Observable<boolean>;
  @Select(state => state.translate.inputMode) inputMode$: Observable<InputMode>;

  @HostBinding('class.spoken-to-signed') spokenToSigned: boolean;


  signedLanguages = ['us', 'gb', 'fr', 'es', 'sy', 'by', 'bg', 'cn', 'hr', 'cz', 'dk', 'in', 'nz', 'ee', 'fi', 'at', 'de', 'cy', 'gr', 'is',
    'isl', 'it', 'jp', 'lv', 'lt', 'ir', 'pl', 'br', 'pt', 'ro', 'ru', 'sk', 'ar', 'cl', 'cu', 'mx', 'se', 'tr', 'ua', 'pk'];

  spokenLanguages = ['en', 'fr', 'es', 'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'co',
    'hr', 'cs', 'da', 'nl', 'eo', 'et', 'tl', 'fi', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 'hu', 'is',
    'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml',
    'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si',
    'sk', 'sl', 'so', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'
  ];


  constructor(private store: Store, private transloco: TranslocoService) {
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

