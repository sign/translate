/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {Holistic} from '@mediapipe/holistic';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

let model: Holistic;
let results: Observable<any>;

async function loadModel(): Promise<void> {
  model = new Holistic({locateFile: (file) => `/assets/models/holistic/${file}`});

  model.setOptions({modelComplexity: 1});
  await model.initialize();

  results = new Observable(subscriber => {
    model.onResults((results) => {
      subscriber.next({
        faceLandmarks: results.faceLandmarks,
        poseLandmarks: results.poseLandmarks,
        leftHandLandmarks: results.leftHandLandmarks,
        rightHandLandmarks: results.rightHandLandmarks
      });
    });
  });
}

async function pose(imageData: ImageData): Promise<any> {
  if (!model) {
    throw new Error('Model not loaded');
  }

  const image = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = image.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  const result = results.pipe(first()).toPromise();
  await model.send({image: image as any});
  return result;
}


comlink.expose({loadModel, pose});
