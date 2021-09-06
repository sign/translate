import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
import {PoseService} from './pose.service';
import {LoadPoseModel, PoseVideoFrame, StoreFramePose} from './pose.actions';
import {Observable} from 'rxjs';
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
  defaults: initialState
})
export class PoseState implements NgxsOnInit {
  @Select(state => state.settings.pose) poseSetting$: Observable<boolean>;

  constructor(private poseService: PoseService) {
  }

  ngxsOnInit({dispatch}: StateContext<any>): void {
    this.poseSetting$.pipe(
      filter(Boolean),
      first(),
      tap(() => dispatch(LoadPoseModel))
    ).subscribe();
  }

  @Action(LoadPoseModel)
  async load({patchState, dispatch}: StateContext<PoseStateModel>): Promise<void> {
    patchState({isLoaded: false});
    await this.poseService.load();
  }

  @Action(PoseVideoFrame)
  async poseFrame({patchState, dispatch}: StateContext<PoseStateModel>, {video}: PoseVideoFrame): Promise<void> {
    const result = await this.poseService.predict(video);

    // Since v0.4, "results" include additional parameters
    dispatch(new StoreFramePose(result));
  }

  @Action(StoreFramePose)
  storePose({getState, patchState}: StateContext<PoseStateModel>, {pose}: StoreFramePose): void {
    patchState({isLoaded: true, pose});
  }
}
