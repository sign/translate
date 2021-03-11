import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {HandStateModel, SignWritingStateModel} from './sign-writing.state';
import {SignWritingService} from './sign-writing.service';

export type HandPlane = 'wall' | 'floor';
export type HandDirection = 'me' | 'you' | 'middle';

export interface HandNormal {
  center: THREE.Vector3;
  direction: THREE.Vector3;
}

@Injectable({
  providedIn: 'root'
})
export class HandsService {

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

  private angle(n, d): number {
    return (Math.atan2(n, d) * 180 / Math.PI + 360) % 360;
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
          return 'middle';
        }

        return 'you';

      case 'floor':
        const xyAngle = this.angle(normal.direction.y, x);

        // TODO this is not correct

        if (xyAngle > 0) {
          return 'me';
        }

        if (xyAngle > -60) {
          return 'middle';
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

    if (!isLeft) {
      char += 0x8;
    }


    if (hand.plane === 'floor') {
      char += 0x30;
    }

    // Rotation
    char += isLeft ? (8 - hand.rotation) % 8 : hand.rotation ;

    // Direction
    const shifts = {
      you: 0,
      middle: 0x10,
      me: 0x20
    };
    char += shifts[hand.direction];

    const text = String.fromCodePoint(char);
    const center = new THREE.Vector2((hand.bbox.min.x + hand.bbox.max.x) / 2, (hand.bbox.min.y + hand.bbox.max.y) / 2);

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
