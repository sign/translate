import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, distinctUntilChanged, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {Store} from '@ngxs/store';
import {
  CopySignedLanguageVideo,
  DownloadSignedLanguageVideo,
  SetSpokenLanguageText,
  ShareSignedLanguageVideo,
} from '../../../modules/translate/translate.actions';
import {PoseViewerSetting} from '../../../modules/settings/settings.state';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TranslateStateModel} from '../../../modules/translate/translate.state';
import {isIOS, isMacLike} from 'src/app/core/constants';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss'],
})
export class SpokenToSignedComponent {
  signWriting$!: Observable<string[]>;

  constructor(private store: Store) {
    this.signWriting$ = this.store.select<string[]>(state => state.translate.signWriting);
  }
}
