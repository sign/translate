import {Injectable} from '@angular/core';
import * as holistic from '@mediapipe/holistic';

@Injectable({
  providedIn: 'root',
})
export class MediapipeHolisticService {
  private importPromise: Promise<typeof holistic>;
  private holistic: typeof holistic;

  async load(): Promise<typeof holistic> {
    if (!this.importPromise) {
      this.importPromise = import(/* webpackChunkName: "@mediapipe/holistic" */ '@mediapipe/holistic').then(
        module => (this.holistic = module)
      );
    }

    return this.importPromise;
  }

  get Holistic(): typeof holistic.Holistic {
    return this.holistic.Holistic;
  }

  get POSE_LANDMARKS(): typeof holistic.POSE_LANDMARKS {
    return this.holistic.POSE_LANDMARKS;
  }

  get POSE_CONNECTIONS(): typeof holistic.POSE_CONNECTIONS {
    return this.holistic.POSE_CONNECTIONS;
  }

  get HAND_CONNECTIONS(): typeof holistic.HAND_CONNECTIONS {
    return this.holistic.HAND_CONNECTIONS;
  }

  get FACEMESH_TESSELATION(): typeof holistic.FACEMESH_TESSELATION {
    return this.holistic.FACEMESH_TESSELATION;
  }

  get FACEMESH_RIGHT_EYE(): typeof holistic.FACEMESH_RIGHT_EYE {
    return this.holistic.FACEMESH_RIGHT_EYE;
  }

  get FACEMESH_RIGHT_EYEBROW(): typeof holistic.FACEMESH_RIGHT_EYEBROW {
    return this.holistic.FACEMESH_RIGHT_EYEBROW;
  }

  get FACEMESH_LEFT_EYE(): typeof holistic.FACEMESH_LEFT_EYE {
    return this.holistic.FACEMESH_LEFT_EYE;
  }

  get FACEMESH_LEFT_EYEBROW(): typeof holistic.FACEMESH_LEFT_EYEBROW {
    return this.holistic.FACEMESH_LEFT_EYEBROW;
  }

  get FACEMESH_FACE_OVAL(): typeof holistic.FACEMESH_FACE_OVAL {
    return this.holistic.FACEMESH_FACE_OVAL;
  }

  get FACEMESH_LIPS(): typeof holistic.FACEMESH_LIPS {
    return this.holistic.FACEMESH_LIPS;
  }
}
