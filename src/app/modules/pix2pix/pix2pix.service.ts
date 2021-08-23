import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs';
import {Tensor, Tensor3D} from '@tensorflow/tfjs';

export class ModelNotLoadedError extends Error {
  constructor() {
    super('Model not loaded');
  }
}

@Injectable({
  providedIn: 'root'
})
export class Pix2PixService {
  sequentialModel: LayersModel;

  async loadModel(): Promise<void> {
    if (this.sequentialModel) {
      return;
    }
    const model = await tf.loadLayersModel('assets/models/pose-to-person/model.json');
    this.sequentialModel = model as unknown as LayersModel;
  }

  async translate(canvas: HTMLCanvasElement, target: HTMLCanvasElement): Promise<void> {
    if (!this.sequentialModel) {
      throw new ModelNotLoadedError();
    }

    const image = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(canvas).toFloat();
      const input = tf.sub(tf.div(pixels, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
      const tensor = input.reshape([1, canvas.width, canvas.height, 3]);

      // Must apply model in training=True mode to avoid using aggregated norm statistics
      let pred = this.sequentialModel.apply(tensor, {training: true}) as Tensor;
      pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]
      // pred = pred.clipByValue(0, 1); // Clip to range [0, 1]
      return pred.reshape([canvas.width, canvas.height, 3]) as Tensor3D;
    });

    await tf.browser.toPixels(image, target);
  }
}
