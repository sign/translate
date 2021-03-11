import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {SetSetting} from '../../../../../modules/settings/settings.actions';
import {NavigatorService} from '../../../../services/navigator/navigator.service';
import {DisableTransmission, EnableTransmission} from './audio.actions';

const allowedVACDevices = new Set([
  'Line 1 (Virtual Audio Cable)',
  'VB-Cable (Virtual)'
]);

interface SpeakerSink {
  id: string;
  label: string;
}

export interface AudioStateModel {
  microphone: MediaStream;
  speakerSink: SpeakerSink;
  error: string;
}

const initialState: AudioStateModel = {
  microphone: null,
  speakerSink: null,
  error: null
};

@Injectable()
@State<AudioStateModel>({
  name: 'audio',
  defaults: initialState
})
export class AudioState implements NgxsOnInit {

  @Select(state => state.settings.transmitAudio) transmitAudio$: Observable<boolean>;

  constructor(private navigator: NavigatorService) {
  }

  ngxsOnInit({dispatch}: StateContext<AudioStateModel>): void {
    this.transmitAudio$.pipe(
      tap((state) => {
        if (state) {
          dispatch(EnableTransmission);
        } else {
          dispatch(DisableTransmission);
        }
      })
    ).subscribe();
  }

  @Action(DisableTransmission)
  disableTransmission({patchState, getState}: StateContext<AudioStateModel>): void {
    // Stop microphone stream if its open
    const {microphone} = getState();
    if (microphone) {
      microphone.getTracks().forEach(track => track.stop());
    }

    patchState({
      ...initialState,
      error: null
    });
  }

  @Action(EnableTransmission)
  async enableTransmission(context: StateContext<AudioStateModel>): Promise<void> {
    const {patchState, dispatch} = context;

    this.disableTransmission(context);

    const turnOffAudio = () => dispatch(new SetSetting('transmitAudio', false));

    try {
      const microphone = await this.navigator.getMicrophone();
      const audioTrack = microphone.getAudioTracks()[0];
      audioTrack.addEventListener('ended', turnOffAudio);

      const speakerSink = await this.getSpeaker();

      patchState({microphone, speakerSink, error: null});
    } catch (e) {
      patchState({error: e.message});
      turnOffAudio();
    }
  }

  private async getSpeaker(mandatory: boolean = true): Promise<SpeakerSink> {
    try {
      const speakerSinkDevice = await this.navigator.getSpeaker(allowedVACDevices);
      return {
        id: speakerSinkDevice.deviceId,
        label: speakerSinkDevice.label,
      };
    } catch (e) {
      if (mandatory) {
        throw e;
      }
      return null;
    }
  }
}
