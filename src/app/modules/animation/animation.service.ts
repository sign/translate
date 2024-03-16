import type {Tensor} from '@tensorflow/tfjs';
import type {LayersModel} from '@tensorflow/tfjs-layers';
import {Injectable} from '@angular/core';
import {EstimatedPose} from '../pose/pose.state';
import {TensorflowService} from '../../core/services/tfjs/tfjs.service';
import {PoseService} from '../pose/pose.service';

const ANIMATION_KEYS = [
  'mixamorigHead.quaternion',
  'mixamorigNeck.quaternion',
  'mixamorigSpine.quaternion',
  'mixamorigSpine1.quaternion',
  'mixamorigSpine2.quaternion',
  'mixamorigHips.quaternion',

  'mixamorigLeftUpLeg.quaternion',
  'mixamorigLeftLeg.quaternion',
  'mixamorigLeftToeBase.quaternion',
  'mixamorigLeftFoot.quaternion',
  'mixamorigLeftArm.quaternion',
  'mixamorigLeftShoulder.quaternion',
  'mixamorigLeftForeArm.quaternion',

  'mixamorigRightUpLeg.quaternion',
  'mixamorigRightLeg.quaternion',
  'mixamorigRightToeBase.quaternion',
  'mixamorigRightFoot.quaternion',
  'mixamorigRightArm.quaternion',
  'mixamorigRightShoulder.quaternion',
  'mixamorigRightForeArm.quaternion',

  'mixamorigLeftHand.quaternion',
  'mixamorigLeftHandThumb1.quaternion',
  'mixamorigLeftHandThumb2.quaternion',
  'mixamorigLeftHandThumb3.quaternion',
  'mixamorigLeftHandIndex1.quaternion',
  'mixamorigLeftHandIndex2.quaternion',
  'mixamorigLeftHandIndex3.quaternion',
  'mixamorigLeftHandMiddle1.quaternion',
  'mixamorigLeftHandMiddle2.quaternion',
  'mixamorigLeftHandMiddle3.quaternion',
  'mixamorigLeftHandRing1.quaternion',
  'mixamorigLeftHandRing2.quaternion',
  'mixamorigLeftHandRing3.quaternion',
  'mixamorigLeftHandPinky1.quaternion',
  'mixamorigLeftHandPinky2.quaternion',
  'mixamorigLeftHandPinky3.quaternion',

  'mixamorigRightHand.quaternion',
  'mixamorigRightHandThumb1.quaternion',
  'mixamorigRightHandThumb2.quaternion',
  'mixamorigRightHandThumb3.quaternion',
  'mixamorigRightHandIndex1.quaternion',
  'mixamorigRightHandIndex2.quaternion',
  'mixamorigRightHandIndex3.quaternion',
  'mixamorigRightHandMiddle1.quaternion',
  'mixamorigRightHandMiddle2.quaternion',
  'mixamorigRightHandMiddle3.quaternion',
  'mixamorigRightHandRing1.quaternion',
  'mixamorigRightHandRing2.quaternion',
  'mixamorigRightHandRing3.quaternion',
  'mixamorigRightHandPinky1.quaternion',
  'mixamorigRightHandPinky2.quaternion',
  'mixamorigRightHandPinky3.quaternion',
];

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  sequentialModel: LayersModel;

  constructor(private tf: TensorflowService, private poseService: PoseService) {}

  async loadModel(): Promise<LayersModel> {
    await this.tf.load();
    return this.tf
      .loadLayersModel('assets/models/pose-animation/model.json')
      .then(model => (this.sequentialModel = model as unknown as LayersModel));
  }

  normalizePose(pose: EstimatedPose): Tensor {
    const landmarks = this.poseService.normalizeHolistic(pose, [
      'poseLandmarks',
      'leftHandLandmarks',
      'rightHandLandmarks',
    ]);
    return this.tf.tensor(landmarks.map(l => [l.x, l.y, l.z]));
  }

  estimate(poses: EstimatedPose[]): {[key: string]: [number, number, number, number][]} {
    if (!this.sequentialModel) {
      return null;
    }

    const quaternions = this.tf.tidy(() => {
      const normalized = poses.map(pose => this.normalizePose(pose).reshape([1, 75 * 3]));
      const stack = this.tf.stack(normalized, 1);
      const pred: Tensor = this.sequentialModel.predict(stack) as Tensor;
      const sequence = pred.reshape([normalized.length, ANIMATION_KEYS.length, 4]);
      const keysSequence = sequence.transpose([1, 0, 2]);
      return keysSequence.arraySync();
    });

    const tracks = {};
    ANIMATION_KEYS.forEach((k, i) => (tracks[k] = quaternions[i]));
    return tracks;
  }
}
