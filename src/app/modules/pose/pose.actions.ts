import {EstimatedPose} from './pose.state';

export class LoadPoseEstimationModel {
  static readonly type = '[Pose] Load Pose Estimation Model';

  constructor() {}
}

export class PoseVideoFrame {
  static readonly type = '[Pose] Pose Video Frame';

  constructor(public video: HTMLVideoElement) {}
}

export class StoreFramePose {
  static readonly type = '[Pose] Store Frame Pose';

  constructor(public pose: EstimatedPose) {}
}
