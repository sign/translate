import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import {Pix2PixService} from '../../../../modules/pix2pix/pix2pix.service';
import {fromEvent, interval} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {BasePoseViewerComponent} from '../pose-viewer.component';
import {transferableImage} from '../../../../core/helpers/image/transferable';
import {IonProgressBar, IonSpinner} from '@ionic/angular/standalone';
import {AsyncPipe} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'app-human-pose-viewer',
  templateUrl: './human-pose-viewer.component.html',
  styleUrls: ['./human-pose-viewer.component.scss'],
  imports: [IonProgressBar, IonSpinner, AsyncPipe, MatTooltipModule, TranslocoDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HumanPoseViewerComponent extends BasePoseViewerComponent implements AfterViewInit, OnDestroy {
  private pix2pix = inject(Pix2PixService);

  appearance$ = this.store.select<string>(state => state.settings.appearance);

  readonly canvasEl = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

  @Input() src: string;
  @Input() width: string;
  @Input() height: string;

  ready = false;
  modelReady = false;

  totalFrames = 1;

  ngAfterViewInit(): void {
    const pose = this.poseEl().nativeElement;

    const canvas = this.canvasEl().nativeElement;
    const ctx = canvas.getContext('2d');

    let destroyed = false;
    this.ngUnsubscribe.subscribe(() => (destroyed = true));

    fromEvent(pose, 'firstRender$')
      .pipe(
        tap(async () => {
          this.reset();
          this.totalFrames = (await this.fps()) * pose.duration;

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
            await new Promise(requestAnimationFrame); // Await animation frame due to canvas change
            const image = await transferableImage(poseCanvas, poseCtx);
            await pose.nextFrame();
            this.translateFrame(image, canvas, ctx).then(() => {
              queued--;
              iterFrame();
            });
          };

          for (let i = 0; i < 3; i++) {
            await iterFrame();
          }
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  async translateFrame(image: ImageBitmap | ImageData, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const uint8Array: Uint8ClampedArray = await this.pix2pix.translate(image);
    this.modelReady = true; // Stop loading after first model inference

    const imageData = new ImageData(new Uint8ClampedArray(uint8Array), canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);

    const imageBitmap = await createImageBitmap(imageData);
    await this.addCacheFrame(imageBitmap);
  }

  drawFrame(bitmap: ImageBitmap, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.background) {
      ctx.fillStyle = this.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);
  }

  override reset(): void {
    super.reset();
    this.ready = false;
  }

  async drawCache(): Promise<void> {
    // Supported in selected browsers https://caniuse.com/?search=MediaStreamTrackGenerator
    if (this.videoEncoder) {
      return this.stopRecording();
    }

    if (this.cache.length === 0) {
      return;
    }

    const canvas = this.canvasEl().nativeElement;
    await this.startRecording(canvas as any);

    const ctx = canvas.getContext('2d');
    const fps = await this.fps();

    let i = -1;
    this.cacheSubscription = interval(1000 / fps)
      .pipe(
        tap(() => {
          i++;
          if (i < this.cache.length) {
            this.drawFrame(this.cache[i], canvas, ctx);
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

  get progress(): number {
    const poseEl = this.poseEl();
    if (!poseEl) {
      return 0;
    }
    const pose = poseEl.nativeElement;
    if (!pose.duration) {
      return 0;
    }

    return this.frameIndex / this.totalFrames;
  }
}
