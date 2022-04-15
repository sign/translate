import {SettingsStateModel} from './settings.state';

export class SetSetting {
  static readonly type = '[Settings] Set Setting';

  constructor(public setting: keyof SettingsStateModel, public value: any) {}
}
