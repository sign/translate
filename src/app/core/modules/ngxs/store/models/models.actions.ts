export class PoseVideoFrame {
  static readonly type = '[Models] Pose Video Frame';

  constructor(public video: HTMLVideoElement) {
  }
}

export class DetectSigning {
  static readonly type = '[Models] Detect Signing';
}
