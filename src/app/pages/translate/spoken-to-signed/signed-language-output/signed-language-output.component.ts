import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {
  CopySignedLanguageVideo,
  DownloadSignedLanguageVideo,
  ShareSignedLanguageVideo,
} from '../../../../modules/translate/translate.actions';
import {BaseComponent} from '../../../../components/base/base.component';
import {Capacitor} from '@capacitor/core';
import {getMediaSourceClass} from '../../pose-viewers/playable-video-encoder';

@Component({
  selector: 'app-signed-language-output',
  templateUrl: './signed-language-output.component.html',
  styleUrls: ['./signed-language-output.component.scss'],
})
export class SignedLanguageOutputComponent extends BaseComponent implements OnInit {
  poseViewerSetting$!: Observable<PoseViewerSetting>;
  pose$!: Observable<string>;
  video$!: Observable<string>;

  videoUrl: string;
  safeVideoUrl: SafeUrl;
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
          this.videoUrl = url;
          this.safeVideoUrl = url ? this.domSanitizer.bypassSecurityTrustUrl(url) : null;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
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
    const video = event.target as HTMLVideoElement;
    if (video.paused) {
      video.play().then().catch();
    }
  }

  async createVideoMediaSource() {
    const res = await fetch(this.videoUrl);
    const blob = await res.blob();

    const mediaSourceClass = getMediaSourceClass();
    if (!mediaSourceClass) {
      return null;
    }

    const mediaSource = new mediaSourceClass();
    mediaSource.addEventListener('sourceopen', async () => {
      const sourceBuffer = mediaSource.addSourceBuffer(blob.type);
      sourceBuffer.addEventListener('updateend', () => {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();
        }
      });
      sourceBuffer.appendBuffer(await blob.arrayBuffer());
    });

    return mediaSource;
  }

  async onVideoError(event: ErrorEvent) {
    // https://github.com/sign/translate/issues/127
    if (this.safeVideoUrl === null) {
      return;
    }

    const video = event.target as HTMLVideoElement;
    if (!video.srcObject) {
      // Fallback behavior to make sure the browser can play the video
      this.safeVideoUrl = null;
      video.disableRemotePlayback = true; // Disable AirPlay, must be used for ManagedMediaSource
      video.srcObject = await this.createVideoMediaSource();
    }
  }
}
