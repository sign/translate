import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {SignWritingStateModel} from './sign-writing.state';
import {SignWritingService} from './sign-writing.service';
import {LayersModel} from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs';
import {PlaneNormal, PoseNormalizationService} from '../pose/pose-normalization.service';

export type HandPlane = 'wall' | 'floor';
export type HandDirection = 'me' | 'you' | 'side';

export interface HandStateModel {
  bbox: THREE.Box3;
  normal: PlaneNormal;
  plane: HandPlane;
  rotation: number; // Rotation  [0,7]
  direction: 'me' | 'you' | 'both';
  shape: string;
}

@Injectable({
  providedIn: 'root'
})
export class HandsService {

  // Need two models because they are stateful
  leftHandSequentialModel: LayersModel;
  rightHandSequentialModel: LayersModel;

  constructor(private poseNormalization: PoseNormalizationService) {
  }

  async loadModel(): Promise<LayersModel[]> {
    return Promise.all([
      tf.loadLayersModel('assets/models/hand-shape/model.json')
        .then(model => this.leftHandSequentialModel = model as unknown as LayersModel),
      tf.loadLayersModel('assets/models/hand-shape/model.json') // TODO figure out a way to copy the model, not load twice
        .then(model => this.rightHandSequentialModel = model as unknown as LayersModel)
    ]);
  }

  normalizeHand(vectors: THREE.Vector3[], normal: PlaneNormal, flipHand: boolean): tf.Tensor {
    return this.poseNormalization.normalize(vectors, normal, [0, 9], 0, flipHand);
  }

  shape(vectors: THREE.Vector3[], normal: PlaneNormal, isLeft: boolean): string {
    const model = isLeft ? this.leftHandSequentialModel : this.rightHandSequentialModel;
    if (!model) {
      return '񆄡'; // By default just fist shape
    }

    const hsIndex = tf.tidy(() => {
      const handTensor = this.normalizeHand(vectors, normal, isLeft);
      const pred: Tensor = model.predict(handTensor.reshape([1, 1, 63])) as Tensor;
      const argmax = tf.softmax(pred).argMax(2).dataSync();
      return argmax[0];
    });

    const code = 262145 + 0x60 * hsIndex;
    return String.fromCodePoint(code);
  }

  bbox(vectors: THREE.Vector3[]): THREE.Box3 {
    return new THREE.Box3().setFromPoints(vectors);
  }

  normal(vectors: THREE.Vector3[], flipNormal: boolean = false): PlaneNormal {
    // 0 - WRIST
    // 5 - INDEX_FINGER_MCP
    // 17 - PINKY_MCP
    const planeNormal = this.poseNormalization.normal(vectors, [0, 5, 17]);

    planeNormal.direction = planeNormal.direction.multiplyScalar(flipNormal ? -1 : 1);

    return planeNormal;
  }

  plane(vectors: THREE.Vector3[]): HandPlane {
    const p1 = vectors[0];
    const p2 = vectors[13];

    const y = Math.abs(p2.y - p1.y) * 1.5; // add bias to y
    const z = Math.abs(p2.z - p1.z);

    if (y > z) {
      return 'wall';
    }
    return 'floor';
  }

  angleRotationBucket(angle: number): number {
    angle += 360 / 16; // make a safety margin around every angle
    angle = (angle + 360) % 360; // working with positive angles is easier
    return Math.floor(angle / 45);
  }

  rotation(vectors: THREE.Vector3[]): number {
    const p1 = vectors[0];
    const p2 = vectors[13];

    const angle = this.poseNormalization.angle(p2.y - p1.y, p2.x - p1.x) + 90; // SignWriting first char is 90 degrees rotated
    return this.angleRotationBucket(angle);
  }

  direction(plane: HandPlane, normal: PlaneNormal, flipAxis: boolean): HandDirection {
    const x = flipAxis ? normal.direction.x : -normal.direction.x; // For right hand, flip the x axis

    // TODO subtract chest normal from hand normal, to allow for body rotation

    switch (plane) {
      case 'wall':
        const xzAngle = this.poseNormalization.angle(normal.direction.z, x);

        if (xzAngle > 210) { // 180 degrees + 30 safety
          return 'me';
        }

        if (xzAngle > 150) {
          return 'side';
        }

        return 'you';

      case 'floor':
        const xyAngle = this.poseNormalization.angle(normal.direction.y, x);

        // TODO this is not correct

        if (xyAngle > 0) {
          return 'me';
        }

        if (xyAngle > -60) {
          return 'side';
        }

        return 'you';
    }
  }

  drawBbox(bbox: THREE.Box3, ctx: CanvasRenderingContext2D): void {
    const dimensions = new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 0);
    const min = new THREE.Vector3().multiplyVectors(bbox.min, dimensions);
    const max = new THREE.Vector3().multiplyVectors(bbox.max, dimensions);

    ctx.strokeStyle = '#0000FF';
    ctx.beginPath();
    ctx.moveTo(min.x, min.y);
    ctx.lineTo(min.x, max.y);
    ctx.lineTo(max.x, max.y);
    ctx.lineTo(max.x, min.y);
    ctx.lineTo(min.x, min.y);
    ctx.stroke();
  }

  drawNormal(normal: PlaneNormal, ctx: CanvasRenderingContext2D): void {
    const dimensions = new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, ctx.canvas.width);

    const scaledNormal = new THREE.Vector3().multiplyVectors(dimensions, normal.direction).normalize().multiplyScalar(100);

    const center = new THREE.Vector3().multiplyVectors(dimensions, normal.center);

    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + scaledNormal.x, center.y + scaledNormal.y);
    ctx.stroke();
  }

  drawShape(shouldersWidth: number, hand: HandStateModel, isLeft: boolean, ctx: CanvasRenderingContext2D): void {
    let char = hand.shape.codePointAt(0);

    const heelView = new Set(['񁹱', '񁳱', '񆆑', '񅱑', '񁶱', '񂍑', '񂊑'].map(c => c.codePointAt(0)));
    const isHeelView = heelView.has(char + 0x10);

    if (!isLeft) {
      char += 0x8;
    }

    // Rotation
    char += isLeft ? (8 - hand.rotation) % 8 : hand.rotation;

    if (isHeelView) {  // Heel view only has "side" shift
      char += 0x10;
    } else {
      if (hand.plane === 'floor') {
        char += 0x30;
      }

      // Direction
      const shifts = {
        you: 0,
        side: 0x10,
        me: 0x20
      };
      char += shifts[hand.direction];
    }

    const text = String.fromCodePoint(char);
    const center = new THREE.Vector2((hand.bbox.min.x + hand.bbox.max.x) / (2 * ctx.canvas.width),
      (hand.bbox.min.y + hand.bbox.max.y) / (2 * ctx.canvas.height));

    // Font should be same size for all shapes, where flat hand is 1/3 of shoulders width
    const fontSize = SignWritingService.textFontSize('񂇁', shouldersWidth / 3, ctx);

    SignWritingService.drawSWText(text, center, fontSize, ctx);
  }

  drawHand(shouldersWidth: number, hand: HandStateModel, isLeft: boolean, ctx: CanvasRenderingContext2D): void {
    // this.drawBbox(hand.bbox, ctx);
    // this.drawNormal(hand.normal, ctx);
    this.drawShape(shouldersWidth, hand, isLeft, ctx);
  }

  draw(swState: SignWritingStateModel, ctx: CanvasRenderingContext2D): void {
    if (swState.leftHand) {
      this.drawHand(swState.body.shoulders.width, swState.leftHand, true, ctx);
    }
    if (swState.rightHand) {
      this.drawHand(swState.body.shoulders.width, swState.rightHand, false, ctx);
    }
  }
}
