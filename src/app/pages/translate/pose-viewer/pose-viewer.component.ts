import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../../components/base/base.component';
import {Pix2PixService} from '../../../modules/pix2pix/pix2pix.service';

function promiseRaf<T>(callback: CallableFunction): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(async () => {
      resolve(await callback());
    });
  });
}

@Component({
  selector: 'app-pose-viewer',
  templateUrl: './pose-viewer.component.html',
  styleUrls: ['./pose-viewer.component.scss']
})
export class PoseViewerComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('poseViewer') poseEl: ElementRef<HTMLPoseViewerElement>;
  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  @Input() src: string;
  @Input() autoplay = false;
  @Input() loop = false;
  @Input() width: string;
  @Input() height: string;

  cache: ImageData[] = [];
  ready = false;

  constructor(private store: Store, private pix2pix: Pix2PixService) {
    super();
  }

  ngAfterViewInit(): void {
    const pose = this.poseEl.nativeElement;

    const canvas = this.canvasEl.nativeElement;
    const ctx = canvas.getContext('2d');

    pose.addEventListener('loadeddata$', async () => {
      this.cache = [];
      this.ready = false;

      await this.pix2pix.loadModel();
      while (!pose.ended) {
        await promiseRaf(() => {
          const poseCanvas = pose.shadowRoot.querySelector('canvas');
          return this.pix2pix.translate(poseCanvas, canvas);
        });
        const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.cache.push(image);
        console.log({image});

        await pose.nextFrame();
      }

      console.log('Ended');
      this.ready = true;
    });
  }

  progress(): number {
    if (!this.poseEl) {
      return 0;
    }
    const pose = this.poseEl.nativeElement;
    if (!pose.duration) {
      return 0;
    }
    return 100 * pose.currentTime / pose.duration;
  }
}
