import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {FaceStateModel, SignWritingStateModel} from './sign-writing.state';
import {SignWritingService} from './sign-writing.service';
import {PoseLandmark} from '../pose/pose.state';


@Injectable({
  providedIn: 'root'
})
export class FaceService {

  center(landmarks: PoseLandmark[]): THREE.Vector2 {
    const nose = landmarks[4]; // Nose point

    return new THREE.Vector2(nose.x, nose.y);
  }

  drawFace(shouldersWidth: number, face: FaceStateModel, ctx: CanvasRenderingContext2D): void {
    const fontSize = SignWritingService.textFontSize(face.shape, shouldersWidth * 0.6, ctx);
    SignWritingService.drawSWText(face.shape, face.center, fontSize, ctx);
  }

  draw(swState: SignWritingStateModel, ctx: CanvasRenderingContext2D): void {
    if (swState.face) {
      this.drawFace(swState.body.shoulders.width, swState.face, ctx);
    }
  }
}
