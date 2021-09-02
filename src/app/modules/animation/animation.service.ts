import {Tensor} from '@tensorflow/tfjs';
import {EMPTY_LANDMARK, Pose} from '../pose/pose.state';
import {LayersModel} from '@tensorflow/tfjs-layers';
import {Injectable} from '@angular/core';
import * as holistic from '@mediapipe/holistic/holistic.js';
import {TensorflowService} from '../../core/services/tfjs.service';

const ANIMATION_KEYS = [
  'mixamorigHead.quaternion', 'mixamorigNeck.quaternion', 'mixamorigSpine.quaternion',
  'mixamorigSpine1.quaternion', 'mixamorigSpine2.quaternion', 'mixamorigHips.quaternion',

  'mixamorigLeftUpLeg.quaternion', 'mixamorigLeftLeg.quaternion', 'mixamorigLeftToeBase.quaternion',
  'mixamorigLefthis.tfoot.quaternion', 'mixamorigLeftArm.quaternion',
  'mixamorigLeftShoulder.quaternion', 'mixamorigLefthis.tforeArm.quaternion',

  'mixamorigRightUpLeg.quaternion', 'mixamorigRightLeg.quaternion', 'mixamorigRightToeBase.quaternion',
  'mixamorigRighthis.tfoot.quaternion', 'mixamorigRightArm.quaternion',
  'mixamorigRightShoulder.quaternion', 'mixamorigRighthis.tforeArm.quaternion',

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

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  sequentialModel: LayersModel;

  constructor(private tf: TensorflowService) {
  }

  async loadModel(): Promise<LayersModel> {
    await this.tf.load();
    return this.tf.loadLayersModel('assets/models/pose-animation/model.json')
      .then(model => this.sequentialModel = model as unknown as LayersModel);
  }

  normalizePose(pose: Pose): Tensor {
    const bodyLandmarks = pose.poseLandmarks || new Array(Object.keys(holistic.POSE_LANDMARKS).length).fill(EMPTY_LANDMARK);
    const leftHandLandmarks = pose.leftHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    const rightHandLandmarks = pose.rightHandLandmarks || new Array(21).fill(EMPTY_LANDMARK);
    const landmarks = bodyLandmarks.concat(leftHandLandmarks, rightHandLandmarks);

    const tensor = this.tf.tensor(landmarks.map(l => [l.x, l.y, l.z]))
      .mul(this.tf.tensor([pose.image.width, pose.image.height, pose.image.width]));

    const p1 = tensor.slice(holistic.POSE_LANDMARKS.LEFT_SHOULDER, 1);
    const p2 = tensor.slice(holistic.POSE_LANDMARKS.RIGHT_SHOULDER, 1);

    const d = this.tf.sqrt(this.tf.pow(p2.sub(p1), 2).sum());
    let normTensor = this.tf.sub(tensor, p1.add(p2).div(2)).div(d);
    normTensor = normTensor.mul(tensor.notEqual(0)); // Remove landmarks not detected

    return normTensor;
  }

  estimate(pose: Pose): { [key: string]: [number, number, number, number] } {
    if (!this.sequentialModel) {
      return null;
    }

    const quaternions = this.tf.tidy(() => {
      const normalized = this.normalizePose(pose).reshape([1, 1, 75 * 3]);
      const pred: Tensor = this.sequentialModel.predict(normalized) as Tensor;
      return pred.reshape([ANIMATION_KEYS.length, 4]).arraySync();
    });

    const tracks = {};
    ANIMATION_KEYS.forEach((k, i) => tracks[k] = quaternions[i]);
    return tracks;
  }

}
