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
  tf.env().set('WEBGL_FORCE_F16_TEXTURES', false);
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

let queuePromise: Promise<any> = Promise.resolve();
let globalQueueId = 0;

async function translateQueue(queueId: number, image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
  globalQueueId = queueId;

  const tensor = await translate(image); // Lazy tensor evaluation

  queuePromise = queuePromise.then(() => {
    if (globalQueueId !== queueId) {
      return null;
    }

    return tensorToImage(tensor);
  });

  return queuePromise;
}

async function translate(image: ImageBitmap | ImageData): Promise<Tensor3D> {
  if (!model) {
    throw new ModelNotLoadedError();
  }

  const tf = await tfPromise;

  return tf.tidy(() => {
    const pixels = tf.browser.fromPixels(image, 3); // 0.1-0.3ms
    const pixelsTensor = pixels.toFloat();
    const input = tf.sub(tf.div(pixelsTensor, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
    const tensor = tf.expandDims(input, 0); // Add batch dimension

    // Must apply model in training=True mode to avoid using aggregated norm statistics
    let pred = model.apply(tensor, {training: true}) as Tensor; //6-8ms, but works
    // let pred = model.predict(tensor) as Tensor; // 3-4ms, but returns black screen
    pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]

    pred = tf.squeeze(pred); // Remove batch dimension
    return pred as Tensor3D;
  });
}

async function tensorToImage(tensor: Tensor3D): Promise<Uint8ClampedArray> {
  const tf = await tfPromise;

  // TODO: draw on canvas directly
  let data = await tf.browser.toPixels(tensor); // 1-3ms by itself, 60-70ms with evaluation
  data = removeGreenScreen(data); // 0.1-0.2ms

  return comlink.transfer(data, [data.buffer]);
}

comlink.expose({loadModel, translate, translateQueue});
