import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {PoseService} from './pose.service';
import {LoadPoseModel, PoseVideoFrame, StoreFramePose} from './pose.actions';

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
  constructor(private poseService: PoseService, private store: Store) {

  }

  ngxsOnInit(ctx?: StateContext<any>): void {
    this.store.dispatch(LoadPoseModel);
  }

  @Action(LoadPoseModel)
  async load({patchState, dispatch}: StateContext<PoseStateModel>): Promise<void> {
    patchState({isLoaded: false});
    await this.poseService.load();
    this.poseService.model.onResults((results) => this.store.dispatch(new StoreFramePose(results)));
  }

  @Action(PoseVideoFrame)
  async poseFrame({patchState, dispatch}: StateContext<PoseStateModel>, {video}: PoseVideoFrame): Promise<void> {
    await this.poseService.predict(video);
  }

  @Action(StoreFramePose)
  storePose({getState, patchState}: StateContext<PoseStateModel>, {pose}: StoreFramePose): void {
    patchState({isLoaded: true, pose});
  }
}
