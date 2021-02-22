// import {Injectable} from '@angular/core';
// import {LayersModel} from '@tensorflow/tfjs-layers/src/engine/training';
// import * as tf from '@tensorflow/tfjs';
// import {Tensor} from '@tensorflow/tfjs-core';
// import {Vector2D} from '@tensorflow-models/posenet/dist/types';
// import {Pose} from '../pose/models/base.pose-model';
//
//
// const WINDOW_SIZE = 20;
// const LINEAR_WEIGHTS = [0.04518767, 0.06754455, 0.12843487, 0.057285164, 0.0738754, 0.0016703978, 0.038430076, 0.05914564, 0.006238494,
//   -0.030242687, -0.001319781, -0.0072753574, -0.024136841, 1.38366595e-05, -0.017613031, 0.035724297, 0.03492076,
//   0.084389575, 0.08676544, 0.0062924633, -0.008905508, -0.011594881, -0.0061611193, -0.025734566, -0.0126820095];
//
// @Injectable({
//   providedIn: 'root'
// })
// export class DetectorService {
//   lastPose: Pose;
//   lastTimestamp: number;
//
//   shoulderWidth: Float32Array = new Float32Array(WINDOW_SIZE).fill(0);
//   shoulderWidthIndex = 0;
//
//   sequentialModel: LayersModel;
//
//   constructor() {
//     tf.loadLayersModel('assets/models/sign-detector/model.json')
//       .then(model => this.sequentialModel = model as unknown as LayersModel);
//   }
//
//   distance(p1: Vector2D, p2: Vector2D): number {
//     const xs = p1.x - p2.x;
//     const ys = p1.y - p2.y;
//     return Math.sqrt(xs * xs + ys * ys);
//   }
//
//   normalizeTensor(pose: Pose): Pose {
//     const p1 = pose[2];
//     const p2 = pose[5];
//
//     if (p1.x > 0 && p2.x > 0) {
//       this.shoulderWidth[this.shoulderWidthIndex % WINDOW_SIZE] = this.distance(p1, p2);
//       this.shoulderWidthIndex++;
//     }
//
//     if (this.shoulderWidthIndex < WINDOW_SIZE) {
//       return null;
//     }
//
//     const meanShoulders = this.shoulderWidth.reduce((a, b) => a + b, 0) / WINDOW_SIZE;
//     const newPose = new Array(pose.length);
//     pose.forEach((v, i) => {
//       newPose[i] = {
//         x: v.x / meanShoulders,
//         y: v.y / meanShoulders,
//       };
//     });
//
//     return newPose;
//   }
//
//   distance2DTensors(p1: Pose, p2: Pose, multiplier = 1): Float32Array {
//     const d = new Float32Array(p1.length).fill(0);
//     for (let i = 0; i < d.length; i += 1) {
//       const a = p1[i];
//       const b = p2[i];
//
//       if (a.x > 0 && b.x > 0) {
//         d[i] = this.distance(a, b) * multiplier;
//       }
//     }
//     return d;
//   }
//
//   getSequentialConfidence(opticalFlow: Float32Array): number {
//     const pred: Tensor = this.sequentialModel.predict(tf.tensor(opticalFlow).reshape([1, 1, 25])) as Tensor;
//     const probs = tf.softmax(pred).dataSync();
//     return probs[1];
//   }
//
//   getLinearConfidence(opticalFlow: Float32Array): number {
//     let sum = 0;
//     for (let i = 0; i < LINEAR_WEIGHTS.length; i++) {
//       sum += opticalFlow[i] * LINEAR_WEIGHTS[i];
//     }
//     return sum;
//   }
//
//   getConfidence(opticalFlow: Float32Array): number {
//     if (this.sequentialModel) {
//       return this.getSequentialConfidence(opticalFlow);
//     } else {
//       return this.getLinearConfidence(opticalFlow);
//     }
//   }
//
//   detect(pose: Pose): number {
//     const timestamp = performance.now() / 1000;
//     let confidence = 0;
//
//     const normalized = this.normalizeTensor(pose);
//
//     if (this.lastPose && normalized) {
//       const fps = 1 / (timestamp - this.lastTimestamp);
//       const distance = this.distance2DTensors(normalized, this.lastPose, fps);
//       confidence = this.getConfidence(distance);
//     }
//
//     this.lastTimestamp = timestamp;
//     this.lastPose = normalized;
//
//     return confidence;
//   }
//
// }
