import * as tf from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs';
import {EMPTY_LANDMARK, Pose, PoseLandmark} from '../pose/pose.state';
import {LayersModel} from '@tensorflow/tfjs-layers';
import {Injectable} from '@angular/core';
import * as holistic from '@mediapipe/holistic/holistic.js';

const ANIMATION_KEYS = [
  'mixamorigHead.quaternion', 'mixamorigNeck.quaternion', 'mixamorigSpine.quaternion',
  'mixamorigSpine1.quaternion', 'mixamorigSpine2.quaternion', 'mixamorigHips.quaternion',

  'mixamorigLeftUpLeg.quaternion', 'mixamorigLeftLeg.quaternion', 'mixamorigLeftToeBase.quaternion',
  'mixamorigLeftFoot.quaternion', 'mixamorigLeftArm.quaternion',
  'mixamorigLeftShoulder.quaternion', 'mixamorigLeftForeArm.quaternion',

  'mixamorigRightUpLeg.quaternion', 'mixamorigRightLeg.quaternion', 'mixamorigRightToeBase.quaternion',
  'mixamorigRightFoot.quaternion', 'mixamorigRightArm.quaternion',
  'mixamorigRightShoulder.quaternion', 'mixamorigRightForeArm.quaternion',

  'mixamorigLeftHand.quaternion',
  'mixamorigLeftHandThumb1.quaternion', 'mixamorigLeftHandThumb2.quaternion',
  'mixamorigLeftHandThumb3.quaternion',
  'mixamorigLeftHandIndex1.quaternion', 'mixamorigLeftHandIndex2.quaternion',
  'mixamorigLeftHandIndex3.quaternion',
  'mixamorigLeftHandMiddle1.quaternion', 'mixamorigLeftHandMiddle2.quaternion',
  'mixamorigLeftHandMiddle3.quaternion',
  'mixamorigLeftHandRing1.quaternion', 'mixamorigLeftHandRing2.quaternion', 'mixamorigLeftHandRing3.quaternion',
  'mixamorigLeftHandPinky1.quaternion', 'mixamorigLeftHandPinky2.quaternion',
  'mixamorigLeftHandPinky3.quaternion',

  'mixamorigRightHand.quaternion',
  'mixamorigRightHandThumb1.quaternion', 'mixamorigRightHandThumb2.quaternion',
  'mixamorigRightHandThumb3.quaternion',
  'mixamorigRightHandIndex1.quaternion', 'mixamorigRightHandIndex2.quaternion',
  'mixamorigRightHandIndex3.quaternion',
  'mixamorigRightHandMiddle1.quaternion', 'mixamorigRightHandMiddle2.quaternion',
  'mixamorigRightHandMiddle3.quaternion',
  'mixamorigRightHandRing1.quaternion', 'mixamorigRightHandRing2.quaternion',
  'mixamorigRightHandRing3.quaternion',
  'mixamorigRightHandPinky1.quaternion', 'mixamorigRightHandPinky2.quaternion',
  'mixamorigRightHandPinky3.quaternion',
];

// The reason some numbers are hard coded is v0.1 of holistic doesn't have these names. TODO remove when v0.3 works
const BODY_MAPPING = {
  LeftEye: holistic.POSE_LANDMARKS.LEFT_EYE,
  RightEye: holistic.POSE_LANDMARKS.RIGHT_EYE,
  LeftArm: holistic.POSE_LANDMARKS.LEFT_SHOULDER,
  LeftForeArm: holistic.POSE_LANDMARKS.LEFT_ELBOW,
  RightArm: holistic.POSE_LANDMARKS.RIGHT_SHOULDER,
  RightForeArm: holistic.POSE_LANDMARKS.RIGHT_ELBOW
};

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  sequentialModel: LayersModel;

  loadModel(): void {
    tf.loadLayersModel('assets/models/pose-animation/model.json')
      .then(model => this.sequentialModel = model as unknown as LayersModel);
  }

  normalizePose(pose: Pose): tf.Tensor {
    const bodyLandmarks = this.bodyLandmarks(pose);
    const leftHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    const rightHandLandmarks = pose.rightHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    // Use fallback wrists if hands not detected
    if (pose.poseLandmarks) {
      if (!pose.leftHandLandmarks) {
        leftHandLandmarks[0] = pose.poseLandmarks[holistic.POSE_LANDMARKS.LEFT_WRIST];
      }
      if (!pose.rightHandLandmarks) {
        rightHandLandmarks[0] = pose.poseLandmarks[holistic.POSE_LANDMARKS.RIGHT_WRIST];
      }
    }

    const landmarks = bodyLandmarks.concat(leftHandLandmarks, rightHandLandmarks);

    const tensor = tf.tensor(landmarks.map(l => [l.x, l.y, 0])) // Model was trained with no z axis because holistic z != real z
      .mul(tf.tensor([pose.image.width, pose.image.height, pose.image.width]));

    const p1 = tensor.slice(2, 1);
    const p2 = tensor.slice(4, 1);

    const d = tf.sqrt(tf.pow(p2.sub(p1), 2).sum());
    let normTensor = tf.sub(tensor, p1.add(p2).div(2)).div(d);
    normTensor = normTensor.mul(tensor.notEqual(0)); // Remove landmarks not detected

    return normTensor;
  }

  estimate(pose: Pose): { [key: string]: [number, number, number, number] } {
    if (!this.sequentialModel) {
      return null;
    }

    const quaternions = tf.tidy(() => {
      const normalized = this.normalizePose(pose).reshape([1, 1, -1]);
      const pred: Tensor = this.sequentialModel.predict(normalized) as Tensor;
      return pred.reshape([ANIMATION_KEYS.length, 4]).arraySync();
    });

    const tracks = {};
    ANIMATION_KEYS.forEach((k, i) => tracks[k] = quaternions[i]);
    return tracks;
  }

  private bodyLandmarks(pose: Pose): PoseLandmark[] {
    if (!pose.poseLandmarks) {
      return new Array(Object.keys(BODY_MAPPING).length).fill(EMPTY_LANDMARK);
    }

    return Object.values(BODY_MAPPING).map(i => pose.poseLandmarks[i]);
  }

}
