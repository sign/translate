import {AfterViewInit, Component, Input} from '@angular/core';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Store} from '@ngxs/store';


@Component({
  selector: 'app-skeleton-pose-viewer',
  templateUrl: './skeleton-pose-viewer.component.html',
  styleUrls: ['./skeleton-pose-viewer.component.scss']
})
export class SkeletonPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;
  @Input() width: string;
  @Input() height: string;

  constructor(store: Store) {
    super(store);
  }

  ngAfterViewInit(): void {
    const pose = this.poseEl.nativeElement;

    fromEvent(pose, 'firstRender$').pipe(
      tap(async () => {
        const poseCanvas = pose.shadowRoot.querySelector('canvas');
        this.startRecording(poseCanvas as any);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    fromEvent(pose, 'ended$').pipe(
      tap(async () => this.stopRecording()),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }
}
