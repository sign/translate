import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {isIOS, isMacLike} from '../../../../core/constants';
import {
  CopySignedLanguageVideo,
  DownloadSignedLanguageVideo,
  ShareSignedLanguageVideo,
} from '../../../../modules/translate/translate.actions';
import {BaseComponent} from '../../../../components/base/base.component';
import {Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-signed-language-output',
  templateUrl: './signed-language-output.component.html',
  styleUrls: ['./signed-language-output.component.scss'],
})
export class SignedLanguageOutputComponent extends BaseComponent implements OnInit {
  poseViewerSetting$!: Observable<PoseViewerSetting>;
  pose$!: Observable<string>;
  video$!: Observable<string>;

  videoUrl: SafeUrl;
  isSharingSupported: boolean;

  constructor(private store: Store, private domSanitizer: DomSanitizer) {
    super();

    this.poseViewerSetting$ = this.store.select<PoseViewerSetting>(state => state.settings.poseViewer);
    this.pose$ = this.store.select<string>(state => state.translate.signedLanguagePose);
    this.video$ = this.store.select<string>(state => state.translate.signedLanguageVideo);

    this.isSharingSupported = Capacitor.isNativePlatform() || ('navigator' in globalThis && 'share' in navigator);
  }

  ngOnInit(): void {
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
    return isIOS || isMacLike ? 'share-outline' : 'share-social-outline';
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
