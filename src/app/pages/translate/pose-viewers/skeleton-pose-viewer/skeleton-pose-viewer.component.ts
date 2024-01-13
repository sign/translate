import {AfterViewInit, Component, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Store} from '@ngxs/store';
import {MediaMatcher} from '@angular/cdk/layout';
import {PlayableVideoEncoder} from '../playable-video-encoder';

@Component({
  selector: 'app-skeleton-pose-viewer',
  templateUrl: './skeleton-pose-viewer.component.html',
  styleUrls: ['./skeleton-pose-viewer.component.scss'],
})
export class SkeletonPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;

  colorSchemeMedia!: MediaQueryList;

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
          pose.currentTime = 0; // Force time back to 0

          // startRecording is imperfect, specifically when the tab is out of focus.
          if (!PlayableVideoEncoder.isSupported()) {
            await this.startRecording(poseCanvas as any);
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Most reliable method to create a video from a canvas
    if (PlayableVideoEncoder.isSupported()) {
      let lastRendered = NaN;
      fromEvent(pose, 'render$')
        .pipe(
          tap(async () => {
            if (pose.currentTime === lastRendered) {
              // There are possibly redundant renders when video is paused or tab is out of focus
              return;
            }
            const poseCanvas = pose.shadowRoot.querySelector('canvas');
            const imageBitmap = await createImageBitmap(poseCanvas);
            await this.addCacheFrame(imageBitmap);
            lastRendered = pose.currentTime;
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe();
    }

    fromEvent(pose, 'ended$')
      .pipe(
        tap(async () => this.stopRecording()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.pauseInvisible();
  }

  pauseInvisible() {
    const pose = this.poseEl.nativeElement;

    // TODO: this should be on the current element, not document
    fromEvent(document, 'visibilitychange')
      .pipe(
        tap(async () => {
          if (document.visibilityState === 'visible') {
            await pose.play();
            if (this.mediaRecorder) {
              this.mediaRecorder.resume();
            }
          } else {
            await pose.pause();
            if (this.mediaRecorder) {
              this.mediaRecorder.pause();
            }
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
