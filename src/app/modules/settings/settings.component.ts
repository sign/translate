import {SettingsStateModel} from './settings.state';
import {SetSetting} from './settings.actions';
import {Store} from '@ngxs/store';
import {BaseComponent} from '../../components/base/base.component';
import {Directive} from '@angular/core';

@Directive()
export abstract class BaseSettingsComponent extends BaseComponent {
  settingsState$ = this.store.select<SettingsStateModel>(state => state.settings);

  protected constructor(protected store: Store) {
    super();
  }

  applySetting(setting: keyof SettingsStateModel, value: any): void {
    this.store.dispatch(new SetSetting(setting, value));
  }
}
