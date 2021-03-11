import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Pose, PoseLandmark} from '../pose/pose.state';
import {filter, tap} from 'rxjs/operators';
import {HandNormal, HandPlane, HandsService} from './hands.service';
import * as THREE from 'three';
import {CalculateBodyFactors, EstimateFaceShape, EstimateHandShape} from './sign-writing.actions';
import {BodyService, BodyShoulders} from './body.service';
import * as holistic from '@mediapipe/holistic/holistic';
import {FaceService} from './face.service';


export interface HandStateModel {
  bbox: THREE.Box3;
  normal: HandNormal;
  plane: HandPlane;
  rotation: number; // Rotation  [0,7]
  direction: 'me' | 'you' | 'both';
  shape: string;
}

export interface BodyStateModel {
  shoulders: BodyShoulders;
  elbows: [PoseLandmark, PoseLandmark];
  wrists: [PoseLandmark, PoseLandmark];
}

export interface FaceStateModel {
  center: THREE.Vector2;
  shape: string;
}

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
  @Select(state => state.pose.pose) pose$: Observable<Pose>;


  constructor(private bodyService: BodyService,
              private faceService: FaceService,
              private handsService: HandsService) {

  }

  ngxsOnInit({patchState, dispatch}: StateContext<any>): void {
    this.pose$.pipe(
      filter(Boolean),
      tap((pose: Pose) => {
        dispatch([
          new CalculateBodyFactors(pose),
          new EstimateFaceShape(pose.faceLandmarks),
          new EstimateHandShape('leftHand', pose.leftHandLandmarks),
          new EstimateHandShape('rightHand', pose.rightHandLandmarks)
        ]).subscribe(() => patchState({timestamp: Date.now()}));
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
  async estimateFace({patchState, dispatch}: StateContext<SignWritingStateModel>, {landmarks}: EstimateFaceShape): Promise<void> {
    if (!landmarks) {
      patchState({face: null});
      return;
    }

    patchState({
      face: {
        center: this.faceService.center(landmarks),
        shape: '񌞁'
      }
    });
  }

  @Action(EstimateHandShape)
  async estimateHand({patchState, dispatch}: StateContext<SignWritingStateModel>, {hand, landmarks}: EstimateHandShape): Promise<void> {
    if (!landmarks) {
      patchState({[hand]: null});
      return;
    }

    const isLeft = hand === 'leftHand';

    const vectors = landmarks.map(l => new THREE.Vector3(l.x, l.y, l.z));

    const normal = this.handsService.normal(vectors, isLeft);
    const plane = this.handsService.plane(vectors);


    patchState({
      [hand]: {
        bbox: this.handsService.bbox(vectors),
        normal,
        plane,
        rotation: this.handsService.rotation(vectors),
        direction: this.handsService.direction(plane, normal, isLeft),
        shape: '񂋡' // Hand flat
      }
    });
  }

}
