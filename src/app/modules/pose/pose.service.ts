import {inject, Injectable} from '@angular/core';
import * as drawing from '@mediapipe/drawing_utils/drawing_utils.js';
import {EMPTY_LANDMARK, EstimatedPose, PoseLandmark} from './pose.state';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {MediapipeHolisticService} from '../../core/services/holistic.service';

const IGNORED_BODY_LANDMARKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22];

@Injectable({
  providedIn: 'root',
})
export class PoseService {
  private ga = inject(GoogleAnalyticsService);
  private holistic = inject(MediapipeHolisticService);

  model?: any;

  // loadPromise must be static, in case multiple PoseService instances are created (during testing)
  static loadPromise: Promise<any>;

  isFirstFrame = true;
  onResultsCallbacks = [];

  onResults(onResultsCallback) {
    this.onResultsCallbacks.push(onResultsCallback);
  }

  async load(): Promise<void> {
    if (!PoseService.loadPromise) {
      PoseService.loadPromise = this._load();
    }

    // Holistic loading may fail for various reasons.
    // If that fails, show an alert to the user, for further investigation.
    try {
      await PoseService.loadPromise;
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  private async _load(): Promise<void> {
    if (this.model) {
      return;
    }

    await this.holistic.load();

    await this.ga.trace('pose', 'load', async () => {
      this.model = new this.holistic.Holistic({locateFile: file => `assets/models/holistic/${file}`});

      this.model.setOptions({
        upperBodyOnly: false,
        modelComplexity: 1,
      });

      await this.model.initialize();

      // Send an empty frame, to force the mediapipe computation graph to load
      const frame = document.createElement('canvas');
      frame.width = 256;
      frame.height = 256;
      await this.model.send({image: frame});
      frame.remove();

      // Track following results
      this.model.onResults(results => {
        for (const callback of this.onResultsCallbacks) {
          callback(results);
        }
      });
    });
  }

  async predict(video: HTMLVideoElement | HTMLImageElement): Promise<void> {
    await this.load();

    const frameType = this.isFirstFrame ? 'first-frame' : 'frame';
    await this.ga.trace('pose', frameType, () => {
      this.isFirstFrame = false;
      return this.model.send({image: video});
    });
  }

  drawBody(landmarks: PoseLandmark[], ctx: CanvasRenderingContext2D): void {
    const filteredLandmarks = Array.from(landmarks);
    for (const l of IGNORED_BODY_LANDMARKS) {
      delete filteredLandmarks[l];
    }

    drawing.drawConnectors(ctx, filteredLandmarks, this.holistic.POSE_CONNECTIONS, {color: '#00FF00'});
    drawing.drawLandmarks(ctx, filteredLandmarks, {color: '#00FF00', fillColor: '#FF0000'});
  }

  drawHand(
    landmarks: PoseLandmark[],
    ctx: CanvasRenderingContext2D,
    lineColor: string,
    dotColor: string,
    dotFillColor: string
  ): void {
    drawing.drawConnectors(ctx, landmarks, this.holistic.HAND_CONNECTIONS, {color: lineColor});
    drawing.drawLandmarks(ctx, landmarks, {
      color: dotColor,
      fillColor: dotFillColor,
      lineWidth: 2,
      radius: landmark => {
        return drawing.lerp(landmark.z, -0.15, 0.1, 10, 1);
      },
    });
  }

  drawFace(landmarks: PoseLandmark[], ctx: CanvasRenderingContext2D): void {
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_RIGHT_EYE, {color: '#FF3030'});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_LEFT_EYE, {color: '#30FF30'});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
    drawing.drawConnectors(ctx, landmarks, this.holistic.FACEMESH_LIPS, {color: '#E0E0E0'});
  }

  drawConnect(connectors: PoseLandmark[][], ctx: CanvasRenderingContext2D): void {
    for (const connector of connectors) {
      const from = connector[0];
      const to = connector[1];
      if (from && to) {
        if (from.visibility && to.visibility && (from.visibility < 0.1 || to.visibility < 0.1)) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(from.x * ctx.canvas.width, from.y * ctx.canvas.height);
        ctx.lineTo(to.x * ctx.canvas.width, to.y * ctx.canvas.height);
        ctx.stroke();
      }
    }
  }

  drawElbowHandsConnection(pose: EstimatedPose, ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 5;

    if (pose.rightHandLandmarks) {
      ctx.strokeStyle = '#00FF00';
      this.drawConnect(
        [[pose.poseLandmarks[this.holistic.POSE_LANDMARKS.RIGHT_ELBOW], pose.rightHandLandmarks[0]]],
        ctx
      );
    }

    if (pose.leftHandLandmarks) {
      ctx.strokeStyle = '#FF0000';
      this.drawConnect([[pose.poseLandmarks[this.holistic.POSE_LANDMARKS.LEFT_ELBOW], pose.leftHandLandmarks[0]]], ctx);
    }
  }

  draw(pose: EstimatedPose, ctx: CanvasRenderingContext2D): void {
    if (pose.poseLandmarks) {
      this.drawBody(pose.poseLandmarks, ctx);
      this.drawElbowHandsConnection(pose, ctx);
    }

    if (pose.leftHandLandmarks) {
      this.drawHand(pose.leftHandLandmarks, ctx, '#CC0000', '#FF0000', '#00FF00');
    }

    if (pose.rightHandLandmarks) {
      this.drawHand(pose.rightHandLandmarks, ctx, '#00CC00', '#00FF00', '#FF0000');
    }

    if (pose.faceLandmarks) {
      this.drawFace(pose.faceLandmarks, ctx);
    }

    ctx.restore();
  }

  normalizeHolistic(pose: EstimatedPose, components: string[], normalized = true): PoseLandmark[] {
    // This calculation takes up to 0.05ms for 543 landmarks
    const vectors = {
      poseLandmarks: pose.poseLandmarks || new Array(33).fill(EMPTY_LANDMARK),
      faceLandmarks: pose.faceLandmarks || new Array(468).fill(EMPTY_LANDMARK),
      leftHandLandmarks: pose.leftHandLandmarks || new Array(21).fill(EMPTY_LANDMARK),
      rightHandLandmarks: pose.rightHandLandmarks || new Array(21).fill(EMPTY_LANDMARK),
    };
    let landmarks = components.reduce((acc, component) => acc.concat(vectors[component]), []);

    // Scale by image dimensions
    landmarks = landmarks.map(l => ({
      x: l.x * pose.image.width,
      y: l.y * pose.image.height,
      z: l.z * pose.image.width,
    }));

    if (normalized && pose.poseLandmarks) {
      const p1 = landmarks[this.holistic.POSE_LANDMARKS.LEFT_SHOULDER];
      const p2 = landmarks[this.holistic.POSE_LANDMARKS.RIGHT_SHOULDER];
      const scale = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + (p2.z - p1.z) ** 2);

      const dx = (p1.x + p2.x) / 2;
      const dy = (p1.y + p2.y) / 2;
      const dz = (p1.z + p2.z) / 2;

      // Normalize all non-zero landmarks
      landmarks = landmarks.map(l => ({
        x: l.x === 0 ? 0 : (l.x - dx) / scale,
        y: l.y === 0 ? 0 : (l.y - dy) / scale,
        z: l.z === 0 ? 0 : (l.z - dz) / scale,
      }));
    }

    return landmarks;
  }
}
