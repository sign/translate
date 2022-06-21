/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {Tensor, Tensor3D} from '@tensorflow/tfjs';
import {LayersModel} from '@tensorflow/tfjs-layers';
import {loadTFDS} from '../../core/services/tfjs/tfjs.loader';
import {Dropout} from '@tensorflow/tfjs-layers/dist/layers/core';

class ModelNotLoadedError extends Error {
  constructor() {
    super('Model not loaded');
  }
}

const tfPromise = loadTFDS();
let model: LayersModel;

function resetDropout(layers: any[]) {
  for (const layer of layers) {
    if (layer.layers) {
      resetDropout(layer.layers);
    }

    if (layer instanceof Dropout) {
      (layer as any).rate = 0;
    }
  }
}

async function loadModel(): Promise<void> {
  const tf = await tfPromise;
  model = await tf.loadLayersModel('assets/models/pose-to-person/model.json');
  resetDropout(model.layers); // Extremely important, as we are performing inference in training mode
}

function isGreen(r: number, g: number, b: number) {
  return g > 255 / 2 && g > r * 1.5 && g > b * 1.5;
}

function removeGreenScreen(data: Uint8ClampedArray): Uint8ClampedArray {
  // This takes 0.15ms for 256x256 images, would perhaps be good to do this in wasm.
  for (let i = 0; i < data.length; i += 4) {
    if (isGreen(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0;
    }
  }
  return data;
}

async function translate(image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
  if (!model) {
    throw new ModelNotLoadedError();
  }
  const tf = await tfPromise;

  const {width, height} = image;

  const output = await tf.tidy(() => {
    const pixels = tf.browser.fromPixels(image);
    const pixelsTensor = pixels.toFloat();
    const input = tf.sub(tf.div(pixelsTensor, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
    const tensor = input.reshape([1, width, height, 3]);

    // Must apply model in training=True mode to avoid using aggregated norm statistics
    let pred = model.apply(tensor, {training: true}) as Tensor;
    pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]
    pred = pred.reshape([width, height, 3]);
    return pred;
  });

  const outputArray = await output.array(); // Slowest operation
  const outputImg = tf.tensor(outputArray).reshape([width, height, 3]) as Tensor3D;
  let data = await tf.browser.toPixels(outputImg);
  data = removeGreenScreen(data);

  return comlink.transfer(data, [data.buffer]);
}

comlink.expose({loadModel, translate});
