import {Injectable} from '@angular/core';
import type {Tensor} from '@tensorflow/tfjs-core';
import type {Vector3} from 'three';
import {TensorflowService} from '../../core/services/tfjs/tfjs.service';
import {ThreeService} from '../../core/services/three.service';

export interface PlaneNormal {
  center: Vector3;
  direction: Vector3;
}

@Injectable({
  providedIn: 'root',
})
export class PoseNormalizationService {
  model?: any;

  constructor(public tf: TensorflowService, private three: ThreeService) {}

  normal(vectors: Vector3[], planeIdx: [number, number, number]): PlaneNormal {
    const triangle = planeIdx.map(i => vectors[i]);

    const center = new this.three.Vector3(
      (triangle[0].x + triangle[1].x + triangle[2].x) / 3,
      (triangle[0].y + triangle[1].y + triangle[2].y) / 3,
      (triangle[0].z + triangle[1].z + triangle[2].z) / 3
    );

    const plane = new this.three.Plane().setFromCoplanarPoints(triangle[0], triangle[1], triangle[2]);
    const direction = plane.normal;

    return {center, direction};
  }

  angle(n, d): number {
    return ((Math.atan2(n, d) * 180) / Math.PI + 360) % 360;
  }

  normalize(
    vectors: Vector3[],
    normal: PlaneNormal,
    line: [number, number],
    center: number,
    flip: boolean = false
  ): Tensor {
    let matrix: Tensor = this.tf.tensor2d(vectors.map(v => [v.x, v.y, v.z]));

    // 1. Rotate vectors to normal
    const oldXAxis = new this.three.Vector3(1, 0, 0);
    const zAxis = normal.direction.multiplyScalar(-1);
    const yAxis = new this.three.Vector3().crossVectors(oldXAxis, zAxis);
    const xAxis = new this.three.Vector3().crossVectors(zAxis, yAxis);

    const axis = this.tf.tensor2d([
      [xAxis.x, yAxis.x, zAxis.x],
      [xAxis.y, yAxis.y, zAxis.y],
      [xAxis.z, yAxis.z, zAxis.z],
    ]);

    matrix = matrix.sub(matrix.slice(0, 1));
    matrix = this.tf.dot(matrix, axis);

    if (flip) {
      // Because of mismatch between training and inference, need to flip X axis for right hand
      matrix = matrix.mul(this.tf.tensor2d([[-1, 1, 1]]));
    }

    // 2. Rotate hand on the XY plane such that the BASE-M_CMC is on the Y axis
    const p1 = matrix.slice(line[0], 1); // BASE
    const p2 = matrix.slice(line[1], 1); // M_CMC
    const vec = p2.sub(p1).arraySync();
    const angle = 90 + this.angle(vec[0][1], vec[0][0]);
    const sinAngle = Math.sin((angle * Math.PI) / 180);
    const cosAngle = Math.cos((angle * Math.PI) / 180);
    const rotationMatrix = this.tf.tensor2d([
      [cosAngle, -sinAngle, 0],
      [sinAngle, cosAngle, 0],
      [0, 0, 1],
    ]);

    matrix = matrix.dot(rotationMatrix);

    // 3. Scale line to be of length 200
    const j1 = matrix.slice(line[0], 1); // BASE
    const j2 = matrix.slice(line[1], 1); // M_CMC
    const len = this.tf.pow(j2.sub(j1), 2).sum().sqrt();
    const scalingFactor = this.tf.scalar(200).div(len);
    matrix = matrix.mul(scalingFactor);

    return matrix.sub(matrix.slice(center, 1));
  }
}
