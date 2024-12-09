import {inject, Injectable} from '@angular/core';
import type {Vector2, Vector3} from 'three';
import {SignWritingStateModel} from './sign-writing.state';
import {SignWritingService} from './sign-writing.service';
import type {LayersModel} from '@tensorflow/tfjs-layers';
import type {Tensor} from '@tensorflow/tfjs';
import {PoseNormalizationService} from '../pose/pose-normalization.service';
import {TensorflowService} from '../../core/services/tfjs/tfjs.service';
import {ThreeService} from '../../core/services/three.service';

export interface SWFeatureDescription {
  location: Vector2 | Vector3;
  symbol: string;
}

export interface FaceStateModel {
  face?: SWFeatureDescription;
  eyes?: {
    left: SWFeatureDescription;
    right: SWFeatureDescription;
  };
  eyebrows?: {
    left: SWFeatureDescription;
    right: SWFeatureDescription;
  };
  mouth?: SWFeatureDescription;
}

const FACE_MAP = {
  Eyes: ['񌞱', '񌡱', '񌠑', '񌧱'],
  Eyebrows: ['񌑑', '񌏱', '񌒱'],
  Mouth: ['񍪱', '񍡱', '񍤱', '񍘱', '񍝑', '񍠑', '񍭱'],
};

@Injectable({
  providedIn: 'root',
})
export class FaceService {
  private poseNormalization = inject(PoseNormalizationService);
  private tf = inject(TensorflowService);
  private three = inject(ThreeService);

  faceSequentialModel: LayersModel;

  async loadModel(): Promise<LayersModel> {
    await Promise.all([this.tf.load(), this.three.load()]);
    return this.tf
      .loadLayersModel('assets/models/face-features/model.json')
      .then(model => (this.faceSequentialModel = model as unknown as LayersModel));
  }

  normalize(vectors): Tensor {
    const normal = this.poseNormalization.normal(vectors, [4, 133, 362]);
    return this.poseNormalization.normalize(vectors, normal, [4, 6], 4);
  }

  shape(vectors: Vector3[]): FaceStateModel {
    const faceLocation = vectors[4];
    const model = this.faceSequentialModel;

    if (!model) {
      // By default, just open eyes
      return {face: {location: faceLocation, symbol: '񌞁'}};
    }

    // 4 # Nose
    // 362 # Right eye inner
    // 133 # Left eye inner

    const state = this.tf.tidy((): any => {
      const faceTensor = this.normalize(vectors);
      let pred: Tensor = model.predict(faceTensor.reshape([1, 1, 468 * 3])) as Tensor;
      pred = pred.reshape([-1]);
      const result: any = {};
      let i = 0;
      for (const [k, vs] of Object.entries(FACE_MAP)) {
        result[k] = vs[pred.slice(i, vs.length).argMax(0).dataSync()[0]];
        i += vs.length;
      }
      return result;
    });

    // Eyes
    const eyeSymbol = this.shift(state.Eyes, 0x10);
    const eyesY = (vectors[133].y + vectors[362].y) / 2;
    const leftEye = new this.three.Vector2((vectors[133].x + vectors[33].x) / 2, eyesY);
    const rightEye = new this.three.Vector2((vectors[362].x + vectors[263].x) / 2, eyesY);

    // Eyebrows
    const eyebrowsY = (vectors[65].y + vectors[362].y) / 2;
    const leftEyebrowSymbol = this.shift(state.Eyebrows, 0x10);
    const leftEyebrow = new this.three.Vector2(vectors[282].x, eyebrowsY);
    const rightEyebrowSymbol = this.shift(state.Eyebrows, 0x20);
    const rightEyebrow = new this.three.Vector2(vectors[52].x, eyebrowsY);

    // Mouth
    const mouthX = (vectors[14].x + vectors[17].x) / 2;
    const mouthY = (vectors[14].y + vectors[17].y) / 2;
    const mouthLocation = new this.three.Vector2(mouthX, mouthY);

    return {
      face: {location: faceLocation, symbol: '񋾡'},
      eyes: {
        left: {location: leftEye, symbol: eyeSymbol},
        right: {location: rightEye, symbol: eyeSymbol},
      },
      eyebrows: {
        left: {location: leftEyebrow, symbol: leftEyebrowSymbol},
        right: {location: rightEyebrow, symbol: rightEyebrowSymbol},
      },
      mouth: {location: mouthLocation, symbol: state.Mouth},
    };
  }

  drawFaceFeature(width: number, feature: SWFeatureDescription, ctx: CanvasRenderingContext2D): void {
    const fontSize = SignWritingService.textFontSize(feature.symbol, width, ctx);
    SignWritingService.drawSWText(feature.symbol, feature.location, fontSize, ctx, false);
  }

  draw(swState: SignWritingStateModel, ctx: CanvasRenderingContext2D): void {
    if (!swState.face) {
      return;
    }

    const sw = swState.body.shoulders.width;

    const {face, eyes, eyebrows, mouth} = swState.face;
    if (face) {
      this.drawFaceFeature(sw * 0.7, face, ctx);
    }
    if (eyes) {
      this.drawFaceFeature(sw * 0.2, eyes.left, ctx);
      this.drawFaceFeature(sw * 0.2, eyes.right, ctx);
    }
    if (eyebrows) {
      this.drawFaceFeature(sw * 0.15, eyebrows.left, ctx);
      this.drawFaceFeature(sw * 0.15, eyebrows.right, ctx);
    }
    if (mouth) {
      this.drawFaceFeature(sw * 0.25, mouth, ctx);
    }
  }

  private shift(char: string, shift: number): string {
    return String.fromCodePoint(char.codePointAt(0) + shift);
  }
}
