import {Pose} from './pose.state';

export class LoadPoseModel {
  static readonly type = '[Pose] Load Pose Model';

  constructor() {}
}

export class PoseVideoFrame {
  static readonly type = '[Pose] Pose Video Frame';

  constructor(public video: HTMLVideoElement) {}
}

export class StoreFramePose {
  static readonly type = '[Pose] Store Frame Pose';

  constructor(public pose: Pose) {}
}
