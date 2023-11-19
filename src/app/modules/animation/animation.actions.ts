import {EstimatedPose} from '../pose/pose.state';

export class AnimatePose {
  static readonly type = '[Animation] Get animation state from pose';

  constructor(public pose: EstimatedPose) {}
}
