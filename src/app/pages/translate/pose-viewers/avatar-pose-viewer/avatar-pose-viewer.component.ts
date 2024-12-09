import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {AnimationComponent} from '../../../../components/animation/animation.component';

@Component({
  selector: 'app-avatar-pose-viewer',
  templateUrl: './avatar-pose-viewer.component.html',
  styleUrls: ['./avatar-pose-viewer.component.scss'],
  imports: [AnimationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AvatarPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit {
  @Input() src: string;

  effectiveFps: number = 1;

  ngAfterViewInit(): void {
    const poseEl = this.poseEl().nativeElement;
    // TODO reset animation through the store
    fromEvent(poseEl, 'firstRender$')
      .pipe(
        tap(async () => {
          const pose = await poseEl.getPose();

          this.effectiveFps = pose.body.fps;
          // TODO send pose tensor to the animation service (through the store)
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }
}
