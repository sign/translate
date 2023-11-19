import type {Tensor} from '@tensorflow/tfjs';
import {EMPTY_LANDMARK, EstimatedPose, PoseLandmark} from '../pose/pose.state';
import type {LayersModel} from '@tensorflow/tfjs-layers';
import {Injectable} from '@angular/core';
import {TensorflowService} from '../../core/services/tfjs/tfjs.service';
import {MediapipeHolisticService} from '../../core/services/holistic.service';

const WINDOW_SIZE = 20;

@Injectable({
  providedIn: 'root',
})
export class DetectorService {
  lastPose: PoseLandmark[];
  lastTimestamp: number;

  shoulderWidth: Float32Array = new Float32Array(WINDOW_SIZE).fill(0);
  shoulderWidthIndex = 0;

  sequentialModel: LayersModel;

  constructor(private tf: TensorflowService, private holistic: MediapipeHolisticService) {}

  async loadModel() {
    return Promise.all([
      this.holistic.load(),
      this.tf
        .load()
        .then(() => this.tf.loadLayersModel('assets/models/sign-detector/model.json'))
        .then(model => (this.sequentialModel = model as unknown as LayersModel)),
    ]);
  }

  distance(p1: PoseLandmark, p2: PoseLandmark): number {
    const xs = p1.x - p2.x;
    const ys = p1.y - p2.y;
    return Math.sqrt(xs * xs + ys * ys);
  }

  normalizePose(pose: EstimatedPose): PoseLandmark[] {
    const bodyLandmarks =
      pose.poseLandmarks || new Array(Object.keys(this.holistic.POSE_LANDMARKS).length).fill(EMPTY_LANDMARK);
    const leftHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    const rightHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    const landmarks = bodyLandmarks
      .concat(leftHandLandmarks, rightHandLandmarks)
      .map(l => (this.isValidLandmark(l) ? l : EMPTY_LANDMARK));

    const p1 = landmarks[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER];
    const p2 = landmarks[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER];

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
      x:
        (newPose[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER].x +
          newPose[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER].x) /
        2,
      y:
        (newPose[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER].y +
          newPose[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER].y) /
        2,
    };

    return [
      newPose[this.holistic.POSE_LANDMARKS.NOSE],
      neck,
      newPose[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER],
      newPose[this.holistic.POSE_LANDMARKS.RIGHT_ELBOW],
      newPose[this.holistic.POSE_LANDMARKS.RIGHT_WRIST],
      newPose[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER],
      newPose[this.holistic.POSE_LANDMARKS.LEFT_ELBOW],
      newPose[this.holistic.POSE_LANDMARKS.LEFT_WRIST],
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      newPose[this.holistic.POSE_LANDMARKS.RIGHT_EYE],
      newPose[this.holistic.POSE_LANDMARKS.LEFT_EYE],
      newPose[this.holistic.POSE_LANDMARKS.RIGHT_EAR],
      newPose[this.holistic.POSE_LANDMARKS.LEFT_EAR],
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
      EMPTY_LANDMARK,
    ];
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
    return this.tf.tidy(() => {
      const pred: Tensor = this.sequentialModel.predict(
        this.tf.tensor(opticalFlow).reshape([1, 1, opticalFlow.length])
      ) as Tensor;
      const softmax = this.tf.softmax(pred).dataSync();
      return softmax[1];
    });
  }

  detect(pose: EstimatedPose): number {
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
