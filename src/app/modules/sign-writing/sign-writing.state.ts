import {inject, Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {EstimatedPose} from '../pose/pose.state';
import {filter, first, tap} from 'rxjs/operators';
import {HandsService, HandStateModel} from './hands.service';
import {CalculateBodyFactors, EstimateFaceShape, EstimateHandShape} from './sign-writing.actions';
import {BodyService, BodyStateModel} from './body.service';
import {FaceService, FaceStateModel} from './face.service';
import {ThreeService} from '../../core/services/three.service';
import {MediapipeHolisticService} from '../../core/services/holistic.service';
import {SignWritingService} from './sign-writing.service';
import {Observable} from 'rxjs';

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
  defaults: initialState,
})
export class SignWritingState implements NgxsOnInit {
  private store = inject(Store);
  private bodyService = inject(BodyService);
  private faceService = inject(FaceService);
  private handsService = inject(HandsService);
  private three = inject(ThreeService);
  private holistic = inject(MediapipeHolisticService);

  drawSignWriting = false;
  pose$: Observable<EstimatedPose>;
  drawSignWriting$: Observable<boolean>;

  constructor() {
    this.pose$ = this.store.select<EstimatedPose>(state => state.pose.pose);
    this.drawSignWriting$ = this.store.select<boolean>(state => state.settings.drawSignWriting);
  }

  ngxsOnInit({patchState, dispatch}: StateContext<any>): void {
    // Load model once setting turns on
    this.drawSignWriting$
      .pipe(
        filter(Boolean),
        first(),
        tap(() => {
          return Promise.all([
            this.handsService.loadModel(),
            this.faceService.loadModel(),
            SignWritingService.loadFonts(),
          ]);
        })
      )
      .subscribe();
    this.drawSignWriting$.subscribe(drawSignWriting => (this.drawSignWriting = drawSignWriting));

    this.pose$
      .pipe(
        filter(Boolean),
        filter(() => this.drawSignWriting), // Only run if needed
        tap((pose: EstimatedPose) => {
          dispatch([
            new CalculateBodyFactors(pose),
            new EstimateFaceShape(pose.faceLandmarks, pose.image),
            new EstimateHandShape('leftHand', pose.leftHandLandmarks, pose.image),
            new EstimateHandShape('rightHand', pose.rightHandLandmarks, pose.image),
          ]).subscribe(() => patchState({timestamp: Date.now()}));
        })
      )
      .subscribe();

    // If no sign writing required to be drawn
    this.pose$
      .pipe(
        filter(Boolean),
        filter(() => !this.drawSignWriting), // Only run if needed
        tap(() => {
          patchState({timestamp: Date.now()});
        })
      )
      .subscribe();
  }

  @Action(CalculateBodyFactors)
  async calculateBody(
    {patchState, dispatch}: StateContext<SignWritingStateModel>,
    {pose}: CalculateBodyFactors
  ): Promise<void> {
    if (!pose.poseLandmarks) {
      patchState({body: null});
      return;
    }

    patchState({
      body: {
        shoulders: this.bodyService.shoulders(pose.poseLandmarks),
        elbows: [
          pose.poseLandmarks[this.holistic.POSE_LANDMARKS.LEFT_ELBOW],
          pose.poseLandmarks[this.holistic.POSE_LANDMARKS.RIGHT_ELBOW],
        ],
        wrists: [
          pose.poseLandmarks[this.holistic.POSE_LANDMARKS.LEFT_WRIST],
          pose.poseLandmarks[this.holistic.POSE_LANDMARKS.RIGHT_WRIST],
        ],
      },
    });
  }

  @Action(EstimateFaceShape)
  async estimateFace(
    {patchState, dispatch}: StateContext<SignWritingStateModel>,
    {landmarks, poseImage}: EstimateFaceShape
  ): Promise<void> {
    if (!landmarks) {
      patchState({face: null});
      return;
    }

    await this.three.load();
    const vectors = landmarks.map(
      l => new this.three.Vector3(l.x * poseImage.width, l.y * poseImage.height, l.z * poseImage.width)
    );

    patchState({
      face: this.faceService.shape(vectors),
    });
  }

  @Action(EstimateHandShape)
  async estimateHand(
    {patchState, dispatch}: StateContext<SignWritingStateModel>,
    {hand, landmarks, poseImage}: EstimateHandShape
  ): Promise<void> {
    if (!landmarks) {
      patchState({[hand]: null});
      return;
    }

    const isLeft = hand === 'leftHand';

    await this.three.load();
    const vectors = landmarks.map(
      l => new this.three.Vector3(l.x * poseImage.width, l.y * poseImage.height, l.z * poseImage.width)
    );

    const normal = this.handsService.normal(vectors, isLeft);
    const plane = this.handsService.plane(vectors);

    patchState({
      [hand]: {
        bbox: this.handsService.bbox(vectors),
        normal,
        plane,
        rotation: this.handsService.rotation(vectors),
        direction: this.handsService.direction(plane, normal, isLeft),
        shape: this.handsService.shape(vectors, normal, isLeft),
      },
    });
  }
}
