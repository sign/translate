import {Injectable} from '@angular/core';
import * as comlink from 'comlink';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {AssetsService} from '../../core/services/assets/assets.service';
import {isSafari} from '../../core/constants';

interface Pix2PixModel {
  loadModel: (generator: Map<string, string>, upscaler: Map<string, string>) => Promise<void>;
  translateQueue: (queueId: number, image: ImageBitmap | ImageData) => Promise<Uint8ClampedArray>;
}

@Injectable({
  providedIn: 'root',
})
export class Pix2PixService {
  worker: comlink.Remote<Pix2PixModel> | Pix2PixModel;

  isFirstFrame = true;

  queueId = 0;

  constructor(private ga: GoogleAnalyticsService, private assets: AssetsService) {}

  async loadModel(): Promise<void> {
    this.queueId++;

    if (this.worker) {
      return;
    }

    await this.ga.trace('pix2pix', 'init', async () => {
      if (isSafari) {
        // Some browsers (Safari) don't support WebGL in workers,
        // making the model slow to the point it is unusable.
        this.worker = await import('./pix2pix.model');
      } else {
        this.worker = comlink.wrap(new Worker(new URL('./pix2pix.worker', import.meta.url)));
      }
    });

    const [generator, upscaler] = await Promise.all([
      this.assets.getDirectory('models/generator/model.h5.layers16/'),
      this.assets.getDirectory('models/upscaler/model.h5.layers/'),
    ]);
    await this.ga.trace('pix2pix', 'load', () => this.worker.loadModel(generator, upscaler));
  }

  async translate(image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
    const frameType = this.isFirstFrame ? 'first-frame' : 'frame';
    return this.ga.trace('pix2pix', frameType, async () => {
      this.isFirstFrame = false;
      return this.worker.translateQueue(this.queueId, image);
    });
  }
}
