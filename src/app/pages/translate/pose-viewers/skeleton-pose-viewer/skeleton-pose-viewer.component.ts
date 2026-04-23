import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {PlayableVideoEncoder} from '../playable-video-encoder';

@Component({
  selector: 'app-skeleton-pose-viewer',
  templateUrl: './skeleton-pose-viewer.component.html',
  styleUrls: ['./skeleton-pose-viewer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SkeletonPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;

  private recordingCanvas: HTMLCanvasElement | null = null;

  ngAfterViewInit(): void {
    const pose = this.poseEl().nativeElement;

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(async () => {
          const poseCanvas = pose.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
          pose.currentTime = 0; // Force time back to 0

          if (!PlayableVideoEncoder.isSupported()) {
            // Create a compositing canvas for watermarked MediaRecorder capture
            this.recordingCanvas = document.createElement('canvas');
            this.recordingCanvas.width = poseCanvas.width;
            this.recordingCanvas.height = poseCanvas.height;
            await this.startRecording(this.recordingCanvas);
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    let lastRendered = NaN;
    fromEvent(pose, 'render$')
      .pipe(
        tap(async () => {
          if (pose.currentTime === lastRendered) {
            return;
          }
          const poseCanvas = pose.shadowRoot.querySelector('canvas') as HTMLCanvasElement;

          if (PlayableVideoEncoder.isSupported()) {
            const imageBitmap = await createImageBitmap(poseCanvas);
            await this.addCacheFrame(imageBitmap);
          } else if (this.recordingCanvas) {
            const ctx = this.recordingCanvas.getContext('2d');
            ctx.drawImage(poseCanvas, 0, 0);
          }

          lastRendered = pose.currentTime;
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

    this.pauseInvisible();
  }

  pauseInvisible() {
    const pose = this.poseEl().nativeElement;

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
