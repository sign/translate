import {Injectable} from '@angular/core';
import {Action, State, StateContext} from '@ngxs/store';
import {SetSetting} from './settings.actions';


export interface SettingsStateModel {
  receiveVideo: boolean;

  detectSign: boolean;

  animatePose: boolean;

  drawVideo: boolean;
  drawPose: boolean;
  drawSignWriting: boolean;
}

const initialState: SettingsStateModel = {
  receiveVideo: true,

  detectSign: false,

  animatePose: true,

  drawVideo: true,
  drawPose: true,
  drawSignWriting: false,
};

@Injectable()
@State<SettingsStateModel>({
  name: 'settings',
  defaults: initialState
})
export class SettingsState {
  @Action(SetSetting)
  setSetting({patchState}: StateContext<SettingsStateModel>, {setting, value}: SetSetting): void {
    patchState({[setting]: value});
  }
}
