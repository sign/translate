import {EstimatedPose} from '../pose/pose.state';

export class DetectSigning {
  static readonly type = '[Detector] Detect If Signing';

  constructor(public pose: EstimatedPose) {}
}
