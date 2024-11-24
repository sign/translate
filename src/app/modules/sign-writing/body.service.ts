import {inject, Injectable} from '@angular/core';
import {SignWritingService} from './sign-writing.service';
import {PoseLandmark} from '../pose/pose.state';
import {ThreeService} from '../../core/services/three.service';
import type {Vector2} from 'three';
import {MediapipeHolisticService} from '../../core/services/holistic.service';

export interface BodyShoulders {
  center: Vector2;
  width: number;
}

export interface BodyStateModel {
  shoulders: BodyShoulders;
  elbows: [PoseLandmark, PoseLandmark];
  wrists: [PoseLandmark, PoseLandmark];
}

@Injectable({
  providedIn: 'root',
})
export class BodyService {
  private three = inject(ThreeService);
  private holistic = inject(MediapipeHolisticService);

  shoulders(landmarks: PoseLandmark[]): BodyShoulders {
    const p1 = landmarks[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER];
    const p2 = landmarks[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER];

    return {
      center: new this.three.Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2),
      width: Math.abs(p1.x - p2.x),
    };
  }

  drawShoulders(shoulders: BodyShoulders, ctx: CanvasRenderingContext2D): void {
    const shouldersText = '񎣡';
    const fontSize = SignWritingService.textFontSize(shouldersText, shoulders.width, ctx);
    SignWritingService.drawSWText(shouldersText, shoulders.center, fontSize, ctx);
  }

  drawArm(shoulder: PoseLandmark, elbow: PoseLandmark, wrist: PoseLandmark, ctx: CanvasRenderingContext2D): void {
    // make sure elbow is visible
    if (elbow.visibility < 0.8) {
      return;
    }
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(shoulder.x * ctx.canvas.width, shoulder.y * ctx.canvas.height);
    ctx.lineTo(elbow.x * ctx.canvas.width, elbow.y * ctx.canvas.height);
    if (wrist.visibility > 0.8) {
      ctx.lineTo(wrist.x * ctx.canvas.width, wrist.y * ctx.canvas.height);
    }
    ctx.stroke();
  }

  drawArms(body: BodyStateModel, ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = (body.shoulders.width * ctx.canvas.width) / 50;
    const shoulders = [
      {x: body.shoulders.center.x + 0.45 * body.shoulders.width, y: body.shoulders.center.y},
      {x: body.shoulders.center.x - 0.45 * body.shoulders.width, y: body.shoulders.center.y},
    ] as PoseLandmark[];
    this.drawArm(shoulders[0], body.elbows[0], body.wrists[0], ctx);
    this.drawArm(shoulders[1], body.elbows[1], body.wrists[1], ctx);
  }

  draw(body: BodyStateModel, ctx: CanvasRenderingContext2D): void {
    if (body) {
      this.drawShoulders(body.shoulders, ctx);
      this.drawArms(body, ctx);
    }
  }
}
