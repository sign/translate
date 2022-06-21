import {Injectable} from '@angular/core';
import * as comlink from 'comlink';
import {transferableImage} from '../../core/helpers/image/transferable';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';

@Injectable({
  providedIn: 'root',
})
export class Pix2PixService {
  worker: comlink.Remote<{
    loadModel: () => Promise<void>;
    translate: (bitmap: ImageBitmap | ImageData) => Promise<Uint8ClampedArray>;
  }>;

  isFirstFrame = true;

  constructor(private ga: GoogleAnalyticsService) {}

  async loadModel(): Promise<void> {
    if (this.worker) {
      return;
    }

    await this.ga.trace('pix2pix', 'init', () => {
      this.worker = comlink.wrap(new Worker(new URL('./pix2pix.worker', import.meta.url)));
    });
    await this.ga.trace('pix2pix', 'load', () => this.worker.loadModel());
  }

  async translate(image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
    const frameType = this.isFirstFrame ? 'first-frame' : 'frame';
    return this.ga.trace('pix2pix', frameType, async () => {
      this.isFirstFrame = false;
      return this.worker.translate(image);
    });
  }
}
