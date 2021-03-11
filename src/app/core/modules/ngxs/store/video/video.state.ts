import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {StartCamera, StopCamera} from './video.actions';
import {SetSetting} from '../../../../../modules/settings/settings.actions';
import {NavigatorService} from '../../../../services/navigator/navigator.service';


export type AspectRatio = '16-9' | '4-3' | '2-1';

export interface CameraSettings {
  aspectRatio: AspectRatio;
  frameRate: number;
  height: number;
  width: number;
}

export interface VideoStateModel {
  camera: MediaStream;
  cameraSettings: CameraSettings;
  error: string;
}

const initialState: VideoStateModel = {
  camera: null,
  cameraSettings: null,
  error: null,
};

@Injectable()
@State<VideoStateModel>({
  name: 'video',
  defaults: initialState
})
export class VideoState implements NgxsOnInit {

  @Select(state => state.settings.receiveVideo) receiveVideo$: Observable<boolean>;

  constructor(private navigator: NavigatorService) {
  }

  ngxsOnInit({dispatch}: StateContext<VideoStateModel>): void {
    this.receiveVideo$.pipe(
      tap((state) => {
        if (state) {
          dispatch(StartCamera);
        } else {
          dispatch(StopCamera);
        }
      })
    ).subscribe();
  }

  @Action(StopCamera)
  stopCamera({patchState, getState}: StateContext<VideoStateModel>): void {
    // Stop camera stream if its open
    const {camera, error} = getState();
    if (camera) {
      camera.getTracks().forEach(track => track.stop());
    }

    patchState({
      ...initialState,
      error: error || 'turnedOff'
    });
  }

  @Action(StartCamera)
  async startCamera(context: StateContext<VideoStateModel>): Promise<void> {
    const {patchState, dispatch} = context;

    patchState({error: 'starting'});
    this.stopCamera(context);

    const turnOffVideo = () => dispatch(new SetSetting('receiveVideo', false));

    try {
      const camera = await this.navigator.getCamera({
        facingMode: 'user',
        width: {min: 1280},
        height: {min: 720}
      });
      if (!camera) {
        throw new Error('notConnected');
      }

      const videoTrack = camera.getVideoTracks()[0];
      const trackSettings = videoTrack.getSettings();
      const aspectRatio = trackSettings.aspectRatio > 1.9 ? '2-1' : trackSettings.aspectRatio < 1.5 ? '4-3' : '16-9';
      const cameraSettings: CameraSettings = {
        aspectRatio,
        frameRate: trackSettings.frameRate,
        width: trackSettings.width,
        height: trackSettings.height
      };
      videoTrack.addEventListener('ended', turnOffVideo);

      patchState({camera, cameraSettings, error: null});
    } catch (e) {
      patchState({error: e.message});
      turnOffVideo();
    }
  }
}
