/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {Tensor, Tensor3D} from '@tensorflow/tfjs';
import {LayersModel} from '@tensorflow/tfjs-layers';

const tfPromise = import(/* webpackChunkName: "@tensorflow/tfjs" */ '@tensorflow/tfjs');
let model: LayersModel;

async function loadModel(): Promise<void> {
  const tf = await tfPromise;
  model = await tf.loadLayersModel('assets/models/pose-to-person/model.json');
}

const RANGE_LIMIT = 17;

function isWhitish(rgb): boolean {
  const min = Math.min(...rgb);
  return min > 130 && Math.max(...rgb) - min <= RANGE_LIMIT;
}

function removeGreenScreen(data: Uint8ClampedArray): Uint8ClampedArray {
  // This takes 0.15ms for 256x256 images, would perhaps be good to do this in wasm.
  for (let i = 0; i < data.length; i += 4) {
    const rgb = [data[i], data[i + 1], data[i + 2]];

    // If its white-ish, change it
    if (isWhitish(rgb)) {
      data[i + 3] = 0;
    }
  }
  return data;
}

async function translate(image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
  if (!model) {
    throw new Error('Model not loaded');
  }
  const tf = await tfPromise;

  const {width, height} = image;
  const pixels = tf.browser.fromPixels(image);

  const output = tf.tidy(() => {
    const pixelsTensor = pixels.toFloat();
    const input = tf.sub(tf.div(pixelsTensor, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
    const tensor = input.reshape([1, width, height, 3]);

    // Must apply model in training=True mode to avoid using aggregated norm statistics
    let pred = model.apply(tensor, {training: true}) as Tensor;
    pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]
    return pred.reshape([width, height, 3]) as Tensor3D;
  });

  const data = await tf.browser.toPixels(output);
  const cleanData = removeGreenScreen(data);
  return comlink.transfer(cleanData, [cleanData.buffer]);
}


comlink.expose({loadModel, translate});
