import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext, Store} from '@ngxs/store';
import {filter, tap} from 'rxjs/operators';
import {SetVideo, StartCamera, StopVideo} from './video.actions';
import {SetSetting} from '../../../../../modules/settings/settings.actions';
import {NavigatorService} from '../../../../services/navigator/navigator.service';
import {Observable} from 'rxjs';

export type AspectRatio = '16-9' | '4-3' | '2-1' | '1-1';

export interface VideoSettings {
  aspectRatio: AspectRatio;
  frameRate: number;
  height: number;
  width: number;
}

export interface VideoStateModel {
  camera: MediaStream;
  src: string | null;
  videoSettings: VideoSettings;
  error: string;
}

const initialState: VideoStateModel = {
  camera: null,
  src: null,
  videoSettings: null,
  error: null,
};

@Injectable()
@State<VideoStateModel>({
  name: 'video',
  defaults: initialState,
})
export class VideoState implements NgxsOnInit {
  receiveVideo$: Observable<boolean>;

  constructor(private store: Store, private navigator: NavigatorService) {
    this.receiveVideo$ = this.store.select<boolean>(state => state.settings.receiveVideo);
  }

  ngxsOnInit({dispatch}: StateContext<VideoStateModel>): void {
    this.receiveVideo$
      .pipe(
        filter(state => !state),
        tap(() => dispatch(StopVideo))
      )
      .subscribe();
  }

  @Action(StopVideo)
  stopVideo({patchState, getState}: StateContext<VideoStateModel>): void {
    // Stop camera stream if its open
    const {camera, error} = getState();
    if (camera) {
      camera.getTracks().forEach(track => track.stop());
    }

    patchState({
      ...initialState,
      error: error || 'turnedOff',
    });
  }

  @Action(StartCamera)
  async startCamera(context: StateContext<VideoStateModel>): Promise<void> {
    const {patchState, dispatch} = context;

    patchState({error: 'starting'});
    this.stopVideo(context);

    const turnOffVideo = () => dispatch(new SetSetting('receiveVideo', false));

    try {
      const camera = await this.navigator.getCamera({
        facingMode: 'user',
        aspectRatio: 1,
        width: {min: 1280},
        height: {min: 720},
        frameRate: 120, // Used to minimize motion blur
      });

      const videoTrack = camera.getVideoTracks()[0];
      const trackSettings = videoTrack.getSettings();
      const videoSettings: VideoSettings = {
        aspectRatio: VideoState.aspectRatio(trackSettings.aspectRatio),
        frameRate: trackSettings.frameRate,
        width: trackSettings.width,
        height: trackSettings.height,
      };
      videoTrack.addEventListener('ended', turnOffVideo);

      patchState({camera, videoSettings, error: null});
    } catch (e) {
      patchState({error: e.message});
      turnOffVideo();
    }
  }

  @Action(SetVideo)
  async setVideo(context: StateContext<VideoStateModel>, {src}: SetVideo): Promise<void> {
    const {patchState} = context;
    patchState({error: null});
    this.stopVideo(context);

    const videoEl: HTMLVideoElement = document.createElement('video');
    videoEl.addEventListener('loadedmetadata', () => {
      const width = videoEl.videoWidth;
      const height = videoEl.videoHeight;
      const videoSettings: VideoSettings = {
        aspectRatio: VideoState.aspectRatio(width / height),
        frameRate: null,
        width,
        height,
      };

      patchState({src, videoSettings, error: null});
      videoEl.remove();
    });
    videoEl.src = src;
  }

  static aspectRatio(ratio: number): AspectRatio {
    return ratio > 1.9 ? '2-1' : ratio < 1.5 ? (ratio < 1.1 ? '1-1' : '4-3') : '16-9';
  }
}
