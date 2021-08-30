import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Pix2PixService} from '../../../../modules/pix2pix/pix2pix.service';
import {fromEvent, interval, Subscription} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Store} from '@ngxs/store';

function promiseRaf<T>(callback: CallableFunction): Promise<T> {
  return new Promise((resolve) => {
    requestAnimationFrame(async () => {
      resolve(await callback());
    });
  });
}


@Component({
  selector: 'app-human-pose-viewer',
  templateUrl: './human-pose-viewer.component.html',
  styleUrls: ['./human-pose-viewer.component.scss']
})
export class HumanPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  @Input() src: string;
  @Input() width: string;
  @Input() height: string;

  cache: ImageData[] = [];
  cacheSubscription: Subscription;
  ready = false;
  modelReady = false;

  constructor(store: Store, private pix2pix: Pix2PixService) {
    super(store);
  }

  ngAfterViewInit(): void {
    const pose = this.poseEl.nativeElement;

    const canvas = this.canvasEl.nativeElement;
    const ctx = canvas.getContext('2d');

    let destroyed = false;
    this.ngUnsubscribe.subscribe(() => destroyed = true);

    fromEvent(pose, 'firstRender$').pipe(
      tap(async () => {
        this.reset();

        await this.pix2pix.loadModel();
        this.modelReady = true;

        const poseCanvas = pose.shadowRoot.querySelector('canvas');

        while (!pose.ended) {
          // Verify element is not destroyed
          if (destroyed) {
            return;
          }

          const uint8Array: Uint8ClampedArray = await promiseRaf(() => this.pix2pix.translate(poseCanvas));

          const imageData = new ImageData(uint8Array, canvas.width, canvas.height);
          this.cache.push(imageData);

          ctx.putImageData(imageData, 0, 0);

          await pose.nextFrame();
        }

        // Reset the pose-viewer drawing
        this.ready = true;
        await this.drawCache();
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  reset(): void {
    if (this.cacheSubscription) {
      this.cacheSubscription.unsubscribe();
    }
    this.cache = [];
    this.ready = false;
  }

  async getFps(): Promise<number> {
    const poseEl = this.poseEl.nativeElement;
    const pose = await poseEl.getPose();

    return pose.body.fps;
  }

  async drawCache(): Promise<void> {
    if (this.cache.length === 0) {
      return;
    }

    const canvas = this.canvasEl.nativeElement;
    this.startRecording(canvas as any);

    const ctx = canvas.getContext('2d');
    const fps = await this.getFps();

    let i = -1;
    this.cacheSubscription = interval(1000 / fps).pipe(
      tap(() => {
        i++;
        if (i < this.cache.length) {
          ctx.putImageData(this.cache[i], 0, 0);
          delete this.cache[i]; // Free up memory after cached frame is no longer necessary
        } else {
          this.cacheSubscription.unsubscribe();
          this.stopRecording();
        }
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
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
