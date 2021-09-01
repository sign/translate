import {Injectable} from '@angular/core';
import {HandsService} from './hands.service';
import {SignWritingStateModel} from './sign-writing.state';
import {BodyService} from './body.service';
import {FaceService} from './face.service';
import {Vector2, Vector3} from 'three';


@Injectable({
  providedIn: 'root'
})
export class SignWritingService {
  constructor(private bodyService: BodyService,
              private faceService: FaceService,
              private handsService: HandsService) {
  }

  static textFontSize(text: string, width: number, ctx: CanvasRenderingContext2D): number {
    ctx.font = '100px SuttonSignWritingOneD';
    const measure = ctx.measureText(text);
    const bboxWidth = width * ctx.canvas.width;
    const scale = bboxWidth / measure.width;

    return 100 * scale;
  }

  static drawSWText(text: string, center: Vector2 | Vector3, fontSize: number,
                    ctx: CanvasRenderingContext2D, isNormalized = true): void {
    ctx.font = fontSize + 'px SuttonSignWritingOneD';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    const x = isNormalized ? center.x * ctx.canvas.width : center.x;
    const y = isNormalized ? center.y * ctx.canvas.height : center.y;
    ctx.fillText(text, x, y);
  }


  draw(swState: SignWritingStateModel, ctx: CanvasRenderingContext2D): void {
    this.bodyService.draw(swState.body, ctx);
    this.faceService.draw(swState, ctx);
    this.handsService.draw(swState, ctx);
  }
}
