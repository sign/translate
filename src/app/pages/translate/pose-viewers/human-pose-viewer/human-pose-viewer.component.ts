import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Pix2PixService} from '../../../../modules/pix2pix/pix2pix.service';
import {fromEvent, interval, Observable} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {Select, Store} from '@ngxs/store';
import {transferableImage} from '../../../../core/helpers/image/transferable';

@Component({
  selector: 'app-human-pose-viewer',
  templateUrl: './human-pose-viewer.component.html',
  styleUrls: ['./human-pose-viewer.component.scss'],
})
export class HumanPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit, OnDestroy {
  @Select(state => state.settings.appearance) appearance$: Observable<string>;

  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;

  @Input() src: string;
  @Input() width: string;
  @Input() height: string;

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
    this.ngUnsubscribe.subscribe(() => (destroyed = true));

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(async () => {
          this.reset();

          await this.pix2pix.loadModel();

          const poseCanvas = pose.shadowRoot.querySelector('canvas');
          const poseCtx = poseCanvas.getContext('2d', {willReadFrequently: true});

          // To avoid communication time losses, we create a queue sent to be translated
          let queued = 0;

          const iterFrame = async () => {
            // Verify element is not destroyed
            if (destroyed) {
              return;
            }

            if (pose.ended) {
              if (queued === 0) {
                // Reset the pose-viewer drawing
                this.ready = true;
                await this.drawCache();
              }
              return;
            }

            queued++;
            // await new Promise(requestAnimationFrame); // Await animation frame due to canvas change
            const image = await transferableImage(poseCanvas, poseCtx);
            await pose.nextFrame();
            const time = pose.currentTime;
            this.translateFrame(image, canvas, ctx).then(() => {
              queued--;
              iterFrame();
            });
          };

          // The more frames in parallel, the more GPU util (1=~40%, 2=~75%, 5=~90%), but inconsistent frame rate
          await iterFrame();
          await iterFrame();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  async translateFrame(image: ImageBitmap | ImageData, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const uint8Array = await this.pix2pix.translate(image);
    this.modelReady = true; // Stop loading after first model inference

    const imageData = new ImageData(uint8Array, canvas.width, canvas.height);
    await this.addCacheFrame(imageData);

    ctx.putImageData(imageData, 0, 0);
  }

  override reset(): void {
    super.reset();
    this.ready = false;
  }

  async drawCache(): Promise<void> {
    // Supported in selected browsers https://caniuse.com/?search=MediaStreamTrackGenerator
    if (this.streamWriter) {
      return this.stopRecording();
    }

    if (this.cache.length === 0) {
      return;
    }

    const canvas = this.canvasEl.nativeElement;
    await this.startRecording(canvas as any);

    const ctx = canvas.getContext('2d');
    const fps = await this.fps();

    let i = -1;
    this.cacheSubscription = interval(1000 / fps)
      .pipe(
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
      )
      .subscribe();
  }

  progress(): number {
    if (!this.poseEl) {
      return 0;
    }
    const pose = this.poseEl.nativeElement;
    if (!pose.duration) {
      return 0;
    }
    return (100 * pose.currentTime) / pose.duration;
  }
}
