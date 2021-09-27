/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {Holistic} from '@mediapipe/holistic';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

let model: Holistic;
let results: Observable<any>;

async function loadModel(): Promise<void> {
  model = new Holistic({
    locateFile: (file) => {
      const f = new URL(`/assets/models/holistic/${file}`, globalThis.location.origin).toString();
      console.log('path', f);
      return f;
    }
  });

  model.setOptions({modelComplexity: 1});
  await model.initialize();
  console.log('Pose model loaded!');

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

async function pose(imageBitmap: ImageBitmap): Promise<any> {
  if (!results) {
    return null;
  }

  // TODO remove
  // const image = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  // const ctx = image.getContext('2d');
  // ctx.drawImage(imageBitmap, 0, 0);

  const result = results.pipe(first()).toPromise();
  await model.send({image: imageBitmap as any});
  return result;
}


comlink.expose({loadModel, pose});
