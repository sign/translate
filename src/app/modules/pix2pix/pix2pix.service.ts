import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs';
import {Tensor, Tensor3D} from '@tensorflow/tfjs';

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
      return null;
    }

    const image = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(canvas).toFloat();
      console.log({pixels}, pixels.dtype);
      pixels.print();
      const tensor = pixels.reshape([1, canvas.width, canvas.height, 3]);
      const pred = this.sequentialModel.predict(tensor) as Tensor;
      return pred.reshape([canvas.width, canvas.height, 3]) as Tensor3D;
    });

    console.log(image.dataSync());

    await tf.browser.toPixels(image, target);
  }
}
