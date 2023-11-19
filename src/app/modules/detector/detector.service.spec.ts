import {TestBed} from '@angular/core/testing';

import {DetectorService} from './detector.service';
import {EstimatedPose, PoseLandmark} from '../pose/pose.state';
import {TensorflowService} from '../../core/services/tfjs/tfjs.service';
import {MediapipeHolisticService} from '../../core/services/holistic.service';
import createSpy = jasmine.createSpy;

describe('DetectorService', () => {
  let service: DetectorService;
  let tf: TensorflowService;
  let holistic: MediapipeHolisticService;

  beforeEach(async () => {
    TestBed.configureTestingModule({providers: [TensorflowService, MediapipeHolisticService]});
    service = TestBed.inject(DetectorService);
    tf = TestBed.inject(TensorflowService);
    holistic = TestBed.inject(MediapipeHolisticService);

    await tf.load();
    await holistic.load();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('model weights should not contain NaN', async () => {
    await tf.setBackend('cpu'); // only cpu has `isNaN` properly

    await service.loadModel();
    const model = service.sequentialModel;

    expect(model).toBeTruthy();

    const weights = await Promise.all(model.getWeights().map(w => w.data()));
    for (const weight of weights) {
      const isNaN = Boolean(tf.isNaN(weight).any().dataSync()[0]);
      expect(isNaN).toBeFalse();
    }
  });

  it('distance should calculate XY distance and ignore Z', () => {
    const p1: PoseLandmark = {x: 0, y: 1, z: 2};
    const p2: PoseLandmark = {x: 2, y: 3, z: 0};

    const d = service.distance(p1, p2);

    expect(d).toBeCloseTo(2.82843, 5);
  });

  it('normalizing a pose should return null if window size too small', () => {
    const pose = {
      faceLandmarks: null,
      poseLandmarks: null,
      rightHandLandmarks: null,
      leftHandLandmarks: null,
    } as EstimatedPose;

    const normalized = service.normalizePose(pose);

    expect(normalized).toBeNull();
  });

  it('normalizing zero pose should return OpenPose zeros', () => {
    service.shoulderWidth.fill(1);
    service.shoulderWidthIndex = service.shoulderWidth.length + 1;

    const pose = {
      faceLandmarks: null,
      poseLandmarks: null,
      rightHandLandmarks: null,
      leftHandLandmarks: null,
    } as EstimatedPose;

    const normalized = service.normalizePose(pose);

    expect(normalized.length).toBe(25);
    for (const landmark of normalized) {
      expect(landmark.x).toEqual(0);
      expect(landmark.y).toEqual(0);
    }
  });

  describe('distance2DTensors', () => {
    const p1: PoseLandmark[] = [
      {x: 1, y: 1, z: 2},
      {x: 0, y: 1, z: 2},
      {x: 7, y: 3, z: 5},
    ];
    const p2: PoseLandmark[] = [
      {x: 2, y: 3, z: 0},
      {x: 0, y: 0, z: 0},
      {x: 3, y: 4, z: 5},
    ];

    const distances = [2.23606, 0, 4.1231];

    it('should calculate distance between two poses', () => {
      const d = service.distance2DTensors(p1, p2);

      expect(d[0]).toBeCloseTo(distances[0], 4);
      expect(d[1]).toBe(distances[1]);
      expect(d[2]).toBeCloseTo(distances[2], 4);
    });

    it('distance between poses should scale by multiplier', () => {
      const multiplier = 2.5;
      const d = service.distance2DTensors(p1, p2, multiplier);

      expect(d[0]).toBeCloseTo(distances[0] * multiplier, 4);
      expect(d[1]).toBe(distances[1] * multiplier);
      expect(d[2]).toBeCloseTo(distances[2] * multiplier, 4);
    });
  });

  it('should use model to get confidence', async () => {
    const spy = createSpy('predict').and.returnValue(tf.tensor([1, 2]));
    service.sequentialModel = {predict: spy} as any;

    const confidence = service.getSequentialConfidence(new Float32Array(25).fill(0));
    expect(spy).toHaveBeenCalled();
    expect(confidence).toBeCloseTo(0.731);
  });
});
