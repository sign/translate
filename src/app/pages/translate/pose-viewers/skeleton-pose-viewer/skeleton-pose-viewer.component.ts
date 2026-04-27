import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';

@Component({
  selector: 'app-skeleton-pose-viewer',
  templateUrl: './skeleton-pose-viewer.component.html',
  styleUrls: ['./skeleton-pose-viewer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SkeletonPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;

  private firstPassDone = false;
  private poseFps: number;
  private expectedFrames = Infinity;

  ngAfterViewInit(): void {
    const pose = this.poseEl().nativeElement;

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(() => {
          this.firstPassDone = false;
          this.expectedFrames = Infinity;
          this.reset();
          pose.getPose().then(poseData => {
            this.poseFps = poseData.body.fps;
            this.expectedFrames = Math.round(this.poseFps * pose.duration);
            this.checkComplete();
          });
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(pose, 'render$')
      .pipe(
        tap(async () => {
          if (this.firstPassDone) return;
          const poseCanvas = pose.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
          if (!poseCanvas) return;
          const imageBitmap = await createImageBitmap(poseCanvas);
          if (this.firstPassDone) return;
          this.addCacheFrame(imageBitmap, this.poseFps);
          this.checkComplete();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(pose, 'ended$')
      .pipe(
        tap(() => {
          if (!this.firstPassDone) {
            this.firstPassDone = true;
            this.signalReady();
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  private checkComplete(): void {
    if (!this.firstPassDone && this.frameIndex >= this.expectedFrames) {
      this.firstPassDone = true;
      this.signalReady();
    }
  }
}
