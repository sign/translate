import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Store} from '@ngxs/store';


@Component({
  selector: 'app-avatar-pose-viewer',
  templateUrl: './avatar-pose-viewer.component.html',
  styleUrls: ['./avatar-pose-viewer.component.scss']
})
export class AvatarPoseViewerComponent extends BasePoseViewerComponent {
  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  @Input() src: string;

  constructor(store: Store) {
    super(store);
  }
}
