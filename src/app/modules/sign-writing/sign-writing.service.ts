import {inject, Injectable} from '@angular/core';
import {HandsService} from './hands.service';
import {SignWritingStateModel} from './sign-writing.state';
import {BodyService} from './body.service';
import {FaceService} from './face.service';
import type {Vector2, Vector3} from 'three';
import type {font} from '@sutton-signwriting/font-ttf';

@Injectable({
  providedIn: 'root',
})
export class SignWritingService {
  private bodyService = inject(BodyService);
  private faceService = inject(FaceService);
  private handsService = inject(HandsService);

  static font: Promise<typeof font>;
  static fontsLoaded = false;

  static get fontsModule() {
    if (!SignWritingService.font) {
      SignWritingService.font = import(
        /* webpackChunkName: "@sutton-signwriting/font-ttf" */ '@sutton-signwriting/font-ttf/font/font.min'
      ) as Promise<typeof font>;
    }
    return SignWritingService.font;
  }

  static async cssLoaded() {
    const fontModule = await SignWritingService.fontsModule;
    return new Promise(resolve => fontModule.cssLoaded(resolve));
  }

  static async loadFonts() {
    if (SignWritingService.fontsLoaded) {
      return;
    }
    SignWritingService.fontsLoaded = true;

    const fontModule = await SignWritingService.fontsModule;

    // Set local font directory, copied from @sutton-signwriting/font-ttf
    fontModule.cssAppend('assets/fonts/signwriting/');
  }

  static async normalizeFSW(text: string): Promise<string> {
    const {signNormalize} = await import(
      /* webpackChunkName: "@sutton-signwriting/font-ttf/fsw" */ '@sutton-signwriting/font-ttf/fsw/fsw'
    );
    return signNormalize(text);
  }

  static textFontSize(text: string, width: number, ctx: CanvasRenderingContext2D): number {
    ctx.font = '100px SuttonSignWritingOneD';
    const measure = ctx.measureText(text);
    const bboxWidth = width * ctx.canvas.width;
    const scale = bboxWidth / measure.width;

    return 100 * scale;
  }

  static drawSWText(
    text: string,
    center: Vector2 | Vector3,
    fontSize: number,
    ctx: CanvasRenderingContext2D,
    isNormalized = true
  ): void {
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
