import {Pose} from './pose.state';

export class PoseVideoFrame {
  static readonly type = '[Pose] Pose Video Frame';

  constructor(public video: HTMLVideoElement) {}
}

export class StoreFramePose {
  static readonly type = '[Pose] Store Frame Pose';

  constructor(public pose: Pose) {}
}
