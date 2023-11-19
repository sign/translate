import {EstimatedPose, PoseLandmark} from '../pose/pose.state';

export class EstimateHandShape {
  static readonly type = '[SignWriting - Hands] Estimate Hand Shape';

  constructor(
    public hand: 'leftHand' | 'rightHand',
    public landmarks: PoseLandmark[],
    public poseImage: HTMLCanvasElement
  ) {}
}

export class EstimateFaceShape {
  static readonly type = '[SignWriting - Face] Estimate Face Shape';

  constructor(public landmarks: PoseLandmark[], public poseImage: HTMLCanvasElement) {}
}

export class CalculateBodyFactors {
  static readonly type = '[SignWriting - Body] Calculate Body Factors';

  constructor(public pose: EstimatedPose) {}
}
