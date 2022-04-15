import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, distinct, distinctUntilChanged, takeUntil, tap} from 'rxjs/operators';
import {interval, Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {
  CopySignedLanguageVideo,
  DownloadSignedLanguageVideo,
  SetSpokenLanguageText,
  ShareSignedLanguageVideo,
} from '../../../modules/translate/translate.actions';
import {PoseViewerSetting} from '../../../modules/settings/settings.state';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {TranslateStateModel} from '../../../modules/translate/translate.state';

@Component({
  selector: 'app-spoken-to-signed',
  templateUrl: './spoken-to-signed.component.html',
  styleUrls: ['./spoken-to-signed.component.scss'],
})
export class SpokenToSignedComponent extends BaseComponent implements OnInit {
  @Select(state => state.settings.poseViewer) poseViewerSetting$: Observable<PoseViewerSetting>;
  @Select(state => state.translate) translate$: Observable<TranslateStateModel>;
  @Select(state => state.translate.spokenLanguageText) text$: Observable<string>;
  @Select(state => state.translate.signWriting) signWriting$: Observable<string[]>;
  @Select(state => state.translate.signedLanguagePose) pose$: Observable<string>;
  @Select(state => state.translate.signedLanguageVideo) video$: Observable<string>;

  videoUrl: SafeUrl;
  spokenLanguage: string;

  text = new FormControl();
  maxTextLength = 500;

  constructor(private store: Store, private domSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit(): void {
    this.translate$
      .pipe(
        tap(({spokenLanguage, detectedLanguage}) => (this.spokenLanguage = spokenLanguage || detectedLanguage)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Local text changes
    this.text.valueChanges
      .pipe(
        debounce(() => interval(500)),
        distinctUntilChanged(),
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

    this.video$
      .pipe(
        tap(url => {
          this.videoUrl = url ? this.domSanitizer.bypassSecurityTrustUrl(url) : null;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  shareIcon(): string {
    const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
    return isIOS || isMacLike ? 'ios_share' : 'share';
  }

  copyTranslation(): void {
    this.store.dispatch(CopySignedLanguageVideo);
  }

  downloadTranslation(): void {
    this.store.dispatch(DownloadSignedLanguageVideo);
  }

  shareTranslation(): void {
    this.store.dispatch(ShareSignedLanguageVideo);
  }
}
