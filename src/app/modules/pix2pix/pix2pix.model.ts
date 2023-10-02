import type {Tensor, Tensor3D} from '@tensorflow/tfjs';
import type {LayersModel} from '@tensorflow/tfjs-layers';
import {loadTFJS} from '../../core/services/tfjs/tfjs.loader';

class ModelNotLoadedError extends Error {
  constructor() {
    super('Model not loaded');
  }
}

const tfPromise = loadTFJS();
let model: LayersModel;
let upscaler: LayersModel;

function resetDropout(layers: any[]) {
  for (const layer of layers) {
    // For Sequential models, the layers are in the layers property
    if (layer.layers) {
      resetDropout(layer.layers);
    }

    // For TimeDistributed models, the layer is in the layer property
    if (layer.layer) {
      resetDropout([layer.layer]);
    }

    // If the layer is a dropout layer, reset the rate
    if (layer.rate) {
      layer.rate = 0;
    }
  }
}

async function loadLayersModel(layers: Map<string, string>) {
  const tf = await tfPromise;
  return tf.loadLayersModel(layers.get('model.json'), {
    weightUrlConverter: async name => layers.get(name),
  });
}

async function loadUpscalerModel(layers: Map<string, string>) {
  const req = await fetch(layers.get('model.json'));
  const json = await req.json();
  // Remove d2s and update the output layer
  const d2sLayer = json.modelTopology.model_config.config.layers.pop();
  json.modelTopology.model_config.config.output_layers[0][0] = d2sLayer.inbound_nodes[0][0];
  // Convert JSON to blob
  const blob = new Blob([JSON.stringify(json)]);
  layers.set('model.json', URL.createObjectURL(blob));

  return loadLayersModel(layers);
}

async function loadGeneratorModel(layers: Map<string, string>) {
  const req = await fetch(layers.get('model.json'));
  const json = await req.json();

  const lstmSequence = json.modelTopology.model_config.config.layers[9].config.layers;
  // Error: Identity matrix initializer can only be used for 2D square matrices.
  lstmSequence[2].config.kernel_initializer.class_name = 'Zeros';
  // Orthogonal initializer is being called on a matrix with more than 2000 (1048576) elements: Slowness may result.
  lstmSequence[2].config.recurrent_initializer.class_name = 'Zeros';
  // Make model stateful
  lstmSequence[0].config.batch_input_shape[0] = 1;
  lstmSequence[0].config.batch_input_shape[1] = 1;
  lstmSequence[2].config.stateful = true;

  // Convert JSON to blob
  const blob = new Blob([JSON.stringify(json)]);
  layers.set('model.json', URL.createObjectURL(blob));

  return loadLayersModel(layers);
}

export async function loadModel(
  generatorPaths: Map<string, string>,
  upscalerPaths: Map<string, string>
): Promise<void> {
  const tf = await tfPromise;
  tf.env().set('WEBGL_FORCE_F16_TEXTURES', false);

  [model, upscaler] = await Promise.all([loadGeneratorModel(generatorPaths), loadUpscalerModel(upscalerPaths)]);
  resetDropout(model.layers); // Extremely important, as we are performing inference in training mode
}

function isGreen(r: number, g: number, b: number) {
  return g > 255 / 2 && g > r * 1.5 && g > b * 1.5;
}

function removeGreenScreen(data: Uint8ClampedArray): Uint8ClampedArray {
  // TODO consider
  //  https://github.com/bhj/gl-chromakey
  //  https://github.com/Sean-Bradley/Three.js-TypeScript-Boilerplate/blob/webcam/src/client/client.ts
  //  (easiest) https://developer.vonage.com/blog/2020/06/24/use-a-green-screen-in-javascript-with-vonage-video

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

export async function translateQueue(queueId: number, image: ImageBitmap | ImageData): Promise<Uint8ClampedArray> {
  globalQueueId = queueId;

  const tensor = await translate(image); // Lazy tensor evaluation
  const tf = await tfPromise;

  // Chain the model evaluation per frame
  queuePromise = queuePromise.then(() => {
    if (globalQueueId !== queueId) {
      return null;
    }

    return tensor.buffer(); // 60-70ms
  });

  const imageBuffer = await queuePromise;
  const imageTensor = imageBuffer.toTensor();
  let outputImage = await tf.browser.toPixels(imageTensor); // ~1-3ms
  outputImage = removeGreenScreen(outputImage); // ~0.1-0.2ms

  // Manually cleanup memory
  tensor.dispose();
  imageTensor.dispose();

  return outputImage;
}

const frameTimes = [];
let lastFrameTime = null;

function upscale(tensor: Tensor) {
  return (upscaler.predict(tensor) as Tensor)
    .depthToSpace(3, 'NHWC') // Could not convert the depthToSpace operation to tfjs, must use this instead
    .clipByValue(0, 1); // Clipping to [0, 1] as upscale model may output values greater than 1
}

async function translate(image: ImageBitmap | ImageData): Promise<Tensor3D> {
  if (lastFrameTime) {
    frameTimes.push(Date.now() - lastFrameTime);
    if (frameTimes.length > 20) {
      const totalTime = frameTimes.slice(frameTimes.length - 20).reduce((a, b) => a + b, 0);
      console.log('average', (totalTime / 20).toFixed(1), 'ms');
    }
  }
  lastFrameTime = Date.now();

  if (!model) {
    throw new ModelNotLoadedError();
  }

  const tf = await tfPromise;

  return tf.tidy(() => {
    const pixels = tf.browser.fromPixels(image, 3); // 0.1-0.3ms
    const pixelsTensor = pixels.toFloat();
    const input = tf.sub(tf.div(pixelsTensor, tf.scalar(255 / 2)), tf.scalar(1)); // # Normalizing the images to [-1, 1]
    const tensor = tf.reshape(input, [1, 1, ...input.shape]); // Add batch and time dimensions

    // Must apply model in training=True mode to avoid using aggregated norm statistics
    let pred = model.apply(tensor, {training: true}) as Tensor; //6-8ms, but works

    // let pred = model.predict(tensor) as Tensor; // 3-4ms, but returns black screen
    pred = pred.mul(tf.scalar(0.5)).add(tf.scalar(0.5)); // Normalization to range [0, 1]

    pred = tf.squeeze(pred, [0]); // Remove time dimension
    pred = upscale(pred);

    pred = tf.squeeze(pred); // Remove batch dimension
    return pred as Tensor3D;
  });
}
