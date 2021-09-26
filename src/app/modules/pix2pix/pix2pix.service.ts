import {Injectable} from '@angular/core';
import * as comlink from 'comlink';


@Injectable({
  providedIn: 'root'
})
export class Pix2PixService {
  worker: comlink.Remote<{
    loadModel: () => Promise<void>,
    translate: (bitmap: ImageBitmap) => Promise<Uint8ClampedArray>,
  }>;

  async loadModel(): Promise<void> {
    if (this.worker) {
      return;
    }

    // eslint-disable-next-line
    this.worker = comlink.wrap(new Worker(new URL('./pix2pix.worker', import.meta.url)));
    await this.worker.loadModel();
  }

  async translate(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray> {
    const bitmap = await createImageBitmap(canvas);

    return this.worker.translate(bitmap);
  }
}
