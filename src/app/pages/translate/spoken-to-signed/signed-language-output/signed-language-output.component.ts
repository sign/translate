import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PoseViewerSetting} from '../../../../modules/settings/settings.state';
import {Store} from '@ngxs/store';
import {takeUntil, tap} from 'rxjs/operators';
import {ShareSignedLanguageVideo} from '../../../../modules/translate/translate.actions';
import {FrameCacheService} from '../../../../core/services/frame-cache.service';
import {TranslateState, TranslateStateModel} from '../../../../modules/translate/translate.state';
import {BaseComponent} from '../../../../components/base/base.component';
import {IonButton, IonIcon, IonSpinner} from '@ionic/angular/standalone';
import {AvatarPoseViewerComponent} from '../../pose-viewers/avatar-pose-viewer/avatar-pose-viewer.component';
import {SkeletonPoseViewerComponent} from '../../pose-viewers/skeleton-pose-viewer/skeleton-pose-viewer.component';
import {HumanPoseViewerComponent} from '../../pose-viewers/human-pose-viewer/human-pose-viewer.component';
import {ShareDialogComponent} from '../../../../components/share-dialog/share-dialog.component';
import {TranslocoPipe} from '@jsverse/transloco';
import {AsyncPipe} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {addIcons} from 'ionicons';
import {downloadOutline, linkOutline, shareOutline, shareSocialOutline} from 'ionicons/icons';

@Component({
  selector: 'app-signed-language-output',
  templateUrl: './signed-language-output.component.html',
  styleUrls: ['./signed-language-output.component.scss'],
  imports: [
    IonButton,
    IonSpinner,
    AvatarPoseViewerComponent,
    SkeletonPoseViewerComponent,
    HumanPoseViewerComponent,
    ShareDialogComponent,
    TranslocoPipe,
    AsyncPipe,
    MatTooltipModule,
    IonIcon,
  ],
})
export class SignedLanguageOutputComponent extends BaseComponent implements OnInit {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);
  frameCache = inject(FrameCacheService);

  poseViewerSetting$!: Observable<PoseViewerSetting>;
  pose$!: Observable<string>;

  signedLanguageReady = false;
  isLoading = false;
  isMobile: boolean;
  shareDialogUrl: string | null = null;
  private text = '';
  private progressRafId: number | null = null;

  constructor() {
    super();

    this.poseViewerSetting$ = this.store.select<PoseViewerSetting>(state => state.settings.poseViewer);
    this.pose$ = this.store.select<string>(state => state.translate.signedLanguagePose);

    this.isMobile =
      'navigator' in globalThis &&
      navigator.maxTouchPoints > 0 &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    addIcons({downloadOutline, linkOutline, shareOutline, shareSocialOutline});
  }

  ngOnInit(): void {
    this.store
      .select<string>(state => state.translate.signedLanguageVideo)
      .pipe(
        tap(video => {
          this.signedLanguageReady = !!video;
          this.updateLoadingState();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.store
      .select<string>(state => state.translate.spokenLanguageText)
      .pipe(
        tap(text => {
          this.text = text;
          this.updateLoadingState();
          if (text.trim()) {
            this.startProgressTracking();
          } else {
            this.stopProgressTracking();
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  private updateLoadingState(): void {
    this.isLoading = !!this.text.trim() && !this.signedLanguageReady;
    this.cdr.detectChanges();
  }

  private startProgressTracking(): void {
    if (this.progressRafId !== null) return;
    const tick = () => {
      this.cdr.detectChanges();
      if (this.frameCache.encoding) {
        this.progressRafId = requestAnimationFrame(tick);
      } else {
        this.progressRafId = null;
      }
    };
    this.progressRafId = requestAnimationFrame(tick);
  }

  private stopProgressTracking(): void {
    if (this.progressRafId !== null) {
      cancelAnimationFrame(this.progressRafId);
      this.progressRafId = null;
    }
  }

  downloadTranslation(): void {
    const blob = this.frameCache.blob;
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const text = this.store.selectSnapshot<string>(state => state.translate.spokenLanguageText);
    const ext = '.' + blob.type.split('/').pop();
    const filename =
      encodeURIComponent(text)
        .replaceAll('%20', '-')
        .slice(0, 250 - ext.length) + ext;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  shareTranslation(): void {
    if (this.isMobile) {
      this.store.dispatch(ShareSignedLanguageVideo);
    } else {
      const state = this.store.selectSnapshot<TranslateStateModel>(state => state.translate);
      this.shareDialogUrl = TranslateState.buildShareUrl(state);
    }
  }

  override ngOnDestroy(): void {
    this.stopProgressTracking();
    super.ngOnDestroy();
  }
}
