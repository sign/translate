import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {TensorLike} from '@tensorflow/tfjs';
import * as comlink from 'comlink';


@Injectable({
  providedIn: 'root'
})
export class Pix2PixService {
  worker: comlink.Remote<{
    loadModel: () => Promise<void>,
    translate: (width: number, height: number, pixels: TensorLike) => Promise<Uint8ClampedArray>,
  }>;

  async loadModel(): Promise<void> {
    if (this.worker) {
      return;
    }

    // tslint:disable-next-line: whitespace
    this.worker = comlink.wrap(new Worker(new URL('./pix2pix.worker', import.meta.url)));
    await this.worker.loadModel();
  }

  async translate(canvas: HTMLCanvasElement): Promise<Uint8ClampedArray> {
    /*
     TODO
     Communication costs are very high!
     A typical timing of this function is:
     - this entire function: 103.435791015625 ms
     - fromPixels: 35.729736328125 ms
     - web worker "translate": 11.86181640625 ms
     TODO one improvement would be to make the drawing canvas an offscreen one
     */

    const {width, height} = canvas;

    // TODO: this operation takes >25ms!!! Insane
    const pixels = tf.browser.fromPixels(canvas).dataSync(); // TODO move to the web worker itself

    return this.worker.translate(width, height, pixels);
  }
}
