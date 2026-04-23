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

  ngAfterViewInit(): void {
    const pose = this.poseEl().nativeElement;

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(() => {
          pose.getPose().then(poseData => (this.poseFps = poseData.body.fps));
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(pose, 'render$')
      .pipe(
        tap(async () => {
          if (this.firstPassDone) return;
          const poseCanvas = pose.shadowRoot.querySelector('canvas') as HTMLCanvasElement;
          const imageBitmap = await createImageBitmap(poseCanvas);
          this.addCacheFrame(imageBitmap, this.poseFps);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    fromEvent(pose, 'ended$')
      .pipe(
        tap(() => (this.firstPassDone = true)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
