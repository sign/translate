import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {HandStateModel, SignWritingStateModel} from './sign-writing.state';
import {SignWritingService} from './sign-writing.service';
import {LayersModel} from '@tensorflow/tfjs-layers';
import * as tf from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs';

export type HandPlane = 'wall' | 'floor';
export type HandDirection = 'me' | 'you' | 'side';

export interface HandNormal {
  center: THREE.Vector3;
  direction: THREE.Vector3;
}

@Injectable({
  providedIn: 'root'
})
export class HandsService {

  // Need two models because they are stateful
  leftHandSequentialModel: LayersModel;
  rightHandSequentialModel: LayersModel;

  constructor() {
    tf.loadLayersModel('assets/models/hand-shape/model.json')
      .then(model => this.leftHandSequentialModel = model as unknown as LayersModel);
    tf.loadLayersModel('assets/models/hand-shape/model.json')
      .then(model => this.rightHandSequentialModel = model as unknown as LayersModel);
  }

  normalizeHand(vectors: THREE.Vector3[], normal: HandNormal, flipHand: boolean): tf.Tensor {
    // This is a very inefficient way to do this, consider using WebGL

    let handMatrix: tf.Tensor = tf.tensor2d(vectors.map(v => [v.x, v.y, v.z]));

    // 1. Rotate vectors to normal
    const oldXAxis = new THREE.Vector3(1, 0, 0);
    const zAxis = normal.direction.multiplyScalar(-1);
    const yAxis = new THREE.Vector3().crossVectors(oldXAxis, zAxis);
    const xAxis = new THREE.Vector3().crossVectors(zAxis, yAxis);

    const axis = tf.tensor2d([
      [xAxis.x, yAxis.x, zAxis.x],
      [xAxis.y, yAxis.y, zAxis.y],
      [xAxis.z, yAxis.z, zAxis.z],
    ]);

    handMatrix = handMatrix.sub(handMatrix.slice(0, 1));
    handMatrix = tf.dot(handMatrix, axis);

    // Because of mismatch between training and inference, need to flip X axis for right hand
    if (!flipHand) {
      handMatrix = handMatrix.mul(tf.tensor2d([[-1, 1, 1]]));
    }

    // 2. Rotate hand on the XY plane such that the BASE-M_CMC is on the Y axis
    const p1 = handMatrix.slice(0, 1); // BASE
    const p2 = handMatrix.slice(9, 1); // M_CMC
    const vec = p2.sub(p1).arraySync();
    const angle = 90 + this.angle(vec[0][1], vec[0][0]);
    const sinAngle = Math.sin(angle * Math.PI / 180);
    const cosAngle = Math.cos(angle * Math.PI / 180);
    const rotationMatrix = tf.tensor2d([
      [cosAngle, -sinAngle, 0],
      [sinAngle, cosAngle, 0],
      [0, 0, 1],
    ]);

    handMatrix = handMatrix.dot(rotationMatrix);

    // 3. Scale Metacarpal to be of length 200
    const j1 = handMatrix.slice(0, 1); // BASE
    const j2 = handMatrix.slice(9, 1); // M_CMC
    const len = tf.pow(j2.sub(j1), 2).sum().sqrt();
    const scalingFactor = tf.scalar(200).div(len);
    handMatrix = handMatrix.mul(scalingFactor);

    handMatrix = handMatrix.sub(handMatrix.slice(0, 1));

    // console.log(      tf.tensor2d(vectors.map(v => [v.x, v.y, v.z])).arraySync())
    // console.log(      handMatrix.arraySync())
    // throw new Error("test")

    return handMatrix;
  }

  shape(vectors: THREE.Vector3[], normal: HandNormal, isLeft: boolean): string {
    const model = isLeft ? this.leftHandSequentialModel : this.rightHandSequentialModel;
    if (!model) {
      return '񆄡'; // By default just fist shape
    }

    const hsIndex = tf.tidy(() => {
      const handTensor = this.normalizeHand(vectors, normal, !isLeft);
      const pred: Tensor = model.predict(handTensor.reshape([1, 1, 63])) as Tensor;
      const argmax = tf.softmax(pred).argMax(2).dataSync();
      // console.log(argmax, tf.memory().numTensors, [0, 14, 30, 68, 76, 135, 165, 187, 206].map(i => probs[i]));
      return argmax[0];
    });

    const code = 262145 + 0x60 * hsIndex;
    console.log(String.fromCodePoint(code), code.toString(16));
    return String.fromCodePoint(code);
  }

  bbox(vectors: THREE.Vector3[]): THREE.Box3 {
    return new THREE.Box3().setFromPoints(vectors);
  }

  normal(vectors: THREE.Vector3[], flipNormal: boolean = false): HandNormal {
    const triangle = [
      vectors[0], // WRIST
      vectors[5], // INDEX_FINGER_MCP
      vectors[17], // PINKY_MCP
    ];

    const center = new THREE.Vector3(
      (triangle[0].x + triangle[1].x + triangle[2].x) / 3,
      (triangle[0].y + triangle[1].y + triangle[2].y) / 3,
      (triangle[0].z + triangle[1].z + triangle[2].z) / 3,
    );

    const plane = new THREE.Plane().setFromCoplanarPoints(triangle[0], triangle[1], triangle[2]);
    const direction = plane.normal.multiplyScalar(flipNormal ? -1 : 1);

    return {center, direction};
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

  rotation(vectors: THREE.Vector3[]): number {
    const p1 = vectors[0];
    const p2 = vectors[13];

    let angle = this.angle(p2.y - p1.y, p2.x - p1.x) + 94; // SignWriting first chat is 90 degrees rotated

    angle += 360 / 16; // make a safety margin around every angle
    angle = (angle + 360) % 360; // working with positive angles is easier
    return Math.floor(angle / 45);
  }

  direction(plane: HandPlane, normal: HandNormal, flipAxis: boolean): HandDirection {
    const x = flipAxis ? normal.direction.x : -normal.direction.x; // For right hand, flip the x axis

    // TODO subtract chest normal from hand normal, to allow for body rotation

    switch (plane) {
      case 'wall':
        const xzAngle = this.angle(normal.direction.z, x);

        if (xzAngle > 210) { // 180 degrees + 30 safety
          return 'me';
        }

        if (xzAngle > 150) {
          return 'side';
        }

        return 'you';

      case 'floor':
        const xyAngle = this.angle(normal.direction.y, x);

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

  drawNormal(normal: HandNormal, ctx: CanvasRenderingContext2D): void {
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

  private angle(n, d): number {
    return (Math.atan2(n, d) * 180 / Math.PI + 360) % 360;
  }
}
