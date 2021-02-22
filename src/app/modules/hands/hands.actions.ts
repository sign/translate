import {PoseLandmark} from '../pose/pose.state';

export class EstimateHandShape {
  static readonly type = '[Hands] Estimate Hand Shape';

  constructor(public hand: 'leftHand' | 'rightHand', public landmarks?: PoseLandmark[]) {
  }
}
