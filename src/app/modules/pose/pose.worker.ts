/// <reference lib="webworker" />

import * as comlink from 'comlink';
import {Holistic} from '@mediapipe/holistic';
import {firstValueFrom, Observable} from 'rxjs';

// Fake document to satisfy `"ontouchend" in document`
globalThis.document = {} as any;

const POSE_CONFIG = {
  // angular.json copies `@mediapipe/holistic` to `assets/mediapipe/holistic`
  locateFile: file => new URL(`/assets/models/holistic/${file}`, globalThis.location.origin).toString(),
};

// Solution taken from https://github.com/google/mediapipe/issues/2506#issuecomment-1386616165
(self as any).createMediapipeSolutionsWasm = POSE_CONFIG;
(self as any).createMediapipeSolutionsPackedAssets = POSE_CONFIG;

importScripts(
  '/assets/models/holistic/holistic_solution_packed_assets_loader.js',
  '/assets/models/holistic/holistic_solution_simd_wasm_bin.js'
);

// let model: Holistic;
let model: Holistic;
let results: Observable<any>;

async function loadModel(): Promise<void> {
  model = new Holistic(POSE_CONFIG);
  model.setOptions({
    // TODO use our preferred settings:
    // modelComplexity: 1,
    // smoothLandmarks: false

    selfieMode: false,
    modelComplexity: 2,
    smoothLandmarks: false,
  });

  const solution = (model as any).g;
  const solutionConfig = solution.g;
  solutionConfig.files = () => []; // disable default import files behavior
  await model.initialize();
  solution.D = solution.h.GL.currentContext.GLctx; // set gl ctx

  // load data files
  const files = solution.F;
  files['pose_landmark_heavy.tflite'] = (
    await fetch(POSE_CONFIG.locateFile('pose_landmark_heavy.tflite'))
  ).arrayBuffer();
  files['holistic.binarypb'] = (await fetch(POSE_CONFIG.locateFile('holistic.binarypb'))).arrayBuffer();
  //
  // // To be on the safe side, we load the files in the order they are listed in the manifest. TODO: remove this
  // for (const file of ['pose_landmark_lite.tflite', 'pose_landmark_full.tflite', 'pose_landmark_heavy.tflite']) {
  //   files[file] = fetch(POSE_CONFIG.locateFile(file)).then(res => res.arrayBuffer());
  // }

  results = new Observable(subscriber => {
    model.onResults(results => {
      console.log(results); // Currently prints: {image: ImageBitmap, multiFaceGeometry: Array(0)}
      subscriber.next({
        faceLandmarks: results.faceLandmarks,
        poseLandmarks: results.poseLandmarks,
        leftHandLandmarks: results.leftHandLandmarks,
        rightHandLandmarks: results.rightHandLandmarks,
        image: results.image, // TODO reconsider if sending this is expensive
      });
    });
  });
}

async function pose(imageBitmap: ImageBitmap | ImageData): Promise<any> {
  if (!results) {
    return null;
  }

  const result = firstValueFrom(results);
  await model.send({image: imageBitmap as any});
  return result;
}

comlink.expose({loadModel, pose});
