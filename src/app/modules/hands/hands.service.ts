import {Injectable} from '@angular/core';
import * as THREE from 'three';
import {HandDirection, HandNormal, HandPlane, HandsStateModel, HandStateModel} from './hands.state';


@Injectable({
  providedIn: 'root'
})
export class HandsService {

  //     const normal = this.handsService.normal(landmarks);
  //
  //
  //     patchState({
  //       [hand]: {
  //         bbox: this.handsService.bbox(landmarks),
  //         normal,
  //         plane: this.handsService.plane(normal),
  //         rotation: this.handsService.rotation(landmarks),
  //         direction: this.handsService.direction(landmarks),

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

  plane(normal: HandNormal): HandPlane {
    if (Math.abs(normal.direction.y) < Math.abs(normal.direction.z)) {
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

    let angle = this.angle(p2.y - p1.y, p2.x - p1.x) + 90; // SignWriting first chat is 90 degrees rotated
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

  drawShape(hand: HandStateModel, isLeft: boolean, ctx: CanvasRenderingContext2D): void {
    let char = hand.shape.codePointAt(0);

    if (isLeft) {
      char += 0x8;
    }


    if (hand.plane === 'floor') {
      char += 0x30;
    }

    // Rotation
    char += isLeft ? hand.rotation : (8 - hand.rotation) % 8;

    // Direction
    const shifts = {
      you: 0,
      middle: 0x10,
      me: 0x20
    };
    char += shifts[hand.direction];


    ctx.font = '100px SignWriting';
    const text = String.fromCodePoint(char);
    const measure = ctx.measureText(text);
    const bboxWidth = (hand.bbox.max.x - hand.bbox.min.x) * ctx.canvas.width;
    const scale = bboxWidth / measure.width;
    ctx.font = (100 * scale) + 'px SignWriting';

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = (hand.bbox.min.x + hand.bbox.max.x) / 2 * ctx.canvas.width;
    const y = (hand.bbox.min.y + hand.bbox.max.y) / 2 * ctx.canvas.height;

    ctx.fillText(String.fromCodePoint(char), x, y);
  }

  drawHand(hand: HandStateModel, isLeft: boolean, ctx: CanvasRenderingContext2D): void {
    this.drawBbox(hand.bbox, ctx);
    this.drawNormal(hand.normal, ctx);
    this.drawShape(hand, isLeft, ctx);
  }

  draw(hands: HandsStateModel, ctx: CanvasRenderingContext2D): void {
    if (hands.leftHand) {
      this.drawHand(hands.leftHand, true, ctx);
    }
    if (hands.rightHand) {
      this.drawHand(hands.rightHand, false, ctx);
    }
  }

}
