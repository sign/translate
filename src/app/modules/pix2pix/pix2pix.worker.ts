/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {loadModel, translateQueue} from './pix2pix.model';

async function translateQueueWrapper(queueId: number, image: ImageBitmap | ImageData) {
  const outputImage = await translateQueue(queueId, image);
  return comlink.transfer(outputImage, [outputImage.buffer]);
}

comlink.expose({loadModel, translateQueue: translateQueueWrapper});
