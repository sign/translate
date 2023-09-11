import {AfterViewInit, Component, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Store} from '@ngxs/store';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-skeleton-pose-viewer',
  templateUrl: './skeleton-pose-viewer.component.html',
  styleUrls: ['./skeleton-pose-viewer.component.scss'],
})
export class SkeletonPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;

  colorSchemeMedia!: MediaQueryList;

  background: string = '';

  constructor(store: Store, private mediaMatcher: MediaMatcher) {
    super(store);

    this.colorSchemeMedia = this.mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
  }

  ngAfterViewInit(): void {
    const pose = this.poseEl.nativeElement;

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(async () => {
          const poseCanvas = pose.shadowRoot.querySelector('canvas');
          await this.startRecording(poseCanvas as any);
          pose.currentTime = 0; // Force time back to 0

          // Some browsers videos can't have a transparent background
          const isTransparencySupported = 'chrome' in window; // transparency is currently not supported in firefox and safari
          if (this.mediaRecorder && !isTransparencySupported) {
            // Make the video background the same as the element's background
            const el = document.querySelector('app-signed-language-output');
            this.background = getComputedStyle(el).backgroundColor;
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(pose, 'ended$')
      .pipe(
        tap(async () => this.stopRecording()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
