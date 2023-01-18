import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {PoseService} from './pose.service';
import {LoadPoseModel, PoseVideoFrame, StoreFramePose} from './pose.actions';
import {filter, first, tap} from 'rxjs/operators';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export const EMPTY_LANDMARK: PoseLandmark = {x: 0, y: 0, z: 0};

export interface Pose {
  faceLandmarks: PoseLandmark[];
  poseLandmarks: PoseLandmark[];
  rightHandLandmarks: PoseLandmark[];
  leftHandLandmarks: PoseLandmark[];
  image: HTMLCanvasElement;
}

export interface PoseStateModel {
  isLoaded: boolean;
  pose: Pose;
}

const initialState: PoseStateModel = {
  isLoaded: false,
  pose: null,
};

@Injectable()
@State<PoseStateModel>({
  name: 'pose',
  defaults: initialState,
})
export class PoseState implements NgxsOnInit {
  poseSetting$ = this.store.select<boolean>(state => state.settings.pose);

  constructor(private poseService: PoseService, private store: Store) {}

  ngxsOnInit({dispatch}: StateContext<any>): void {
    this.poseSetting$
      .pipe(
        filter(Boolean),
        first(),
        tap(() => dispatch(LoadPoseModel))
      )
      .subscribe();
  }

  @Action(LoadPoseModel)
  async load({patchState, dispatch}: StateContext<PoseStateModel>): Promise<void> {
    patchState({isLoaded: false});
    await this.poseService.load();
  }

  @Action(PoseVideoFrame)
  async poseFrame({patchState, dispatch}: StateContext<PoseStateModel>, {video}: PoseVideoFrame): Promise<void> {
    const result = await this.poseService.predict(video);
    // TODO: passing the `image` canvas through NGXS bugs the pose.
    // https://github.com/google/mediapipe/issues/2422
    //    const fakeImage = document.createElement('canvas');
    //       fakeImage.width = results.image.width;
    //       fakeImage.height = results.image.height;
    //       const ctx = fakeImage.getContext('2d');
    //       ctx.drawImage(results.image, 0, 0, fakeImage.width, fakeImage.height);
    //
    //       // Since v0.4, "results" include additional parameters
    //       this.store.dispatch(
    //         new StoreFramePose({
    //           faceLandmarks: results.faceLandmarks,
    //           poseLandmarks: results.poseLandmarks,
    //           leftHandLandmarks: results.leftHandLandmarks,
    //           rightHandLandmarks: results.rightHandLandmarks,
    //           image: fakeImage,
    //         })
    //       );

    // Since v0.4, "results" include additional parameters
    dispatch(new StoreFramePose(result));
  }

  @Action(StoreFramePose)
  storePose({getState, patchState}: StateContext<PoseStateModel>, {pose}: StoreFramePose): void {
    patchState({isLoaded: true, pose});
  }
}
