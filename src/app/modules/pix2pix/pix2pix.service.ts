import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs';

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

    // TODO add this code as a test
    console.log(this.sequentialModel.getWeights());
    for (const weight of this.sequentialModel.getWeights()) {
      const data = await weight.data();
      tf.isNaN(data).any().print();
    }

    const image = tf.tidy(() => {
      const pixels = tf.browser.fromPixels(canvas).toFloat();
      const input = tf.sub(tf.div(pixels, tf.scalar(127.5)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
      const tensor = input.reshape([1, canvas.width, canvas.height, 3]);


      tensor.print();

      const pred = this.sequentialModel.predict(tensor) as Tensor;
      pred.print();
      // return pred.reshape([canvas.width, canvas.height, 3]) as Tensor3D;
    });


    // await tf.browser.toPixels(image, target);
  }
}
