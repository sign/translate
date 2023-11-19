import {TestBed} from '@angular/core/testing';

import {PoseService} from './pose.service';
import {EstimatedPose, PoseLandmark} from './pose.state';
import {MediapipeHolisticService} from '../../core/services/holistic.service';

describe('PoseService', () => {
  let service: PoseService;

  let pose: EstimatedPose;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(async () => {
    TestBed.configureTestingModule({providers: [MediapipeHolisticService]});
    service = TestBed.inject(PoseService);

    const holistic = TestBed.inject(MediapipeHolisticService);
    await holistic.load();

    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');

    const landmark: PoseLandmark = {x: 1, y: 2, z: 3, visibility: 0.8};
    pose = {
      faceLandmarks: new Array(468).fill(landmark),
      poseLandmarks: new Array(35).fill(landmark),
      rightHandLandmarks: new Array(21).fill(landmark),
      leftHandLandmarks: new Array(21).fill(landmark),
      image: canvas,
    };
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should drawBody', () => {
    service.drawBody(pose.poseLandmarks, ctx);
  });

  it('should drawHand', () => {
    service.drawHand(pose.leftHandLandmarks, ctx, 'red', 'green', 'blue');
  });

  it('should drawFace', () => {
    service.drawFace(pose.faceLandmarks, ctx);
  });

  it('should drawConnect to visible landmarks', () => {
    const landmarks: PoseLandmark[] = [
      {x: 1, y: 2, z: 3, visibility: 0.8},
      {x: 1, y: 2, z: 3, visibility: 0.8},
    ];
    service.drawConnect([landmarks], ctx);
  });

  it('should not drawConnect to invisible landmark', () => {
    const landmarks = [
      {x: 1, y: 2, z: 3, visibility: 0.8},
      {x: 1, y: 2, z: 3, visibility: 0.01},
    ];
    service.drawConnect([landmarks], ctx);
  });

  it('should drawElbowHandsConnection', () => {
    service.drawElbowHandsConnection(pose, ctx);
  });

  it('should draw full pose', () => {
    const drawBodySpy = spyOn(service, 'drawBody');
    const drawElbowHandsConnectionSpy = spyOn(service, 'drawElbowHandsConnection');
    const drawHandSpy = spyOn(service, 'drawHand');
    const drawFaceSpy = spyOn(service, 'drawFace');
    service.draw(pose, ctx);

    expect(drawBodySpy).toHaveBeenCalled();
    expect(drawElbowHandsConnectionSpy).toHaveBeenCalled();
    expect(drawHandSpy).toHaveBeenCalledTimes(2);
    expect(drawFaceSpy).toHaveBeenCalled();
  });

  it('should draw pose without face and hands', () => {
    delete pose.leftHandLandmarks;
    delete pose.rightHandLandmarks;
    delete pose.faceLandmarks;

    const drawBodySpy = spyOn(service, 'drawBody');
    const drawElbowHandsConnectionSpy = spyOn(service, 'drawElbowHandsConnection');
    const drawHandSpy = spyOn(service, 'drawHand');
    const drawFaceSpy = spyOn(service, 'drawFace');
    service.draw(pose, ctx);

    expect(drawBodySpy).toHaveBeenCalled();
    expect(drawElbowHandsConnectionSpy).toHaveBeenCalled();
    expect(drawHandSpy).not.toHaveBeenCalled();
    expect(drawFaceSpy).not.toHaveBeenCalled();
  });
});
