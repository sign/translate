import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Pose} from '../pose/pose.state';
import {filter, first, tap} from 'rxjs/operators';
import {HandsService, HandStateModel} from './hands.service';
import {CalculateBodyFactors, EstimateFaceShape, EstimateHandShape} from './sign-writing.actions';
import {BodyService, BodyStateModel} from './body.service';
import * as holistic from '@mediapipe/holistic/holistic';
import {FaceService, FaceStateModel} from './face.service';
import {ThreeService} from '../../core/services/three.service';


export interface SignWritingStateModel {
  timestamp: number;
  body: BodyStateModel;
  face: FaceStateModel;
  leftHand: HandStateModel;
  rightHand: HandStateModel;
}

const initialState: SignWritingStateModel = {
  timestamp: null,
  body: null,
  face: null,
  leftHand: null,
  rightHand: null,
};

@Injectable()
@State<SignWritingStateModel>({
  name: 'signWriting',
  defaults: initialState
})
export class SignWritingState implements NgxsOnInit {
  drawSignWriting = false;
  @Select(state => state.pose.pose) pose$: Observable<Pose>;
  @Select(state => state.settings.drawSignWriting) drawSignWriting$: Observable<boolean>;

  constructor(private bodyService: BodyService,
              private faceService: FaceService,
              private handsService: HandsService,
              private three: ThreeService) {
  }

  ngxsOnInit({patchState, dispatch}: StateContext<any>): void {
    // Load model once setting turns on
    this.drawSignWriting$.pipe(
      filter(Boolean),
      first(),
      tap(() => {
        this.handsService.loadModel();
        this.faceService.loadModel();
      })
    ).subscribe();
    this.drawSignWriting$.subscribe(drawSignWriting => this.drawSignWriting = drawSignWriting);

    this.pose$.pipe(
      filter(Boolean),
      filter(() => this.drawSignWriting), // Only run if needed
      tap((pose: Pose) => {
        dispatch([
          new CalculateBodyFactors(pose),
          new EstimateFaceShape(pose.faceLandmarks, pose.image),
          new EstimateHandShape('leftHand', pose.leftHandLandmarks, pose.image),
          new EstimateHandShape('rightHand', pose.rightHandLandmarks, pose.image)
        ]).subscribe(() => patchState({timestamp: Date.now()}));
      })
    ).subscribe();

    // If no sign writing required to be drawn
    this.pose$.pipe(
      filter(Boolean),
      filter(() => !this.drawSignWriting), // Only run if needed
      tap((pose: Pose) => {
        patchState({timestamp: Date.now()});
      })
    ).subscribe();
  }


  @Action(CalculateBodyFactors)
  async calculateBody({patchState, dispatch}: StateContext<SignWritingStateModel>, {pose}: CalculateBodyFactors): Promise<void> {
    if (!pose.poseLandmarks) {
      patchState({body: null});
      return;
    }


    patchState({
      body: {
        shoulders: this.bodyService.shoulders(pose.poseLandmarks),
        elbows: [pose.poseLandmarks[holistic.POSE_LANDMARKS.LEFT_ELBOW], pose.poseLandmarks[holistic.POSE_LANDMARKS.RIGHT_ELBOW]],
        wrists: [pose.poseLandmarks[holistic.POSE_LANDMARKS.LEFT_WRIST], pose.poseLandmarks[holistic.POSE_LANDMARKS.RIGHT_WRIST]],
      }
    });
  }

  @Action(EstimateFaceShape)
  async estimateFace({patchState, dispatch}: StateContext<SignWritingStateModel>,
                     {landmarks, poseImage}: EstimateFaceShape): Promise<void> {
    if (!landmarks) {
      patchState({face: null});
      return;
    }

    await this.three.load();
    const vectors = landmarks.map(l => new this.three.Vector3(l.x * poseImage.width, l.y * poseImage.height, l.z * poseImage.width));

    patchState({
      face: this.faceService.shape(vectors)
    });
  }

  @Action(EstimateHandShape)
  async estimateHand({patchState, dispatch}: StateContext<SignWritingStateModel>,
                     {hand, landmarks, poseImage}: EstimateHandShape): Promise<void> {
    if (!landmarks) {
      patchState({[hand]: null});
      return;
    }

    const isLeft = hand === 'leftHand';

    await this.three.load();
    const vectors = landmarks.map(l => new this.three.Vector3(l.x * poseImage.width, l.y * poseImage.height, l.z * poseImage.width));

    const normal = this.handsService.normal(vectors, isLeft);
    const plane = this.handsService.plane(vectors);

    patchState({
      [hand]: {
        bbox: this.handsService.bbox(vectors),
        normal,
        plane,
        rotation: this.handsService.rotation(vectors),
        direction: this.handsService.direction(plane, normal, isLeft),
        shape: this.handsService.shape(vectors, normal, isLeft)
      }
    });
  }

}
