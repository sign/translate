import * as tf from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs';
import {Pose, PoseLandmark} from '../pose/pose.state';
import {LayersModel} from '@tensorflow/tfjs-layers';
import {Injectable} from '@angular/core';
import * as holistic from '@mediapipe/holistic/holistic.js';

const WINDOW_SIZE = 20;

@Injectable({
  providedIn: 'root'
})
export class DetectorService {
  lastPose: PoseLandmark[];
  lastTimestamp: number;

  shoulderWidth: Float32Array = new Float32Array(WINDOW_SIZE).fill(0);
  shoulderWidthIndex = 0;

  sequentialModel: LayersModel;

  constructor() {
    tf.loadLayersModel('assets/models/sign-detector/model.json')
      .then(model => this.sequentialModel = model as unknown as LayersModel);
  }

  distance(p1: PoseLandmark, p2: PoseLandmark): number {
    const xs = p1.x - p2.x;
    const ys = p1.y - p2.y;
    return Math.sqrt(xs * xs + ys * ys);
  }

  normalizePose(pose: Pose): PoseLandmark[] {
    const emptyLandmark: PoseLandmark = {x: 0, y: 0, z: 0};

    const bodyLandmarks = pose.poseLandmarks || new Array(Object.keys(holistic.POSE_LANDMARKS).length).fill(emptyLandmark);
    const leftHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(emptyLandmark);
    const rightHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(emptyLandmark);
    const landmarks = bodyLandmarks.concat(leftHandLandmarks, rightHandLandmarks).map(l => this.isValidLandmark(l) ? l : emptyLandmark);

    const p1 = landmarks[holistic.POSE_LANDMARKS.LEFT_SHOULDER];
    const p2 = landmarks[holistic.POSE_LANDMARKS.RIGHT_SHOULDER];

    if (p1.x > 0 && p2.x > 0) {
      this.shoulderWidth[this.shoulderWidthIndex % WINDOW_SIZE] = this.distance(p1, p2);
      this.shoulderWidthIndex++;
    }

    if (this.shoulderWidthIndex < WINDOW_SIZE) {
      return null;
    }

    const meanShoulders = this.shoulderWidth.reduce((a, b) => a + b, 0) / WINDOW_SIZE;
    const newPose = new Array(landmarks.length);
    landmarks.forEach((v, i) => {
      newPose[i] = {
        x: v.x / meanShoulders,
        y: v.y / meanShoulders,
      };
    });

    // TODO remove, this is to be compliant with openpose
    const neck = {
      x: (newPose[holistic.POSE_LANDMARKS.LEFT_SHOULDER].x + newPose[holistic.POSE_LANDMARKS.RIGHT_SHOULDER].x) / 2,
      y: (newPose[holistic.POSE_LANDMARKS.LEFT_SHOULDER].y + newPose[holistic.POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2,
    };
    const newFakePose = [
      newPose[holistic.POSE_LANDMARKS.NOSE],
      neck,
      newPose[holistic.POSE_LANDMARKS.RIGHT_SHOULDER],
      newPose[holistic.POSE_LANDMARKS.RIGHT_ELBOW],
      newPose[holistic.POSE_LANDMARKS.RIGHT_WRIST],
      newPose[holistic.POSE_LANDMARKS.LEFT_SHOULDER],
      newPose[holistic.POSE_LANDMARKS.LEFT_ELBOW],
      newPose[holistic.POSE_LANDMARKS.LEFT_WRIST],
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      newPose[holistic.POSE_LANDMARKS.RIGHT_EYE],
      newPose[holistic.POSE_LANDMARKS.LEFT_EYE],
      newPose[holistic.POSE_LANDMARKS.RIGHT_EAR],
      newPose[holistic.POSE_LANDMARKS.LEFT_EAR],
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark,
      emptyLandmark
    ];

    return newFakePose;
  }

  isValidLandmark(l: PoseLandmark): boolean {
    return l.x > 0.02 && l.x < 0.98 && l.y > 0.02 && l.y < 0.98;
  }

  distance2DTensors(p1: PoseLandmark[], p2: PoseLandmark[], multiplier = 1): Float32Array {
    const d = new Float32Array(p1.length).fill(0);
    for (let i = 0; i < d.length; i += 1) {
      const a = p1[i];
      const b = p2[i];

      if (a.x > 0 && b.x > 0) {
        d[i] = this.distance(a, b) * multiplier;
      }
    }
    return d;
  }

  getSequentialConfidence(opticalFlow: Float32Array): number {
    const pred: Tensor = this.sequentialModel.predict(tf.tensor(opticalFlow).reshape([1, 1, opticalFlow.length])) as Tensor;
    const probs = tf.softmax(pred).dataSync();
    return probs[1];
  }

  detect(pose: Pose): number {
    const timestamp = performance.now() / 1000;
    let confidence = 0;

    const normalized = this.normalizePose(pose);

    if (this.lastPose && normalized) {
      const fps = 1 / (timestamp - this.lastTimestamp);
      const distance = this.distance2DTensors(normalized, this.lastPose, fps);
      confidence = this.getSequentialConfidence(distance);
    }

    this.lastTimestamp = timestamp;
    this.lastPose = normalized;

    return confidence;
  }

}
