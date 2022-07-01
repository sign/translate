# Sign Language Detection

Paper: https://arxiv.org/abs/2008.04637

Training code: https://github.com/sign/detection-train

Video: https://www.youtube.com/watch?v=nozz2pvbG_Q

Original demo application: https://sign-language-detector.web.app/

### Disclaimer:

This model was trained with OpenPose data at 50fps, with frame-dropout to mimic lower FPS. In this app we use MediaPipe
Holistic pose estimation, which is incompatible with OpenPose. For information on how we convert the holistic pose to
something similar to OpenPose, check out `newFakePose` created
in [`DetectorService`](../../../app/modules/detector/detector.service.ts).
