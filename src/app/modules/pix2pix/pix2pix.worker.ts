/// <reference lib="webworker" />

import * as comlink from 'comlink';
import * as tf from '@tensorflow/tfjs';
import {Tensor, Tensor3D, TensorLike} from '@tensorflow/tfjs';
import {LayersModel} from '@tensorflow/tfjs-layers';

class ModelNotLoadedError extends Error {
  constructor() {
    super('Model not loaded');
  }
}

let model: LayersModel;

async function loadModel(): Promise<void> {
  model = await tf.loadLayersModel('assets/models/pose-to-person/model.json');
}

function removeGreenScreen(data: Uint8ClampedArray): Uint8ClampedArray {
  // This takes 0.15ms for 256x256 images, would perhaps be good to do this in wasm.
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

    // If its white-ish, change it
    if (r > 170 && g > 170 && b > 170) {
      data[i + 3] = 0;
    }
  }
  return data;
}

async function translate(width: number, height: number, pixels: TensorLike): Promise<Uint8ClampedArray> {
  if (!model) {
    throw new ModelNotLoadedError();
  }

  const image = tf.tidy(() => {
    const pixelsTensor = tf.tensor(pixels).toFloat();
    const input = tf.sub(tf.div(pixelsTensor, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
    const tensor = input.reshape([1, width, height, 3]);

    // Must apply model in training=True mode to avoid using aggregated norm statistics
    let pred = model.apply(tensor, {training: true}) as Tensor;
    pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]
    return pred.reshape([width, height, 3]) as Tensor3D;
  });

  const data = await tf.browser.toPixels(image);
  return removeGreenScreen(data);
}


comlink.expose({loadModel, translate});
