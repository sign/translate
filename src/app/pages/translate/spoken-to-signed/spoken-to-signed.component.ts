import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BaseComponent} from '../../../components/base/base.component';
import {debounce, distinctUntilChanged, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {interval} from 'rxjs';
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
export class SpokenToSignedComponent extends BaseComponent implements OnInit {
  poseViewerSetting$ = this.store.select<PoseViewerSetting>(state => state.settings.poseViewer);
  translate$ = this.store.select<TranslateStateModel>(state => state.translate);
  text$ = this.store.select<string>(state => state.translate.spokenLanguageText);
  signWriting$ = this.store.select<string[]>(state => state.translate.signWriting);
  pose$ = this.store.select<string>(state => state.translate.signedLanguagePose);
  video$ = this.store.select<string>(state => state.translate.signedLanguageVideo);

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

  playVideoIfPaused(event: MouseEvent): void {
    const video = event.target as HTMLPoseViewerElement;
    if (video.paused) {
      video.play().then().catch();
    }
  }
}
